# MCP 工具开发

> 这篇文档介绍如何开发 MCP（Model Context Protocol）工具，扩展智能体的执行能力。

## 什么是 MCP

MCP（Model Context Protocol）是 Agent 调用外部工具的标准协议，类似于 USB 是设备的通用接口。通过 MCP，Agent 能以统一方式调用各种工具。

## MCP 工具 vs 客户端工具

| 维度 | MCP 工具 | 客户端工具 |
|------|----------|-----------|
| 执行位置 | 服务端/独立 MCP 服务 | 客户端本地 |
| 注册方式 | `client_mcp_servers` | `available_tools` |
| 适用场景 | 通用服务（搜索、数据库等） | 本地操作（文件、终端等） |

## 开发流程

### 1. 实现 MCP 服务

<!-- TODO: 补充 MCP 服务实现的具体步骤和代码示例 -->

### 2. 注册到客户端

在发起对话时通过 `client_mcp_servers` 字段声明：

```json
{
  "client_mcp_servers": [
    {
      "name": "my-mcp-service",
      "tools": [
        {
          "name": "search_web",
          "description": "搜索互联网",
          "parameters": {
            "query": { "type": "string", "description": "搜索关键词" }
          }
        }
      ]
    }
  ]
}
```

### 3. 调试

使用 MCP Inspector 调试：

```bash
cd taiyiflow
make run_mcp_inspector
```

按命令行提示打开浏览器访问 MCP Inspector 界面。

## 相关文档

- [客户端工具开发](/skill-development/client-tools) — 本地执行工具
- [客户端工具协议](/integration/client-tool-protocol) — 回调协议详解
