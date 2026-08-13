# JS SDK 集成

> 这篇文档介绍如何使用太乙智启 JS SDK 将 AI 对话能力嵌入你的 Web 页面。

## 什么是 JS SDK

太乙智启 JS SDK（taiyiflow-jssdk）是一个轻量级的 JavaScript 库，让你可以在任意 Web 页面中嵌入 AI 对话能力，支持：

- 流式对话
- 自定义技能注入
- 客户端工具回调
- 书签小工具模式

## 快速开始

### 安装

```bash
npm install taiyiflow-jssdk
```

或通过 CDN 引入：

```html
<script src="https://your-cdn/umd/taiyiflow.js"></script>
```

### 初始化

```javascript
import TaiyiSDK from 'taiyiflow-jssdk'

const sdk = new TaiyiSDK({
  agentUrl: 'https://your-agent-url',
  apiKey: 'your-api-key'
})
```

### 发起对话

```javascript
sdk.on('message', (data) => {
  console.log('AI 回答:', data.text)
})

sdk.chat('你好，请介绍一下自己')
```

## 技能供应

SDK 支持两种技能供应模式：

### 1. 自定义技能注入

```javascript
const sdk = new TaiyiSDK({
  agentUrl: 'https://your-agent-url',
  skills: [
    {
      name: 'my-custom-skill',
      description: '自定义技能描述',
      content: '# 技能标题\n技能正文内容（Markdown 格式）'
    }
  ]
})
```

### 2. 指定服务端技能

```javascript
const sdk = new TaiyiSDK({
  agentUrl: 'https://your-agent-url',
  requestedSkillNames: ['server-skill-a', 'server-skill-b']
})
```

## 消息类型

| 类型 | 方向 | 说明 |
|------|------|------|
| `init` | SDK → 服务端 | 初始化 |
| `start_chat` | SDK → 服务端 | 发起对话 |
| `message` | 服务端 → SDK | AI 回答 |
| `client_tool` | 服务端 → SDK | 工具调用请求 |
| `finish:client_tool` | SDK → 服务端 | 工具执行结果 |
| `set:client_skill_packages` | SDK → 服务端 | 技能同步 |
| `ready` | 服务端 → SDK | 就绪通知 |

## 详细文档

:::tip
JS SDK 拥有独立的完整文档站，包含概念入门、使用指南、高级功能和架构文档。

**请访问 taiyiflow-jssdk 文档站获取完整文档。**
:::

<!-- TODO: 补充 jssdk 文档站的实际访问地址 -->

## 相关文档

- [技能注入机制](/integration/skill-injection) — 技能同步协议详解
- [客户端工具协议](/integration/client-tool-protocol) — 工具回调流程
