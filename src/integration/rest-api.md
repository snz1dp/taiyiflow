# REST API 参考

> 本篇是协议层文档：太乙智启服务端全部 REST 路由的分类索引。所有路由统一前缀 `/api/v1`（健康检查除外）。

## 通用约定

### 认证

所有接口需携带凭据，详见[认证与鉴权](/integration/authentication)：

```
Authorization: Bearer <token>
```

### 响应格式

管理类接口普遍采用统一信封：

```json
{
  "code": 0,
  "message": "success",
  "data": { }
}
```

`code = 0` 表示成功；非 0 时 `message` 为错误描述。部分接口（如运行端点）直接返回业务对象或纯文本，以各接口文档为准。

### 分页

列表接口普遍支持 `skip` / `limit` 查询参数，返回 `{ items, total }` 结构。

---

## 一、对话与运行

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/run/{flow_id_or_name}/stream` | SSE 流式对话 → [详细文档](/integration/stream-api) |
| POST | `/run/{flow_id_or_name}` | 简化运行，返回纯文本 + `x-session-id` |
| GET | `/run/{flow_id_or_name}` | 简化运行（query 传参） |
| WS | `/run/{flow_id_or_name}/websocket` | WebSocket 流式运行 → [详细文档](/integration/websocket-api) |
| GET | `/run/{flow_id_or_name}/metadata` | 智能服务元信息 |
| POST | `/agents/client/call/result` | 客户端工具结果回调 → [详细文档](/integration/client-tool-protocol) |

### 编排构建执行（管理端调试）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/build/{flow_id}/flow` | 构建并运行整个流程 |
| POST | `/build/{flow_id}/vertices` | 构建运行指定顶点集合 |
| POST | `/build/{flow_id}/vertices/{vertex_id}` | 构建运行单个顶点 |
| GET | `/all` | 列出全部流程 |
| POST | `/clean-executing-messages` | 清理执行中状态的消息 |

---

## 二、会话与消息

### 管理端视角（`/sessions`）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/sessions/` | 会话列表 |
| GET | `/sessions/count` | 会话计数 |
| GET | `/sessions/{session_id}` | 会话详情 |
| POST | `/sessions/{session_id}` | 更新会话 |
| DELETE | `/sessions/{session_id}` | 删除会话 |
| GET | `/sessions/{session_id}/messages` | 会话消息列表 |
| GET | `/sessions/{session_id}/callrecords` | 工具调用记录 |
| POST | `/sessions/clean-executing` | 回收会话执行锁 |

### 智能体客户端视角（`/agents`）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/agents/flows` | 可用智能服务列表 |
| GET | `/agents/flows/{flow_id_or_name}` | 智能服务详情 |
| GET/POST | `/agents/flows/{flow}/sessions` | 该服务下的会话列表 / 创建会话 |
| GET/DELETE | `/agents/flows/{flow}/sessions/{session_id}` | 会话详情 / 删除 |
| GET/POST/PUT/DELETE | `/agents/flows/{flow}/sessions/{session_id}/messages` | 消息增删改查 |
| GET | `/agents/apps` | 可访问应用列表 |
| GET | `/agents/apps/{appid}` | 应用详情 |

### 会话分组

`/session_groups`（管理端）与 `/agents` 下的分组端点：分组 CRUD、会话归属调整。

→ [会话分组接口参考](/reference/api/session)

---

## 三、智能服务与应用管理

| 前缀 | 说明 |
|------|------|
| `/flows` | 智能服务 CRUD、上传/下载、批量操作、启用状态 |
| `/apps` | 智能应用管理（租户隔离单元） |
| `/components` | 可视化编排组件库 |
| `/prompt`、`/agents/prompts` | 提示词模板管理 |
| `/variable` | 全局变量 |
| `/markdowns` | Markdown 文档资源 |
| `/basicdata` | 基础数据 |

---

## 四、文件

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/agents/upload/{flow_id_or_name}` | 上传文件到会话上下文 |
| GET | `/agents/download/{flow_id_or_name}/{session_id}/{file_path}` | 下载会话产物文件 |
| GET/POST/DELETE | `/agents/files` | 会话文件 CRUD |
| — | `/files` | 通用文件管理 |

:::tip 产物下载认证
下载服务端产物需携带时效性 SSO token：请求头 `Authorization: Bearer <token>` 或 query `?__TOKEN__=<token>`。每次下载前重新获取令牌，不要缓存。
:::

---

## 五、知识库与检索

| 前缀 | 说明 |
|------|------|
| `/knowledge` | 知识库、文档管理（管理端） |
| `/agents/knowledge` | 智能体客户端视角的知识库查询 |
| `/knowledge/graph`、`/agents/graph` | 知识图谱 |

请求级检索范围通过运行接口的 `knowledge_scopes` / `knowledge_docs` / `internet_search` 字段控制。

---

## 六、技能

| 方法 | 路径 | 说明 |
|------|------|------|
| — | `/skill-packages` | 技能包管理（管理端） |
| GET | `/agents/skills` | 当前用户可见技能（支持 `allow_elevated_risk`、`terminal_type` 参数） |
| GET | `/agents/skills/{id}` | 下载技能内容 |
| POST | `/agents/skills/upload` | 上传技能（JSON 或 ZIP） |
| DELETE | `/agents/skills/{id}` | 删除技能 |
| — | `/agents/skills/installations` | 安装记录上报与查询、卸载 |

→ [技能注入机制](/integration/skill-injection)

---

## 七、MCP 工具

| 方法 | 路径 | 说明 |
|------|------|------|
| POST/GET | `/mcp` | **平台自身作为 MCP Server**（Streamable HTTP） |
| — | `/mcp`（管理前缀） | MCP 服务器与工具管理（管理端） |
| — | `/agents/mcp` | 智能体客户端视角的 MCP 管理 |

平台可作为标准 MCP Server 被外部 MCP 客户端（如 IDE、其他 Agent 框架）接入。

---

## 八、语音

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/tts/text_to_speech` | 文本转语音 |
| POST | `/asr/speech_to_text` | 离线语音识别（上传音频文件） |
| WS | `/asr/websocket` | 实时语音识别 |
| GET | `/asr/websocket/alived` | ASR 通道探活 |
| WS | `/agents/dialogue/websocket` | 人机实时语音对话 |
| — | `/voiceprints`、`/agents/voiceprints` | 用户声纹注册与识别 |
| — | `/settings/tts/voices` | 系统音色管理 |
| POST | `/agents/client/broadcast` | 跨渠道语音广播 |

→ [语音识别接口（ASR）](/reference/api/voice)、[语音对话接口](/reference/api/voice-dialogue)、[用户声纹接口](/reference/api/voiceprint)、[系统音色管理接口](/reference/api/tts-voices)

---

## 九、客户端协同

| 方法 | 路径 | 说明 |
|------|------|------|
| WS | `/agents/client/websocket` | 客户端协同长连接 |
| GET | `/agents/client/websocket/alived` | 协同通道探活 |
| POST | `/agents/client/primary-dispatch` | 转发主任务到在线客户端 |
| GET | `/agents/client/online-desktops` | 查询在线桌面端 |
| — | `/agents/client/schedules` | 客户端定时任务 CRUD、启停、执行记录、结果上报 |
| — | `/agents/client/collaborations` | 协同任务 CRUD |
| POST | `/agents/client/check-update` | 检查客户端更新 |
| GET | `/agents/client/releases/{download_token}/download` | 下载安装包 |
| POST | `/agents/client/release/report-status` | 上报安装状态 |
| — | `/client-schedule-manager`、`/client-collaboration-manager`、`/client-release-manager` | 管理端视角的调度/协同/发布管理 |

→ [WebSocket 接口](/integration/websocket-api)

---

## 十、记忆

| 前缀 | 说明 |
|------|------|
| `/memory-manager` | 长期记忆管理（管理端） |
| `/agents`（记忆相关端点） | 客户端视角的记忆检索与写入 |

请求级开关：`long_term_memory_enabled`、`cross_session_memory_enabled`。

---

## 十一、用户与组织

| 前缀 | 说明 |
|------|------|
| `/users` | 用户管理，含 `GET /users/whoami` 查询当前身份 |
| `/orgscopes` | 组织机构 |
| `/departments` | 部门 |
| `/positions` | 岗位 |
| `/register`、`/invitation` | 注册与邀请 |

---

## 十二、设备

| 前缀 | 说明 |
|------|------|
| `/devices` | 设备管理 |
| `/device-access` | 设备接入 |
| `/agents/device/ota` | 设备 OTA 升级 |

---

## 十三、模型代理与配额

| 前缀 | 说明 |
|------|------|
| `/apiproxy/nodes` | 模型节点供应管理 |
| `/apiproxy/quotas` | 模型配额 |
| `/apiproxy/request-logs` | 模型请求日志 |
| `/lmdeploy` | 模型部署与状态测试 |

---

## 十四、系统配置与运维

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/settings/` | 全量设置（含前端运行时配置，如 `stream_protocol`） |
| GET/POST | `/settings/{setting_code}` | 单项设置读写 |
| POST | `/settings/license/decode` | 授权许可解析 |
| POST | `/settings/lmdeploy/test` | 模型部署连通性测试 |
| GET | `/health` | 健康检查（根路径，无前缀） |
| GET | `/api/health_check` | 健康检查（db / chat / storage 分项） |
| — | `/monitor` | 运行监控 |
| — | `/overview` | 概览统计 |
| — | `/changelog` | 更新日志 |
| — | `/validate` | 校验类接口 |

→ [运行时配置接口参考](/reference/api/runtime-config)

:::tip 客户端如何获知流式协议
调用 `GET /api/v1/settings/`，读取返回配置中的 `stream_protocol` 字段：`sse` → 走 `/run/{flow}/stream`；`websocket` → 走 `/run/{flow}/websocket`。
:::

---

## 十五、其他

| 前缀 | 说明 |
|------|------|
| `/agents/share` | 会话分享 |
| `/agents/verify` | 校验（展会、邀请等场景） |
| `/agents/watermark` | 水印 |
| `/exhibition` | 展会体验场景 |

---

## 错误码

### HTTP 状态码

| 状态码 | 含义 | 常见原因 |
|--------|------|----------|
| 400 | 请求错误 | 参数缺失/格式错误、`flow_id` 不存在 |
| 401 | 未认证 | 凭据缺失或过期 |
| 403 | 无权限 | 用户无权访问该 Flow 所属 App、角色不足 |
| 404 | 资源不存在 | 会话/技能/任务 ID 无效 |
| 409 | 冲突 | 会话正在执行中 |
| 422 | 参数校验失败 | 请求体不符合 Schema |
| 500 | 服务端错误 | 查看服务端日志 |

### WebSocket 关闭码

| 关闭码 | 含义 |
|--------|------|
| 1000 | 正常关闭 |
| 4001 | 认证失败 |
| 4002 | 请求参数无效 / 首条消息超时（10s） |
| 4003 | 无权访问此智能服务应用 |
| 4004 | 智能服务不存在或不可用 |
| 4009 | 会话正在执行中（冲突） |

---

## 交互式接口文档

后端服务自带 OpenAPI 文档，部署后可直接访问：

```
http://<host>:7860/docs        # Swagger UI
http://<host>:7860/redoc       # ReDoc
http://<host>:7860/openapi.json
```

这是查询字段级细节最权威的来源，本文档索引与之配合使用。

## 相关文档

- [流式对话接口参考](/reference/api/stream)
- [会话分组接口参考](/reference/api/session)
- [语音相关接口参考](/reference/api/voice)
- [数据结构字典](/reference/api/data-structures)
- [集成代码示例](/integration/examples)
