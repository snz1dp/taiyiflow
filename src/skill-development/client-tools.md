# 客户端工具开发

> 这篇文档介绍如何开发在客户端本地执行的工具，让 Agent 能操作你的电脑。

## 工作原理

客户端工具在用户本地执行，通过回调协议与 Agent 交互：

1. Agent 决定调用工具 → 服务端发送 SSE 事件
2. 客户端收到事件 → 本地执行工具
3. 执行完成 → 回调结果给服务端
4. Agent 根据结果继续推理

## 声明可用工具

在发起对话时通过 `available_tools` 声明：

```json
{
  "available_tools": [
    {
      "name": "read_file",
      "description": "读取本地文件内容",
      "parameters": {
        "path": { "type": "string", "description": "文件路径" }
      }
    }
  ]
}
```

## 处理工具调用

收到 `event: client_tool` 事件后：

```javascript
// 解析事件
const toolCall = JSON.parse(eventData)
const { name, arguments: args, id } = toolCall.function

// 执行工具
let result
switch (name) {
  case 'read_file':
    result = await readFile(args.path)
    break
  // ... 其他工具
}

// 回调结果
await callbackResult(toolCall, result)
```

## 错误处理

工具执行失败时，应回调错误信息而非静默失败：

```json
{
  "function_id": "call-1",
  "result": null,
  "error": "文件不存在: /path/to/file"
}
```

## 安全考虑

:::warning
客户端工具在用户本地执行，请注意：
- 限制工具的文件访问范围
- 使用 `external_resource_access_policy` 控制越界访问
- 使用 `write_confirmation_policy` 控制写入审查
:::

## 相关文档

- [客户端工具协议](/integration/client-tool-protocol) — 完整协议规范
- [MCP 工具开发](/skill-development/mcp-tools) — 服务端工具开发
