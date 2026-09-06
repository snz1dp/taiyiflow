# 安装与部署

> 这篇文档介绍太乙智启各组件的安装方式，帮你选择最适合自己的使用路径。

## 选择你的使用方式

| 方式 | 适合人群 | 难度 |
|------|----------|------|
| 桌面客户端 | 普通用户、开发者 | ⭐ 简单 |
| CLI 命令行 | 终端爱好者、开发者 | ⭐⭐ 中等 |
| Web 部署 | 团队/企业使用 | ⭐⭐⭐ 需要运维 |
| 源码部署 | 二次开发、深度定制 | ⭐⭐⭐⭐ 需要开发经验 |

---

## 方式一：桌面客户端（推荐新手）

桌面客户端内置了 CLI 工具、Python 3.12 和 Node 22 运行时，开箱即用。

### 下载

从发布页面下载对应平台的安装包：

| 平台 | 格式 | 说明 |
|------|------|------|
| macOS | `.dmg` / `.zip` | 支持 Intel（x64）和 Apple Silicon（arm64） |
| Windows | `.exe`（NSIS） | 支持 x64 和 arm64 |
| Linux | `.deb` / `.rpm` | 支持 x64 和 arm64 |

### 安装后

1. 打开太乙智启应用
2. 使用账号登录（或扫码登录）
3. 开始对话

:::tip
桌面客户端安装后，CLI 工具位于：
- macOS：`TaiyiAgent.app/Contents/bin/taiyiflow-cli`
- Windows / Linux：安装目录下 `bin/taiyiflow-cli`
:::

---

## 方式二：CLI 命令行工具

CLI 是面向终端的智能体客户端，使用 Go 编写，提供 TUI（终端用户界面）交互。

### 获取 CLI

**方式 A：从桌面客户端获取**

桌面客户端已内置 CLI，直接使用即可。

**方式 B：独立下载**

从发布页面下载对应平台的 `taiyiflow-cli` 可执行文件。

### 登录

```bash
# 账号密码登录（进入 TUI 登录表单）
./taiyiflow-cli login

# 扫码登录（终端显示二维码）
./taiyiflow-cli login qr

# 查看登录状态
./taiyiflow-cli login status
```

### 开始使用

```bash
# 进入交互式 TUI
./taiyiflow-cli

# 单次任务模式
./taiyiflow-cli task "帮我整理当前目录下的 README"
```

---

## 方式三：Web 部署（团队使用）

Web 部署包含后端服务、对话前端和管理前端三个部分。

### 环境要求

| 组件 | 要求 |
|------|------|
| 后端 | Python 3.12+、PostgreSQL/MySQL、Redis |
| 对话前端 | Nginx 或任意静态服务器 |
| 管理前端 | Nginx 或任意静态服务器 |

### Docker 部署（推荐）

```bash
# 构建后端镜像
cd taiyiflow/src/backend
docker build -t taiyiflow-backend .

# 构建对话前端镜像
cd taiyiflow-chatui
docker build -t taiyiflow-chatui .

# 构建管理前端镜像
cd dashweb
docker build -t taiyiflow-dashweb .
```

:::warning
生产环境部署前，请确保已配置好数据库连接、大模型 API Key 等环境变量。具体配置项参见[管理指南 - 部署架构](/admin-guide/deployment)。
:::

---

## 方式四：源码部署（开发者）

适合需要二次开发或参与贡献的开发者。

### 后端

```bash
# 1. 安装 Miniforge（Python 环境管理）
# 下载地址：https://mirror.nju.edu.cn/github-release/conda-forge/miniforge/LatestRelease/

# 2. 创建 Python 环境
conda create -n taiyiflow python=3.12
conda activate taiyiflow
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# 3. 安装开发依赖
cd taiyiflow
make install_uv
make install_dev_dependencies

# 4. 初始化数据库
# 参考 test/README.md 进行数据库和本地文件初始化

# 5. 启动后端（VSCode 中选择 Debug Backend 运行）
```

### 对话前端

```bash
# 需要 Node.js 20
nvm use 20

cd taiyiflow-chatui
npm i -g @quasar/cli
npm install
quasar dev
```

### 管理前端

```bash
cd dashweb
npm i -g @quasar/cli
npm install
quasar dev
```

### CLI

```bash
cd taiyiflow-cli
go build -o taiyiflow-cli .
./taiyiflow-cli
```

---

## 常见问题

**Q：Windows 下后端启动报 Opus 库错误？**

```bash
conda install -c conda-forge libopus -y
```

然后将 Conda 环境中的 `opus.dll` 复制到 `.venv\Scripts` 目录下。

**Q：桌面端构建出现 OOM？**

设置环境变量：`NODE_OPTIONS="--max-old-space-size=8192"`

---

## 下一步

安装完成后，进入 [第一次对话](/getting-started/first-conversation) 体验完整流程。
