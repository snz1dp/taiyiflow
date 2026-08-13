# 技能注入机制

> 这篇文档说明客户端如何将技能包注入到对话中，以及服务端如何消费这些技能。

## 概述

技能注入是太乙智启的核心扩展机制之一。客户端通过 `client_skill_packages` 字段将技能内容上送到服务端，服务端将其作为额外的上下文指令注入到 AI 的提示词中。

:::tip
技能是**提示词文本注入**，不是工具调用。技能告诉 AI "怎么做"，工具让 AI "能做到"。
:::

## 注入方式

### 1. 客户端技能包上送

在发起流式对话时，通过 `client_skill_packages` 字段携带技能列表：

```json
{
  "input_value": "用户消息",
  "client_skill_packages": [
    {
      "name": "my-skill",
      "description": "技能描述",
      "content": "# 技能标题\n完整正文",
      "summary": "技能标题",
      "metadata": {
        "request_types": ["agent"]
      }
    }
  ]
}
```

### 2. 服务端技能名称指定

通过 `requestedSkillNames` 指定服务端允许提供的技能名称：

```json
["server-skill-a", "server-skill-b"]
```

服务端收到后，会将这些技能纳入当前会话的可用技能范围。

## 同步机制

| 机制 | 说明 |
|------|------|
| 防抖同步 | 技能注册/注销后 50ms 内合并为一次同步 |
| 就绪同步 | 智能体就绪后自动触发全量同步 |
| 立即同步 | `requestedSkillNames` 设置后立即同步（不走防抖） |

## metadata 字段

| 字段 | 说明 |
|------|------|
| `request_types` | 技能适用的请求类型，如 `["agent", "plan"]` |

## 渐进式披露

客户端默认将未被禁用的技能纳入候选，但不会一次性全部注入。服务端根据对话上下文按需加载相关技能，避免提示词过长。

## 相关文档

- [技能是什么](/skill-development/skill-basics) — 技能概念入门
- [SKILL.md 编写规范](/skill-development/skill-format) — 如何编写技能
- [JS SDK 集成](/integration/jssdk) — SDK 中的技能供应 API
