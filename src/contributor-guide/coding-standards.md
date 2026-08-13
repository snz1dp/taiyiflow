# 编码规范与提交流程

> 这篇文档介绍太乙智启各组件的编码规范和代码提交流程。

## 代码风格

### 后端（Python）

- 使用 Pyright 进行类型检查（配置见 `pyrightconfig.json`）
- 遵循 PEP 8 规范

### 前端（JavaScript/Vue）

- 使用 ESLint 进行代码检查
- 提交前执行 `npm run lint`
- 使用 `npm run format` 格式化

### CLI（Go）

- 遵循 Go 标准代码风格
- 使用 `gofmt` 格式化

## Git 提交规范

<!-- TODO: 补充具体的 commit message 规范 -->

建议格式：

```
<type>(<scope>): <subject>

<body>
```

type 取值：`feat`、`fix`、`docs`、`style`、`refactor`、`test`、`chore`

## CI/CD

<!-- TODO: 补充 CI/CD 流程说明 -->

## 贡献流程

1. Fork 或创建分支
2. 开发并测试
3. 提交 PR
4. Code Review
5. 合并

## 相关文档

- [CONTRIBUTING.md](https://github.com/snz1/taiyiflow/blob/main/CONTRIBUTING.md)
