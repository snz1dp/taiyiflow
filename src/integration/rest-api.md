# REST API 参考

> 这篇文档汇总太乙智启所有 REST API 接口，按功能分类索引。

## 接口分类

### 对话与运行

| 接口 | 方法 | 说明 | 详细文档 |
|------|------|------|----------|
| `/api/v1/run/{flow_id}/stream` | POST | 流式对话 | [流式对话接口](/reference/api/stream) |
| `/api/v1/run/{flow_id}/stream/callback` | POST | 客户端工具回调 | [客户端工具协议](/integration/client-tool-protocol) |

### 会话管理

| 接口 | 方法 | 说明 | 详细文档 |
|------|------|------|----------|
| 会话分组相关 | - | 会话列表、分组、删除 | [会话分组接口](/reference/api/session) |

### 语音

| 接口 | 方法 | 说明 | 详细文档 |
|------|------|------|----------|
| 实时语音识别 | WS | 实时转写 | [语音相关接口](/reference/api/voice) |
| 离线语音识别 | POST | 文件转写 | [语音相关接口](/reference/api/voice) |
| 语音对话 | POST | 语音输入对话 | [语音相关接口](/reference/api/voice) |
| 用户声纹 | - | 声纹注册/识别 | [语音相关接口](/reference/api/voice) |
| 音色管理 | - | 系统音色配置 | [语音相关接口](/reference/api/voice) |

### 配置

| 接口 | 方法 | 说明 | 详细文档 |
|------|------|------|----------|
| 运行时配置 | - | 运行时参数管理 | [运行时配置接口](/reference/api/runtime-config) |

### 用户提示词

| 接口 | 方法 | 说明 | 详细文档 |
|------|------|------|----------|
| 用户提示词 | - | 自定义提示词管理 | <!-- TODO --> |

## 通用约定

### 认证

所有接口需在请求头携带：

```
Authorization: Bearer <api-key>
```

### 响应格式

```json
{
  "status": "success",
  "data": { ... }
}
```

### 错误码

<!-- TODO: 补充错误码列表 -->
