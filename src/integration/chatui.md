# ChatUI 前端集成与二次开发

> 本篇是应用层文档：介绍如何部署与定制太乙智启对话前端 **taiyiflow-chatui**。它既是独立的智能体客户端产品（Web SPA + Electron 桌面端），也是 JS SDK 中 iframe 加载的对话页面。

## ChatUI 是什么

taiyiflow-chatui 是太乙智启平台的**一体化智能体前端**，不是单纯的聊天 UI，而是「对话 + 客户端工具执行 + 技能管理 + MCP + 语音通话 + 子任务协作」的完整 Agent 客户端。

| 维度 | 说明 |
|------|------|
| 技术栈 | Vue 3（Composition API）+ Quasar 2 + Vite + Pinia + Vue Router |
| 形态 | Web SPA、Electron 桌面端、移动端/微信内嵌（同一套代码库） |
| 后端依赖 | Composer 业务后端（`/taiyi/composer/api/v1`）+ XEAI 认证后端（`/xeai`） |
| 桌面能力 | 本地文件/Shell/浏览器/桌面操作工具、本地技能安装、Stdio MCP 子进程、服务器地址切换、自动更新 |

### Web 端与 Electron 端能力差异

| 能力 | Web SPA | Electron 桌面端 |
|------|---------|----------------|
| 流式对话（SSE/WebSocket） | ✅ | ✅ |
| 客户端工具（文件/Shell/浏览器/桌面） | ❌（仅 MCP 管理类内置工具） | ✅ 完整 |
| 本地技能安装与脚本执行 | ❌（`terminal_type='web'` 降级，排除含脚本技能） | ✅ |
| 本地登录（账号密码/扫码/持久令牌） | ❌（依赖网关 SSO） | ✅ |
| 服务器地址运行时切换 | ❌ | ✅ |
| 语音通话（ASR/TTS/Opus） | ✅ | ✅ |

## 部署 Web SPA

### Docker 部署（推荐）

官方镜像 `snz1.cn/taiyiflow/chatui`（linux/amd64 + arm64 双平台）：

```bash
docker run -d \
  -p 5000:80 \
  -e WEB_CONTEXT_PATH=/taiyi/chat \
  -e TZ=Asia/Shanghai \
  snz1.cn/taiyiflow/chatui
```

- 容器内为 Nginx 托管的静态产物（`/app/html`），SPA history 回退已内置
- 入口脚本会按 `WEB_CONTEXT_PATH` 替换构建时的 context path
- 健康检查端点：`/health`

### 网关接入要点

生产部署通常在网关（Ingress）层完成：

1. **路由前缀**：Web 页面挂在 `/taiyi/chat`，业务 API 反代到 Composer 后端（默认 `:7860`）的 `/taiyi/composer/api/v1`，认证 API 反代到 XEAI（`:8585`）的 `/xeai`
2. **SSO**：`/taiyi/chat` 路径配置 SSO 认证；Web 端收到 401 时会 `reload` 触发网关重定向登录
3. **WebSocket 透传**：`/asr/websocket`、`/agents/client/websocket`、`/run/{flow}/websocket` 需要 Nginx 配置 `Upgrade`/`Connection` 头透传，并放宽读写超时（流式对话可达 600s）
4. **匿名路径**：`/js/libs`（JS SDK 书签小工具产物）需放行匿名访问

### 源码构建

```bash
# 环境：Node 20+，Quasar CLI
npm install -g @quasar/cli
npm install

# 开发模式（端口 4005，API 代理到本地 Composer :7860 / XEAI :8585）
quasar dev

# 生产构建，产物在 dist/spa
quasar build
```

开发代理与路径常量定义在 `quasar.config.js` 顶部：`CHAT_WEB_URL=/taiyi/chat`、`COMPOSER_API_URL=/taiyi/composer/api/v1`、`XEAI_API_URL=/xeai`。私有化部署如需调整网关前缀，修改这三个常量后重新构建。

## Electron 桌面端

### 构建安装包

```bash
# 目录包（electron-packager）
make electron-image

# 安装包（electron-builder，支持镜像内/本机两种构建）
make electron-builder-host
make electron-installers-macos    # 或 windows / linux
```

- macOS：dmg/zip，hardenedRuntime + entitlements，`after-sign.js` 走公证流程
- Windows：NSIS 安装包，支持 Certum 云证书签名
- Linux：deb/rpm
- 安装包内置运行时：`taiyiflow-cli`、Python、Node（打入 `bin/`），以及 27 个内置技能包

### 桌面端认证模型

Electron 端与 CLI **共享认证体系与配置文件**：

- 配置/令牌持久化在 `~/.snz1dp/config/taiyiflow.yaml`
- 登录流程：获取 deviceId → 账号密码（RSA 加密）/ 扫码登录 → 保存 accessToken；勾选"记住"时创建 persistentToken
- 自动续期：401 时用持久令牌换牌（`GET /sso/salt` → SHA-256(deviceId+salt) 签名 → `POST /sso`）后重放请求；换牌失败跳登录页
- 服务器地址可在设置页运行时切换，立即持久化到 YAML

### 桌面端工具运行时

Electron 主进程内置完整的智能体工具运行时（`src-electron/agent-runtime/`）：

| 工具族 | 能力 |
|--------|------|
| file-tools | 本地文件读/写/编辑/glob/搜索 |
| shell-tools | Shell 执行、后台任务、终端输出捕获 |
| browser-tools / computer-tools | 浏览器自动化、桌面截图与输入 |
| document-tools | 文档结构化、图像理解 |
| subtask-tools | 子任务并行调度 |
| skill-tools / schedule-tools / todo-tools | 技能加载、定时任务、待办清单 |
| security | 审批模式、沙箱根目录、写确认策略、权限规则 |

渲染进程通过 preload 桥（`window.__ELECTRON_AGENT__`）获取工具定义并注册到对话流，工具执行经 IPC 转发回主进程。安全审批体系确保高风险操作（写文件、Shell、桌面输入）需用户确认。

## 作为 JS SDK 的对话页

JS SDK 的 `agentUrl` 指向的就是 ChatUI 的对话路由：

```
https://your-platform/taiyi/chat/{flowId}
```

ChatUI 检测到运行在 SDK iframe 中时，会与 SDK 建立 postMessage 通道（消息源标识：SDK 侧 `taiyiflow-sdk`，ChatUI 侧 `taiyiflow-agent`）：

| 消息 | 方向 | 用途 |
|------|------|------|
| `agent:ready` | ChatUI → SDK | 智能体就绪，SDK 全量同步工具与技能 |
| `set:client_mcp_servers` | SDK → ChatUI | 同步宿主页面注册的工具定义 |
| `set:client_skill_packages` | SDK → ChatUI | 同步宿主注入的技能包 |
| `set:requested_skill_names` | SDK → ChatUI | 指定服务端技能 |
| `client_tool` | ChatUI → SDK | 请求宿主执行工具 |
| `finish:client_tool` | SDK → ChatUI | 回传工具执行结果 |
| `start_chat` | SDK → ChatUI | 主动发起对话 |
| `flow_metadata` | ChatUI → SDK | 智能服务元信息（名称等） |
| `ping` / `pong` | 双向 | 心跳保活 |

ChatUI 收到工具定义后，会将其并入对话请求的 `client_mcp_servers` 字段上送后端；收到 `client_tool` 事件时转发给 SDK 执行。完整链路见[客户端工具协议](/integration/client-tool-protocol)。

## 白标定制扩展点

ChatUI 为 OEM/白标场景预留了完整的定制面：

| 扩展点 | 位置 | 说明 |
|--------|------|------|
| 产品名/品牌 | `package.json` `productName`；`quasar.config.js` 支持 `ELECTRON_BUILDER_PRODUCT_NAME` 等环境变量覆盖 | 安装包名、窗口标题 |
| 应用标题/版本 | `quasar.config.js` `build.env`（`CHAT_WEB_TITLE` / `CHAT_WEB_VERSION`） | 运行时读取 |
| 主题色 | `src/css/quasar.variables.scss`（`$primary` 等） | Quasar 变量体系 |
| 深色模式 | `src/stores/theme.js`、`src/css/dark-theme.scss` | 支持跟随系统 |
| 图标/Logo | `src-electron/icons/`、`public/favicon.ico`、`public/logo.png`、`icongenie-profile.json` | 全套品牌视觉 |
| 后端地址 | Web：网关 + `WEB_CONTEXT_PATH`；Electron：设置页 + YAML 持久化 | 私有化部署关键 |
| 国际化 | `src/i18n/zh.js`（vue-i18n） | 当前仅中文，可扩展语言包 |
| 内嵌协议/帮助文档 | `src/docs/` + `pages/about/DocsViewer.vue` | 隐私政策、用户协议可替换 |
| 内置技能集 | `src-electron/agent-runtime/builtin-skills/` | 增删定制桌面端技能 |
| 新手引导 | `src/config/guide-steps.js`（driver.js） | 引导步骤定制 |
| 书签小工具 | `public/js/libs`（JS SDK 产物） | 网页划词集成 |

白标合作的商务与流程细节见[厂商指南 · 白标定制](/vendor-guide/white-label)。

## 深入阅读

- ChatUI 源码级架构解析：[ChatUI 内部实现](/internals/chatui-internals)
- 仓库内 wiki：`taiyiflow-chatui/docs/wiki/`（Architecture、State-Management、API-Layer、Agent-Runtime、subtask-architecture 等 13 篇）
- 流式协议契约：[流式对话 API](/integration/stream-api)、[WebSocket 接口](/integration/websocket-api)
