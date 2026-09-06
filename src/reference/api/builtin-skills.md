# 内置技能客户端类型供应

> 说明后端如何根据 `client_type`（客户端类型）自动供应内置技能，以及新增内置技能的操作流程。技能注入的整体机制（三层解析、请求级技能声明）见[技能注入机制](/integration/skill-injection)，本页只补充服务端注册表与维护流程细节。

## 背景

不同客户端类型（web、cli、esp32 等）对技能的渲染能力不同。例如 web 前端支持 ECharts 交互式图表渲染，而 cli 终端仅支持纯文本输出。因此需要按 `client_type` 差异化供应内置技能。

## 核心机制

### 注册表

服务端 Agent 服务中维护两个映射表：

| 映射表 | 维度 | 说明 |
|--------|------|------|
| `DEFAULT_BUILTIN_SKILLS_BY_REQUEST_TYPE` | `request_type` | 按请求类型（ask/agent/plan）供应的内置技能 |
| `BUILTIN_SKILLS_BY_CLIENT_TYPE` | `client_type` | 按客户端类型（web/cli/esp32）供应的内置技能 |

`BUILTIN_SKILLS_BY_CLIENT_TYPE` 支持特殊 key `"all"`，表示所有客户端类型通用。

### 解析链路

```
请求进入 → build_context(client_type=...)
         → resolve_skills(client_type=...)
         → _resolve_requested_skill_names(client_type=...)
            1. 合并 DEFAULT_BUILTIN_SKILLS_BY_REQUEST_TYPE[request_type]
            2. 合并 BUILTIN_SKILLS_BY_CLIENT_TYPE["all"]
            3. 合并 BUILTIN_SKILLS_BY_CLIENT_TYPE[client_type]
            4. 合并显式请求的技能名
            5. 去重
         → 三层解析：client_skill_packages → db_skills → 本地文件技能
```

三层解析优先级详见[技能注入机制](/integration/skill-injection)。

### 防御性校验

技能文件的 frontmatter 支持 `client_types` 字段（逗号分隔），加载时会校验当前 `client_type` 是否在列表中。即使注册表配置错误，也不会将不适用的技能注入到错误的客户端。

```yaml
---
name: echarts
description: ...
client_types: web
---
```

## client_type 传递链路

| 层级 | 来源 | 说明 |
|------|------|------|
| API 层 | `chat_session.client_type` | 会话创建时记录的客户端类型 |
| 模型组件层 | `graph_context.get("client_type")` | 从连接/图上下文中提取 |
| 技能解析层 | `resolve_skills(client_type=...)` | 透传到技能名称合并与文件加载 |

## 当前已注册的内置技能

| 技能名 | client_type | 说明 |
|--------|-------------|------|
| `doc_summary` | 所有（按 request_type=ask） | 文档摘要 |
| `doc_writer` | 所有（按 request_type=ask） | 文档写作 |
| `echarts` | web | ECharts 数据可视化图表 |
| `mermaid` | web | Mermaid 流程图、时序图、脑图等结构化图形 |

## 新增内置技能操作流程

1. **创建技能文件**：在服务端技能目录 `services/agent/skills/<skill-name>/SKILL.md` 创建技能文件，frontmatter 中声明 `client_types`（逗号分隔）。
2. **注册技能**：在 `BUILTIN_SKILLS_BY_CLIENT_TYPE` 对应 client_type 列表中追加技能名。
3. **前端配合**：确保对应客户端前端已实现该技能的渲染能力（如 ECharts 代码块渲染组件）。
4. **编写测试**：补充客户端类型技能供应的单元测试用例。
5. **更新文档**：更新本页"当前已注册的内置技能"表格。

## 相关接口

### 技能解析预览

```
POST /api/v1/agent/flows/{flow_id_or_name}/sessions/{session_id}/skills/resolve
```

该接口自动传入会话的 `client_type`，预览结果会包含对应客户端类型的内置技能。

### 流式对话

```
POST /api/v1/run/{flow_id_or_name}/stream
```

`client_type` 通过会话上下文自动传递，无需在请求体中显式指定。

## 相关文档

- [技能注入机制](/integration/skill-injection) — 技能三层解析与请求级声明
- [SKILL.md 编写规范](/skill-development/skill-format) — 技能文件格式
