# 会话分组接口

> 会话分组用于把同一智能服务下的会话按项目、设备等维度归类。本页是客户端视角（Agent Client / CLI 客户端）分组接口的字段级参考；管理端 `/session_groups` 路由索引见 [REST API 参考](/integration/rest-api)。

## 接口总览

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/agents/session-groups` | 获取会话分组列表 |
| POST | `/api/v1/agents/session-groups` | 创建会话分组 |
| GET | `/api/v1/agents/session-groups/{group_id}` | 获取分组详情 |
| POST | `/api/v1/agents/session-groups/{group_id}/update` | 更新会话分组 |
| DELETE | `/api/v1/agents/session-groups/{group_id}` | 删除会话分组（软删除） |
| POST | `/api/v1/agents/session-groups/sessions` | 批量设置会话所属分组 |

所有接口权限要求：仅需登录用户。

## 获取会话分组列表

```
GET /api/v1/agents/session-groups
```

获取当前用户的所有会话分组，默认按最新消息时间降序排列，支持 `client_id`、`flow_id` 过滤、多种排序方式和分页。

### 查询参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `flow_id` | string (UUID) | ✅ | - | 流程服务 ID 过滤，返回匹配或为 NULL 的分组 |
| `client_id` | string | ❌ | - | 客户端 ID 过滤，设置时返回匹配或为 NULL 的分组 |
| `order_by` | string | ❌ | `last_message_at desc` | 排序字段，格式 `field asc\|desc`，支持 `last_message_at`、`sort_order`、`name`、`created_at` |
| `offset` | int | ❌ | `0` | 分页偏移量 |
| `limit` | int | ❌ | `100` | 每页数量，最大 200 |

### 响应示例

```json
{
  "offset": 0,
  "total": 15,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "项目A",
      "owner_user": "san_dezi",
      "color": "#FF5733",
      "icon": "folder",
      "sort_order": 0,
      "workspace_dir": "/home/user/project-a",
      "client_id": "client-001",
      "flow_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "session_count": 5,
      "last_message_at": "2025-07-28T10:30:00+08:00",
      "created_at": "2025-07-01T09:00:00+08:00",
      "updated_at": "2025-07-28T10:30:00+08:00"
    }
  ]
}
```

### 响应字段说明（SessionGroupRead）

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | UUID | 分组唯一标识 |
| `name` | string | 分组名称 |
| `owner_user` | string | 所属用户 ID |
| `color` | string \| null | 分组颜色标记 |
| `icon` | string \| null | 分组图标标识 |
| `sort_order` | int | 排序权重，越小越靠前 |
| `workspace_dir` | string \| null | 工作区目录路径 |
| `client_id` | string \| null | 关联的客户端 ID |
| `flow_id` | string \| null | 关联的流程服务 ID |
| `session_count` | int | 分组内会话数量 |
| `last_message_at` | datetime \| null | 分组下最新消息时间 |
| `created_at` | datetime | 创建时间 |
| `updated_at` | datetime | 更新时间 |

## 创建会话分组

```
POST /api/v1/agents/session-groups
```

名称不能为空，`flow_id` 为必填字段。

### 请求体

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `name` | string | ✅ | - | 分组名称，最大 120 字符 |
| `flow_id` | string (UUID) | ✅ | - | 关联的流程服务 ID |
| `color` | string | ❌ | - | 分组颜色标记 |
| `icon` | string | ❌ | - | 分组图标标识 |
| `sort_order` | int | ❌ | `0` | 排序权重 |
| `workspace_dir` | string | ❌ | - | 工作区目录路径 |
| `client_id` | string | ❌ | - | 关联的客户端 ID |

```json
{
  "name": "新分组",
  "flow_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "color": "#FF5733",
  "icon": "folder",
  "sort_order": 0,
  "workspace_dir": "/home/user/project",
  "client_id": "client-001"
}
```

**响应：** `201 Created`，返回 `SessionGroupRead` 对象。

## 获取会话分组详情

```
GET /api/v1/agents/session-groups/{group_id}
```

返回 `SessionGroupRead` 对象。

## 更新会话分组

```
POST /api/v1/agents/session-groups/{group_id}/update
```

更新分组的名称、颜色、图标或排序权重。请求体为 `SessionGroupUpdate` 对象，仅更新非 None 字段（`flow_id` 除外，`flow_id` 为必填）。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `flow_id` | string (UUID) | ✅ | 关联的流程服务 ID |
| `name` | string | ❌ | 分组名称 |
| `color` | string | ❌ | 分组颜色 |
| `icon` | string | ❌ | 分组图标 |
| `sort_order` | int | ❌ | 排序权重 |
| `workspace_dir` | string | ❌ | 工作区目录路径 |
| `client_id` | string | ❌ | 关联的客户端 ID |

**响应：** 返回更新后的 `SessionGroupRead` 对象。

## 删除会话分组

```
DELETE /api/v1/agents/session-groups/{group_id}
```

软删除会话分组，分组下的会话将自动移出（`group_id` 置为 NULL），会话本身不会被删除。

## 批量设置会话所属分组

```
POST /api/v1/agents/session-groups/sessions
```

### 请求体

```json
{
  "session_ids": ["session-1", "session-2"],
  "group_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 响应

```json
{
  "moved": 2
}
```

## 相关文档

- [REST API 参考](/integration/rest-api) — 会话与消息全部路由索引
- [数据结构字典](/reference/api/data-structures) — `ChatSession` 等表结构定义
