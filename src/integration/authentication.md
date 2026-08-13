# 认证与鉴权

> 这篇文档介绍如何获取访问凭证并通过认证调用太乙智启 API。

## 认证方式

太乙智启支持以下认证方式：

| 方式 | 适用场景 |
|------|----------|
| API Key | 程序化调用、后端集成 |
| 账号密码登录 | 用户交互场景 |
| 扫码登录 | 移动端/桌面端快捷登录 |
| persistent_token | 长期会话自动续期 |

## API Key

### 获取 API Key

1. 登录管理后台
2. 进入「API Key 管理」页面
3. 创建新的 API Key

### 使用 API Key

在请求头中携带：

```
Authorization: Bearer <your-api-key>
```

## Token 机制

### 登录获取 Token

```bash
POST /api/v1/login
{
  "username": "your-username",
  "password": "your-password"
}
```

响应中包含：
- `access_token`：短期访问令牌
- `persistent_token`：长期续期令牌

### 自动续期

客户端在长时间闲置后，会优先使用 `persistent_token` 自动续期：
1. 续期成功 → 直接重放原始请求
2. 续期失败 → 回落到重新登录

## 扫码登录

1. 客户端请求二维码
2. 用户手机扫码确认
3. 客户端轮询获取登录结果

<!-- TODO: 补充扫码登录具体 API 端点 -->

## 安全建议

:::warning
- API Key 创建后仅显示一次，请妥善保存
- 不要在客户端代码中硬编码 API Key
- 定期轮换 API Key
- 生产环境使用 HTTPS
:::
