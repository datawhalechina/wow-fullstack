## Cookie参数

你可以像定义 Query 参数和 Path 参数一样来定义 Cookie 参数。

首先，导入 Cookie:

```python
import uvicorn
from typing import Annotated
from fastapi import Cookie, FastAPI
app = FastAPI()
@app.get("/items/")
async def read_items(ads_id: Annotated[str | None, Cookie()]):
    return {"ads_id": ads_id}

if __name__ == '__main__':
    config = uvicorn.Config(app, host='0.0.0.0', port=8009)
    server = uvicorn.Server(config)
    await server.serve()
```

INFO:     Started server process [20348]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8009 (Press CTRL+C to quit)
INFO:     127.0.0.1:55519 - "GET /docs HTTP/1.1" 200 OK
INFO:     127.0.0.1:55519 - "GET /openapi.json HTTP/1.1" 200 OK
INFO:     127.0.0.1:55518 - "GET /items/ HTTP/1.1" 422 Unprocessable Entity
INFO:     127.0.0.1:55572 - "GET /items/ HTTP/1.1" 422 Unprocessable Entity
INFO:     Shutting down
INFO:     Waiting for application shutdown.
INFO:     Application shutdown complete.
INFO:     Finished server process [20348]

声明 Cookie 参数的结构与声明 Query 参数和 Path 参数时相同。

你需要使用 Cookie 来声明 cookie 参数，否则参数将会被解释为查询参数。

## requests库

```python
url = 'http://127.0.0.1:8009/items/' 
headers = {"Cookie":"cka=111a;ckb=111b"}
res = requests.get(url, headers=headers) 
res.text

# 在另一个ipynb文件中运行代码，会得到 '{"ads_id":"你好"}'

# 不知为什么，无法识别Cookie，需要再探索探索
```
