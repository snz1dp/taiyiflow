# 语音识别接口（ASR）

> 语音识别相关接口的字段级参考，覆盖 WebSocket 实时识别与 HTTP 离线/伪流式识别两个入口。语音链路在整个 WebSocket 体系中的定位见 [WebSocket 接口](/integration/websocket-api)；语音对话、声纹、音色管理见本页末尾的相关文档链接。

## 接口总览

| 接口 | 协议 | 路径 | 适用场景 |
|------|------|------|----------|
| 实时语音识别 | WebSocket | `/api/v1/asr/websocket` | 边说边出字的实时转写 |
| 离线语音识别 | HTTP | `POST /api/v1/asr/speech_to_text` | 完整音频文件转写 |
| 伪流式识别 | HTTP + SSE | `POST /api/v1/asr/speech_to_text`（`streaming=true`） | HTTP 下展示接近实时的字幕过程 |
| 通道探活 | HTTP | `GET /api/v1/asr/websocket/alived` | ASR 通道可用性检查 |

---

## 一、实时语音识别（WebSocket）

### 接口入口

```text
ws(s)://<host>/api/v1/asr/websocket
```

连接建立后，服务端会先解析当前登录用户，再创建连接对象并进入处理流程。

### 建连参数

支持从 Header 或 Query 中解析以下参数：

| 参数名 | 来源 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `session-id` | Header / Query | ❌ | 服务端自动生成 UUID | 当前识别会话 ID；传入非法 UUID 时记录告警并重新生成 |
| `client-id` | Header / Query | ❌ | `unknown_client` | 客户端实例标识 |
| `device-id` | Header / Query | ❌ | `unknown_device` | 设备标识；注意 Query 中使用下划线写法 `device_id` |
| `multi-speaker` | Header / Query | ❌ | `false` | 是否启用多说话人识别与声纹能力，接受 `true/1/yes` |
| `silence-duration-ms` | Header / Query | ❌ | 系统 ASR 设置 `min_silence_duration_ms` | 断句结束超时时间，单位毫秒 |

推荐建连示例：

```text
wss://example.com/api/v1/asr/websocket?session-id=9f61f6f1-6b0a-4e2a-a4d1-302c5aef8d1f&client-id=web-debug&device_id=browser-01&multi-speaker=true&silence-duration-ms=800
```

参数解析细节：

- `session-id` 只接受合法 UUID；非法值不会报错断开，而是记录告警后自动生成新 UUID。
- `device-id` 在 Query 参数中读取的是 `device_id`，不是 `device-id`。
- `multi-speaker` 只要值属于 `true`、`1`、`yes` 之一，就视为启用。
- `min-silence-duration-ms` 同时兼容连字符与下划线两种命名；值非法或小于等于 0 时回退系统默认配置。
- WebSocket 连接层当前固定使用 `auto` 模式，不再从建连参数解析 `listen-mode`。

### 建连后的初始化流程

1. 服务端接受连接（`accept`）。
2. 初始化当前事件循环引用。
3. 如果启用了 `multi-speaker`，加载当前用户的声纹档案并注入声纹识别器。
4. 打开 ASR 音频通道。
5. 立即下发一次 `hello` 消息。
6. 进入循环接收客户端消息：文本消息走文本处理，二进制消息走音频处理，收到 disconnect 时结束会话。

运行中抛出 `RuntimeError` 时，服务端记录错误并向客户端发送 `error` 消息，内容为 `语音识别失败`。

### 服务端首包 hello

```json
{
  "type": "hello",
  "session_id": "9f61f6f1-6b0a-4e2a-a4d1-302c5aef8d1f",
  "transport": "websocket",
  "silence_duration_ms": 800,
  "audio_params": {
    "format": "opus",
    "sample_rate": 16000,
    "channels": 1,
    "frame_duration": 60
  }
}
```

- `audio_params.format` 初始值默认为 `opus`。
- `silence_duration_ms` 为当前连接实际生效的断句结束超时配置。

### 客户端可发送的消息

文本控制消息只支持 `ping`、`hello`、`listen` 三种 `type`，此外可直接发送二进制音频帧。

#### hello（更新会话参数）

```json
{
  "type": "hello",
  "session_id": "9f61f6f1-6b0a-4e2a-a4d1-302c5aef8d1f",
  "audio_params": { "format": "pcm" }
}
```

处理规则：

- `session_id` 是合法 UUID 时覆盖当前连接的 `session_id`；非法时返回 `error`，消息内容为 `session_id 参数错误`。
- `audio_params.format` 为非空字符串时覆盖当前连接的 `audio_format`。
- 处理完成后服务端再次发送一条 `hello` 响应。

#### listen（开始/停止送音）

仅支持 `state=start` 与 `state=stop`：

```json
{ "type": "listen", "state": "start" }
```

- `start`：重置当前轮音频状态与识别文本状态，回确认消息 `{ "type": "listen", "state": "start", "session_id": "..." }`。
- `stop`：只表示客户端停止发送音频，**不会**被当成一句话结束信号；断句与最终结果下发仍由服务端 VAD/ASR 自主判断。回确认消息 `{ "type": "listen", "state": "stop", "session_id": "..." }`。
- `state` 非 `start`/`stop` 时返回 `{ "type": "error", "message": "listen state 参数错误" }`。

#### ping（探活）

```json
{ "type": "ping" }
```

服务端返回 `{ "type": "pong", "session_id": "..." }`。

#### 二进制音频帧

- 收到一帧音频后直接放入音频队列，由 ASR 后台线程消费处理。
- 处理时如有 VAD，先判断当前帧是否有语音，再把音频送入 ASR。
- 满足以下条件时自动向底层发送停止请求：当前不是 `manual` 模式、ASR 接口类型是 `STREAM`、客户端已停止送音、ASR 实例具备停止能力。

### 服务端下发的识别结果（stt 消息）

#### 流式中间结果

```json
{
  "type": "stt",
  "session_id": "9f61f6f1-6b0a-4e2a-a4d1-302c5aef8d1f",
  "stage": "partial",
  "is_final": false,
  "text": "今天北京",
  "correction_text": "今天北京",
  "speaker_id": "speaker_1",
  "speaker_name": "张三",
  "raw_speaker_id": "speaker_1_raw",
  "speaker_resolution_source": "voiceprint",
  "sentence_id": 12,
  "begin_time": 1200,
  "end_time": 2600
}
```

| 字段 | 说明 |
|------|------|
| `type` | 固定为 `stt` |
| `stage` | 当前阶段，连接层明确支持 `partial` 与 `final` |
| `is_final` | 是否最终结果 |
| `text` | 当前识别文本 |
| `correction_text` | 自动修正文本，存在时下发 |
| `speaker_id` | 解析后的说话人 ID |
| `speaker_name` | 解析后的说话人名称 |
| `raw_speaker_id` | provider 原始说话人 ID |
| `speaker_resolution_source` | 说话人解析来源 |
| `sentence_id` | 句段 ID |
| `begin_time` / `end_time` | 句段起止时间 |

阶段归一化规则：调用方显式传入 `stage=partial/final` 时直接使用；否则按 `is_final` 推断（`true → final`，`false → partial`）。

#### 最终完成结果

```json
{
  "type": "stt",
  "session_id": "9f61f6f1-6b0a-4e2a-a4d1-302c5aef8d1f",
  "stage": "completed",
  "text": "帮我查一下今天的天气",
  "speaker_id": "speaker_1",
  "speaker_name": "张三",
  "language": "zh"
}
```

:::warning 注意
如果 `text` 本身是 JSON 字符串，连接层会先反序列化再展开到返回体中，而不是简单放到 `text` 字段里。
:::

### 错误消息

| 场景 | message |
|------|---------|
| 文本消息不是合法 JSON / 不是对象 | `消息格式错误` |
| 不支持的消息类型 | `不支持的消息类型` |
| hello 中 session_id 非法 | `session_id 参数错误` |
| 运行期失败（RuntimeError） | `语音识别失败` |

错误消息统一格式：

```json
{
  "type": "error",
  "session_id": "9f61f6f1-6b0a-4e2a-a4d1-302c5aef8d1f",
  "message": "..."
}
```

### 连接关闭行为

连接结束时服务端会：设置停止事件 → 关闭 ASR 资源 → 释放 VAD 连接资源（如支持）→ 尝试关闭 WebSocket（客户端已关闭时忽略异常）。

### 客户端接入建议

1. 建立 WebSocket 连接，显式传入 `session-id`、`client-id`、`device-id`、`multi-speaker`、`min-silence-duration-ms`。
2. 等待服务端首包 `hello`。
3. 如需切换 `session_id` 或音频格式，再发送一次 `hello`。
4. 发送 `listen start`，开始一轮新的识别。
5. 连续发送二进制音频帧。
6. 停止发音频时发送 `listen stop`，但不要假设服务端会立即返回最终结果。
7. 以 `stt.stage` 和 `is_final` 为准驱动前端状态，不要仅依赖 `listen stop`。

---

## 二、离线语音识别（HTTP）

### 接口入口

```text
POST /api/v1/asr/speech_to_text
Content-Type: multipart/form-data
```

统一入口，同时支持两种模式：

- `streaming=false`（默认）：一次性识别，完整上传后直接返回 JSON。
- `streaming=true`：伪流式识别，完整上传后由服务端按原音频速度回放到 ASR/VAD 链路，通过 SSE 返回识别过程。

### 请求参数（表单字段）

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| `audio_file` | 文件 | 二选一 | - | 上传音频文件，支持 `wav/mp3/mp4/m4a` 等常见封装格式 |
| `audio_data` | bytes | 二选一 | - | 直接上传音频二进制数据 |
| `audio_format` | string | ❌ | `opus` | 原始音频格式；传文件且文件名带后缀时优先使用文件后缀 |
| `streaming` | bool | ❌ | `false` | 是否开启 SSE 伪流式识别 |
| `multi_speaker` | bool | ❌ | `false` | 是否在最终结果中返回说话人字段 |
| `show_timestamp` | bool | ❌ | `false` | 是否在最终结果中返回句段时间戳字段 |
| `session_id` | string | ❌ | 服务端自动生成 UUID | 当前识别会话 ID |
| `silence_duration_ms` | int | ❌ | `600` | 断句结束的静音持续时间；传 `0` 或负数时回退系统默认值 |
| `send_stt_stage` | bool | ❌ | `false` | 是否输出 `partial/final` 中间态 |
| `hotwords` | string | ❌ | - | 热词与权重配置字符串，内容必须是 JSON 对象，例如 `{"小启": 50, "慧码至一": 30}` |

约束：

- `audio_file` 与 `audio_data` 必须二选一。
- `streaming=true` 时仅支持 `pcm` 或 `opus` 原始音频输入。
- `wav/mp3/mp4/m4a` 文件会先统一转换为 `16kHz/单声道/16bit PCM` 再进入识别流程。
- `hotwords` 是字符串参数；服务端校验其内容是 JSON 对象，但按原字符串传递给 ASR provider。

### 一次性识别模式（streaming=false）

适合离线录音文件转写、表单提交后直接获取最终结果、只关心最终文本的场景。

返回示例：

```json
{
  "id": "9f61f6f1-6b0a-4e2a-a4d1-302c5aef8d1f",
  "text": "帮我查一下今天的天气"
}
```

当 `multi_speaker=true` 且 `show_timestamp=true` 时：

```json
{
  "id": "9f61f6f1-6b0a-4e2a-a4d1-302c5aef8d1f",
  "text": "帮我查一下今天的天气",
  "language": "zh",
  "speaker": "speaker_1",
  "speaker_id": "speaker_1",
  "speaker_name": "张三",
  "raw_speaker_id": "speaker_1_raw",
  "speaker_resolution_source": "voiceprint",
  "sentence_id": 12,
  "begin_time": 1200,
  "end_time": 2600
}
```

字段裁剪规则：

- `multi_speaker=false` 时，最终 JSON 不返回 `speaker`、`speaker_id`、`speaker_name`、`raw_speaker_id`、`speaker_resolution_source`。
- `show_timestamp=false` 时，最终 JSON 不返回 `sentence_id`、`begin_time`、`end_time`。
- 这两个参数只控制 HTTP 非流式最终 JSON；SSE 中间态和 WebSocket 实时识别按各自规则执行。

### 伪流式识别模式（streaming=true）

返回 `text/event-stream`。语义不是边上传边识别，而是完整上传后做服务端伪流式回放，适合在 HTTP 下展示接近实时的字幕过程。需要真正的边说边出字体验时，应接入 WebSocket 实时识别。

供音节奏规则：

- PCM 按 `16000 × 2` 字节每秒换算真实时长。
- Opus 因完整上传后无法恢复原始逐包边界，退化为按每片约 `60ms` 的节奏送入。
- 供音控制采用"累计音频时长 − 已过去真实时间"计算等待时间，避免快放或慢放。

### SSE 事件格式

统一使用：

```text
event: stt
data: {...}
```

#### 启动事件

```json
{
  "stage": "start",
  "transport": "http_stream",
  "session_id": "9f61f6f1-6b0a-4e2a-a4d1-302c5aef8d1f",
  "audio_format": "pcm",
  "min_silence_duration_ms": 100
}
```

#### 中间态事件（仅 send_stt_stage=true 时下发）

```json
{
  "session_id": "9f61f6f1-6b0a-4e2a-a4d1-302c5aef8d1f",
  "stage": "partial",
  "is_final": false,
  "text": "今天北京",
  "speaker": "speaker_1",
  "speaker_id": "speaker_1",
  "speaker_name": "张三",
  "segments": [
    {
      "speaker": "speaker_1",
      "speaker_id": "speaker_1",
      "speaker_name": "张三",
      "begin_time": 1200,
      "end_time": 2600,
      "text": "今天北京"
    }
  ]
}
```

#### 最终完成事件

```json
{
  "stage": "completed",
  "session_id": "9f61f6f1-6b0a-4e2a-a4d1-302c5aef8d1f",
  "text": "帮我查一下今天的天气",
  "speaker": "speaker_1",
  "speaker_id": "speaker_1",
  "speaker_name": "张三",
  "language": "zh"
}
```

#### 结束事件

```json
{
  "session_id": "9f61f6f1-6b0a-4e2a-a4d1-302c5aef8d1f",
  "stage": "end"
}
```

补充说明：

- HTTP 伪流式路径用 `stage` 描述启动、识别中、完成、结束等阶段，不像 WebSocket 那样固定依赖 `type=stt`。
- `send_stt_stage=false` 时通常只会收到 `stage=start`、`stage=completed`、`stage=end`。

### 客户端接入建议

- 只需要最终文本：默认 `streaming=false`。
- HTTP 下展示接近实时的字幕过程：`streaming=true` + `send_stt_stage=true`。
- 真正的实时识别体验：接入 WebSocket 实时识别。

## 相关文档

- [语音对话接口](/reference/api/voice-dialogue) — 全双工人机语音对话 WebSocket
- [用户声纹接口](/reference/api/voiceprint) — 声纹注册与管理
- [系统音色管理接口](/reference/api/tts-voices) — TTS 参考音色维护
- [WebSocket 接口](/integration/websocket-api) — 语音链路在集成体系中的定位
