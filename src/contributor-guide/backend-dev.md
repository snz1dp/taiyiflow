# 后端开发指南

> 这篇文档介绍太乙智启后端的目录结构、API 开发方法和调试技巧。

## 技术栈

- **语言**：Python 3.12
- **框架**：FastAPI
- **ORM**：SQLModel
- **迁移**：Alembic
- **包管理**：uv

## 目录结构

```
src/backend/
├── base/taiyiflow/
│   ├── api/v1/              # API 路由定义
│   ├── alembic/             # 数据库迁移脚本
│   │   └── versions/        # 迁移版本文件
│   ├── initial_setup/       # 初始化配置
│   └── models/              # 数据模型
├── taiyiflow/               # 核心业务逻辑
├── tests/                   # 测试用例
├── scripts/                 # 辅助脚本
├── pyproject.toml           # 项目配置
└── uv.lock                  # 依赖锁定
```

## 开发调试

### VSCode 调试

1. 打开 `taiyiflow` 工程目录
2. 切换至「运行和调试」标签
3. 选择 `Debug Backend`
4. 点击「运行」启动

### MCP Inspector

```bash
make run_mcp_inspector
```

## API 开发

API 路由位于 `src/backend/base/taiyiflow/api/v1/` 目录。

<!-- TODO: 补充 API 开发示例 -->

## 数据库迁移

修改数据模型后：

```bash
make upgrade_model_schemas
```

自动在 `alembic/versions/` 下生成迁移文件，验证后提交。

新增表需在 `create_db_and_tables` 函数中注册表名。

## 测试

```bash
cd src/backend
pytest tests/
```

## 相关文档

- [数据库迁移](/contributor-guide/database-migration) — 迁移详细流程
- [编码规范](/contributor-guide/coding-standards) — 代码风格要求
