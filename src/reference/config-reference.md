# 配置项参考

> 太乙智启各组件的配置项汇总。

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

<!-- TODO: 补充后端环境变量和配置文件说明 -->

## 前端配置项

<!-- TODO: 补充 quasar.config.js 关键配置说明 -->
