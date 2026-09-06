# MCP 工具开发

> 这篇文档介绍如何开发 MCP（Model Context Protocol）工具，扩展智能体的执行能力。

## 什么是 MCP

MCP（Model Context Protocol）是 Agent 调用外部工具的标准协议，类似于 USB 是设备的通用接口。通过 MCP，Agent 能以统一方式调用各种工具。

## MCP 工具 vs 客户端工具

| 维度 | MCP 工具 | 客户端工具 |
|------|----------|-----------|
| 执行位置 | 服务端/独立 MCP 服务 | 客户端本地 |
| 注册方式 | `client_mcp_servers` / 平台 MCP 管理 | `available_tools` |
| 工具名前缀 | `s_`（远程 MCP） | `c_`（客户端） |
| 适用场景 | 通用服务（搜索、数据库、企业系统 API 封装） | 本地操作（文件、终端、浏览器等） |

## 三种传输类型

太乙智启客户端支持接入三种传输方式的 MCP 服务器：

| 类型 | 地址格式 | 说明 |
|------|----------|------|
| `streamable_http` | `http://localhost:8080/mcp` | **默认推荐**，HTTP 流式传输，支持会话缓存 |
| `sse` | `http://localhost:8080/sse` | Server-Sent Events，兼容旧版 MCP 服务 |
| `stdio` | `stdio://command arg1 arg2` | 本地子进程，标准输入输出通信，如 `stdio://npx -y @some/mcp-server` |

## 开发流程

### 1. 实现 MCP 服务

MCP 服务可以用任意语言实现，只要遵循 MCP 协议。核心是实现三类能力：`tools`（工具）、`resources`（资源）、`prompts`（提示词模板），最常用的是 tools。

以 Python（官方 SDK `mcp`）实现一个 stdio 服务为例：

```python
# my_mcp_server.py
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("order-service")

@mcp.tool()
def query_order(order_id: str) -> dict:
    """根据订单号查询订单状态。当用户询问订单进度时使用。

    Args:
        order_id: 订单号，如 DD20260901001
    """
    # 调用你的业务系统 API
    return {"order_id": order_id, "status": "已发货", "eta": "2026-09-08"}

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

以 Node.js（官方 SDK `@modelcontextprotocol/sdk`）实现一个 Streamable HTTP 服务为例：

```javascript
// server.mjs
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { z } from 'zod'
import express from 'express'

const server = new McpServer({ name: 'order-service', version: '1.0.0' })

server.tool(
  'query_order',
  '根据订单号查询订单状态。当用户询问订单进度时使用。',
  { order_id: z.string().describe('订单号，如 DD20260901001') },
  async ({ order_id }) => ({
    content: [{ type: 'text', text: JSON.stringify({ order_id, status: '已发货' }) }]
  })
)

const app = express()
app.post('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
  await server.connect(transport)
  await transport.handleRequest(req, res, req.body)
})
app.listen(8080)
```

:::tip 工具描述是最重要的代码
`description` 是 AI 决定是否调用工具的唯一依据。写清"做什么 + 什么时候用 + 参数含义"，比堆砌实现细节更有效。模糊的描述会导致误调用或漏调用。
:::

### 2. 注册到客户端

#### 方式 A：CLI 命令注册（持久化）

```bash
# Streamable HTTP 服务
taiyiflow-cli mcp add --name order-service --url http://localhost:8080/mcp --type streamable_http

# stdio 本地子进程
taiyiflow-cli mcp add --name local-tool --url "stdio://npx -y @some/mcp-server" --type stdio

# 查看 / 编辑 / 删除
taiyiflow-cli mcp list
taiyiflow-cli mcp edit --name order-service --url http://new-host:8080/mcp
taiyiflow-cli mcp remove --name order-service
```

注册信息持久化在客户端配置中，之后每次会话自动连接。

#### 方式 B：对话中让 AI 自助注册

客户端内置了 MCP 管理工具族，直接在对话里说"帮我添加一个 MCP 服务"即可：

| 工具 | 作用 |
|------|------|
| `mcp_list_servers` | 列出可访问的 MCP 服务器及状态 |
| `mcp_list_tools` | 列出某服务器下的工具与启用状态 |
| `mcp_add_server` | 添加自建服务器（name + server_url + server_type） |
| `mcp_edit_server` / `mcp_delete_server` | 编辑 / 删除自建服务器 |
| `mcp_toggle_server` / `mcp_toggle_tool` | 启用 / 禁用服务器或单个工具 |

变更类工具（add/edit/delete/toggle）受客户端审批模式约束，`readonly` 模式下会被拦截。

#### 方式 C：请求级动态声明（集成开发）

后端集成时通过运行接口的 `client_mcp_servers` 字段随请求上送，仅本次会话生效：

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

使用 MCP 官方调试工具 MCP Inspector 调试（`npx @modelcontextprotocol/inspector` 启动，或按平台提供的调试入口）。

按命令行提示打开浏览器访问 MCP Inspector 界面，可以：

- 连接你的 MCP 服务，列出全部工具
- 手工构造参数调用工具，查看原始返回
- 验证工具 schema 定义是否合法

调试建议顺序：Inspector 单工具调通 → CLI `mcp list` 确认注册成功 → 对话中让 AI 实际调用 → 检查工具调用记录（`GET /api/v1/sessions/{session_id}/callrecords`）核对参数与结果。

## 与技能的关系

MCP 工具解决"AI 能做到"，技能解决"AI 知道何时做、怎么做"。企业系统接入的推荐组合：

1. 把系统 API 封装为 MCP 工具（精确、可测试、事务安全）
2. 编写配套技能（SKILL.md），说明业务背景、调用顺序、结果解读规范
3. 技能通过 `metadata.requires` 或正文说明依赖哪些 MCP 工具

浏览器录制固化的技能中，高频且要求强可靠性的 API 调用也适合进一步沉淀为 MCP 工具，见[浏览器录制固化技能](/skill-development/browser-recording-skill)。

## 相关文档

- [客户端工具开发](/skill-development/client-tools) — 本地执行工具
- [客户端工具协议](/integration/client-tool-protocol) — 回调协议详解
- [技能注入机制](/integration/skill-injection) — 技能与工具如何进入上下文
