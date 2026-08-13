# 数据库迁移

> 这篇文档介绍太乙智启后端的数据库迁移流程。

## 工具

使用 **Alembic** 进行数据库结构迁移。

## 生成迁移

修改数据模型后执行：

```bash
make upgrade_model_schemas
```

自动生成迁移文件到 `src/backend/base/taiyiflow/alembic/versions/` 目录。

## 验证与提交

1. 检查生成的迁移文件内容
2. 本地执行迁移验证
3. 测试通过后提交到代码仓库

## 新增表

新增表结构时，必须在 `create_db_and_tables` 函数中注册表名：

```python
current_tables = [
    "flow", "user", "apikey",
    "message", "variable", "transaction",
    "vertex_build", "app", "appuser",
    "settings", "chat_session",
    # 在这里添加新表名
]
```

## 注意事项

:::warning
- 迁移文件一旦提交不要修改，应创建新的迁移
- 生产环境执行迁移前请先备份数据库
:::
