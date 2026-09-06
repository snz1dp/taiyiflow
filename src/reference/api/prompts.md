# 用户提示词接口

> UserPrompt 管理接口的字段级参考，提供用户提示词的完整 CRUD 操作。提示词可用于流程绑定或作为 MCP Prompt 供应。

## 接口总览

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/prompts` | 获取用户提示词列表 |
| GET | `/api/v1/prompts/{prompt_id}` | 根据 ID 获取提示词 |
| GET | `/api/v1/prompts/by-code/{code}` | 根据代码获取提示词 |
| POST | `/api/v1/prompts` | 创建提示词 |
| PUT | `/api/v1/prompts/{prompt_id}` | 更新提示词 |
| DELETE | `/api/v1/prompts/{prompt_id}` | 删除提示词 |

## 权限说明

所有接口都需要用户认证，并且需要以下角色之一：

- `taiyicomposer_services`
- `taiyicomposer_knowledge_base`

## 获取用户提示词列表

```
GET /api/v1/prompts
```

### 查询参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `owner_appid` | UUID | ❌ | 应用 ID |
| `owner_scope` | string | ❌ | 所有者范围（`all` / `public` / `private`），默认 `all` |
| `name_like` | string | ❌ | 名称模糊查询 |
| `orderby` | string | ❌ | 排序字段 |
| `offset` | int | ❌ | 偏移量，默认 0 |
| `limit` | int | ❌ | 限制数量，默认 20，最大 100 |

### 响应示例

```json
{
  "offset": 0,
  "total": 10,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "code": "assistant_prompt",
      "name": "智能助手提示词",
      "template": "你是一个{role}，请帮助用户{task}",
      "description": "通用智能助手提示词",
      "arguments": [
        { "name": "role", "type": "string", "description": "助手角色" },
        { "name": "task", "type": "string", "description": "要完成的任务" }
      ],
      "owner_user": "john_doe",
      "create_user": "john_doe",
      "created_at": "2025-01-01T12:00:00Z",
      "modify_user": "john_doe",
      "updated_at": "2025-01-01T12:00:00Z",
      "owner_appid": "456e7890-e12b-34d5-b678-901234567890"
    }
  ]
}
```

## 根据 ID / 代码获取提示词

```
GET /api/v1/prompts/{prompt_id}
GET /api/v1/prompts/by-code/{code}
```

- 路径参数：`prompt_id`（UUID）或 `code`（string），必填。
- 查询参数：`owner_appid`（UUID，可选）。
- 响应：单个提示词对象，字段同列表项。

## 创建用户提示词

```
POST /api/v1/prompts
```

### 请求体

```json
{
  "code": "new_assistant_prompt",
  "name": "新的智能助手提示词",
  "template": "你是一个专业的{role}，擅长{skill}。请根据用户需求{task}，提供专业的建议。",
  "description": "专业智能助手提示词，适用于各种专业领域",
  "arguments": [
    { "name": "role", "type": "string", "description": "专业角色" },
    { "name": "skill", "type": "string", "description": "专业技能" },
    { "name": "task", "type": "string", "description": "用户任务" }
  ],
  "owner_appid": "456e7890-e12b-34d5-b678-901234567890"
}
```

**响应：** `201 Created`，返回创建的提示词对象。

## 更新用户提示词

```
PUT /api/v1/prompts/{prompt_id}
```

- 查询参数：`owner_appid`（UUID，可选）。

### 请求体

```json
{
  "name": "更新后的提示词名称",
  "description": "更新后的描述",
  "template": "更新后的模板内容"
}
```

**响应：** 返回更新后的提示词对象。

## 删除用户提示词

```
DELETE /api/v1/prompts/{prompt_id}
```

- 查询参数：`owner_appid`（UUID，可选）。
- **响应：** `204 No Content`。

## 错误响应

| 状态码 | 场景 |
|--------|------|
| 400 Bad Request | 请求参数不合法 |
| 401 Unauthorized | 未认证 |
| 403 Forbidden | 无权限访问 |
| 404 Not Found | 资源不存在 |
| 409 Conflict | 代码重复（仅创建时） |
| 422 Unprocessable Entity | 数据验证失败 |

错误响应示例：

```json
{
  "detail": "提示词代码已存在"
}
```

## 相关文档

- [数据结构字典](/reference/api/data-structures) — `prompt.UserPrompt` 表结构
- [REST API 参考](/integration/rest-api) — `/prompt`、`/agents/prompts` 路由索引
