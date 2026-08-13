# CLI 开发指南

> 这篇文档介绍太乙智启 CLI 的项目结构、构建方法和开发要点。

## 技术栈

- **语言**：Go
- **TUI**：Bubble Tea
- **浏览器扩展**：Chrome Extension + Native Messaging

## 项目结构

```
taiyiflow-cli/
├── main.go              # 入口
├── cmd/                 # 命令定义
├── internal/            # 内部实现
│   └── provider/taiyiflow/  # 后端适配层
├── browser-extension/   # 浏览器扩展
├── specs/               # 规格文档
├── files/               # 内置资源
└── bin/                 # 构建产物
```

## 构建

```bash
# 当前平台构建
make build

# 全平台构建
make build-all

# 发布构建（需 macOS 主机）
make build-release

# Docker 构建
make release

# 直接构建
go build -o taiyiflow-cli .
```

## 开发要点

- 首版联调基线：`../taiyiflow/src/backend/base`
- 登录与 TUI `/login` 共用同一套认证实现
- 技能发现：`.snz1dp/skills` 与用户级目录
- 运行时行为：`agent_auto_loop_max_rounds` 控制自动续跑

## 浏览器扩展

```bash
# 刷新扩展构建产物
make browser-extension-dist

# 安装 Native Messaging host
./taiyiflow-cli browser install
```

## 桌面实机验证

```bash
make verify-computer-live-darwin
```

需要先授予终端辅助功能权限。

## 相关文档

- [规格计划](https://github.com/snz1/taiyiflow-cli/blob/main/specs/taiyiflow-go-client.md)
