# 配置项参考

> 太乙智启各组件的配置项汇总：CLI 客户端配置、后端环境变量与运行时公共配置快照。

## CLI 配置项

| 配置项 | 取值 | 默认值 | 说明 |
|--------|------|--------|------|
| `backend_base_url` | URL | - | 后端服务地址 |
| `external_resource_access_policy` | `confirm` / `deny` / `allow` | `confirm` | 工作目录外资源访问策略 |
| `write_confirmation_policy` | `direct` / 其他 | - | 文件写入审查策略 |
| `agent_auto_loop_max_rounds` | `0-100` | - | 智能体自动续跑最大轮次，0 为禁用 |

### 配置命令

```bash
./taiyiflow-cli config show
./taiyiflow-cli config set <key> <value>
```

### 兼容性说明

- 旧参数 `--sandbox-escape-policy` 仍可用，新文档推荐 `--external-resource-access-policy`
- 配置键 `external_resource_access_policy` 兼容旧键 `sandbox_escape_policy`

## 后端配置项

后端基于 Pydantic Settings，所有配置项均可通过 **`TAIYIFLOW_` 前缀的环境变量**覆盖（如 `database_url` → `TAIYIFLOW_DATABASE_URL`），也可写入配置目录下的 YAML 配置文件。列表类字段支持逗号分隔的环境变量写法。

### 基础与数据库

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `config_dir` | str | 系统缓存目录 | 配置目录路径，未提供时使用默认路径 |
| `save_db_in_config_dir` | bool | `false` | 数据库是否保存在配置目录（否则保存在服务目录） |
| `dev` | bool | `false` | 开发模式 |
| `database_url` | str | SQLite | 数据库 URL；未提供时回退环境变量 `TAIYIFLOW_DATABASE_URL`，再回退 SQLite |
| `pool_size` | int | `15` | 连接池大小 |
| `max_overflow` | int | `45` | 超出连接池的最大连接数 |
| `db_connect_timeout` | int | `20` | 数据库连接超时（秒） |
| `database_echo` | bool | `false` | 是否记录所有 SQL 查询日志 |
| `sqlite_pragmas` | dict | `{"synchronous": "NORMAL", "journal_mode": "WAL"}` | SQLite 配置参数 |

### 缓存与 Redis

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `cache_type` | `async` / `redis` / `memory` / `disk` | `async` | 缓存类型 |
| `cache_expire` | int | `3600` | 缓存过期时间（秒） |
| `redis_host` | str | `localhost` | Redis 主机地址 |
| `redis_port` | int | `6379` | Redis 端口 |
| `redis_db` | int | `0` | Redis 数据库编号 |
| `redis_url` | str | - | Redis 连接 URL；未提供时由 host/port/db 构建 |
| `redis_cache_expire` | int | `3600` | Redis 缓存过期时间（秒） |
| `langchain_cache` | str | `InMemoryCache` | LangChain 缓存类型 |

### 服务运行

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `host` | str | `127.0.0.1` | 服务监听地址 |
| `port` | int | `7860` | 服务监听端口 |
| `workers` | int | `1` | 工作进程数量 |
| `backend_only` | bool | `false` | 为 true 时不提供前端服务 |
| `log_level` | str | `critical` | 日志级别 |
| `log_file` | str | `logs/taiyiflow.log` | 日志文件路径 |
| `alembic_log_file` | str | `alembic/alembic.log` | Alembic 迁移日志路径 |
| `open_browser` | bool | `false` | 启动时是否打开浏览器 |
| `worker_timeout` | int | `900` | 工作实例调用超时（秒） |
| `frontend_timeout` | int | `0` | 前端 API 调用超时（秒） |
| `user_agent` | str | `TaiyiFlow` | API 调用的 User-Agent |
| `celery_enabled` | bool | `false` | 是否启用 Celery 任务队列 |
| `elapsed_debug` | bool | `false` | 耗时调试开关 |

### 上传与自动保存

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `auto_saving` | bool | `true` | 是否自动保存流程 |
| `auto_saving_interval` | int | `1000` | 自动保存间隔（毫秒） |
| `health_check_max_retries` | int | `5` | 健康检查最大重试次数 |
| `max_file_size_upload` | int | `100` | 上传文件最大尺寸（MB） |

### 变量与环境

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `variable_store` | str | `db` | 变量存储类型（`db` / `kubernetes`） |
| `fallback_to_env_var` | bool | `true` | 是否允许从环境变量获取配置值 |
| `store_environment_variables` | bool | `true` | 是否将环境变量存储为数据库全局变量 |
| `variables_to_get_from_environment` | list[str] | 内置清单 | 优先从环境变量取值的变量名列表 |

### 对象存储（S3）

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `storage_type` | str | `local` | 存储类型（`local` / `s3`） |
| `s3_bucket` | str | `taiyiflow` | S3 存储桶名称 |
| `s3_region_name` | str | `None` | S3 区域 |
| `s3_use_ssl` | str | `True` | 是否使用 SSL 连接 S3 |
| `s3_endpoint_url` | str | - | S3 端点 URL |
| `s3_access_key_id` / `s3_secret_access_key` / `s3_session_token` | str | - | S3 凭据 |

### 遥测与追踪

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `do_not_track` | bool | `true` | 是否禁用遥测跟踪 |
| `telemetry_base_url` | str | `http://taiyiflow-telemetry:7879` | 遥测服务 URL |
| `transactions_storage_enabled` | bool | `false` | 是否跟踪流程间事务 |
| `vertex_builds_storage_enabled` | bool | `false` | 是否跟踪每个顶点构建输出 |
| `deactivate_tracing` | bool | `true` | 是否禁用追踪 |
| `max_transactions_to_keep` | int | `3000` | 数据库中保留的最大事务数 |
| `max_vertex_builds_to_keep` | int | `3000` | 保留的最大顶点构建数 |
| `sentry_dsn` | str | - | Sentry 地址 |
| `sentry_traces_sample_rate` / `sentry_profiles_sample_rate` | float | `1.0` | Sentry 采样率 |
| `prometheus_enabled` | bool | `false` | 是否启用 Prometheus 监控 |
| `prometheus_port` | int | `9090` | Prometheus 端口 |

### 统一身份认证（Xeai）

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `xeai_service_prefix` | str | `http://localhost:8585/xeai` | Xeai 服务 URL 前缀 |
| `xeai_access_algorithm` | str | `RS256` | 访问令牌签名算法 |
| `xeai_access_username` | str | 空 | 访问令牌用户名 |
| `xeai_access_secret` | str | 空 | 访问令牌凭据 |
| `xeai_token_expires` | int | `360` | 令牌过期时间（秒） |
| `xeai_user_scope` | str | `employee` | 用户域设置 |

### MCP

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `mcp_server_enabled` | bool | `true` | 是否启用 MCP 服务器功能 |
| `mcp_connection_timeout` | int | `60` | 与 MCP 服务器连接超时（秒） |
| `mcp_stdio_timeout` | int | `60` | MCP Stdio 服务器连接超时（秒） |
| `mcp_http_timeout` | int | `60` | MCP HTTP 服务器连接超时（秒） |
| `mcp_request_timeout` | int | `30` | MCP 请求超时（秒） |
| `mcp_create_timeout` | int | `30` | 创建 MCP 会话超时（秒） |
| `mcp_server_enable_progress_notifications` | bool | `false` | 是否启用 MCP 服务器进度通知 |
| `mcp_max_sessions_per_server` | int | `10` | 每个 MCP 服务器最大并发会话数 |
| `mcp_session_idle_timeout` | int | `400` | MCP 会话空闲超时（秒） |
| `mcp_session_cleanup_interval` | int | `120` | 空闲会话清理任务间隔（秒） |
| `mcp_resource_url_prefix` | str | `upload://` | MCP 资源 URL 前缀 |
| `mcp_default_tools` | list[str] | `["inline"]` | MCP 工具默认作用域 |

### 语音链路 Provider

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `tts_provider` | str | `fishspeech` | 文本转语音服务提供商 |
| `asr_provider` | str | `fun_stream` | 语音识别服务提供商 |
| `vad_provider` | str | `silero` | VAD 服务提供商 |
| `voiceprint_provider` | str | `3dsparker` | 声纹识别服务提供商 |

### 向量库与其他

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `milvus_consistency_level` | str | `Eventually` | Milvus 一致性级别 |
| `milvus_timeout` | int | `30` | Milvus 超时（秒） |
| `components_path` | list[str] | 内置组件目录 | 组件搜索路径；环境变量 `TAIYIFLOW_COMPONENTS_PATH` 会追加到列表 |
| `load_flows_path` | str | - | 从指定目录加载流程定义 |
| `laod_prompts_path` | str | - | 从指定目录加载提示定义 |
| `chatui_sub_head` | str | 平台宣传语 | ChatUI 子标题 |
| `basic_data_version` | int | `0` | 基础数据版本号 |
| `remove_api_keys` | bool | `false` | 是否在日志和错误消息中移除 API 密钥 |
| `markdowns` | dict | `{}` | 内置 Markdown 文档内容 |

功能开关类环境变量使用独立前缀 `TAIYIFLOW_FEATURE_`；认证相关配置使用 `TAIYIFLOW_` 前缀下的 auth 设置组。

## 运行时公共配置快照

前端与集成客户端不应直接读取后端环境变量，而应通过 `GET /api/v1/config` 获取聚合后的公共配置快照（功能开关、上传限制、默认流程 ID 等），字段级说明见[运行时配置接口](/reference/api/runtime-config)。

管理端可通过 `/api/v1/settings/` 系列接口读写数据库中的设置项，见 [REST API 参考](/integration/rest-api)。

## 前端配置项

<!-- TODO: 补充前端关键配置说明 -->
