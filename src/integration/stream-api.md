# 流式对话 API

> 这篇文档是太乙智启核心对话接口的完整参考，基于 SSE（Server-Sent Events）实现流式输出。

## 接口概览

```
POST /api/v1/run/{flow_id_or_name}/stream
Content-Type: application/json
Authorization: Bearer <api-key>
```

返回 `text/event-stream` 格式的流式响应。

## 请求体

基于 `SimplifiedAPIRequest`，主要字段如下：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `input_value` | string | ✅ | 用户输入的消息内容 |
| `session_id` | string | ❌ | 会话 ID，未传时服务端自动生成 |
| `run_id` | string | ❌ | 本次 Agent 执行链路标识 |
| `message_id` | string | ❌ | 消息 ID，用于绑定客户端回调 |
| `available_tools` | array | ❌ | 允许调用的工具列表 |
| `client_mcp_servers` | array | ❌ | 客户端上报的本地 MCP 服务与工具清单 |
| `client_skill_packages` | array | ❌ | 客户端上报的技能包内容 |
| `request_type` | string | ❌ | `ask` / `agent` / `plan` |
| `runtime_strategy` | string | ❌ | `default` / `hermes` |
| `tweaks` | object | ❌ | 运行时参数调整 |

### request_type 说明

| 值 | 说明 | 默认策略 |
|----|------|----------|
| `ask` | 纯问答，不执行操作 | `default` |
| `plan` | 规划模式，制定计划不执行 | `default` |
| `agent` | 执行模式，可调用工具 | `hermes` |

### runtime_strategy 说明

| 值 | 说明 |
|----|------|
| `default` | 标准终止行为 |
| `hermes` | 工具调用场景的失败恢复与收口控制 |

:::tip
未显式传入 `runtime_strategy` 时，服务端按 `request_type` 自动推导默认策略。
:::

## 请求头

| Header | 说明 |
|--------|------|
| `Authorization` | `Bearer <api-key>` |
| `x-taiyiflow-tweaks` | 可选，与请求体中的 `tweaks` 合并后执行 |

## 响应事件

### 标准消息事件

```text
event: message
data: {"text": "这是 AI 的回答...", "sender": "Machine", ...}
```

### 客户端工具调用事件

当 Agent 需要客户端执行工具时，服务端发送以下事件之一：

- `event: client_tool`
- `event: mcp_tool`
- `event: built_in`

#### 示例

```text
event: client_tool
data: {"flow_id":"flow-1","context":{"session_id":"session-1","run_id":"run-1","message_id":"message-1"},"server":{"name":"device/local"},"function":{"id":"call-1","name":"open_url","arguments":{"url":"https://example.com"}},"event_type":"client_tool"}
```

#### 字段说明

| 字段 | 说明 |
|------|------|
| `flow_id` | 当前服务 ID，回调时必须原样带回 |
| `context.session_id` | 本轮会话 ID |
| `context.run_id` | 本轮 Agent 执行 ID |
| `context.message_id` | 当前消息 ID |
| `server.name` | 工具服务名称 |
| `function.id` | 调用 ID |
| `function.name` | 工具函数名 |
| `function.arguments` | 工具参数 |
| `event_type` | 冗余字段，兼容不解析 SSE event 行的客户端 |

## 客户端工具回调

客户端执行完工具后，需将结果回调给服务端：

```
POST /api/v1/run/{flow_id}/stream/callback
```

<!-- TODO: 补充回调请求体完整格式 -->

## 完整示例

### cURL

```bash
curl -N -X POST \
  'http://localhost:7860/api/v1/run/my-flow/stream' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your-api-key' \
  -d '{
    "input_value": "你好，请介绍一下自己",
    "request_type": "ask"
  }'
```

### Python

```python
import requests

response = requests.post(
    'http://localhost:7860/api/v1/run/my-flow/stream',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-api-key'
    },
    json={
        'input_value': '你好，请介绍一下自己',
        'request_type': 'ask'
    },
    stream=True
)

for line in response.iter_lines():
    if line:
        print(line.decode('utf-8'))
```

## 相关文档

- [客户端工具协议](/integration/client-tool-protocol) — 工具回调完整流程
- [技能注入机制](/integration/skill-injection) — client_skill_packages 详解
- [集成示例](/integration/examples) — 更多语言的完整示例
