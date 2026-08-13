# WebSocket 实时接口

> 这篇文档介绍太乙智启的 WebSocket 实时通信接口，适用于语音对话、实时协作等双向通信场景。

## 适用场景

- 实时语音识别与对话
- 需要服务端主动推送消息的场景
- 低延迟双向通信需求

## 连接方式

<!-- TODO: 从 taiyiflow/doc/websocket-stream-api.md 提取完整协议 -->

```
ws://<host>:<port>/api/v1/ws/{flow_id}
```

## 消息格式

<!-- TODO: 补充消息帧格式 -->

## 与 SSE 流式接口的对比

| 特性 | SSE 流式 | WebSocket |
|------|----------|-----------|
| 通信方向 | 服务端 → 客户端（单向） | 双向 |
| 协议 | HTTP | WebSocket |
| 适用场景 | 文本对话 | 语音、实时协作 |
| 断线重连 | 浏览器自动 | 需自行实现 |

## 相关文档

- [流式对话 API](/integration/stream-api) — 文本对话推荐方式
- [语音相关接口](/reference/api/voice) — 语音识别专用接口
