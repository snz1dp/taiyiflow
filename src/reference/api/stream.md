# 流式对话接口

> 太乙智启核心对话 API 的完整参数参考。

## 接口

```
POST /api/v1/run/{flow_id_or_name}/stream
```

## 请求头

| Header | 必填 | 说明 |
|--------|------|------|
| `Authorization` | ✅ | `Bearer <api-key>` |
| `Content-Type` | ✅ | `application/json` |
| `x-taiyiflow-tweaks` | ❌ | 运行时参数调整，与请求体 tweaks 合并 |

## 请求体字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `input_value` | string | ✅ | 用户输入消息 |
| `session_id` | string | ❌ | 会话 ID，未传自动生成 |
| `run_id` | string | ❌ | Agent 执行链路标识 |
| `message_id` | string | ❌ | 消息 ID |
| `available_tools` | array | ❌ | 允许调用的工具列表 |
| `mcp_tools` | array | ❌ | 兼容旧字段，新接入用 available_tools |
| `client_mcp_servers` | array | ❌ | 客户端 MCP 服务清单 |
| `client_skill_packages` | array | ❌ | 技能包内容 |
| `request_type` | string | ❌ | `ask` / `agent` / `plan` |
| `runtime_strategy` | string | ❌ | `default` / `hermes` |
| `tweaks` | object | ❌ | 运行时参数 |

## 响应

返回 `text/event-stream`。

### 事件类型

| 事件 | 说明 |
|------|------|
| `message` | 标准消息输出 |
| `client_tool` | 客户端工具调用 |
| `mcp_tool` | MCP 工具调用 |
| `built_in` | 内置工具调用 |

### 运行时策略推导

| request_type | 默认 runtime_strategy |
|--------------|----------------------|
| `agent` | `hermes` |
| `ask` / `plan` | `default` |

## 详细文档

完整协议说明见[流式对话 API](/integration/stream-api)。
