# 术语表

> 太乙智启相关术语的简明定义。

| 术语 | 英文 | 定义 |
|------|------|------|
| 智能体 | Agent | 能思考、能调用工具、能多步执行任务的 AI 实体 |
| 服务/流程 | Flow | Agent 的工作蓝图，定义模型、提示词、工具和知识库的组合 |
| 会话 | Session | 一次对话上下文，包含多轮消息 |
| 技能 | Skill | 结构化的提示词注入，告诉 Agent 在特定场景下怎么做 |
| MCP | Model Context Protocol | Agent 调用外部工具的标准协议 |
| RAG | Retrieval-Augmented Generation | 检索增强生成，让 AI 基于私有数据回答 |
| SSE | Server-Sent Events | 服务端向客户端推送流式数据的协议 |
| TUI | Terminal User Interface | 终端用户界面 |
| 客户端工具 | Client Tool | 在用户本地执行的工具，通过回调协议与 Agent 交互 |
| 运行时策略 | Runtime Strategy | Agent 执行时的行为策略（default/hermes） |
| 请求类型 | Request Type | 对话模式（ask/plan/agent） |
| 渐进式披露 | Progressive Disclosure | 按需加载技能，避免一次性注入过多内容 |
| 向量存储 | Vector Store | 存储文档向量的数据库，用于 RAG 检索 |
| 流式输出 | Streaming | AI 回答逐字/逐块实时输出 |
| 技能包 | Skill Package | 技能的完整数据结构，包含名称、描述、内容和元数据 |
