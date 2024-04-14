## Header参数

你可以使用定义 Query, Path 和 Cookie 参数一样的方法定义 Header 参数。

为了声明headers， 你需要使用Header, 因为否则参数将被解释为查询参数。

首先导入 Header:

然后使用和Path, Query and Cookie 一样的结构定义 header 参数

第一个值是默认值，你可以传递所有的额外验证或注释参数：

```python
import uvicorn
from typing import Annotated
from fastapi import FastAPI, Header
app = FastAPI()
@app.get("/items/")
async def read_items(user_agent: Annotated[str | None, Header()] = None):
    return {"User-Agent": user_agent}

if __name__ == '__main__':
    config = uvicorn.Config(app, host='0.0.0.0', port=8009)
    server = uvicorn.Server(config)
    await server.serve()
```

INFO:     Started server process [16572]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8009 (Press CTRL+C to quit)
INFO:     127.0.0.1:55646 - "GET /docs HTTP/1.1" 200 OK
INFO:     127.0.0.1:55646 - "GET /openapi.json HTTP/1.1" 200 OK
INFO:     127.0.0.1:55645 - "GET /items/ HTTP/1.1" 200 OK
INFO:     Shutting down
INFO:     Waiting for application shutdown.
INFO:     Application shutdown complete.
INFO:     Finished server process [16572]

## requests库

```python
url = 'http://127.0.0.1:8009/items/' 
headers = {"User-Agent": "test"}
res = requests.get(url, headers=headers) 
res.text

# 在另一个ipynb文件中运行代码，会得到 '{"User-Agent":"test"}'
```

