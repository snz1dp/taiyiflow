# 流式对话接口速查

> 本页是 `POST /api/v1/run/{flow_id_or_name}/stream` 的字段级速查卡。完整协议契约（请求体全字段、SSE 事件流、断连行为、代码示例）见[流式对话 API（SSE）](/integration/stream-api)；客户端工具回调协议见[客户端工具协议](/integration/client-tool-protocol)。本页不重复展开，只补充参考手册独有的内容：运行时策略推导规则与运行时留痕字段。

## 端点

```
POST /api/v1/run/{flow_id_or_name}/stream
```

- `{flow_id_or_name}` 同时接受智能服务的 UUID 或名称。
- 响应为 `text/event-stream`；客户端断连时服务端自动取消任务并释放会话执行锁。
- 请求头 `x-taiyiflow-tweaks` 会与请求体中的 `tweaks` 合并后再执行。

## 核心请求字段速查

仅列出与执行形态强相关的字段，输入、文件、知识库、记忆等完整字段分组见[流式对话 API（SSE）](/integration/stream-api#请求体-simplifiedapirequest)。

| 字段 | 类型 | 说明 |
|------|------|------|
| `input_value` | string | 用户输入内容（服务端自动去除零宽字符） |
| `session_id` | string | 会话 ID，不传自动生成（经 `x-session-id` 响应头返回） |
| `run_id` | string | 本次 Agent 执行链路 ID，客户端回调时须原样带回 |
| `message_id` | string | 消息 ID，用于绑定客户端回调 |
| `available_tools` | array | 允许调用的工具列表 |
| `mcp_tools` | array | 兼容旧字段，仅用于平滑迁移；新接入统一使用 `available_tools` |
| `client_mcp_servers` | array | 客户端上报的本地 MCP 服务与工具清单 |
| `client_skill_packages` | array | 客户端上报的技能包内容，仅用于技能文本/提示注入，不参与客户端工具绑定 |
| `request_type` | string | `ask` / `agent` / `plan` |
| `runtime_strategy` | string | `default` / `hermes`，不传时按 `request_type` 推导 |

## SSE 事件类型

| 事件 | 说明 |
|------|------|
| `message` | 标准消息输出 |
| `client_tool` | 客户端工具调用（需客户端执行后回调） |
| `mcp_tool` | MCP 工具调用 |
| `built_in` | 内置工具调用 |

为兼容只读取 `data` JSON 而不解析 SSE `event` 行的客户端，服务端会在 JSON 负载中冗余 `event_type` 字段。收到 `client_tool`、`mcp_tool`、`built_in` 事件后不要当成聊天文本渲染，处理方式见[客户端工具协议](/integration/client-tool-protocol)。

## 运行时策略推导规则

| 场景 | 生效策略 |
|------|----------|
| 显式传入 `runtime_strategy` | 按传入值执行（非法值回退为 `default`） |
| 未传，且 `request_type=agent` | `hermes` |
| 未传，且 `request_type=ask` / `plan` | `default` |

说明：`hermes` 主要用于工具调用场景下的失败恢复与收口控制；`default` 保持标准终止行为。

## 运行时留痕与统计字段

一次请求结束时，服务端会把运行期统计同步回当前消息对象并写入持久化层：

- `token_usage.agent`：本轮 Agent 审计与统计快照，随消息落库。
- `agent_trace`：Agent 决策与执行留痕，通过独立的 Agent Trace Upsert 链路写入留痕表（`agent_message_trace`）；消息表中的 `agent_trace` 字段保留兼容读取能力。

常见统计键：

| 键 | 说明 |
|----|------|
| `tool_rounds` | 工具调用轮次 |
| `tool_failure_rounds` | 工具调用失败轮次 |
| `hermes_recovery_rounds` | Hermes 失败恢复轮次 |
| `tool_force_answer_rounds` | 工具强制收口轮次 |
| `last_tool_actions` | 最近若干次工具动作序列（如 `["error", "response"]`） |

边界约束：

- `ask` / `plan` 场景不会主动新增 Hermes 专有统计字段（`hermes_recovery_rounds`、`tool_force_answer_rounds`），除非历史数据已包含并被兼容透传。
- 运行期统计会合并到已初始化的 `agent_trace` / `token_usage.agent`，不会覆盖 `request_type`、`runtime_strategy` 等基础审计字段。

### 示例：agent + hermes

```json
{
  "token_usage": {
    "prompt_tokens": 512,
    "completion_tokens": 233,
    "total_tokens": 745,
    "agent": {
      "enabled": true,
      "request_type": "agent",
      "runtime_strategy": "hermes",
      "max_iterations": 30,
      "tool_use_enabled": true,
      "tool_rounds": 3,
      "tool_failure_rounds": 2,
      "hermes_recovery_rounds": 1,
      "tool_force_answer_rounds": 0,
      "last_tool_actions": ["error", "response"]
    }
  }
}
```

### 示例：ask + default

```json
{
  "token_usage": {
    "prompt_tokens": 128,
    "completion_tokens": 64,
    "total_tokens": 192,
    "agent": {
      "enabled": true,
      "request_type": "ask",
      "runtime_strategy": "default",
      "max_iterations": 30,
      "tool_use_enabled": false,
      "tool_rounds": 0,
      "last_tool_actions": []
    }
  }
}
```

请求参数 → 运行时上下文 → 消息落库字段的完整对照表见[数据结构字典](/reference/api/data-structures#agent-运行时留痕落库说明)。

## 相关文档

- [流式对话 API（SSE）](/integration/stream-api) — 完整请求体与事件流契约
- [客户端工具协议](/integration/client-tool-protocol) — `client_tool` 事件的执行与回调
- [WebSocket 接口](/integration/websocket-api) — 流式运行的 WebSocket 等价形式
- [数据结构字典](/reference/api/data-structures) — 消息表与留痕字段定义
