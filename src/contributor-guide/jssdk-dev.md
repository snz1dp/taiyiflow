# JS SDK 开发指南

> 这篇文档介绍太乙智启 JS SDK 的开发、测试和构建方法。

## 技术栈

- **语言**：JavaScript (ES Module)
- **构建**：Vite（UMD / ESM / IIFE 三种格式）
- **测试**：Vitest
- **文档**：VitePress

## 开发

```bash
npm install
npm run dev:demo
```

启动后：
- 监听 `src` 目录实时构建
- 静态文件服务器（dist）
- 测试页面服务器（test）

访问 `http://localhost:3005/iife_demo` 测试书签功能。

## 测试

```bash
npm run test              # 全量测试
npm run test:watch        # 监听模式
npm run test:file -- <file>  # 单文件
npm run test:coverage     # 覆盖率
```

## 构建

```bash
npm run build
```

产物在 `dist/` 下：`umd/`、`esm/`、`iife/` 三种格式。

## 文档站

```bash
npm run docs:dev          # 本地预览
npm run docs:build        # Docker 用构建
npm run docs:build:gh     # GitHub Pages 用构建
```

## 发布

- Docker 镜像：SDK + 文档站一并打包
- GitHub Pages：推送 `docs/` 变更自动发布

## 相关文档

- JS SDK 拥有独立的完整文档站，详见 taiyiflow-jssdk 仓库 `docs/` 目录
