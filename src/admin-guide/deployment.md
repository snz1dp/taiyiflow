# 部署架构与运维

> 这篇文档介绍太乙智启的部署架构、Docker 编排和运维要点。

## 系统架构

```mermaid
graph TD
    U["用户"] --> CU["对话前端 chatui"]
    U --> DW["管理前端 dashweb"]
    U --> CLI["CLI 客户端"]
    CU --> BE["后端服务 taiyiflow"]
    DW --> BE
    CLI --> BE
    BE --> DB["数据库"]
    BE --> LLM["大模型 API"]
    BE --> VS["向量存储"]
```

## 环境要求

| 组件 | 最低要求 |
|------|----------|
| 后端 | Python 3.12+、PostgreSQL/MySQL、Redis |
| 前端 | Nginx 或任意静态服务器 |
| 数据库 | PostgreSQL 14+ 或 MySQL 8+ |

## Docker 部署

### 构建镜像

```bash
# 后端
cd taiyiflow/src/backend && docker build -t taiyiflow-backend .

# 对话前端
cd taiyiflow-chatui && docker build -t taiyiflow-chatui .

# 管理前端
cd dashweb && docker build -t taiyiflow-dashweb .
```

### 环境变量

<!-- TODO: 补充完整环境变量列表 -->

| 变量 | 说明 | 示例 |
|------|------|------|
| `DATABASE_URL` | 数据库连接串 | `postgresql://user:pass@host/db` |
| `REDIS_URL` | Redis 连接串 | `redis://host:6379` |
| `LLM_API_KEY` | 大模型 API Key | - |

## 数据库初始化

首次部署需执行数据库初始化，参考 `taiyiflow/test/README.md`。

## Nginx 配置

<!-- TODO: 补充 Nginx 反向代理配置示例 -->

## 健康检查

<!-- TODO: 补充健康检查端点 -->

## 升级与回滚

<!-- TODO: 补充升级流程 -->
