# 太乙智启文档站重构规划（企业视角版）

> **核心转变**：从"按技术组件分区"转向"按企业角色和业务场景分区"
> **目标读者**：企业决策者 → 业务负责人 → 企业员工 → 集成厂商/ISV → 平台运维 → 深度开发者
> **设计原则**：先讲业务价值，再讲技术实现；先给结论，再给细节

---

## 一、为什么要重构

### 现有结构的问题

| 问题 | 表现 |
|------|------|
| 技术视角主导 | 按"用户→管理员→集成开发→技能开发→贡献者"排列，企业决策者找不到入口 |
| 缺少业务场景 | 没有"智能客服""知识问答""流程自动化"等场景化入口 |
| 厂商集成路径不清晰 | ISV/SI 不知道如何基于太乙智启构建自己的产品 |
| 企业关注点缺失 | 安全合规、多租户、私有化部署、成本估算等企业刚需内容缺失 |
| 价值传递不足 | 首页直接罗列技术特性，没有回答"为什么选你" |

### 重构目标

1. **企业用户**：5 分钟内理解"这能帮我解决什么问题"，30 分钟内完成试点部署
2. **业务厂商**：清晰了解如何基于太乙智启构建产品、集成到客户系统、实现商业变现
3. **兼顾专业深度**：技术细节不丢失，但按"渐进式披露"原则分层呈现

---

## 二、读者画像与核心诉求

### 画像 A：企业决策者（CTO / IT 总监）

| 关注点 | 对应文档需求 |
|--------|-------------|
| 这能解决什么业务问题？ | 场景化价值说明 |
| 和竞品比有什么优势？ | 差异化定位、技术优势 |
| 部署成本和维护成本？ | 资源需求、部署方案对比 |
| 数据安全怎么保障？ | 安全架构、合规说明 |
| 能不能私有化部署？ | 部署模式说明 |

### 画像 B：业务负责人（部门经理 / 项目经理）

| 关注点 | 对应文档需求 |
|--------|-------------|
| 我的团队怎么用起来？ | 分角色的快速上手 |
| 能对接我们现有的系统吗？ | 集成方案概览 |
| 效果怎么衡量？ | 典型场景 + 效果指标 |
| 出了问题找谁？ | 运维与故障排查 |

### 画像 C：企业员工（最终使用者）

| 关注点 | 对应文档需求 |
|--------|-------------|
| 我怎么用？ | 极简操作指南 |
| 能帮我做什么？ | 场景化使用示例 |
| 遇到问题怎么办？ | FAQ + 自助排障 |

### 画像 D：业务厂商 / ISV / 系统集成商

| 关注点 | 对应文档需求 |
|--------|-------------|
| 怎么基于它做产品？ | 产品化集成指南 |
| API 够不够灵活？ | 完整 API 参考 |
| 能不能贴牌 / 定制？ | 白标与定制方案 |
| 多租户怎么支持？ | 多租户架构说明 |
| 商业模式怎么设计？ | 授权与分发说明 |

### 画像 E：平台运维 / 系统管理员

| 关注点 | 对应文档需求 |
|--------|-------------|
| 怎么部署和扩容？ | 部署与运维手册 |
| 怎么监控和排障？ | 监控、日志、告警 |
| 怎么管理用户和权限？ | 管理后台操作指南 |

---

## 三、新目录结构

```
taiyiflow-docs/src/
├── index.md                           # 🏠 首页（价值导向 + 角色入口）
│
├── overview/                          # 📌 第一部分：产品概览（给决策者看）
│   ├── what-is-taiyiflow.md           #   太乙智启是什么（业务语言版）
│   ├── why-taiyiflow.md               #   为什么选择太乙智启（差异化优势）
│   ├── use-cases.md                   #   典型应用场景（按行业/场景）
│   ├── architecture-overview.md       #   技术架构概览（一图看懂）
│   └── editions-and-licensing.md      #   版本与授权说明
│
├── quick-start/                       # 🚀 第二部分：快速上手（按角色分流）
│   ├── index.md                       #   选择你的角色（导航页）
│   ├── for-business-user.md           #   业务人员：10 分钟体验对话
│   ├── for-admin.md                   #   管理员：30 分钟完成部署
│   ├── for-developer.md               #   开发者：跑通第一个 API 调用
│   └── for-vendor.md                  #   厂商：搭建第一个集成 Demo
│
├── scenarios/                         # 🎯 第三部分：场景方案（业务价值导向）
│   ├── index.md                       #   场景总览
│   ├── intelligent-qa.md              #   企业知识问答 / 智能客服
│   ├── document-processing.md         #   文档处理与报告生成
│   ├── workflow-automation.md         #   业务流程自动化
│   ├── dev-assistant.md               #   研发效能提升（代码助手）
│   ├── data-analysis.md               #   数据分析与洞察
│   └── custom-scenario.md             #   自定义场景搭建指南
│
├── user-guide/                        # 👤 第四部分：使用指南（给企业员工）
│   ├── index.md                       #   使用指南总览
│   ├── web-chat.md                    #   Web 对话界面
│   ├── desktop-app.md                 #   桌面客户端
│   ├── cli-guide.md                   #   CLI 命令行工具
│   ├── skills-usage.md                #   使用技能扩展能力
│   ├── knowledge-base.md              #   知识库问答
│   ├── voice-interaction.md           #   语音对话
│   ├── file-handling.md               #   文件上传与处理
│   ├── tips-and-tricks.md             #   高效使用技巧
│   └── faq.md                         #   常见问题
│
├── admin-guide/                       # 🔧 第五部分：管理运维（给企业管理员）
│   ├── index.md                       #   管理指南总览
│   ├── deployment/                    #   部署专题
│   │   ├── planning.md                #     部署规划（资源评估、方案选型）
│   │   ├── docker-deploy.md           #     Docker 容器化部署
│   │   ├── k8s-deploy.md              #     Kubernetes 集群部署
│   │   └── air-gap-deploy.md          #     离线/内网部署
│   ├── user-management.md             #   用户与权限管理
│   ├── model-config.md                #   大模型接入与配额管理
│   ├── flow-designer.md               #   可视化流程设计器
│   ├── knowledge-management.md        #   知识库管理
│   ├── security.md                    #   安全配置（网络隔离、审计日志、数据加密）
│   ├── monitoring.md                  #   监控与告警
│   ├── backup-and-recovery.md         #   备份与恢复
│   └── upgrade.md                     #   版本升级指南
│
├── integration/                       # 🔌 第六部分：集成开发（给厂商和开发者）
│   ├── index.md                       #   集成方式选型指南
│   ├── concepts.md                    #   集成核心概念（会话、流式、回调）
│   ├── authentication.md              #   认证与鉴权
│   ├── stream-api.md                  #   SSE 流式对话 API
│   ├── websocket-api.md               #   WebSocket 实时接口
│   ├── rest-api.md                    #   REST API 参考
│   ├── jssdk.md                       #   JS SDK 集成（外链）
│   ├── client-tool-protocol.md        #   客户端工具回调协议
│   ├── skill-injection.md             #   技能注入机制
│   └── examples.md                    #   集成代码示例（Python/JS/Java/Go）
│
├── vendor-guide/                      # 🏢 第七部分：厂商指南（给 ISV/SI）
│   ├── index.md                       #   厂商合作总览
│   ├── product-building.md            #   基于太乙智启构建产品
│   ├── multi-tenancy.md               #   多租户架构与隔离
│   ├── white-label.md                 #   白标定制（品牌、UI、域名）
│   ├── billing-and-quota.md           #   计费与配额管理方案
│   ├── oem-distribution.md            #   OEM 分发与授权
│   ├── best-practices.md              #   厂商集成最佳实践
│   └── case-studies.md                #   厂商案例参考
│
├── skill-development/                 # 🧩 第八部分：技能开发（给深度开发者）
│   ├── skill-basics.md                #   技能是什么
│   ├── skill-format.md                #   SKILL.md 编写规范
│   ├── skill-lifecycle.md             #   技能生命周期
│   ├── mcp-tools.md                   #   MCP 工具开发
│   ├── client-tools.md                #   客户端工具开发
│   ├── skill-repo.md                  #   技能仓库与发布
│   └── best-practices.md              #   技能编写最佳实践
│
├── contributor-guide/                 # 🛠 第九部分：贡献者指南（给开源社区）
│   ├── architecture.md                #   系统架构详解
│   ├── dev-setup.md                   #   开发环境搭建
│   ├── backend-dev.md                 #   后端开发指南
│   ├── frontend-dev.md                #   前端开发指南
│   ├── cli-dev.md                     #   CLI 开发指南
│   ├── jssdk-dev.md                   #   JS SDK 开发指南
│   ├── database-migration.md          #   数据库迁移
│   └── coding-standards.md            #   编码规范与提交流程
│
└── reference/                         # 📚 第十部分：参考手册
    ├── api/                           #   API 接口文档
    │   ├── stream.md                  #     流式对话接口
    │   ├── session.md                 #     会话分组接口
    │   ├── voice.md                   #     语音相关接口
    │   ├── runtime-config.md          #     运行时配置接口
    │   └── data-structures.md         #     数据结构字典
    ├── config-reference.md            #   配置项参考
    ├── glossary.md                    #   术语表
    ├── changelog.md                   #   更新日志
    └── sla-and-support.md             #   服务等级与支持渠道
```

---

## 四、各章节内容规划

### 第一部分：产品概览（overview/）

> **目标读者**：企业决策者、技术选型负责人
> **核心原则**：用业务语言讲产品价值，技术细节点到为止

| 文档 | 核心内容 | 写作要点 |
|------|----------|----------|
| what-is-taiyiflow.md | 一段话讲清楚产品定位；用"问题→方案"结构；配一张产品全景图 | 避免堆砌技术名词，用"帮你做什么"替代"用了什么技术" |
| why-taiyiflow.md | 与通用大模型 API、其他开源框架的差异化对比；开源优势；可控性 | 用对比表格，突出"开源可控""不锁定""可私有化" |
| use-cases.md | 按行业（金融/制造/教育/政务）和场景（客服/知识管理/研发/运营）分类 | 每个场景配"痛点→方案→效果"三段式 |
| architecture-overview.md | 一张架构图 + 各组件一句话说明；数据流向 | 图为主，文字为辅；标注"你只需要关心这一层" |
| editions-and-licensing.md | 开源版 vs 企业版能力对比；授权模式；商业使用条款 | 表格对比，明确"免费能做什么，付费多什么" |

### 第二部分：快速上手（quick-start/）

> **目标读者**：所有角色的第一次接触
> **核心原则**：按角色分流，每条路径 ≤ 10 步，必须有"看到结果"的里程碑

| 文档 | 核心内容 | 关键里程碑 |
|------|----------|-----------|
| index.md | 角色选择导航："你是谁？" → 跳转对应路径 | 3 秒内找到自己的入口 |
| for-business-user.md | 打开 Web/桌面端 → 登录 → 发送第一条消息 → 尝试知识库问答 | "你成功和 AI 对话了" |
| for-admin.md | 环境检查 → Docker 一键部署 → 访问管理后台 → 创建第一个用户 | "你的团队可以开始用了" |
| for-developer.md | 获取 API Key → cURL 调用 → 收到流式响应 → 跑通 SDK Demo | "你的代码成功调用了 AI" |
| for-vendor.md | 理解集成架构 → 搭建最小 Demo → 调用核心 API → 嵌入前端页面 | "你的产品原型跑通了" |

### 第三部分：场景方案（scenarios/）

> **目标读者**：业务负责人、项目经理
> **核心原则**：每个场景 = 痛点描述 + 方案架构 + 实施步骤 + 效果预期

| 文档 | 场景描述 | 涉及能力 |
|------|----------|----------|
| intelligent-qa.md | 企业内部知识问答、对外智能客服 | 知识库 + RAG + 流程编排 |
| document-processing.md | 合同审查、报告生成、文档摘要 | 文件处理 + 大模型 + 技能 |
| workflow-automation.md | 审批辅助、工单分类、邮件自动回复 | 流程设计器 + API 集成 |
| dev-assistant.md | 代码生成、Code Review、技术文档 | CLI + 技能 + MCP 工具 |
| data-analysis.md | 自然语言查数据、报表生成 | 工具调用 + 知识库 |
| custom-scenario.md | 教用户用流程设计器搭建自定义场景 | 流程设计器 + 技能 + 集成 |

**每篇场景文档的统一结构**：

```markdown
# [场景名称]

## 业务痛点
> 用 2-3 句话描述目标用户面临的真实问题

## 解决方案
> 太乙智启如何解决这个问题（配架构图）

## 实施步骤
> 分步骤说明如何落地（含配置截图）

## 效果参考
> 可量化的效果指标（如响应时间、人力节省）

## 进阶玩法
> 如何进一步优化和扩展
```

### 第四部分：使用指南（user-guide/）

> **目标读者**：企业员工（非技术人员为主）
> **核心原则**：操作导向，每篇解决一个具体问题；大量使用截图和步骤编号

与现有结构基本一致，新增：
- `tips-and-tricks.md`：高效提示词写法、常用技能推荐、快捷操作
- 每篇开头增加"适用场景"说明："当你需要……时，使用本功能"

### 第五部分：管理运维（admin-guide/）

> **目标读者**：企业 IT 管理员、运维工程师
> **核心原则**：覆盖企业级运维全生命周期（规划→部署→运行→升级→灾备）

新增内容：
- `deployment/` 拆分为独立子目录，覆盖多种部署模式
- `security.md`：企业安全专题（网络策略、数据加密、审计日志、等保参考）
- `backup-and-recovery.md`：备份策略与灾难恢复
- `upgrade.md`：版本升级路径与回滚方案

### 第六部分：集成开发（integration/）

> **目标读者**：厂商开发者、企业内开发团队
> **核心原则**：先给全景选型，再深入单个接口；代码示例必须可运行

与现有结构基本一致，优化点：
- `index.md` 重写为"选型决策树"：你的场景 → 推荐集成方式
- `examples.md` 增加 Java、Go 示例（企业常用语言）
- 每个 API 文档增加"错误码速查"和"调试技巧"

### 第七部分：厂商指南（vendor-guide/）🆕

> **目标读者**：ISV、系统集成商、行业方案商
> **核心原则**：回答"如何基于太乙智启构建可售卖的产品/方案"

| 文档 | 核心内容 |
|------|----------|
| index.md | 厂商合作模式总览：产品集成 / OEM / 联合方案 |
| product-building.md | 从 0 到 1 构建产品的完整路径：架构设计→API 集成→UI 定制→测试→上线 |
| multi-tenancy.md | 多租户隔离方案：数据隔离、配额隔离、品牌隔离 |
| white-label.md | 白标定制指南：Logo/配色/域名/版权信息替换方案 |
| billing-and-quota.md | 计费模型设计参考：按调用量/按席位/按时间；配额管理 API |
| oem-distribution.md | OEM 分发：私有化交付、License 管理、版本同步 |
| best-practices.md | 厂商集成最佳实践：性能优化、错误处理、灰度发布 |
| case-studies.md | 脱敏案例：某 ISV 如何基于太乙智启交付行业方案 |

### 第八部分：技能开发（skill-development/）

> 与现有结构一致，面向深度开发者，不做大的调整

### 第九部分：贡献者指南（contributor-guide/）

> 与现有结构一致，面向开源社区贡献者

### 第十部分：参考手册（reference/）

> 与现有结构一致，新增：
> - `sla-and-support.md`：服务等级说明、技术支持渠道、社区资源

---

## 五、首页重构方案

### 现有首页问题
- 直接罗列 6 个技术特性卡片
- 没有回答"这对我有什么用"
- 缺少角色分流入口

### 新首页结构

```
┌─────────────────────────────────────────────────────┐
│  Hero 区                                             │
│  标题：让 AI 真正融入你的业务                          │
│  副标题：开源多智能体平台 · 私有化部署 · 不锁定模型     │
│  CTA：[快速上手] [查看场景方案] [联系我们]             │
├─────────────────────────────────────────────────────┤
│  角色入口区（4 张卡片）                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ 我是业务  │ │ 我是管理  │ │ 我是开发  │ │ 我是   │ │
│  │ 使用者   │ │ 员/运维   │ │ 者       │ │ 厂商   │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘ │
├─────────────────────────────────────────────────────┤
│  场景价值区（3-4 个典型场景，配简短说明）              │
│  智能客服 · 知识管理 · 流程自动化 · 研发提效           │
├─────────────────────────────────────────────────────┤
│  核心优势区（为什么选太乙智启）                       │
│  开源可控 · 模型不锁定 · 私有化部署 · 多端覆盖        │
├─────────────────────────────────────────────────────┤
│  快速链接区                                          │
│  5 分钟 Demo · API 文档 · 部署指南 · 更新日志         │
└─────────────────────────────────────────────────────┘
```

---

## 六、导航结构重构

### 顶部导航（按角色 + 阶段）

```
产品概览 | 快速上手 | 场景方案 | 使用指南 | 管理运维 | 集成开发 | 厂商指南 | 更多▾
                                                              ├─ 技能开发
                                                              ├─ 贡献者指南
                                                              └─ 参考手册
```

### 设计原则

| 原则 | 说明 |
|------|------|
| 前 5 项覆盖 90% 读者 | 企业用户和厂商最常访问的分区放前面 |
| 深度内容折叠 | 技能开发、贡献者、参考手册收入"更多"下拉 |
| 搜索优先 | 全局搜索入口突出，支持关键词直达 |

---

## 七、写作风格规范（升级版）

### 语言层次模型

每篇文档根据读者技术水平，采用"三层表达"：

| 层次 | 适用读者 | 示例 |
|------|----------|------|
| **业务层** | 决策者、业务人员 | "让员工用自然语言就能查询公司制度，不需要找 IT 部门" |
| **操作层** | 管理员、实施人员 | "在管理后台创建知识库，上传 PDF 文档，等待向量化完成" |
| **技术层** | 开发者、架构师 | "调用 /api/v1/stream 接口，传入 knowledge_base_id 参数触发 RAG 检索" |

### 写作规则

| 规则 | 说明 |
|------|------|
| 开头一句话 | 每篇文档第一行必须回答"这篇文档帮你解决什么问题" |
| 先结论后过程 | 先告诉读者结果/答案，再展开步骤和原理 |
| 类比优先 | 技术概念先用生活类比解释，再给精确定义 |
| 可运行代码 | 所有代码示例必须标注前置条件，复制即可运行 |
| 截图配标注 | 关键操作步骤配带标注的截图 |
| 提示框分级 | `:::tip` 技巧 / `:::warning` 注意 / `:::danger` 高风险操作 |
| 术语首次解释 | 专业术语首次出现时括号注释，如"RAG（检索增强生成，让 AI 基于你的资料回答）" |
| 避免空洞形容词 | 不写"强大的""丰富的"，写具体数字和能力 |

### 企业文档特有规范

| 规范 | 说明 |
|------|------|
| 安全声明 | 涉及数据处理的文档必须说明数据存储位置和传输加密方式 |
| 权限前提 | 操作类文档开头标注"需要 XX 角色权限" |
| 影响范围 | 配置变更类文档必须说明"影响范围"和"回滚方式" |
| 版本标注 | 功能说明标注"自 vX.Y 起支持" |

---

## 八、内容迁移映射

### 现有文档 → 新结构的对应关系

| 现有路径 | 新路径 | 变化说明 |
|----------|--------|----------|
| getting-started/introduction.md | overview/what-is-taiyiflow.md | 重写为业务语言版 |
| getting-started/core-concepts.md | integration/concepts.md | 移入集成开发，作为技术概念入口 |
| getting-started/installation.md | quick-start/for-admin.md + admin-guide/deployment/ | 拆分为快速体验 + 正式部署 |
| getting-started/first-conversation.md | quick-start/for-business-user.md | 扩展为业务用户快速上手 |
| user-guide/* | user-guide/* | 基本保留，新增 tips |
| admin-guide/* | admin-guide/* | 扩展安全、备份、升级内容 |
| integration/* | integration/* | 基本保留，优化选型入口 |
| skill-development/* | skill-development/* | 不变 |
| contributor-guide/* | contributor-guide/* | 不变 |
| reference/* | reference/* | 新增 SLA 文档 |
| — | overview/（全新） | 新增产品概览 |
| — | quick-start/（全新） | 新增角色分流快速上手 |
| — | scenarios/（全新） | 新增场景方案 |
| — | vendor-guide/（全新） | 新增厂商指南 |

---

## 九、编写优先级

### 🔴 P0：核心骨架（第 1-2 周）

1. `index.md` — 新首页
2. `overview/what-is-taiyiflow.md` — 产品定位（业务版）
3. `overview/why-taiyiflow.md` — 差异化优势
4. `quick-start/index.md` + `for-business-user.md` + `for-admin.md` — 快速上手主路径
5. `scenarios/intelligent-qa.md` — 第一个场景方案（最高频需求）

### 🟡 P1：企业核心（第 3-4 周）

6. `overview/use-cases.md` — 场景总览
7. `scenarios/` 剩余 5 篇
8. `admin-guide/deployment/` — 部署专题
9. `admin-guide/security.md` — 安全专题
10. `quick-start/for-developer.md` + `for-vendor.md`

### 🟢 P2：厂商与集成（第 5-6 周）

11. `vendor-guide/` 全部 8 篇
12. `integration/` 优化重写
13. `overview/architecture-overview.md`
14. `overview/editions-and-licensing.md`

### 🔵 P3：完善补充（第 7-8 周）

15. `user-guide/` 优化 + 新增 tips
16. `admin-guide/` 剩余新增内容
17. `reference/sla-and-support.md`
18. 迁移并优化 `skill-development/`、`contributor-guide/`

---

## 十、VitePress 配置调整要点

### 导航调整

```typescript
nav: [
  { text: '产品概览', link: '/overview/what-is-taiyiflow' },
  { text: '快速上手', link: '/quick-start/' },
  { text: '场景方案', link: '/scenarios/' },
  { text: '使用指南', link: '/user-guide/' },
  { text: '管理运维', link: '/admin-guide/' },
  { text: '集成开发', link: '/integration/' },
  { text: '厂商指南', link: '/vendor-guide/' },
  {
    text: '更多',
    items: [
      { text: '技能开发', link: '/skill-development/skill-basics' },
      { text: '贡献者指南', link: '/contributor-guide/architecture' },
      { text: '参考手册', link: '/reference/api/stream' }
    ]
  }
]
```

### 其他配置

- **搜索**：保持本地搜索，后续可升级 Algolia
- **品牌**：首页 Hero 使用业务价值主张，非技术描述
- **Footer**：增加"联系我们""商务合作"入口
- **多语言预留**：目录结构支持后续增加 `/en/` 英文版

---

## 十一、与现有文档的兼容策略

| 策略 | 说明 |
|------|------|
| 渐进迁移 | 不一次性删除旧文档，新旧并存过渡 |
| 重定向 | 旧路径配置 VitePress rewrites 或 nginx 301 到新路径 |
| 内容复用 | 技术细节（API 参数、配置项）直接迁移，不重写 |
| 增量新增 | 新增章节（overview/scenarios/vendor-guide）全部新写 |
| 标记废弃 | 旧入口页顶部加 `:::warning 本文档已迁移至 [新地址]` |

---

## 十二、效果衡量指标

| 指标 | 目标 |
|------|------|
| 新用户首次对话时间 | ≤ 10 分钟（从打开文档到完成第一次 AI 对话） |
| 管理员部署完成时间 | ≤ 30 分钟（从阅读部署文档到服务可用） |
| 厂商 Demo 搭建时间 | ≤ 2 小时（从阅读集成文档到跑通最小 Demo） |
| 文档跳出率 | 首页跳出率 < 40%（通过角色分流降低） |
| 搜索命中率 | 常用关键词首次搜索命中率 > 80% |
