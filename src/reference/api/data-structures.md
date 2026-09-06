# 数据结构字典

> 太乙智启核心数据库模型结构参考，涵盖用户与安全、应用与流程、会话与消息、知识库与非结构化数据等模块。每个模型列出字段类型、约束及说明，便于开发和集成时对照接口返回值理解数据含义。

## 基础约定

- **时区处理**：统一使用平台时区工具生成时间戳，并在 Pydantic 序列化时输出 ISO8601 字符串。
- **JSON 存储**：配置类字段采用 JSON 列；大型字典文本会做长字符串截断。
- **枚举限制**：角色、状态等离散值在模型中定义常量或 Enum，通过校验器限定输入。

## 用户与安全模块

### 表：user.User

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | UUID | 主键，`uuid4()` | 用户唯一标识 |
| username | str | 唯一索引 | 登录名 |
| userid | str | 可空 | 外部系统用户 ID |
| password | str | 必填 | 密文存储 |
| profile_image | str | 可空 | 头像 URL |
| is_active | bool | 默认 False | 是否启用 |
| is_superuser | bool | 默认 False | 是否超级管理员 |
| create_at | datetime | 默认当前时区 | 创建时间 |
| updated_at | datetime | 默认当前时区 | 更新时间 |
| last_login_at | datetime | 可空 | 最近登录时间 |

### 表：user.UserVoiceprint

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | UUID | 主键，`uuid4()` | 声纹记录 ID |
| user_id | str | 非空，索引 | 所属用户 ID |
| speaker_id | str | 非空，索引 | 说话人 ID |
| real_speaker_id | str | 可空，索引 | 远端实际说话人 ID |
| speaker_name | str | 可空，索引 | 说话人名称 |
| speaker_description | str | 可空 | 说话人描述 |
| voice_data | bytes | 非空 | 声纹音频二进制 |
| enabled | bool | 默认 True，索引 | 是否启用声纹识别 |
| created_at | datetime | 默认当前时区 | 创建时间 |
| updated_at | datetime | 默认当前时区 | 更新时间 |

> 唯一约束：`(user_id, speaker_id)`。相关接口见[用户声纹接口](/reference/api/voiceprint)。

### 表：api_key.ApiKey

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | UUID | 主键，`uuid4()` | 主键 |
| api_key | str | 唯一索引 | 原始密钥字符串 |
| name | str | 可空，索引 | 密钥备注名 |
| userid | str | 可空，索引 | 归属用户 ID（字符串） |
| total_uses | int | 默认 0 | 调用次数计数 |
| last_used_at | datetime | 可空 | 最近使用时间 |
| created_at | datetime | 默认当前时区 | 创建时间 |
| is_active | bool | 默认 True | 是否可用 |

### 表：variable.Variable

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | UUID | 主键，`uuid4()` | 变量 ID |
| name | str | 必填 | 变量名称 |
| value | str | 必填 | 加密后的值 |
| type | str | 可空 | 变量类型（含凭证类型） |
| default_fields | list[str] | JSON，可空 | 默认字段定义 |
| enabled | bool | 默认 True | 是否启用 |
| owner_appid | UUID | 外键 `app.id`，可空 | 所属应用 |
| create_user | str | 可空 | 创建人 |
| modify_user | str | 可空 | 修改人 |
| readonly | bool | 默认 False | 是否只读 |
| created_at | datetime | 服务端默认 now | 创建时间 |
| updated_at | datetime | 服务端默认 now | 更新时间 |

### 表：settings.Settings

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| code | str | 主键 | 设置编码 |
| name | str | 索引 | 设置名称 |
| value | dict | JSON，可空 | 设置内容 |
| description | str | 可空 | 备注说明 |
| visible | bool | 默认 True，索引 | 是否对前端可见 |
| created_at | datetime | 默认当前时区 | 创建时间 |
| create_user | str | 可空，索引 | 创建人 |
| updated_at | datetime | 默认当前时区，索引 | 更新时间 |
| modify_user | str | 可空 | 修改人 |

### 表：prompt.UserPrompt

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | UUID | 主键 | 提示 ID |
| code | str | 唯一索引，长度 ≤64 | 提示代码 |
| name | str | 索引，≤128 | 提示名称 |
| template | str | 必填 | Prompt 模板正文 |
| description | str | 可空 | 描述 |
| arguments | list | JSON，默认空列表 | MCP Prompt 参数定义 |
| owner_user | str | 可空，索引 | 所属用户（为空表示公共） |
| create_user | str | 可空 | 创建人 |
| modify_user | str | 可空 | 修改人 |
| created_at | datetime | 默认当前时区 | 创建时间 |
| updated_at | datetime | 默认当前时区 | 更新时间 |
| flow_id | UUID | 外键 `flow.id`，可空 | 绑定流程 |
| enabled | bool | 默认 True，索引 | 是否启用 |

相关接口见[用户提示词接口](/reference/api/prompts)。

## 应用与流程模块

### 枚举：app.model.AppScope

| 枚举值 | 说明 |
|--------|------|
| publish | 公开应用，可向所有人发布 |
| organization | 仅组织成员可用 |
| user | 用户私有 |

### 表：app.App

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | UUID | 主键 | 应用 ID |
| code | str | 唯一索引 | 应用编码 |
| name | str | 索引 | 应用名称 |
| description | str | 可空，Text | 描述 |
| create_user | str | 可空 | 创建人 |
| modify_user | str | 可空 | 修改人 |
| manager | str | 可空，索引 | 项目主管 ID |
| manager_name | str | 可空，索引 | 项目主管名称 |
| leader | str | 可空，索引 | 项目经理 ID |
| leader_name | str | 可空，索引 | 项目经理名称 |
| maintenancers | list[str] | JSON，默认空 | 维护者列表 |
| knowledge_base_config | dict | JSON，默认空 | 知识库配置 |
| user_scope | str | 默认 `publish`，索引 | 授权范围 |
| enabled | bool | 默认 True，索引 | 是否启用 |
| created_at | datetime | 默认当前时区 | 创建时间 |
| updated_at | datetime | 默认当前时区 | 更新时间 |

### 表：app_org.AppOrganization

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | UUID | 主键 | 记录 ID |
| owner_appid | UUID | 外键 `app.id`，索引 | 对应应用 |
| org_version | str | 索引 | 组织版本 |
| department_id | str | 索引 | 部门 ID |
| department_path | str | 可空，索引 | 部门路径 |
| department_name | str | 可空，索引 | 部门名称 |
| create_user | str | 可空 | 创建人 |
| modify_user | str | 可空 | 修改人 |
| created_at | datetime | 默认当前时区 | 创建时间 |
| updated_at | datetime | 默认当前时区 | 更新时间 |

> 唯一约束：`(owner_appid, org_version, department_id)`。

### 表：app_user.AppUser

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | UUID | 主键 | 记录 ID |
| owner_appid | UUID | 外键 `app.id`，索引 | 所属应用 |
| user_name | str | 索引 | 成员唯一标识 |
| user_role | str | 索引，限定 `manager` / `developer` / `user` | 成员角色 |
| display_name | str | 可空，索引 | 展示名称 |
| create_user | str | 可空 | 创建人 |
| modify_user | str | 可空 | 修改人 |
| created_at | datetime | 默认当前时区 | 创建时间 |
| updated_at | datetime | 默认当前时区 | 更新时间 |

> 唯一约束：`(owner_appid, user_name)`。

### 枚举：flow.model.FlowStatus

| 枚举值 | 说明 |
|--------|------|
| draft | 草稿状态 |
| publish | 已发布，可使用 |
| offline | 已下线 |

### 表：flow.Flow

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | UUID | 主键 | 流程 ID |
| code | str | 唯一，可空 | 流程编码 |
| name | str | 索引 | 流程名称 |
| description | str | 可空，Text | 描述 |
| icon | str | 可空 | 图标，支持 Base64/Emoji |
| icon_bg_color | str | 可空 | 图标背景色（校验 HEX） |
| gradient | str | 可空 | 渐变背景配置 |
| data | dict | JSON，可空 | 流程图配置，需包含 `nodes`、`edges` |
| tags | list[str] | JSON，默认空 | 标签 |
| owner_appid | UUID | 外键 `app.id`，索引 | 所属应用 |
| create_user | str | 可空，索引 | 创建人 |
| modify_user | str | 可空，索引 | 修改人 |
| publish_user | str | 可空，索引 | 发布人 |
| publish_at | datetime | 默认当前时区 | 发布时间 |
| status | str | 可空，索引 | 状态，使用 `FlowStatus` |
| enabled | bool | 默认 True，索引 | 是否启用 |
| is_chat | bool | 默认 False，索引 | 是否对话型 |
| is_component | bool | 默认 False | 是否组件化流程 |
| is_system | bool | 默认 False，索引 | 是否系统内置 |
| master_flow | str | 可空，Text | 主流程 ID |
| revision | int | 默认 0 | 版本号 |
| created_at | datetime | 默认当前时区 | 创建时间 |
| updated_at | datetime | 默认当前时区 | 更新时间 |

> 唯一约束：`(owner_appid, name, is_component)`。

### 表：vertex_builds.VertexBuildTable

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| build_id | UUID | 主键 | 构建记录 ID |
| id | str | 必填 | 节点 ID |
| flow_id | UUID | 外键 `flow.id` | 所属流程 |
| timestamp | datetime | 默认当前时区 | 记录时间 |
| data | dict | JSON，可空 | 节点数据（截断长文本） |
| artifacts | dict | JSON，可空 | 产物信息 |
| params | str | 可空，Text | 运行参数 |
| valid | bool | 必填 | 是否有效 |

## 会话与消息模块

### 表：session.ChatSession

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | str | 主键 | 会话 ID |
| owner_user | str | 索引 | 所属用户 |
| session_name | str | 必填 | 会话名称 |
| created_at | datetime | 默认当前时区 | 创建时间 |
| updated_at | datetime | 默认当前时区 | 更新时间 |
| flow_id | UUID | 可空，索引 | 关联流程 |
| enabled | bool | 默认 True，索引 | 是否启用 |

会话分组接口见[会话分组接口](/reference/api/session)。

### 表：message.MessageTable

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | UUID | 主键 | 消息 ID |
| flow_id | UUID | 外键 `flow.id`，索引 | 所属流程 |
| session_id | str | 索引 | 会话 ID |
| timestamp | datetime | 默认当前时区 | 发送时间 |
| end_timestamp | datetime | 默认当前时区，可空 | 完成时间 |
| sender | str | 索引 | 发送方类型 |
| sender_name | str | 索引 | 发送方名称 |
| category | str | 默认 `message` | 消息类别 |
| text | str | Text | 消息正文 |
| prompt_text | str | Text | Prompt 正文 |
| files | list[str] | JSON，默认空 | 附件路径 |
| properties | dict | JSON，默认空 | 消息属性 |
| content_blocks | list | JSON，默认空 | 内容块详情 |
| error | bool | 默认 False | 是否错误消息 |
| edit | bool | 默认 False | 是否被编辑 |
| reason_text | str | 可空，Text | 思考内容 |
| internet_search | bool | 默认 False，索引 | 是否联网搜索 |
| search_keyword | str | 可空，索引 | 搜索关键词 |
| knowledge_scopes | list[str] | JSON，默认空 | 知识库范围 |
| knowledge_docs | list[str] | JSON，默认空 | 知识库文档 |
| search_results | list | JSON，默认空 | 搜索结果 |
| user_rating | int | 可空 | 用户评分 |
| rate_reason | str | 可空，Text | 评分原因 |
| rate_timestamp | datetime | 可空 | 评分时间 |
| reasoning_enabled | bool | 可空 | 是否启用深度思考 |
| executing | bool | 可空 | 是否执行中 |
| enabled | bool | 默认 True，索引 | 是否启用 |
| available_tools | list[str] | JSON，默认空 | 本轮可见工具白名单 |
| client_mcp_servers | dict | JSON，默认空 | 客户端上报 MCP 服务快照 |
| client_type | str | 默认 `text`，索引 | 客户端类型 |
| client_id | str | 可空，索引 | 客户端 ID |
| device_id | str | 可空，索引 | 设备 ID |
| token_usage | dict | JSON，可空 | Token 与运行时统计快照 |
| request_type | str | 可空，索引 | 请求类型（ask/agent/plan） |
| requested_skill_names | list[str] | JSON，可空 | 本轮显式启用技能列表 |
| agent_trace | dict | JSON，可空 | Agent 决策与执行留痕（兼容字段） |

### Agent 运行时留痕落库说明

- `token_usage`：直接存储在 `message.MessageTable.token_usage` JSON 字段中。
- `agent_trace`：通过 Agent Trace Upsert 链路写入独立留痕表（`agent_message_trace`），消息表中的 `agent_trace` 字段保留兼容读取能力。
- 请求收尾阶段会把会话级 `agent_runtime` 统计合并回消息对象，再进入上述持久化链路。

#### 小字段对照表（请求参数 → 运行时上下文 → 消息落库字段）

| 请求参数（SimplifiedAPIRequest） | 运行时上下文（AgentContext / session config） | 消息落库字段（message / agent_trace） | 备注 |
|---|---|---|---|
| `request_type` | `AgentContext.request_type` | `message.request_type`、`agent_trace.request_type`、`token_usage.agent.request_type` | 支持 `ask/agent/plan` |
| `runtime_strategy` | `AgentContext.runtime_strategy`、`session.config.agent_runtime.runtime_strategy` | `agent_trace.runtime_strategy`、`token_usage.agent.runtime_strategy` | 未显式传值时按 `request_type` 推导默认策略 |
| `max_iterations` | `AgentContext.max_iterations` | `agent_trace.max_iterations`、`token_usage.agent.max_iterations` | `agent` 场景可覆盖默认上限 |
| `agent_continue_windows` | `AgentContext.agent_continue_windows` | `agent_trace.agent_continue_windows`、`token_usage.agent.agent_continue_windows` | 非交互续跑窗口 |
| `available_tools` | `AgentContext.available_tools`、`session.config.agent_runtime.available_tools` | `message.available_tools`、`agent_trace.available_tools`、`token_usage.agent.available_tools` | 旧 `mcp_tools` 仅兼容输入 |
| `command_execution_target` | 工具可见性裁剪后写入 `AgentContext.available_tools` | 间接体现在 `message.available_tools` 与留痕字段 | 不直接单独落库，作用于工具白名单结果 |
| `requested_skill_names` | `AgentContext.skill_names` | `message.requested_skill_names`、`agent_trace.skill_names`、`token_usage.agent.skill_names` | 入参与实际解析结果可能不完全一致 |
| `client_skill_packages` | 技能解析输入（不参与工具绑定） | `agent_trace.has_extra_skill_text` / 技能来源留痕（若有） | 不直接写入 message 独立字段 |
| `client_mcp_servers` | `session_holder.client_mcp_servers` / 工具注册链路 | `message.client_mcp_servers` | 客户端上报 MCP 快照 |
| （运行期统计） | `session.config.agent_runtime.tool_rounds` 等 | `agent_trace.tool_rounds/tool_failure_rounds/hermes_recovery_rounds/tool_force_answer_rounds/last_tool_actions`；`token_usage.agent.*` 同步 | 请求收尾阶段从 session 统计合并回消息 |

`token_usage` / `agent_trace` 的 JSON 示例见[流式对话接口速查](/reference/api/stream#运行时留痕与统计字段)。

### 表：transactions.TransactionTable

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | UUID | 主键 | 事务 ID |
| flow_id | UUID | 外键 `flow.id` | 所属流程 |
| vertex_id | str | 必填 | 节点 ID |
| target_id | str | 可空 | 目标节点 |
| timestamp | datetime | 默认当前时区 | 执行时间 |
| inputs | dict | JSON，可空 | 输入参数 |
| outputs | dict | JSON，可空 | 输出结果（截断长文本） |
| status | str | 必填 | 执行状态 |
| error | str | 可空 | 错误信息 |

### 表：share.ChatShare

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | UUID | 主键 | 分享 ID |
| title | str | 可空 | 分享标题 |
| owner_user | str | 索引 | 分享创建人 |
| flow_id | UUID | 可空，索引 | 关联流程 |
| session_id | str | 可空，索引 | 关联会话 |
| message_ids | list[str] | JSON，默认空 | 消息 ID 列表 |
| created_at | datetime | 默认当前时区 | 创建时间 |
| user_scope | str | 默认 `publish`，索引 | 分享范围 |
| thumbnail | str | 可空 | 缩略图 |
| share_white_users | list[str] | JSON，默认空 | 用户白名单 |
| share_black_users | list[str] | JSON，默认空 | 用户黑名单 |
| share_departments | list[str] | JSON，默认空 | 部门限制 |
| enabled | bool | 默认 True，索引 | 是否启用 |

### 表：share.ShareVisitHistory

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | UUID | 主键 | 访问记录 ID |
| share_id | UUID | 索引 | 被访问的分享 |
| visit_user | str | 可空，索引 | 访问用户 |
| visit_count | int | 默认 0 | 访问次数 |
| visit_at | datetime | 默认当前时区 | 访问时间 |
| last_visit | datetime | 默认当前时区 | 最后访问时间 |
| rate_value | int | 可空 | 用户评分 |
| rate_reason | str | 可空，Text | 评分原因 |
| rate_at | datetime | 可空 | 评分时间 |

### 表：file.FileRecord

文件记录表，存储上传的文件元信息。

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | UUID | 主键 | 文件记录 ID |
| flow_id | UUID | 索引 | 所属流程 |
| session_id | str | 可空，索引 | 所属会话 |
| file_name | str | 索引 | 文件名 |
| file_size | int | 可空 | 文件大小（字节） |
| upload_by | str | 可空，索引 | 上传者 |
| upload_at | datetime | 默认当前时区 | 上传时间 |
| enabled | bool | 默认 True，索引 | 是否启用 |
| referenced | int | 默认 0，索引 | 引用计数 |
| checksum | str | 可空，索引 | 文件校验和 |
| file_type | str | 可空，索引 | 文件类型 |

> 唯一约束：`(flow_id, session_id, file_name)`。

## 知识库与非结构化模块

### 枚举：knowledge_base.model.KnowledgeBaseType

| 枚举值 | 说明 |
|--------|------|
| shared | 共享知识库 |
| personal | 个人知识库 |

### 枚举：knowledge_base.model.KnowledgeDocumentStatus

| 枚举值 | 说明 |
|--------|------|
| new | 新建任务 |
| importing | 正在导入 |
| success | 导入成功 |
| canceled | 已取消 |
| failed | 导入失败 |

### 表：knowledge_base.KnowledgeBase

知识库表，存储知识库的元信息。

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | UUID | 主键 | 知识库 ID |
| code | str | 索引 | 知识库代码 |
| display_name | str | 可空，索引 | 名称 |
| description | str | 可空 | 描述 |
| create_user | str | 可空，索引 | 创建人 |
| modify_user | str | 可空，索引 | 修改人 |
| owner_appid | UUID | 可空，索引 | 所属应用 |
| owner_user | str | 可空，索引 | 拥有者 |
| type | enum | 可空，索引 | 知识库类型 |
| advanced_permission | bool | 默认 False | 是否开启高级权限 |
| white_roles | list[str] | JSON，默认空 | 角色白名单 |
| black_roles | list[str] | JSON，默认空 | 角色黑名单 |
| white_users | list[str] | JSON，默认空 | 用户白名单 |
| black_users | list[str] | JSON，默认空 | 用户黑名单 |
| owner_departments | list[str] | JSON，默认空 | 部门限制 |
| document_count | int | 默认 0 | 文档数量 |
| chunk_count | int | 默认 0 | 分片数量 |
| extended_attributes | dict | JSON，可空 | 扩展属性 |
| enabled | bool | 默认 True，索引 | 是否可用 |
| created_at | datetime | 默认当前时区 | 创建时间 |
| updated_at | datetime | 默认当前时区 | 更新时间 |

> 唯一约束：`(owner_appid, code, owner_user)`。

### 表：knowledge_base.KnowledgeDocument

知识文档表，存储导入的知识文档元信息。

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | UUID | 主键 | 文档 ID |
| name | str | 索引 | 文档名称 |
| document_text | str | 可空 | 文本内容 |
| file_id | UUID | 可空，索引 | 关联文件 ID |
| file_path | str | 可空，索引 | 文件路径 |
| file_size | int | 可空 | 文件大小 |
| checksum | str | 可空，索引 | 校验和 |
| origin_url | str | 可空 | 来源 URL |
| site_name | str | 可空 | 来源站点 |
| site_icon | str | 可空 | 来源图标 |
| knowledge_base_id | UUID | 可空，索引 | 所属知识库 |
| session_id | str | 可空，索引 | 关联会话 |
| flow_id | UUID | 可空，索引 | 关联流程 |
| owner_appid | UUID | 可空，索引 | 所属应用 |
| create_user | str | 可空，索引 | 创建人 |
| created_at | datetime | 默认当前时区 | 创建时间 |
| state | enum | 默认 `new`，索引 | 导入状态 |
| error_message | str | 可空 | 错误描述 |
| chunk_count | int | 默认 0 | 分片数量 |
| chunk_ids | list[str] | JSON，默认空 | 分片 ID 列表 |
| extended_attributes | dict | JSON，可空 | 扩展属性 |
| modify_user | str | 可空，索引 | 修改人 |
| updated_at | datetime | 默认当前时区 | 更新时间 |
| white_roles / black_roles | list[str] | JSON，默认空 | 角色白/黑名单 |
| white_users / black_users | list[str] | JSON，默认空 | 用户白/黑名单 |
| owner_departments | list[str] | JSON，默认空 | 部门限制 |
| task_id | str | 可空，索引 | 任务 ID |
| process_id | str | 可空，索引 | 处理进程 ID |
| summary | str | 可空 | 文档摘要 |
| enabled | bool | 默认 True，索引 | 是否可用 |

> 唯一约束：`(knowledge_base_id, checksum)`。

### 表：unstructured.FileUnstructuredRecord

文件非结构化处理记录表，存储文件解析状态及信息。

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| file_id | str | 主键 | 文件记录 ID |
| status | enum | 默认 `pending`，索引 | 解析状态 |
| message | str | 可空 | 状态消息 |
| checksum | str | 索引 | 文件校验和 |
| file_size | int | 索引 | 文件大小 |
| start_at | datetime | 默认当前时区 | 开始时间 |
| last_active_at | datetime | 默认当前时区 | 最近活动时间 |
| end_at | datetime | 默认当前时区，可空 | 结束时间 |
| process_id | str | 可空，索引 | 处理进程 |

> 唯一约束：`(checksum, file_size)`。

### 表：unstructured.UnstructuredChunk

非结构化数据分片表，存储文件分片及其元信息。

| 字段 | 类型 | 约束/默认 | 说明 |
|------|------|-----------|------|
| id | UUID | 主键 | 分片 ID |
| element_id | str | 索引 | 元素 ID |
| parent_id | str | 可空，索引 | 父元素 ID |
| file_id | str | 可空，索引 | 对应文件 |
| category | str | 可空，索引 | 块类别 |
| page_number | int | 可空，索引 | 页码 |
| attach_path | str | 可空 | 附件路径 |
| attach_mime_type | str | 可空 | 附件 MIME 类型 |
| image_catelog | str | 可空，索引 | 图片分类 |
| image_scene | str | 可空，索引 | 图片场景 |
| image_summary | str | 可空 | 图片摘要 |
| image_has_human | bool | 可空，索引 | 是否有人像 |
| image_has_face | bool | 可空，索引 | 是否人脸 |
| origin_text | str | 可空，Text | 原始文本 |
| origin_html | str | 可空，Text | 原始 HTML |
| text | str | 可空，Text | 处理后文本 |
| text_as_html | str | 可空，Text | HTML 文本 |
| coordinates | dict | JSON，可空 | 坐标信息 |
| ordinal | int | 可空，索引 | 顺序 |
| languages | list[str] | JSON，默认空 | 语种 |
| attach_handled | bool | 默认 False，索引 | 附件是否处理 |
| handled_success | bool | 可空，索引 | 处理是否成功 |
| handled_message | str | 可空 | 处理结果说明 |
| handle_elapsed | float | 可空 | 处理耗时（毫秒） |
| created_at | datetime | 默认当前时区 | 创建时间 |
| created_user | str | 可空 | 创建人 |
| modified_at | datetime | 默认当前时区 | 更新时间 |
| modify_user | str | 可空 | 修改人 |

> 分片记录可转换为 LangChain `Document`，在需要时自动读取附件并转为 Base64。

## 其他说明

- 各模块还定义了 `Base/Create/Read/Update` 等 Pydantic 模型，用于 API 入参和出参校验，不在此重复列出。
- 字段级最权威来源是部署实例的 OpenAPI 文档（`/docs`、`/openapi.json`），见 [REST API 参考](/integration/rest-api#交互式接口文档)。
