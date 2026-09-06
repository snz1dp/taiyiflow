# 流式对话 API（SSE）

> 本篇是协议层核心文档：太乙智启对话运行接口的完整契约，基于 SSE（Server-Sent Events）实现流式输出。这是所有集成方式的基石——ChatUI、CLI、JS SDK（间接）最终都通过它或其 WebSocket 等价形式与后端通信。

## 运行端点总览

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/run/{flow_id_or_name}/stream` | **SSE 流式运行**（推荐） |
| POST | `/api/v1/run/{flow_id_or_name}` | 简化运行，阻塞等待，返回纯文本 + `x-session-id` 响应头 |
| GET | `/api/v1/run/{flow_id_or_name}` | 简化运行（query 传参） |
| WS | `/api/v1/run/{flow_id_or_name}/websocket` | WebSocket 流式运行，见 [WebSocket 接口](/integration/websocket-api) |
| GET | `/api/v1/run/{flow_id_or_name}/metadata` | 查询智能服务元信息 |

`{flow_id_or_name}` 同时接受智能服务的 UUID 或名称。

## 接口概览

```
POST /api/v1/run/{flow_id_or_name}/stream
Content-Type: application/json
Authorization: Bearer <token>      # 或其他凭据形式，见认证文档
```

响应为 `text/event-stream`。客户端断连时服务端自动取消任务并释放会话执行锁。

## 请求体（SimplifiedAPIRequest）

请求体允许额外字段（`extra="allow"`），核心字段按功能分组如下：

### 输入

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `input_value` | string | ✅ | 用户输入内容（服务端自动去除零宽字符） |
| `input_type` | string | ❌ | 输入类型，默认 `any` |
| `input_files` | string[] | ❌ | 上传文件路径列表（先经上传接口取得路径） |
| `output_type` | string | ❌ | 输出类型，默认 `any` |
| `output_component` | string | ❌ | 多输出组件时指定取哪个组件的输出 |

### 会话与执行标识

| 字段 | 类型 | 说明 |
|------|------|------|
| `session_id` | string | 会话 ID，不传则自动生成（经 `x-session-id` 响应头返回） |
| `run_id` | string | 本次执行链路 ID |
| `parent_id` | string | 父执行 ID（实际为 run_id），标记子智能体会话 |
| `message_id` | string | 消息 ID，用于绑定客户端回调 |
| `group_id` | string | 会话分组 ID |

### 请求形态

| 字段 | 类型 | 说明 |
|------|------|------|
| `request_type` | `ask` / `agent` / `plan` | 请求类型，见下表 |
| `runtime_strategy` | `default` / `hermes` | 运行时策略；不传时按 `request_type` 自动推导 |
| `max_iterations` | number | Agent 最大迭代次数 |
| `reasoning_enabled` | boolean | 是否启用推理过程输出 |
| `command_execution_target` | `server` / `client` | 命令执行位置 |

**request_type 说明**：

| 值 | 说明 | 默认策略 |
|----|------|----------|
| `ask` | 纯问答，不执行操作 | `default` |
| `plan` | 规划模式，制定计划不执行 | `default` |
| `agent` | 执行模式，可调用工具、多轮迭代 | `hermes` |

### 客户端标识

| 字段 | 类型 | 说明 |
|------|------|------|
| `client_type` | `web` / `device` / `cli` / `desktop` | 客户端形态；影响默认 request_type（web/device→ask，cli/desktop→agent）与内置技能注入 |
| `client_id` | string | 客户端实例 ID |
| `device_id` | string | 稳定设备 ID |
| `client_context_dir` | string | CLI 客户端当前工作目录（写入审计） |

### 能力扩展

| 字段 | 类型 | 说明 |
|------|------|------|
| `available_tools` | string[] | 允许调用的工具列表 |
| `client_mcp_servers` | object/array | 客户端本地 MCP 服务与工具清单，见[客户端工具协议](/integration/client-tool-protocol) |
| `client_skill_packages` | object/array/string | 客户端技能包，见[技能注入机制](/integration/skill-injection) |
| `requested_skill_names` | string[] | 指定启用的服务端技能名称 |
| `client_instructions` | string | 客户端附加指令（上限 32000 字符） |
| `master_flow_id` | string | 主流程 ID（多智能体协作） |
| `tweaks` | object | 组件参数运行时调整 |
| `internet_search` | boolean | 是否启用联网搜索，默认 `false` |
| `knowledge_scopes` | string[] | 限定知识库 ID 列表 |
| `knowledge_docs` | string[] | 限定知识文档 ID 列表 |
| `long_term_memory_enabled` | boolean | 启用长期记忆检索与写入 |
| `cross_session_memory_enabled` | boolean | 允许长期记忆跨会话召回 |

## 请求头

| Header | 说明 |
|--------|------|
| `Authorization` / 凭据头 | 认证，见[认证与鉴权](/integration/authentication) |
| `x-taiyiflow-tweaks` | 可选，JSON 字符串，与请求体 `tweaks` 合并后执行 |

## SSE 响应事件

每条事件格式：

```text
event: <事件类型>
data: <JSON 数据>
```

### 事件类型

| event | 含义 | 说明 |
|-------|------|------|
| `message` | 正常消息 | AI 输出 chunk、`start-flow` 开始标记、工具调用过程等 |
| `heartbeat` | 保活心跳 | 15s 间隔，`{"message": "keep-alive"}` |
| `error` | 错误信息 | `{"error": "错误描述"}` |
| `close` | 流结束 | `{"message": "over"}`，收到后连接即将关闭 |
| `bytes` | 二进制数据 | 音频等字节流场景 |
| `stt` | 语音转写 | 语音链路的中间转写结果 |

### message 事件示例

```text
event: message
data: {"chunk": "你好，我是", "sender": "Machine", "session": "session-id", "message_id": "msg-id"}
```

### 客户端工具调用事件

当 Agent 需要客户端执行本地工具时，`message` 事件流中会下发工具调用负载（`event_type` 为 `client_tool` / `mcp_tool` / `built_in`）：

```text
event: message
data: {"flow_id":"flow-1","context":{"session_id":"s-1","run_id":"r-1","message_id":"m-1"},"server":{"name":"device/local"},"function":{"id":"call-1","name":"open_url","arguments":{"url":"https://example.com"}},"event_type":"client_tool"}
```

客户端执行完毕后通过 **`POST /api/v1/agents/client/call/result`** 回传结果。完整闭环（字段、状态机、超时与错误处理）见[客户端工具协议](/integration/client-tool-protocol)。

## 完整示例

### cURL

```bash
curl -N -X POST \
  'http://localhost:7860/api/v1/run/my-flow/stream' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your-token' \
  -d '{
    "input_value": "你好，请介绍一下自己",
    "request_type": "ask"
  }'
```

### Python

```python
import json
import requests

response = requests.post(
    'http://localhost:7860/api/v1/run/my-flow/stream',
    headers={'Authorization': 'Bearer your-token'},
    json={'input_value': '你好，请介绍一下自己', 'request_type': 'ask'},
    stream=True,
)
response.raise_for_status()

event = None
for line in response.iter_lines(decode_unicode=True):
    if not line:
        event = None
        continue
    if line.startswith('event: '):
        event = line[7:]
    elif line.startswith('data: '):
        data = json.loads(line[6:])
        if event == 'message':
            print(data.get('chunk', ''), end='', flush=True)
        elif event == 'close':
            print('\n--- 输出完成 ---')
            break
        elif event == 'error':
            print('\n错误:', data.get('error'))
            break
```

### JavaScript（fetch 消费 SSE）

```javascript
const response = await fetch('/api/v1/run/my-flow/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer your-token' },
  body: JSON.stringify({ input_value: '你好', request_type: 'ask' })
})

const reader = response.body.getReader()
const decoder = new TextDecoder()
let buffer = ''

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  buffer += decoder.decode(value, { stream: true })

  // 按 SSE 事件边界（空行）切分
  const parts = buffer.split('\n\n')
  buffer = parts.pop()
  for (const part of parts) {
    const eventLine = part.split('\n').find(l => l.startsWith('event: '))
    const dataLine = part.split('\n').find(l => l.startsWith('data: '))
    if (!dataLine) continue
    const data = JSON.parse(dataLine.slice(6))
    if (eventLine?.slice(7) === 'message') {
      console.log(data.chunk ?? data)
    }
  }
}
```

:::tip 浏览器生产实践
ChatUI 使用 `@microsoft/fetch-event-source` 库消费该接口，它额外处理了页面隐藏、断线重连与空闲超时。自行集成时建议实现：心跳超时检测（>30s 无事件视为异常）、断线后携带原 `session_id` 重试。
:::

## 协议选择：SSE vs WebSocket

服务端「其他参数配置」中的 `stream_protocol` 字段（`sse` / `websocket`）指示客户端应使用的流式协议：

| 维度 | SSE 端点 | WebSocket 端点 |
|------|----------|----------------|
| 协议 | HTTP `text/event-stream` | `ws://` / `wss://` |
| 请求方式 | POST Body 传参 | 连接后第一条消息传参 |
| 通信方向 | 服务端 → 客户端 | 双向 |
| 断连行为 | 服务端自动取消任务 | 同左，另有语义化关闭码 |
| 适用 | 文本对话（默认） | 需要双向通道、代理环境对 SSE 支持不佳时 |

详见 [WebSocket 接口](/integration/websocket-api)。

## 相关文档

- [客户端工具协议](/integration/client-tool-protocol) — 工具回调完整闭环
- [技能注入机制](/integration/skill-injection) — `client_skill_packages` 详解
- [集成代码示例](/integration/examples) — 更多语言示例
- [流式对话接口参考](/reference/api/stream) — 参考手册视角
