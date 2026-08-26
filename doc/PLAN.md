# 太乙智启文档站规划方案

> 项目目录：`taiyiflow-docs` | 技术方案：VitePress | 面向读者：用户 → 管理员 → 集成开发者 → 技能开发者

---

## 一、产品组件全景

| 组件 | 仓库目录 | 技术栈 | 定位 |
|------|----------|--------|------|
| 后端服务 | `taiyiflow` | Python / FastAPI / SQLModel | 核心引擎：Agent 编排、RAG、流式对话、MCP 协议 |
| 对话前端 | `taiyiflow-chatui` | Quasar2 + Electron | 桌面客户端 & Web 对话界面 |
| 管理前端 | `dashweb` | Quasar2 | 可视化流程设计器、用户/模型/知识库管理 |
| CLI 客户端 | `taiyiflow-cli` | Go / Bubble Tea TUI | 终端智能体客户端 |
| JS SDK | `taiyiflow-jssdk` | JavaScript / Vite | Web 页面嵌入式集成 SDK |

---

## 二、文档站目录结构

```
taiyiflow-docs/
├── package.json
├── PLAN.md                            # 本规划文件
├── README.md                          # 项目说明
├── src/                               # 文档源目录（VitePress root）
│   ├── index.md                       # 🏠 首页（Hero + 功能卡片）
│   │
│   ├── getting-started/               # 📖 第一部分：快速入门
│   │   ├── introduction.md            #   太乙智启是什么
│   │   ├── core-concepts.md           #   核心概念（Agent/Flow/技能/MCP/RAG）
│   │   ├── installation.md            #   安装与部署
│   │   └── first-conversation.md      #   5 分钟完成第一次对话
│   │
│   ├── user-guide/                    # 👤 第二部分：用户指南
│   │   ├── desktop-app.md             #   桌面客户端使用
│   │   ├── web-chat.md                #   Web 对话界面
│   │   ├── cli-guide.md               #   CLI 命令行工具
│   │   ├── skills-usage.md            #   技能的发现与使用
│   │   ├── knowledge-base.md          #   知识库检索
│   │   ├── voice-interaction.md       #   语音对话
│   │   ├── file-handling.md           #   文件上传与处理
│   │   └── faq.md                     #   常见问题
│   │
│   ├── admin-guide/                   # 🔧 第三部分：管理指南
│   │   ├── deployment.md              #   部署架构与运维
│   │   ├── user-management.md         #   用户与权限管理
│   │   ├── model-config.md            #   大模型接入与配额
│   │   ├── flow-designer.md           #   可视化流程设计器
│   │   ├── knowledge-management.md    #   知识库管理
│   │   └── monitoring.md              #   监控与日志
│   │
│   ├── integration/                   # 🔌 第四部分：集成开发指南
│   │   ├── overview.md                #   集成方式总览
│   │   ├── authentication.md          #   认证与鉴权
│   │   ├── stream-api.md              #   流式对话 API（SSE）
│   │   ├── websocket-api.md           #   WebSocket 实时接口
│   │   ├── rest-api.md                #   REST API 参考
│   │   ├── jssdk.md                   #   JS SDK 集成（→ 链接 jssdk 文档站）
│   │   ├── client-tool-protocol.md    #   客户端工具回调协议
│   │   ├── skill-injection.md         #   技能注入机制
│   │   └── examples.md                #   集成示例（Python/JS/cURL）
│   │
│   ├── skill-development/             # 🧩 第五部分：技能开发指南
│   │   ├── skill-basics.md            #   技能是什么
│   │   ├── skill-format.md            #   SKILL.md 编写规范
│   │   ├── skill-lifecycle.md         #   技能生命周期（发现→加载→注入）
│   │   ├── mcp-tools.md               #   MCP 工具开发
│   │   ├── client-tools.md            #   客户端工具开发
│   │   ├── skill-repo.md              #   技能仓库与发布
│   │   └── best-practices.md          #   技能编写最佳实践
│   │
│   └── reference/                     # 📚 第六部分：参考手册
│       ├── api/                       #   API 接口文档
│       │   ├── stream.md              #     流式对话接口
│       │   ├── session.md             #     会话分组接口
│       │   ├── voice.md               #     语音相关接口
│       │   ├── runtime-config.md      #     运行时配置接口
│       │   └── data-structures.md     #     数据结构字典
│       ├── config-reference.md        #   配置项参考
│       ├── glossary.md                #   术语表
│       └── changelog.md               #   更新日志
│
└── src/.vitepress/
    ├── config.mts                     # VitePress 站点配置
    └── theme/
        └── index.ts                   # 自定义主题（品牌色等）
```

---

## 三、各章节内容规划与素材来源

### 第一部分：快速入门（getting-started）

| 文档 | 核心内容 | 素材来源 |
|------|----------|----------|
| introduction.md | 产品定位、五大组件简介、适用场景 | taiyiflow README、产品定位描述 |
| core-concepts.md | Agent、Flow、技能（Skill）、MCP、RAG、会话（Session）等概念通俗解释 | 流式对话接口文档、JSSDK README |
| installation.md | 桌面客户端安装、Web 部署、CLI 安装、Docker 部署 | chatui README（Electron 构建）、taiyiflow INSTALL.md |
| first-conversation.md | 从打开应用到完成第一次 AI 对话的分步教程 | 需实操截图补充 |

### 第二部分：用户指南（user-guide）

| 文档 | 核心内容 | 素材来源 |
|------|----------|----------|
| desktop-app.md | 桌面客户端功能、快捷键、设置 | chatui Electron 相关代码与文档 |
| web-chat.md | Web 对话界面功能、Markdown 渲染、文件预览 | chatui docs/arch/ 下文档 |
| cli-guide.md | CLI 安装、登录、对话、任务管理、配置 | taiyiflow-cli README |
| skills-usage.md | 技能列表查看、启用/禁用、远程仓库安装 | taiyiflow-cli 技能章节 |
| knowledge-base.md | 知识库检索使用方法 | chatui docs/design/knowledge_search |
| voice-interaction.md | 语音对话、声纹、音色管理 | 语音对话接口、实时语音识别文档 |
| file-handling.md | 文件上传、预览、Diff 对比 | chatui docs/arch/文件预览方案 |
| faq.md | 常见问题汇总 | 各仓库 TODO、已知问题 |

### 第三部分：管理指南（admin-guide）

| 文档 | 核心内容 | 素材来源 |
|------|----------|----------|
| deployment.md | 部署架构、Docker 编排、环境要求 | Dockerfile、Makefile、BUILD.yaml |
| user-management.md | 用户/角色/权限管理 | dashweb 接口定义 |
| model-config.md | 大模型接入、配额管理、多模型组合 | dashweb 模型配额接口文档 |
| flow-designer.md | 可视化流程设计器操作指南 | taiyiflow doc/wiki/可视化流程设计器 |
| knowledge-management.md | 知识库创建、文档导入、向量化配置 | 后端 RAG 相关代码 |
| monitoring.md | 日志、监控、健康检查 | 运维相关配置 |

### 第四部分：集成开发指南（integration）

| 文档 | 核心内容 | 素材来源 |
|------|----------|----------|
| overview.md | 三种集成方式：REST API / WebSocket / JSSDK | 整体架构 |
| authentication.md | API Key、Token、扫码登录 | taiyiflow-cli 登录章节 |
| stream-api.md | SSE 流式对话完整协议 | 流式对话接口.md |
| websocket-api.md | WebSocket 实时通信协议 | websocket-stream-api.md |
| rest-api.md | RESTful API 汇总 | doc/backend/api/ 下所有文档 |
| jssdk.md | JS SDK 集成指引 → **外链到 jssdk 文档站** | taiyiflow-jssdk docs/ |
| client-tool-protocol.md | 客户端工具回调协议 | 流式对话接口 client_tool 章节 |
| skill-injection.md | 技能注入机制（client_skill_packages） | JSSDK SKILL 供应机制 |
| examples.md | Python/JavaScript/cURL 集成代码示例 | 需编写 |

### 第五部分：技能开发指南（skill-development）

| 文档 | 核心内容 | 素材来源 |
|------|----------|----------|
| skill-basics.md | 技能本质 = 提示词注入 + 工具绑定 | JSSDK SKILL 供应机制 |
| skill-format.md | SKILL.md frontmatter + 正文编写规范 | 现有技能包示例 |
| skill-lifecycle.md | 发现 → 加载 → 渐进式披露 → 注入 | taiyiflow-cli 技能章节 |
| mcp-tools.md | MCP 服务开发与注册 | taiyiflow MCP Inspector |
| client-tools.md | 客户端工具开发（本地执行） | 流式对话接口 client_tool |
| skill-repo.md | 技能仓库、发布、版本管理 | taiyiflow-cli 远程技能仓库 |
| best-practices.md | 技能编写最佳实践与模板 | 需编写 |

### 第六部分：参考手册（reference）

| 文档 | 核心内容 | 素材来源 |
|------|----------|----------|
| api/*.md | 各接口详细参数与响应 | doc/backend/api/ 下文档 |
| config-reference.md | CLI/后端/前端配置项汇总 | taiyiflow-cli 配置、quasar.config |
| glossary.md | 术语表 | 需编写 |
| changelog.md | 版本更新日志 | 各仓库 VERSION、git log |

---

## 四、编写优先级与批次计划

### 🔴 第一批（核心骨架，优先完成）
1. `index.md` — 首页
2. `getting-started/` — 快速入门全部 4 篇
3. `user-guide/cli-guide.md` — CLI 使用指南
4. `integration/overview.md` + `stream-api.md` — 集成入口

### 🟡 第二批（用户 & 管理）
5. `user-guide/` — 用户指南剩余 7 篇
6. `admin-guide/` — 管理指南全部 6 篇

### 🟢 第三批（开发者）
7. `integration/` — 集成开发剩余 7 篇
8. `skill-development/` — 技能开发全部 7 篇

### 🔵 第四批（参考）
9. `reference/` — 参考手册全部

---

## 五、写作风格规范

| 规则 | 说明 |
|------|------|
| 语言 | 中文为主，技术术语保留英文（如 Agent、MCP、SSE） |
| 语气 | 通俗易懂、循序渐进，避免堆砌术语 |
| 结构 | 每篇文档开头一句话说明"这篇文档解决什么问题" |
| 代码 | 所有代码示例必须可运行，标注语言和前置条件 |
| 截图 | 关键操作步骤配截图，使用 `docs/public/images/` 统一管理 |
| 链接 | JSSDK 文档外链到其独立文档站，不重复维护 |
| 提示框 | 使用 VitePress 的 `:::tip` `:::warning` `:::danger` 标注注意事项 |

---

## 六、VitePress 技术要点

- **框架**：VitePress（与 taiyiflow-jssdk 文档站保持一致的技术选型）
- **搜索**：内置本地搜索（`vitepress-plugin-search`）或 Algolia DocSearch
- **导航**：顶部导航按读者角色分区（用户 / 管理员 / 开发者）
- **侧边栏**：按上述目录结构自动生成
- **品牌**：自定义主题色，与太乙智启产品视觉一致
- **部署**：支持 Docker 镜像发布 + GitHub Pages 双渠道（参考 jssdk 方案）
- **JSSDK 外链**：在集成开发章节中直接链接到 jssdk 文档站地址

---

## 七、与 JSSDK 文档站的关系

`taiyiflow-jssdk` 已有独立的 VitePress 文档站，包含：
- 概念入门（introduction.md）
- 快速开始（overview.md）
- 使用指南（user-guide.md）
- 高级功能（advanced.md）
- 架构文档（architecture.md）

**策略**：taiyiflow-docs 中 `integration/jssdk.md` 作为入口页，简要说明 JSSDK 的定位和适用场景，然后**外链到 jssdk 文档站**，避免内容重复维护。
