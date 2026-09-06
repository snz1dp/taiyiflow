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

### 使用 JS SDK（Web 页面嵌入，推荐）

JS SDK 不直接访问后端 API，而是把对话页装入 iframe，登录态由平台侧建立，因此**无需传 API Key**：

```javascript
import TaiyiSDK from 'taiyiflow'

const sdk = new TaiyiSDK({
  agentUrl: 'https://your-platform/taiyi/chat/your-flow-id',
  origin: 'https://your-platform'
})

// 注册一个宿主页面工具，让智能体可以调用
sdk.registerTool('demo-server', {
  name: 'get_current_time',
  description: '获取当前时间。当用户询问现在几点、今天日期时使用。',
  input_schema: { type: 'object', properties: {} },
  handler: async () => new Date().toISOString()
})

sdk.on('agent:ready', () => {
  console.log('智能体已就绪')
})

// 打开对话框并发起提问
sdk.chat('你好，请介绍一下自己')
```

完整参数与 API 见 [JS SDK 集成](/integration/jssdk)。

---

## WebSocket 示例

### Python（websockets）

```python
import asyncio, json, websockets

async def run_flow_ws(flow_id: str, token: str, input_value: str):
    uri = f"ws://localhost:7860/api/v1/run/{flow_id}/websocket"
    headers = {"Authorization": f"Bearer {token}"}

    async with websockets.connect(uri, additional_headers=headers) as ws:
        # 连接后 10 秒内发送第一条消息
        await ws.send(json.dumps({"input_value": input_value}))

        async for message in ws:
            data = json.loads(message)
            if data["event"] == "message":
                print(data["data"].get("chunk", ""), end="", flush=True)
            elif data["event"] == "close":
                print("\n--- 输出完成 ---")
                break
            elif data["event"] == "error":
                print(f"\n错误: {data['data']['error']}")
                break

asyncio.run(run_flow_ws("my-flow", "your-api-key", "你好"))
```

---

## 客户端工具回调示例（Python）

演示完整闭环：声明工具 → 消费 SSE → 检测工具调用 → 本地执行 → 回调结果。

```python
import json
import uuid
import requests

API_BASE = 'http://localhost:7860'
API_KEY = 'your-api-key'
FLOW_ID = 'my-flow'
HEADERS = {'x-api-key': API_KEY, 'Content-Type': 'application/json'}

# 1. 本地工具实现
def get_weather(city: str) -> dict:
    return {'city': city, 'weather': '晴', 'temperature': '26°C'}

LOCAL_TOOLS = {'get_weather': get_weather}

# 2. 发起对话，声明客户端工具
payload = {
    'input_value': '北京今天天气怎么样？',
    'request_type': 'agent',
    'session_id': str(uuid.uuid4()),
    'client_mcp_servers': {
        'weather-server': {
            'tools': [{
                'name': 'get_weather',
                'description': '查询指定城市的实时天气。当用户询问天气时使用。',
                'input_schema': {
                    'type': 'object',
                    'properties': {'city': {'type': 'string', 'description': '城市名'}},
                    'required': ['city'],
                },
            }]
        }
    },
}

response = requests.post(
    f'{API_BASE}/api/v1/run/{FLOW_ID}/stream',
    headers=HEADERS, json=payload, stream=True,
)

# 3. 消费 SSE，检测工具调用并回调
event = None
for line in response.iter_lines(decode_unicode=True):
    if not line:
        event = None
        continue
    if line.startswith('event: '):
        event = line[7:]
    elif line.startswith('data: ') and event == 'message':
        data = json.loads(line[6:])

        if data.get('event_type') == 'client_tool':
            # 4. 本地执行工具
            fn = data['function']
            handler = LOCAL_TOOLS.get(fn['name'].removeprefix('c_'))
            try:
                result = handler(**fn['arguments'])
                success, error = True, None
            except Exception as exc:
                result, success, error = None, False, str(exc)

            # 5. 回调结果（失败也必须回调）
            requests.post(
                f'{API_BASE}/api/v1/agents/client/call/result',
                headers=HEADERS,
                json={
                    'flow_id': data['flow_id'],
                    'session_id': data['context'].get('session_id'),
                    'message_id': data['context'].get('message_id'),
                    'run_id': data['context']['run_id'],
                    'call_id': fn['id'],
                    'success': success,
                    'result': result,
                    'error_message': error,
                },
            )
        elif 'chunk' in data:
            print(data['chunk'], end='', flush=True)
        elif data.get('message') == 'over':
            print('\n--- 完成 ---')
            break
```

---

## 更多场景

| 场景 | 参考文档 |
|------|----------|
| 客户端工具回调 | [客户端工具协议](/integration/client-tool-protocol) |
| 技能注入 | [技能注入机制](/integration/skill-injection) |
| WebSocket 实时通信 | [WebSocket 接口](/integration/websocket-api) |
| Web 页面嵌入 | [JS SDK 集成](/integration/jssdk) |
| 部署完整对话前端 | [智能体前端集成与二次开发](/integration/chatui) |
