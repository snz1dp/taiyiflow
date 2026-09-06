# ============================================================
# Stage 1: 构建文档站点（VitePress）
# ============================================================
FROM snz1.cn/base/node:20-alpine AS docs-build

WORKDIR /app
COPY . .

# vitepress 的 lastUpdated 需要调用 git 获取文件最后提交时间，alpine 基础镜像默认无 git
RUN apk add --no-cache git

RUN npm config set registry https://registry.npmmirror.com/
RUN npm install && VITEPRESS_BASE_PATH=/taiyi/docs/ npm run docs:build


# ============================================================
# Stage 2: 运行时（Nginx 静态托管）
# ============================================================
FROM snz1.cn/dp/vueapp:2.2

# Nginx 配置
ADD nginx/default.conf /etc/nginx/conf.d/

# 文档站点构建产物
COPY --from=docs-build /app/src/.vitepress/dist /app/html
