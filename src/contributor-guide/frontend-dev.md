# 前端开发指南

> 这篇文档介绍对话前端（chatui）和管理前端（dashweb）的开发方法。

## 技术栈

- **框架**：Quasar 2（基于 Vue 3）
- **状态管理**：Pinia
- **路由**：Vue Router
- **构建**：Vite
- **桌面**：Electron（仅 chatui）

## 目录结构（chatui 和 dashweb 通用）

```
src/
├── assets/       # 静态资源（图片、字体）
├── boot/         # 启动插件
├── components/   # 全局组件
├── layouts/      # 页面布局
├── pages/        # 页面视图
├── router/       # 路由配置
├── stores/       # Pinia 状态管理
├── api/          # Axios 请求
├── css/          # 全局样式
└── utils/        # 工具函数
```

### 路径别名

| 别名 | 对应目录 |
|------|----------|
| `src` | 源代码根目录 |
| `components` | `src/components/` |
| `pages` | `src/pages/` |
| `stores` | `src/stores/` |
| `api` | `src/api/` |
| `utils` | `src/utils/` |

## 开发命令

```bash
# 安装依赖
npm i -g @quasar/cli
npm install

# 开发调试
quasar dev

# Electron 模式（仅 chatui）
quasar dev -m electron

# 代码检查
npm run lint

# 格式化
npm run format

# 构建发布
quasar build
```

:::tip
开发前请先启用 Node.js 20：`nvm use 20`
:::

## 图标

- 默认使用 Material Icons
- 自定义图标从 IconFont 下载，放入 `src/assets/fonts/`

## Electron 特有（chatui）

- 环境判断：`window.__ELECTRON_AUTH__`
- 生产环境注入 `API_BASE_URL`
- 图标制作使用 `electron-icon-builder`

## 相关文档

- [Quasar 2 文档](https://v2.quasar.dev/)
- [Quasar 2 中文文档](https://www.quasar-cn.cn/)
