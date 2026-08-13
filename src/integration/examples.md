# 集成示例

> 这篇文档提供可直接运行的集成代码示例，覆盖 cURL、Python 和 JavaScript 三种语言。

## 前置条件

- 已获取 API Key（参见[认证与鉴权](/integration/authentication)）
- 已知道目标 Flow 的 ID 或名称
- 后端服务地址（以下示例使用 `http://localhost:7860`）

---

## cURL 示例

### 基础对话

```bash
curl -N -X POST \
  'http://localhost:7860/api/v1/run/my-flow/stream' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your-api-key' \
  -d '{
    "input_value": "你好，请介绍一下自己",
    "request_type": "ask"
  }'
```

### 带技能的对话

```bash
curl -N -X POST \
  'http://localhost:7860/api/v1/run/my-flow/stream' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer your-api-key' \
  -d '{
    "input_value": "帮我写一个排序算法",
    "request_type": "agent",
    "client_skill_packages": [
      {
        "name": "code-helper",
        "description": "代码编写助手",
        "content": "# 代码助手\n请用 Python 编写代码，并附带注释和测试用例。"
      }
    ]
  }'
```

---

## Python 示例

### 基础流式对话

```python
import requests

API_BASE = 'http://localhost:7860'
API_KEY = 'your-api-key'
FLOW_ID = 'my-flow'

def chat(message: str):
    """发起流式对话并逐行打印"""
    response = requests.post(
        f'{API_BASE}/api/v1/run/{FLOW_ID}/stream',
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {API_KEY}'
        },
        json={
            'input_value': message,
            'request_type': 'ask'
        },
        stream=True
    )
    response.raise_for_status()

    for line in response.iter_lines():
        if not line:
            continue
        decoded = line.decode('utf-8')
        if decoded.startswith('data: '):
            print(decoded[6:], end='', flush=True)

if __name__ == '__main__':
    chat('你好，请介绍一下自己')
```

### 多轮对话（带 session_id）

```python
import requests
import uuid

API_BASE = 'http://localhost:7860'
API_KEY = 'your-api-key'
FLOW_ID = 'my-flow'

session_id = str(uuid.uuid4())

def chat(message: str):
    response = requests.post(
        f'{API_BASE}/api/v1/run/{FLOW_ID}/stream',
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {API_KEY}'
        },
        json={
            'input_value': message,
            'session_id': session_id,
            'request_type': 'ask'
        },
        stream=True
    )
    for line in response.iter_lines():
        if line:
            print(line.decode('utf-8'))

# 第一轮
chat('我叫小明，请记住我的名字')
# 第二轮（同一 session，AI 能记住上下文）
chat('我叫什么名字？')
```

---

## JavaScript 示例

### 使用 fetch + EventSource 消费 SSE

```javascript
const API_BASE = 'http://localhost:7860'
const API_KEY = 'your-api-key'
const FLOW_ID = 'my-flow'

async function chat(message) {
  const response = await fetch(
    `${API_BASE}/api/v1/run/${FLOW_ID}/stream`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        input_value: message,
        request_type: 'ask'
      })
    }
  )

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const text = decoder.decode(value)
    console.log(text)
  }
}

chat('你好，请介绍一下自己')
```

### 使用 JS SDK（推荐）

```javascript
import TaiyiSDK from 'taiyiflow-jssdk'

const sdk = new TaiyiSDK({
  agentUrl: 'http://localhost:7860',
  apiKey: 'your-api-key'
})

sdk.on('message', (data) => {
  console.log('AI:', data.text)
})

sdk.chat('你好，请介绍一下自己')
```

---

## 更多场景

| 场景 | 参考文档 |
|------|----------|
| 客户端工具回调 | [客户端工具协议](/integration/client-tool-protocol) |
| 技能注入 | [技能注入机制](/integration/skill-injection) |
| WebSocket 实时通信 | [WebSocket 接口](/integration/websocket-api) |
