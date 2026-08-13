# 开发环境搭建

> 这篇文档帮助你在 macOS、Linux 和 Windows 上搭建太乙智启的完整开发环境。

## 环境要求总览

| 组件 | 依赖 |
|------|------|
| 后端 | Python 3.12+（Miniforge/Conda）、uv |
| 前端（chatui/dashweb） | Node.js 20+、@quasar/cli |
| CLI | Go 1.21+ |
| JS SDK | Node.js 20+ |

## macOS

### 后端

```bash
# 安装 Miniforge
# 下载：https://mirror.nju.edu.cn/github-release/conda-forge/miniforge/LatestRelease/

conda create -n taiyiflow python=3.12
conda activate taiyiflow
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

cd taiyiflow
make install_uv
make install_dev_dependencies
```

### 前端

```bash
nvm use 20
npm i -g @quasar/cli
```

### CLI

```bash
# 安装 Go（推荐 brew）
brew install go

cd taiyiflow-cli
go build -o taiyiflow-cli .
```

## Linux

与 macOS 步骤基本一致，注意：
- 使用系统包管理器安装依赖
- Electron 构建需要额外的系统库

## Windows

### 后端

```bash
conda create -n taiyiflow python=3.12
conda activate taiyiflow
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

cd taiyiflow
make install_uv
make install_dev_dependencies
```

:::warning Windows 特有问题
如果启动报 Opus 库错误：
```bash
conda install -c conda-forge libopus -y
```
然后将 Conda 环境中的 `opus.dll` 复制到 `.venv\Scripts` 目录下。
:::

## 数据库初始化

参考 `taiyiflow/test/README.md` 进行数据库和本地文件的初始化。

## IDE 配置

### VSCode

后端调试：打开 `taiyiflow` 目录 → 运行和调试 → 选择 `Debug Backend` → 运行

## 验证环境

```bash
# 后端
cd taiyiflow && make frontend

# 前端
cd taiyiflow-chatui && quasar dev

# CLI
cd taiyiflow-cli && ./taiyiflow-cli about
```
