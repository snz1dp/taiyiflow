# 系统音色管理接口

> 系统语音音色管理接口的字段级参考，用于维护平台级 Fish Speech 参考音色，并通过系统配置中的 `tts_config.reference_id` 选择当前默认音色。

## 能力构成

- **系统音色库管理接口**：维护 `system_tts_voices` 数据表，并在创建、删除时同步调用 Fish Speech reference 接口。
- **系统 TTS 配置绑定接口**：复用现有系统配置接口 `POST /api/v1/settings/tts_config`，校验 `reference_id` 是否对应一个存在且启用的系统音色。

## 接口分组

### 系统音色库入口（`/api/v1/settings/tts/voices`）

| 方法 | 路径 |
|------|------|
| GET | `/api/v1/settings/tts/voices` |
| POST | `/api/v1/settings/tts/voices` |
| GET | `/api/v1/settings/tts/voices/{voice_id}` |
| POST | `/api/v1/settings/tts/voices/{voice_id}` |
| DELETE | `/api/v1/settings/tts/voices/{voice_id}` |

- 全部接口要求具备 `taiyicomposer_settings_config` 角色。
- 列表接口支持按启用状态分页查询。
- 更新接口只允许修改本地元数据和启用状态，不改写远端 Fish Speech reference 的 `reference_id`、参考文本和音频内容。

### 系统 TTS 配置绑定入口

```
POST /api/v1/settings/tts_config
```

- 复用通用系统配置路由，不单独新增路径。
- `reference_id` 非空且当前 TTS 提供者为 Fish Speech 时，校验该音色是否存在且处于启用状态。
- `reference_id` 为空字符串时，表示清空当前系统默认音色绑定。

## 请求参数与请求体

### 列表查询参数

| 参数 | 说明 |
|------|------|
| `enabled` | 按启用状态过滤 |
| `offset` | 分页偏移量，默认 `0` |
| `limit` | 分页大小，默认 `20`，最大 `100` |

### 创建请求体

```json
{
  "reference_id": "system-voice-1",
  "voice_name": "女声客服",
  "voice_description": "用于平台默认播报的女声音色",
  "reference_text": "您好，欢迎使用太乙智启平台。",
  "voice_data": "dm9pY2UtYXVkaW8=",
  "enabled": true
}
```

| 字段 | 说明 |
|------|------|
| `reference_id` | Fish Speech reference 标识，系统内唯一 |
| `voice_name` | 音色显示名称，必填 |
| `voice_description` | 音色描述，可为空 |
| `reference_text` | 上传到 Fish Speech 的参考文本，必填 |
| `voice_data` | 参考音频二进制；JSON 传输时按 `bytes` 字段编码，联调时应传入 Base64 字符串 |
| `enabled` | 是否允许该音色被系统配置引用，默认 `true` |

### 更新请求体

```json
{
  "voice_name": "女声客服-标准版",
  "voice_description": "用于平台默认播报的标准女声音色",
  "enabled": true
}
```

所有字段均为可选；未传入的字段保持原值。

### 系统 TTS 配置绑定请求体示例

```json
{
  "api_url": "http://localhost:6006/v1",
  "api_key": "",
  "chunk_length": 300,
  "format": "wav",
  "reference_id": "system-voice-1",
  "use_memory_cache": "on",
  "normalize": true,
  "max_new_tokens": 4096,
  "top_p": 0.9,
  "repetition_penalty": 1.1,
  "temperature": 0.8,
  "speed": 1.0,
  "pitch": 1.0
}
```

其中 `reference_id` 为系统音色绑定字段。

## 响应结构

### 列表响应

```json
{
  "total": 1,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "reference_id": "system-voice-1",
      "voice_name": "女声客服",
      "voice_description": "用于平台默认播报的女声音色",
      "reference_text": "您好，欢迎使用太乙智启平台。",
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
  "message": "系统音色已删除"
}
```

## 行为说明

- 列表与详情接口只读取数据库中的系统音色记录。
- 创建接口先校验 `reference_id` 唯一性，再向 Fish Speech 上传 reference，随后写入本地数据库。
- 创建时若 Fish Speech 上传成功但本地落库失败，会补偿调用一次 Fish Speech 删除，尽量回滚远端 reference。
- 更新接口只更新 `voice_name`、`voice_description` 和 `enabled`；不支持替换参考音频或重写 `reference_id`。
- 音色正被 `tts_config.reference_id` 引用时，禁用和删除都会被拒绝。
- 删除接口先删除 Fish Speech reference，再删除本地数据库记录。
- 更新 `tts_config` 时，若 `reference_id` 指向不存在或已禁用的系统音色，返回 400。

## 常见错误码

| 状态码 | 场景 |
|--------|------|
| `400 Bad Request` | `reference_id`、`voice_name`、`reference_text` 或 `voice_data` 为空；`voice_data` 不是合法 Base64 音频；`tts_config.reference_id` 指向不存在或已禁用的音色 |
| `403 Forbidden` | 缺少 `taiyicomposer_settings_config` 角色 |
| `404 Not Found` | 系统音色记录不存在 |
| `409 Conflict` | `reference_id` 已存在；或音色正被系统 TTS 配置引用，无法删除/禁用 |
| `422 Unprocessable Entity` | 查询参数或请求体结构校验失败 |
| `502 Bad Gateway` | Fish Speech 上传或删除 reference 失败 |

## 相关文档

- [语音对话接口](/reference/api/voice-dialogue) — `tts-voice` 连接参数与默认音色
- [REST API 参考](/integration/rest-api) — `/settings` 系统配置路由索引
