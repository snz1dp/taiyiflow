# 语音对话接口

> 人机实时语音对话 WebSocket 的字段级参考：建连参数、覆盖优先级、服务默认配置与连接层行为。该通道在集成体系中的定位与音频编码约定见 [WebSocket 接口](/integration/websocket-api)；本页不重复展开 ASR/TTS 下游流式协议细节与前端 UI 行为。

## 服务入口

```text
ws(s)://<host>/api/v1/agents/dialogue/websocket
```

内部串联 VAD（语音活动检测）→ ASR → LLM → TTS 全链路。该端点受服务端特性开关 `human_ai_dialogue` 控制，未开启时不可用。

## 建连参数读取规则

服务端先接受 WebSocket 连接，再解析请求参数。关键细节：

- **优先读取 Header**。
- 只有当 Header 中缺少 `device-id` 时，才会**整体**回退到 Query 参数。
- Header 与 Query 都没有 `device-id` 时，服务端返回文本 `端口正常` 后主动关闭连接。

这意味着 Query 不是逐字段补充，而是依赖 `device-id` 缺失才整体启用；Header 已提供 `device-id` 时，Query 中同名参数不参与覆盖。

## 连接参数清单

| 参数名 | 来源 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `device-id` | Header / Query | ✅ | - | 设备唯一标识；缺失时不会进入正式对话处理 |
| `client-id` | Header / Query | ❌ | - | 客户端实例标识 |
| `client-type` | Header / Query | ❌ | Header 路径 `esp32`，Query 回退路径 `web` | 两条读取路径默认值不同，建议显式传入 |
| `authorization` | Header / Query | ❌ | - | 认证信息 |
| `flow-id` | Header / Query | ❌ | 对话设置中的 `default_flow_id` | 当前会话使用的流程；可通过 [`GET /api/v1/config`](/reference/api/runtime-config) 提前获取 |
| `session-id` | Header / Query | ❌ | 服务端生成 UUID | 当前会话 ID |
| `tts-voice` | Header / Query | ❌ | 对话设置中的 `tts_voice` | 覆盖当前连接音色 |
| `language` | Header / Query | ❌ | 对话设置中的 `language` | 覆盖当前连接语言 |
| `answer-after-wakeup` | Header / Query | ❌ | 对话设置中的 `answer_after_wakeup` | 是否要求先唤醒再进入问答 |
| `only-answer-last-speaker` | Header / Query | ❌ | 对话设置中的 `only_answer_last_speaker` | 是否仅回答最近一次有效说话人 |
| `wakeup-answer-window` | Header / Query | ❌ | 对话设置中的 `wakeup_answer_window` | 唤醒后继续问答窗口，单位秒 |
| `enable-welcome-notify` | Header / Query | ❌ | 对话设置中的 `enable_welcome_notify` | 是否在连接成功后发送欢迎提示 |
| `wakeup-expire-notify` | Header / Query | ❌ | 对话设置中的 `enable_wakeup_window_expire_notify` | 唤醒窗口过期时是否通知 |
| `connect-activity-timeout` | Header / Query | ❌ | 对话设置中的 `close_connection_no_voice_time` | 无语音活动时的连接超时，单位秒 |
| `tts-finish-notify` | Header / Query | ❌ | 对话设置中的 `enable_stop_tts_notify` | TTS 结束时是否播放提示音 |
| `client-mcp-servers` | Header / Query | ❌ | - | 客户端声明的 MCP Server 列表 |

推荐建连示例：

```text
wss://example.com/api/v1/agents/dialogue/websocket?device-id=dev-001&client-id=web-001&client-type=web&flow-id=flow_xxx&answer-after-wakeup=true&only-answer-last-speaker=true&wakeup-answer-window=300
```

## 参数覆盖优先级

同一配置项的最终值按以下顺序确定：

1. Header 参数
2. Query 参数（仅 Header 缺少 `device-id` 时整体启用）
3. 数据库对话设置
4. 服务端静态默认配置

细节：

- `wakeup-answer-window` 与 `connect-activity-timeout` 会在服务端转换为整数。
- `answer-after-wakeup`、`only-answer-last-speaker`、`enable-welcome-notify`、`wakeup-expire-notify`、`tts-finish-notify` 在连接层直接保留传入值；客户端传字符串时，其最终布尔含义取决于下游处理逻辑。
- `client-mcp-servers` 只有在有值时才会解析。
- `flow-id` 未传时使用对话设置中的 `default_flow_id`；该字段为空时当前连接不会从配置层补默认流程。

## 服务默认配置

### 设备与音频默认值

```json
{
  "device": {
    "type": "hello",
    "version": 1,
    "transport": "websocket",
    "audio_params": {
      "format": "pcm",
      "sample_rate": 16000,
      "channels": 1,
      "frame_duration": 60
    }
  }
}
```

默认格式 `pcm`、采样率 `16000`、单声道、帧时长 `60ms`。

### 模块选择默认值

| 模块 | 默认来源 |
|------|----------|
| VAD | 系统设置 `vad_provider` |
| ASR | 系统设置 `asr_provider` |
| TTS | 系统设置 `tts_provider` |
| LLM | `openai` |
| VLLM | `openai` |
| Memory | `nomem` |
| Intent | `function_call` |

### 对话行为默认值

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `voiceprint` | `{}` | 声纹识别配置 |
| `delete_audio` | `true` | 使用完音频文件后删除 |
| `close_connection_no_voice_time` | `7200` | 长时间无语音时关闭连接，单位秒 |
| `tts_timeout` | `10` | TTS 合成超时时间，单位秒 |
| `tts_voice` | `default` | 默认音色 |
| `enable_wakeup_words_response_cache` | `true` | 启用唤醒词响应缓存 |
| `enable_greeting` | `true` | 开场允许回复唤醒词 |
| `answer_after_wakeup` | `true` | 仅唤醒后回答用户消息 |
| `only_answer_last_speaker` | `true` | 仅回答上一说话用户的消息 |
| `wakeup_answer_window` | `300` | 唤醒后可直接回答的时间窗口，单位秒 |
| `wakeup_window_expire_voice` | `assets/chat_closed.mp3` | 唤醒窗口到期提醒音文件 |
| `enable_stop_tts_notify` | `true` | 说完话后播放提示音 |
| `stop_tts_notify_voice` | `assets/tts_notify.mp3` | 提示音文件 |
| `enable_websocket_ping` | `true` | 启用 WebSocket 心跳响应 |
| `tts_audio_send_delay` | `0` | 音频包发送间隔，`0` 表示按音频帧率精确控制 |
| `exit_commands` | `["退出小启", "关闭小启"]` | 触发退出流程的命令 |
| `wakeup_words` | `["你好小启", "小启同学", "小启小启"]` | 默认唤醒词列表 |
| `mcp_endpoint` | `""` | MCP 接入点地址 |
| `enable_welcome_notify` | `true` | 建连后发送欢迎提示 |
| `welcome_notify_text` | `你好，我是小启，很高兴为你服务。` | 默认欢迎语 |

### 等待语与唤醒语默认值

默认等待语配置：

```json
{
  "responses": ["稍等一下", "请稍等片刻", "很快就好，请稍等", "正在处理中，请稍等"],
  "refresh_interval": 60
}
```

默认唤醒回复配置：

```json
{
  "responses": ["在的呢，请随时吩咐。", "请您讲话，我准备好了。", "我认真听着呢，请讲。", "请问您需要什么帮助？", "收到，收到。"],
  "refresh_interval": 60
}
```

### 结束语默认值

```json
{
  "enable": true,
  "prompt": "对用户说\"你好，我先退下了，有事再喊我\"，然后结束对话。"
}
```

## 建连后的服务端处理流程

1. 接受 WebSocket 连接。
2. 读取请求 Header，必要时回退到 Query。
3. 加载数据库中的对话设置。
4. 执行认证逻辑。
5. 解析协议、Host、端口、客户端真实 IP、WebRoot。
6. 确认请求流程与主流程。
7. 查询流程可用的 MCP 工具。
8. 合并配置并创建连接处理器。
9. 进入正式会话处理。

注意事项：

- 流程不存在或未启用时，服务端返回 `请求的智能流程不存在` 并关闭连接。
- 未传 `session-id` 时服务端自动生成 UUID。
- `publish_api_url` 有值时 `webroot` 优先取该配置，否则按网关请求信息推导。

## 认证行为

- `client-type=web` 时会尝试获取当前 WebSocket 登录用户。
- 未启用设备认证（`device_auth_enable=false`）时直接放行。
- 当前白名单分支固定为直接放行，即使设备认证开启，仍会返回空 token 与当前用户。
- `authorization` 参数已预留，但当前实现尚未形成严格设备认证闭环；Web 端连接可以把登录态用户带入对话上下文。

## 连接处理器注入字段

创建连接处理器时，服务端写入的关键字段：

| 字段 | 说明 |
|------|------|
| `flow` / `master_flow` | 当前命中的流程 / 对应主流程 |
| `current_user` | 当前登录用户 |
| `available_tools` | 当前流程可用的 MCP 工具集合 |
| `session_id` | 会话 ID |
| `tts_voice` / `language` | 当前连接生效的音色 / 语言 |
| `prompt` / `prompt_template` | 对话基础提示词 / 提示词模板 |
| `server` | 协议、主机、端口、webroot、auth_key |
| `client` | `device_id`、`client_id`、`client_type`、`client_ip`、`access_token` |
| `exit_intent` / `exit_commands` | 退出意图配置 / 退出命令列表 |
| `answer_after_wakeup` / `only_answer_last_speaker` / `wakeup_answer_window` | 唤醒与说话人约束 |
| `enable_wakeup_window_expire_notify` | 是否提示唤醒窗口过期 |
| `close_connection_no_voice_time` | 连接无语音关闭阈值 |
| `tts_audio_send_delay` | 音频发送间隔配置 |
| `enable_welcome_notify` / `welcome_notify_text` | 欢迎语开关与内容 |
| `enable_stop_tts_notify` | 结束提示音开关 |
| `assistant_initiative_close` | 助手主动关闭会话策略 |

## 关键行为说明

- **唤醒约束**：`answer_after_wakeup=true` 时，会话使用唤醒窗口控制普通输入能否直接进入问答。
- **说话人约束**：`only_answer_last_speaker=true` 时，会话带着"仅响应当前有效说话人"的约束进入识别与对话链路。
- **欢迎语**：由 `enable_welcome_notify` 与 `welcome_notify_text` 共同决定；连接参数可覆盖开关，文本内容来自对话设置或默认配置。
- **TTS 结束提示音**：由 `enable_stop_tts_notify` 与 `stop_tts_notify_voice` 共同决定；连接参数只覆盖开关，资源路径来自服务配置或数据库设置。
- **MCP 挂载**：请求带有 `client-mcp-servers` 时，服务端先解析客户端声明的 MCP Server，再基于当前流程加载服务端可用 MCP 工具。

## 客户端接入建议

为避免不同接入方式下出现默认值差异，建议至少显式传入：`device-id`、`client-id`、`client-type`、`flow-id`、`session-id`、`answer-after-wakeup`、`only-answer-last-speaker`、`wakeup-answer-window`、`enable-welcome-notify`、`wakeup-expire-notify`、`connect-activity-timeout`、`tts-finish-notify`。

其中 `client-type` 尤其建议显式传入，因为 Header 路径与 Query 回退路径的默认值不一致（`esp32` vs `web`）。

## 相关文档

- [WebSocket 接口](/integration/websocket-api) — 语音对话通道在集成体系中的定位与音频编码约定
- [语音识别接口（ASR）](/reference/api/voice) — 独立语音转写通道
- [系统音色管理接口](/reference/api/tts-voices) — `tts-voice` 可用的系统音色维护
- [运行时配置接口](/reference/api/runtime-config) — 获取 `default_flow_id`
