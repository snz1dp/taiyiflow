# SKILL.md 编写规范

> 这篇文档是技能文件的完整编写规范，包含格式要求和示例模板。

## 文件结构

每个技能是一个目录，包含一个 `SKILL.md` 文件：

```
my-skill/
├── SKILL.md          # 技能主文件（必须）
├── scripts/          # 可执行脚本目录（可选）
│   └── helper.py
└── references/       # 参考资料目录（可选）
    └── api-notes.md
```

`scripts/` 与 `references/` 是社区约定俗成的目录名：脚本放 `scripts/`，供 AI 按需读取的长文档放 `references/`（正文中引用路径即可，AI 需要时再读，避免撑爆上下文）。浏览器录制固化的技能包还会生成 `references/recording-data.json` 保存原始录制数据，见[浏览器录制固化技能](/skill-development/browser-recording-skill)。

## SKILL.md 格式

```markdown
---
name: 技能名称
description: 一句话说明什么场景下使用此技能
category: general
metadata:
  request_types:
    - agent
---

# 技能正文

这里是技能的完整指令内容，使用 Markdown 格式编写。
```

### Frontmatter 字段

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | ✅ | 技能的人类友好名称（支持中文、空格），写入 `client_skill_packages.name` |
| `description` | 建议 | 场景导向的一句话描述（"当…时使用"），AI 靠它决定是否加载技能全文 |
| `category` | ❌ | 分类标签，如 `browser`、`tools`、`general` |
| `version` | ❌ | 语义化版本号，用于远程仓库更新检测 |
| `metadata.request_types` | ❌ | 技能在哪些请求类型下可用：`agent` / `ask` / `plan`；缺省为全部可用 |
| `metadata.requires.env` | ❌ | 技能依赖的环境变量键名列表，客户端执行工具时按白名单自动注入 |

:::tip description 决定技能会不会被用
渐进式披露机制下，AI 首先看到的是技能的 `name` + `description` 摘要，只有判断相关时才加载全文。description 写成"当用户需要 X 时使用此技能"比"本技能实现了 X 功能"触发准确率高得多。
:::

## 正文编写要点

### 1. 明确触发条件

告诉 AI 什么时候应该使用这个技能：

```markdown
当用户要求生成 PDF 文档时，使用此技能。
```

### 2. 步骤清晰

使用有序列表描述操作步骤：

```markdown
1. 确认用户需求
2. 收集必要信息
3. 执行操作
4. 验证结果
```

### 3. 提供约束

明确边界和限制：

```markdown
- 不要修改用户未提及的文件
- 遇到不确定的情况先询问用户
```

### 4. 包含示例

好的示例胜过千言万语：

```markdown
## 示例

用户：帮我写一个 TODO 应用
助手：好的，我来创建一个 TODO 应用...
```

## 完整模板

```markdown
---
name: 我的技能名称
---

# 我的技能名称

一句话说明这个技能的用途。

## 触发条件

描述什么情况下应该使用这个技能。

## 操作步骤

1. 第一步
2. 第二步
3. 第三步

## 约束与注意事项

- 约束 1
- 约束 2

## 示例

输入：...
输出：...
```

## 命名规范

- 使用人类友好的名称（如"代码审查助手"）
- 目录名自动转换为 slug 格式（如 `code-review-helper`）
- 仅允许小写字母、数字和连字符

## 安装位置

| 位置 | 作用域 |
|------|--------|
| `~/.snz1dp/skills/` | 用户级，全局可用 |
| `.snz1dp/skills/`（工作区） | 项目级，仅当前项目 |
