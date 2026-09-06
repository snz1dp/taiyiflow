# 运行时配置接口

> `GET /api/v1/config` 的字段级参考。该接口向前端页面、对话入口和集成客户端提供一份统一的公共配置快照，聚合系统设置、聊天输入设置、智能助手设置、Milvus 设置、Nebula 设置与对话设置。

## 接口

```
GET /api/v1/config
```

- 无查询参数、无请求体。
- 权限控制以后端路由实际配置为准。

典型使用场景：

- 前端启动时拉取基础运行参数。
- 聊天页面读取上传限制、可用扩展名与功能开关。
- 对话客户端预先获取 `default_flow_id`，在未显式指定 `flow-id` 时使用默认流程（如[语音对话接口](/reference/api/voice-dialogue)）。

## 示例响应

```json
{
  "feature_flags": {
    "mvp_components": false,
    "text_to_speech": true,
    "speech_to_text": true
  },
  "frontend_timeout": 60,
  "auto_saving": true,
  "auto_saving_interval": 300,
  "health_check_max_retries": 3,
  "max_file_size_upload": 10485760,
  "chatui_sub_head": "太乙智启智能助手",
  "xeai_user_scope": "private",
  "assits": {
    "enabled": true,
    "welcome_message": "你好，我是小启。"
  },
  "doc_exts": [".txt", ".md", ".pdf", ".docx"],
  "input_optimizing_flow_id": null,
  "once_max_file_count": 10,
  "document_import_flow_id": "a4b52d0b-3cfe-4f22-8d34-7f2c79b3f001",
  "image_import_flow_id": "7d8f4c21-f7c2-4eb6-9a8f-24d3fd1a0002",
  "video_import_flow_id": null,
  "audio_import_flow_id": null,
  "sms_send": false,
  "mail_send": true,
  "simlarity_limit": 50,
  "rerank_limit": 10,
  "knowledge_graph": false,
  "default_flow_id": "9f84a8da-19ac-4dc0-b5c2-61384f820003",
  "text_summarize_flow_id": "b1c23e4f-5a67-48d9-9e0f-a1b2c3d4e5f6"
}
```

## 响应字段表（ConfigResponse）

:::tip 稳定契约
以下字段以 `ConfigResponse` 中声明的稳定返回字段为准。接口实现内部会聚合更多设置源；未在 `ConfigResponse` 中声明的字段不应视为稳定对外契约。
:::

| 字段 | 类型 | 说明 |
|------|------|------|
| `feature_flags` | object | 功能开关集合，用于控制前端或入口能力展示 |
| `frontend_timeout` | integer | 前端请求超时时间，单位秒 |
| `auto_saving` | boolean | 是否启用前端自动保存 |
| `auto_saving_interval` | integer | 自动保存间隔，单位秒 |
| `health_check_max_retries` | integer | 前端健康检查最大重试次数 |
| `max_file_size_upload` | integer | 单文件上传大小限制 |
| `chatui_sub_head` | string | 聊天界面副标题 |
| `xeai_user_scope` | string | 当前部署的用户授权范围 |
| `assits` | object \| null | 智能助手配置快照，具体键值取决于当前部署配置 |
| `doc_exts` | array[string] \| null | 当前允许上传或导入的文档扩展名列表 |
| `input_optimizing_flow_id` | string \| null | 输入优化流程 ID |
| `once_max_file_count` | integer \| null | 单次上传允许的最大文件数量 |
| `document_import_flow_id` | string \| null | 文档导入流程 ID |
| `image_import_flow_id` | string \| null | 图片导入流程 ID |
| `video_import_flow_id` | string \| null | 视频导入流程 ID |
| `audio_import_flow_id` | string \| null | 音频导入流程 ID |
| `sms_send` | boolean \| null | 是否启用短信发送能力 |
| `mail_send` | boolean \| null | 是否启用邮件发送能力 |
| `simlarity_limit` | integer \| null | 向量检索返回数量限制 |
| `rerank_limit` | integer \| null | 文档重排返回数量限制 |
| `knowledge_graph` | boolean \| null | 是否启用知识图谱能力 |
| `default_flow_id` | string \| null | 对话服务默认流程 ID；客户端未显式传入 `flow-id` 时的回退值 |
| `text_summarize_flow_id` | string \| null | 文本内容总结流程 ID；未配置时为 `null` |

### feature_flags 子字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `mvp_components` | boolean | 是否启用 MVP 组件能力 |
| `text_to_speech` | boolean | 是否启用文本转语音能力 |
| `speech_to_text` | boolean | 是否启用语音转文本能力 |

## 字段来源说明

接口返回值由多组设置聚合而成：

| 来源 | 字段 |
|------|------|
| 功能开关配置 | `feature_flags` |
| 系统设置 | `frontend_timeout`、`auto_saving`、`chatui_sub_head` 等 |
| 聊天输入设置 | `once_max_file_count`、`input_optimizing_flow_id` 等 |
| 智能助手设置 | `assits` |
| Milvus 设置 | `document_import_flow_id`、`image_import_flow_id`、`simlarity_limit`、`rerank_limit` |
| Nebula 设置 | `knowledge_graph` |
| 对话设置 | `default_flow_id` |
| 系统其他参数配置 | `text_summarize_flow_id` |

## default_flow_id 使用约定

- 客户端调用对话 WebSocket 或相关入口时显式传入 `flow-id`，优先使用显式值。
- 未传入 `flow-id` 时，服务端回退到当前配置中的 `default_flow_id`。
- `default_flow_id` 为空表示当前部署未指定默认流程，客户端应自行传入目标流程。

## 错误响应

### 500 Internal Server Error

后端读取设置或聚合配置失败时返回：

```json
{
  "detail": "<error message>"
}
```

## 相关文档

- [REST API 参考](/integration/rest-api) — `/settings` 系统配置读写路由
- [配置项参考](/reference/config-reference) — 服务端环境变量与 CLI 配置项
