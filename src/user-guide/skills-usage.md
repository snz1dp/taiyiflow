# 技能使用指南

> 这篇文档帮助你了解如何发现、安装、启用和管理太乙智启的技能。

## 什么是技能

技能是给 AI 智能体的"操作手册"，告诉它在特定场景下应该怎么做。技能本质上是一段结构化的提示词，通过 `SKILL.md` 文件声明。

## 查看技能

### CLI 中查看

```bash
./taiyiflow-cli skills list
```

### TUI 中查看

在交互式界面中输入 `/skills`，会弹出技能管理窗口，包含"本地技能"和"远程仓库"两个标签页。

## 技能目录

技能从以下目录自动发现：

| 目录 | 作用域 |
|------|--------|
| `~/.snz1dp/skills/` | 用户级（全局可用） |
| `.snz1dp/skills/`（工作区） | 项目级（仅当前项目） |

## 启用与禁用

```bash
./taiyiflow-cli skills enable <skill-name>
./taiyiflow-cli skills disable <skill-name>
```

未被显式禁用的技能都会纳入候选，在发起对话时自动注入。

## 远程仓库

```bash
# 搜索远程技能
./taiyiflow-cli skills search <keyword>

# 安装技能
./taiyiflow-cli skills install <skill-name>

# 更新技能
./taiyiflow-cli skills update <skill-name>

# 删除技能
./taiyiflow-cli skills remove <skill-name>
```

默认仓库地址：`https://mirror-cn.clawhub.com`

## 技能如何生效

1. 客户端发现本地技能
2. 发起对话时，技能内容通过 `client_skill_packages` 字段上送
3. 服务端将技能作为额外上下文注入到 AI 的提示词中
4. AI 在回答时参考技能指令

:::tip
技能是"知识注入"而非"能力扩展"。如果需要让 AI 执行新操作，请开发 MCP 工具或客户端工具，参见[技能开发指南](/skill-development/skill-basics)。
:::
