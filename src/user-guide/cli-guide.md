# CLI 命令行工具使用指南

> 这篇文档是太乙智启 CLI 的完整使用手册，涵盖安装、登录、对话、任务管理和配置。

## 简介

太乙智启 CLI 是面向终端的智能体客户端，使用 Go 编写，提供 Bubble Tea TUI（终端用户界面）交互体验。

**核心特性**：
- 单入口交互，统一处理代码、文档、脚本和排障任务
- 本地优先，围绕当前工作目录、本地文件和本机命令运行
- 支持技能发现与远程仓库安装
- 支持浏览器扩展与桌面自动化

## 安装

CLI 已内置在桌面客户端中：
- macOS：`TaiyiAgent.app/Contents/bin/taiyiflow-cli`
- Windows / Linux：安装目录下 `bin/taiyiflow-cli`

也可从发布页面独立下载。

## 登录

```bash
# 账号密码登录（进入 TUI 登录表单）
./taiyiflow-cli login

# 扫码登录（终端显示二维码，自动等待扫码完成）
./taiyiflow-cli login qr

# 查看当前登录状态
./taiyiflow-cli login status

# 退出登录
./taiyiflow-cli login logout
```

:::tip 自动续期
长时间闲置后，CLI 会优先使用本地 `persistent_token` 自动续期，续期失败才需要重新登录。
:::

## 对话

### 交互式 TUI

```bash
./taiyiflow-cli
```

进入 TUI 界面后直接输入问题即可对话。

### 单次任务模式

```bash
./taiyiflow-cli task "任务描述"
```

### TUI 内置命令

| 命令 | 说明 |
|------|------|
| `/about` | 查看版本信息 |
| `/login` | 切换账号登录 |
| `/skills` | 技能管理（本地/远程双标签页） |
| `/tasks` | 后台任务管理 |
| `/tasks output <task_id>` | 查看任务输出 |
| `/tasks cleanup` | 清理已完成任务 |

## 技能管理

```bash
# 查看技能列表
./taiyiflow-cli skills list

# 查看技能详情
./taiyiflow-cli skills view <skill-name>

# 启用/禁用技能
./taiyiflow-cli skills enable <skill-name>
./taiyiflow-cli skills disable <skill-name>
```

TUI 中 `/skills` 弹窗支持"本地技能 / 远程仓库"双标签页，可直接浏览远程技能并执行安装、更新、删除。

## 配置管理

```bash
# 查看当前配置
./taiyiflow-cli config show

# 设置配置项
./taiyiflow-cli config set <key> <value>
```

### 常用配置项

| 配置项 | 取值 | 说明 |
|--------|------|------|
| `external_resource_access_policy` | `confirm` / `deny` / `allow` | 工作目录外资源访问策略 |
| `write_confirmation_policy` | `direct` / 其他 | 文件写入审查策略，`direct` 为直接执行 |
| `agent_auto_loop_max_rounds` | `0-100` | 智能体自动续跑最大轮次，`0` 为禁用 |
| `backend_base_url` | URL | 后端服务地址 |

### 单次任务临时覆盖

```bash
./taiyiflow-cli task --external-resource-access-policy confirm "读取工作目录外的参考文件"
```

## 浏览器扩展

```bash
# 安装 Native Messaging host
./taiyiflow-cli browser install
```

安装后在浏览器中加载扩展即可使用 `chrome_session` 模式。

## 版本信息

```bash
./taiyiflow-cli about
```

## 运行时行为说明

- 智能体"最大循环"只约束单次请求内的迭代，不跨用户轮次累计
- 文件写入审查由 `write_confirmation_policy` 控制
- 普通文本分片、上下文压缩进度事件不计入终止条件
