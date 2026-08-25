# 开发者快速上手

> 目标：20 分钟内跑通第一个 API 调用，收到流式响应。
> 前提：平台已部署，管理员已提供 API 地址和访问凭证。

## 第 1 步：获取接入信息（2 分钟）

向管理员获取以下信息：

| 信息 | 示例 | 说明 |
|------|------|------|
| API 地址 | `http://ai.yourcompany.com:8000` | 后端服务地址 |
| 访问凭证 | `Bearer eyJhbG...` 或 API Key | 用于认证 |
| 智能体 ID | `flow_id` | 你要对话的智能体（可选，有默认值） |

## 第 2 步：cURL 快速验证（3 分钟）

发送第一条流式对话请求：

```bash
curl -N -X POST "http://localhost:8000/api/v1/stream" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "input": "你好，请用一句话介绍你自己",
    "session_id": "test-session-001"
  }'
```

预期结果：收到 SSE 格式的流式响应，逐字输出 AI 回复。

```
data: {"type":"text_delta","content":"你"}
data: {"type":"text_delta","content":"好"}
data: {"type":"text_delta","content":"！"}
...
data: {"type":"done"}
```

:::tip 收到 401？
检查 Authorization 头格式是否正确，确认 Token 未过期。
:::

## 第 3 步：理解核心概念（5 分钟）

| 概念 | 说明 | 类比 |
|------|------|------|
| **Session** | 一次对话的上下文容器 | 微信里的一个聊天窗口 |
| **Flow** | 一个智能体的处理流程定义 | 流水线的设计图纸 |
| **Stream** | 流式响应，边生成边返回 | 打字机效果 |
| **Skill** | 注入给智能体的能力包 | 给员工发一本操作手册 |
| **Client Tool** | 在客户端执行的工具回调 | 让前端帮忙执行本地操作 |

## 第 4 步：Python 示例（5 分钟）

```python
import requests
import json

API_BASE = "http://localhost:8000"
TOKEN = "YOUR_TOKEN"

def chat_stream(question: str, session_id: str = "default"):
    """发送流式对话请求并打印响应"""
    response = requests.post(
        f"{API_BASE}/api/v1/stream",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {TOKEN}",
        },
        json={
            "input": question,
            "session_id": session_id,
        },
        stream=True,
    )
    response.raise_for_status()

    for line in response.iter_lines(decode_unicode=True):
        if not line or not line.startswith("data: "):
            continue
        data = json.loads(line[6:])
        if data.get("type") == "text_delta":
            print(data["content"], end="", flush=True)
        elif data.get("type") == "done":
            print("\n--- 回复结束 ---")
            break

# 使用
chat_stream("帮我用 Python 写一个快速排序")
```

## 第 5 步：JavaScript 示例（3 分钟）

```javascript
async function chatStream(question, sessionId = 'default') {
  const response = await fetch('http://localhost:8000/api/v1/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_TOKEN',
    },
    body: JSON.stringify({ input: question, session_id: sessionId }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value);
    for (const line of text.split('\n')) {
      if (!line.startsWith('data: ')) continue;
      const data = JSON.parse(line.slice(6));
      if (data.type === 'text_delta') {
        process.stdout.write(data.content);
      }
    }
  }
}

chatStream('你好，介绍一下太乙智启');
```

## 第 6 步：了解集成方式选型（2 分钟）

| 集成方式 | 适用场景 | 文档 |
|----------|----------|------|
| **SSE 流式 API** | 后端服务调用，最常用 | [流式对话 API](/integration/stream-api) |
| **WebSocket** | 需要双向实时通信 | [WebSocket 接口](/integration/websocket-api) |
| **REST API** | 非对话类操作（管理、查询） | [REST API](/integration/rest-api) |
| **JS SDK** | 在 Web 页面嵌入对话组件 | [JS SDK](/integration/jssdk) |

## ✅ 里程碑达成

- [x] 成功调用流式对话 API
- [x] 理解了 Session / Flow / Stream 核心概念
- [x] 跑通了 Python 或 JavaScript 示例
- [x] 知道如何选择合适的集成方式

## 下一步

- 🔌 深入了解集成方式 → [集成方式总览](/integration/overview)
- 🔐 认证与鉴权详解 → [认证与鉴权](/integration/authentication)
- 🧩 了解技能注入 → [技能注入机制](/integration/skill-injection)
- 📚 完整 API 参考 → [API 接口文档](/reference/api/stream)
