# 客户端定时任务接口

> 客户端定时任务用于在指定时间或周期自动向目标客户端下发任务。本页是用户端与管理端接口的字段级参考；协同长连接与任务下发通道见 [WebSocket 接口](/integration/websocket-api)。

## 路由前缀

| 视角 | 前缀 |
|------|------|
| 用户端 | `/api/v1/agents/client/schedules` |
| 管理端 | `/api/v1/client-schedule-manager` |

任务分发依赖 `target_client_id` / `target_device_id` 定位目标连接，因此**创建、编辑、启用/停用、列表查询均需传递 `client_id` 与 `device_id` 参数**，确保任务能正确分发到当前设备执行。

## client_id / device_id 参数约定

| 场景 | 传递方式 | 说明 |
|------|----------|------|
| 创建任务 | Body 字段 `client_id`、`device_id` | 映射为任务的 `target_client_id`、`target_device_id` |
| 编辑任务 | Body 字段 `client_id`、`device_id` | 同上，更新任务目标设备 |
| 启用/停用任务 | Query 参数 `client_id`、`device_id` | 同步更新任务目标设备，保证启用后分发到当前设备 |
| 查询任务列表 | Query 参数 `client_id`、`device_id` | 按目标客户端/设备过滤，仅返回当前设备的任务 |

> 兼容说明：创建/编辑 Body 中 `target_client_id`、`target_device_id` 仍可使用，与 `client_id`、`device_id` 互为别名；列表 Query 中 `target_client_id`、`target_device_id` 同样保留。

## 用户端接口

### 创建定时任务

```
POST /api/v1/agents/client/schedules
```

请求体示例：

```json
{
  "name": "每日巡检",
  "is_template": false,
  "client_id": "cli-uuid",
  "device_id": "device-uuid",
  "client_type": "desktop",
  "flow_id": "flow-uuid",
  "session_id": "session-uuid",
  "schedule_type": "cron",
  "cron_expr": "0 9 * * *",
  "prompt": "执行每日巡检",
  "request_mode": "agent",
  "working_directory": "/path/to/workdir",
  "available_skills": ["skill-a"],
  "mcp_client_servers": ["server-a"],
  "metadata": { "timeout_seconds": 300 }
}
```

**响应：** `201 Created`，返回任务详情（含 `target_client_id`、`target_device_id`）。

### 编辑定时任务

```
PATCH /api/v1/agents/client/schedules/{schedule_id}
```

请求体示例（更新目标设备）：

```json
{
  "client_id": "cli-uuid",
  "device_id": "device-uuid"
}
```

**响应：** `200 OK`，返回更新后的任务详情。

### 启用 / 停用定时任务

```
POST /api/v1/agents/client/schedules/{schedule_id}/enable
POST /api/v1/agents/client/schedules/{schedule_id}/disable
```

Query 参数：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `client_id` | string | ❌ | 发起操作的客户端 ID，同步更新任务目标客户端 |
| `device_id` | string | ❌ | 发起操作的设备 ID，同步更新任务目标设备 |

请求示例：

```
POST /api/v1/agents/client/schedules/{schedule_id}/enable?client_id=cli-uuid&device_id=device-uuid
```

**响应：** `200 OK`，返回任务详情（启用时 `disabled=false` 且目标设备已更新；停用时 `disabled=true`）。

### 查询定时任务列表

```
GET /api/v1/agents/client/schedules
```

Query 参数：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `client_id` | string | ❌ | 客户端 ID，`target_client_id` 的别名参数 |
| `device_id` | string | ❌ | 设备 ID，`target_device_id` 的别名参数 |
| `target_client_id` | string | ❌ | 目标客户端 ID（与 `client_id` 等价） |
| `target_device_id` | string | ❌ | 目标设备 ID（与 `device_id` 等价） |
| `name` | string | ❌ | 任务名称模糊搜索 |
| `flow_id` | string | ❌ | 流程 ID |
| `session_id` | string | ❌ | 会话 ID |
| `client_type` | string | ❌ | 客户端类型：`desktop` / `cli` / `server` |
| `disabled` | boolean | ❌ | 是否禁用 |
| `is_template` | boolean | ❌ | 是否模板任务 |
| `offset` | integer | ❌ | 偏移量，默认 0 |
| `limit` | integer | ❌ | 每页数量，默认 20，最大 100 |

响应示例：

```json
{
  "offset": 0,
  "total": 1,
  "data": [
    {
      "id": "schedule-uuid",
      "name": "每日巡检",
      "target_client_id": "cli-uuid",
      "target_device_id": "device-uuid",
      "client_type": "desktop",
      "schedule_type": "cron",
      "cron_expr": "0 9 * * *",
      "disabled": false,
      "next_run_at": "2026-08-21T09:00:00+08:00",
      "created_at": "2026-08-20T10:00:00+08:00"
    }
  ]
}
```

### 其他接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/agents/client/schedules/{schedule_id}` | 查询任务详情 |
| DELETE | `/api/v1/agents/client/schedules/{schedule_id}` | 删除定时任务 |
| GET | `/api/v1/agents/client/schedules/{schedule_id}/runs` | 查询执行历史 |

## 管理端接口

管理端路径为 `/api/v1/client-schedule-manager`，接口形态与用户端一致（列表 / 创建 / 详情 / 编辑 / 删除 / 启用 / 停用 / 执行历史），同样支持 `client_id`、`device_id` 参数：

- 列表：Query 参数 `client_id`、`device_id`（`target_client_id`、`target_device_id` 的别名）。
- 创建 / 编辑：Body 字段 `client_id`、`device_id`。
- 启用 / 停用：Query 参数 `client_id`、`device_id`，同步更新任务目标设备。

管理端额外权限要求：

| 操作 | 权限码 |
|------|--------|
| 查看 | `taiyicomposer_client_schedule_manager` |
| 新增 | `taiyicomposer_client_schedule_manager_add` |
| 修改/启停 | `taiyicomposer_client_schedule_manager_modify` |
| 删除 | `taiyicomposer_client_schedule_manager_remove` |
| 全量数据 | `taiyicomposer_client_schedule_manager_alldata` |

## 任务分发说明

调度器触发任务后，按 `client_type` 路由：

- `server`：在服务端直接执行。
- `desktop` / `cli` / 其他：通过 WebSocket 下发到 `target_client_id` / `target_device_id` 对应的在线客户端连接；目标客户端离线时本次执行标记为失败。

创建、编辑、启用任务时传递的 `client_id` / `device_id` 直接决定任务最终分发到哪台设备；列表查询传递这两个参数可确保只展示当前设备相关的任务。

## 相关文档

- [WebSocket 接口](/integration/websocket-api) — 客户端协同长连接
- [REST API 参考](/integration/rest-api) — 客户端协同路由索引
