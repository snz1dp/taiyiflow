# 系统架构总览

> 这篇文档帮助贡献者理解太乙智启的整体架构、组件关系和数据流。

## 架构图

```mermaid
graph TD
    subgraph 客户端
        CU["对话前端 chatui<br/>Quasar2 + Electron"]
        DW["管理前端 dashweb<br/>Quasar2"]
        CLI["CLI 客户端<br/>Go + Bubble Tea"]
        SDK["JS SDK<br/>taiyiflow-jssdk"]
    end

    subgraph 服务端
        BE["后端服务 taiyiflow<br/>Python + FastAPI"]
        WK["Worker 异步任务"]
    end

    subgraph 基础设施
        DB["数据库<br/>PostgreSQL/MySQL"]
        RD["Redis"]
        VS["向量存储"]
        LLM["大模型 API"]
    end

    CU --> BE
    DW --> BE
    CLI --> BE
    SDK --> BE
    BE --> DB
    BE --> RD
    BE --> VS
    BE --> LLM
    BE --> WK
```

## 组件职责

| 组件 | 技术栈 | 职责 |
|------|--------|------|
| taiyiflow | Python / FastAPI / SQLModel | Agent 编排、RAG、流式对话、MCP、API |
| taiyiflow-chatui | Quasar2 / Electron | 桌面客户端 & Web 对话界面 |
| dashweb | Quasar2 | 可视化流程设计器、管理后台 |
| taiyiflow-cli | Go / Bubble Tea | 终端智能体客户端 |
| taiyiflow-jssdk | JavaScript / Vite | Web 嵌入式集成 SDK |

## 后端目录结构

```
taiyiflow/src/backend/
├── base/taiyiflow/
│   ├── api/v1/          # API 路由
│   ├── alembic/         # 数据库迁移
│   ├── initial_setup/   # 初始化配置
│   └── models/          # 数据模型
├── taiyiflow/           # 核心包
├── tests/               # 测试
└── scripts/             # 脚本
```

## 数据流

```mermaid
sequenceDiagram
    participant C as 客户端
    participant B as 后端
    participant M as 大模型
    participant T as 工具

    C->>B: POST /stream 发起对话
    B->>M: 调用大模型推理
    M->>B: 返回推理结果
    alt 需要调用工具
        B->>C: SSE event: client_tool
        C->>T: 本地执行工具
        C->>B: 回调执行结果
        B->>M: 将结果交给模型继续推理
        M->>B: 最终回答
    end
    B->>C: SSE event: message
```

## 相关文档

- [开发环境搭建](/contributor-guide/dev-setup) — 开始开发前必读
- [后端开发指南](/contributor-guide/backend-dev) — 后端开发详情
