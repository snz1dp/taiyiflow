# 用户声纹接口

> 用户声纹管理接口的字段级参考，用于维护说话人档案，并在数据库记录与声纹识别提供者之间同步说话人状态。

## 接口分组

提供两组入口，共用同一张 `user_voiceprints` 数据表、相同的请求体/响应体定义与声纹提供者同步逻辑：

### 后台用户入口（`/api/v1/voiceprints`）

| 方法 | 路径 | 权限 |
|------|------|------|
| GET | `/api/v1/voiceprints` | `taiyicomposer_settings_voiceprints` 角色 |
| POST | `/api/v1/voiceprints` | `taiyicomposer_settings_voiceprints` 角色 |
| GET | `/api/v1/voiceprints/{voiceprint_id}` | 登录用户可读取自己的记录；通过 `user_id` 指定其他用户时需管理角色 |
| POST | `/api/v1/voiceprints/{voiceprint_id}` | `taiyicomposer_settings_voiceprints` 角色 |
| DELETE | `/api/v1/voiceprints/{voiceprint_id}` | `taiyicomposer_settings_voiceprints` 角色 |

列表、创建、更新、删除接口支持查询参数 `user_id`，用于后台管理员代指定用户维护声纹。

### 智能体用户入口（`/api/v1/agents/voiceprints`）

| 方法 | 路径 |
|------|------|
| GET | `/api/v1/agents/voiceprints` |
| POST | `/api/v1/agents/voiceprints` |
| GET | `/api/v1/agents/voiceprints/{voiceprint_id}` |
| POST | `/api/v1/agents/voiceprints/{voiceprint_id}` |
| DELETE | `/api/v1/agents/voiceprints/{voiceprint_id}` |

- 接口固定绑定当前登录用户的 `userid`，不暴露 `user_id` 参数。
- 面向 Agent 用户自助管理声纹，不要求管理角色。
- 访问边界由当前登录用户控制，不能跨用户读取或修改声纹记录。

## 请求参数与请求体

### 列表查询参数

两组入口都支持：

| 参数 | 说明 |
|------|------|
| `enabled` | 按启用状态过滤 |
| `offset` | 分页偏移量，默认 `0` |
| `limit` | 分页大小，默认 `20`，最大 `100` |

仅后台用户入口额外支持 `user_id`（指定目标用户 ID）。

### 创建请求体

```json
{
  "speaker_id": "speaker-1",
  "real_speaker_id": "real-speaker-1",
  "speaker_name": "会议主持人",
  "speaker_description": "用于会议场景的主持人声纹",
  "voice_data": "dm9pY2UtZGF0YQ==",
  "enabled": true
}
```

| 字段 | 说明 |
|------|------|
| `speaker_id` | 说话人标识，用户内唯一 |
| `real_speaker_id` | 远端声纹服务返回或映射的真实说话人 ID，可为空 |
| `speaker_name` | 说话人名称，可为空 |
| `speaker_description` | 说话人描述，可为空 |
| `voice_data` | 声纹音频二进制；JSON 传输时按 `bytes` 字段编码，联调时应传入 Base64 字符串 |
| `enabled` | 是否启用该声纹，默认 `true` |

### 更新请求体

```json
{
  "real_speaker_id": "real-speaker-2",
  "speaker_name": "更新后的说话人名称",
  "speaker_description": "更新后的描述",
  "voice_data": "bmV3LXZvaWNlLWRhdGE=",
  "enabled": false
}
```

更新接口中所有字段均为可选；未传入的字段保持原值。

## 响应结构

### 列表响应

```json
{
  "total": 1,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "user_id": "voice-user-id",
      "speaker_id": "speaker-1",
      "real_speaker_id": "real-speaker-1",
      "speaker_name": "会议主持人",
      "speaker_description": "用于会议场景的主持人声纹",
      "voice_data": "dm9pY2UtZGF0YQ==",
      "enabled": true,
      "created_at": "2026-05-19T10:00:00+08:00",
      "updated_at": "2026-05-19T10:00:00+08:00"
    }
  ]
}
```

### 删除响应

```json
{
  "code": 0,
  "message": "声纹记录已删除"
}
```

## 行为说明

- 列表接口只读取数据库中的声纹记录。
- 创建接口先校验 `(user_id, speaker_id)` 唯一性，再将声纹同步到声纹识别提供者。
- 详情接口会检查声纹是否已加载到提供者：数据库启用但提供者中不存在时自动补录；数据库禁用但提供者中仍存在时自动删除。
- 更新接口先更新数据库记录，再根据 `enabled` 状态和音频内容同步到提供者。
- 删除接口先从提供者移除说话人，再删除数据库记录。

## 常见错误码

| 状态码 | 场景 |
|--------|------|
| `403 Forbidden` | 后台入口缺少 `taiyicomposer_settings_voiceprints` 角色；或试图通过 `user_id` 访问其他用户的声纹记录 |
| `404 Not Found` | 声纹记录不存在 |
| `409 Conflict` | 当前用户下 `speaker_id` 已存在 |
| `422 Unprocessable Entity` | 请求参数或请求体校验失败 |

## 相关文档

- [语音识别接口（ASR）](/reference/api/voice) — `multi-speaker` 模式下声纹的识别链路
- [语音对话接口](/reference/api/voice-dialogue) — 声纹在实时对话中的应用
- [数据结构字典](/reference/api/data-structures) — `UserVoiceprint` 表结构
