> MCP（Model Context Protocol, 模型上下文协议）是 AI 应用程序和 Agents 连接并使用数据源（例如本地文件、数据库或内容存储库）和工具（例如 GitHub、Google Maps 或 Puppeteer）的标准方式。

MCP 定义了 AI Agents 如何与应用程序通信的新兴标准。那么使用 FastAPI 构建的应用程序如何与 MCP 兼容呢？很幸运，FastAPI 社区已经为 MCP 提供了一个扩展库：[`fastapi-mcp`](https://github.com/tadata-org/fastapi_mcp)。那么 `fastapi-mcp` 有哪些特性呢？

- 内置身份认证：保证只有授权的 AI 可以使用你的 API
- 零配置使用：只需几行代码即可接入
- 灵活部署：可以和你的主应用一起运行，也可以单独部署
- 高效通信：直接使用 FastAPI 内部的 ASGI 传输，而无需额外的HTTP请求

## 安装

我们基于 `第01课-路径参数.md` 的代码进行修改，在 Jupyter notebook 中安装 `fastapi-mcp` 扩展库。

```bash
!pip install fastapi-mcp
```

## 基本用法

使用 `fastapi-mcp` 时，你可以通过创建一个 `FastApiMCP` 实例并将其挂载到你的 FastAPI 应用上来启用 MCP。

例如：

```python
import uvicorn
from fastapi import FastAPI

# 导入 fastapi-mcp 扩展库
from fastapi_mcp import FastApiMCP

app = FastAPI()

# 基于原有的 app 创建 MCP 服务
mcp = FastApiMCP(app)
# 将 MCP 服务器直接安装到应用程序中
mcp.mount()

@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == '__main__':
    config = uvicorn.Config(app, host='0.0.0.0', port=8009)
    server = uvicorn.Server(config)
    await server.serve()
```

点 ctrl+enter 运行这个格子。
控制台输出以下信息：

```log
INFO:     Started server process [20419]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8009 (Press CTRL+C to quit)
INFO:     127.0.0.1:54543 - "GET /docs HTTP/1.1" 200 OK
INFO:     127.0.0.1:54543 - "GET /openapi.json HTTP/1.1" 200 OK
INFO:     127.0.0.1:54688 - "GET /mcp HTTP/1.1" 200 OK
INFO:     Shutting down
INFO:     Waiting for connections to close. (CTRL+C to force quit)
INFO:     Finished server process [20419]
```

访问 http://127.0.0.1:8009/mcp 可以看到 MCP 服务器的运行情况。如：

```log
event: endpoint
data: /mcp/messages/?session_id=47bbb4564ea746d3bb1ffc063985eb19

: ping - 2025-05-08 01:36:20.203345+00:00

: ping - 2025-05-08 01:36:35.204371+00:00

: ping - 2025-05-08 01:36:50.206171+00:00

: ping - 2025-05-08 01:37:05.208072+00:00
```

在 MCP Client 中如何使用呢？对于任何支持 SSE 的 MCP 客户端，我们只需提供 MCP url，也就是 http://127.0.0.1:8009/mcp，就可以开始工作了。
所有最流行的 MCP 客户端（Claude Desktop、Cursor 和 Windsurf 等）都使用以下配置格式：

```json
{
  "mcpServers": {
    "fastapi-mcp": {
      "url": "http://127.0.0.1:8009/mcp"
    }
  }
}
```

或者：

```json
{
  "mcpServers": {
    "fastapi-mcp": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://127.0.0.1:8009/mcp",
        "8080"  // 可选端口号。如果你想要 OAuth 正常工作且没有动态客户端注册功能，这个端口号是必需的。
      ]
    }
  }
}
```

配置完成之后我们就能在 MCP 客户端中使用 `fastapi-mcp` 提供的服务了。

## 身份认证

`fastapi-mcp` 支持使用现有的 FastAPI 依赖项进行身份验证和授权，也支持 OAuth 2、自定义 OAuth 元数据、Auth0 等。此处以最基础的 Authorization 为例：

```python
import uvicorn
from fastapi import FastAPI, Depends
from fastapi.security import HTTPBearer
from fastapi_mcp import FastApiMCP, AuthConfig

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

token_auth_scheme = HTTPBearer()
@app.get("/private")
async def private(token = Depends(token_auth_scheme)):
    return token.credentials

mcp = FastApiMCP(
    app,
    name="Protected MCP",
    auth_config=AuthConfig(
        dependencies=[Depends(token_auth_scheme)],
    ),
)
mcp.mount()

if __name__ == '__main__':
    config = uvicorn.Config(app, host='0.0.0.0', port=8009)
    server = uvicorn.Server(config)
    await server.serve()
```

此时我们访问 http://127.0.0.1:8009/mcp 时，会发现无法直接访问，提示需要认证： `{"detail":"Not authenticated"}`。这时在 MCP 客户端中输入认证信息，即可访问，如：

```json
{
  "mcpServers": {
    "remote-example": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:8000/mcp",
        "--header",
        "Authorization:${AUTH_HEADER}"
      ]
    },
    "env": {
      "AUTH_HEADER": "Bearer <your-token>"
    }
  }
}
```

像 Cherry Studio 这样的 MCP 客户端，则需在请求头中输入认证信息，如：

```txt
Authorization=Bearer ${AUTH_HEADER}
```

## 单独部署

正如前面提到的特性中，`fastapi-mcp` 可以和你的主应用一起运行，也可以单独部署。

```python
import uvicorn
from fastapi import FastAPI
from fastapi_mcp import FastApiMCP

app = FastAPI(title="主应用")

# 单独部署 MCP 服务
mcp_app = FastAPI(title="MCP 服务")
mcp = FastApiMCP(app)
mcp.mount(mcp_app)

@app.get("/")
async def root():
    return {"message": "Hello World"}

```

然后，你可以分别运行这两个应用程序：

```bash
uvicorn main:app --host api-host --port 8000
uvicorn main:mcp_app --host mcp-host --port 8009
```

## 基本配置

### `operation_id` 定义 MCP tool 名称

在前面的示例中，我们并没有为接口指定 MCP tool 名称，但 MCP 客户端也能够发现，比如 `root_get`、 `private_private_get` 等，这是因为 `fastapi-mcp` 中使用了 FastAPI 自动生成的 `operation_id`, 命名规则是 `{HTTP方法}_{路径层级}_{变量名}__{变量名}__{方法}` 。如果你想自定义 MCP tool 名称，可以使用 `operation_id`，如：

```python
@app.get("/private", tags=["auth"] , operation_id="private")
async def private(token = Depends(token_auth_scheme)):
    return token.credentials
```

此时，MCP 客户端中看到的 tool 名称原来是 `private_private_get`，而现在就是 `private` 了。

### 自定义公开的 tool

`fastapi-mcp` 默认会公开所有接口作为 MCP tool，如果你想要隐藏一些接口不作为 tool 暴露，可以使用 `exclude_operations` 参数，如：

```python
# 排除特定接口
mcp = FastApiMCP(
    app,
    exclude_operations=["private"]
)
```

此时，MCP 客户端中就不会看到 `private` 这个 tool 了。
也可以通过 `include_operations` 参数来指定哪些接口作为 tool 暴露，如：

```python
# 只暴露特定接口
mcp = FastApiMCP(
    app,
    include_operations=["private"]
)
```

此时，MCP 客户端中就只会看到 `private` 这个 tool 了。

除了 `exclude_operations` 和 `include_operations` 之外，你还可以使用 `exclude_tags` 和 `include_tags` 来指定哪些接口作为 tool 暴露，如：

```python
# 排除特定 tag
mcp = FastApiMCP(
    app,
    exclude_tags=["auth"] # 需先给接口添加 tags 参数
)
```

此时，MCP 客户端中就不会看到 `auth` 这个 tag 下的 tool 了。

## 总结

`fastapi-mcp` 是一个非常实用的 FastAPI 扩展，它能够将你的 API 作为 MCP 服务暴露出来，使得你可以在各种支持 MCP 的客户端中使用它们。通过简单的配置和少量的代码修改，你就可以轻松地将现有的 FastAPI 应用转换为 MCP 服务，从而提升开发效率和工作流。

希望这篇教程能够帮助你更好地理解和使用 `fastapi-mcp`！如果你有任何问题或建议，欢迎随时提出。
后面的课程我们会使用 `fastapi-mcp` 来构建一个 天气查询 MCP 服务。

更多 MCP 相关的内容，可以期待 DataWhale 的后续课程。或者参考以下资源:

- [MCP 官方文档](https://modelcontextprotocol.io/)
- [MCP 中文社区](https://mcpservers.cn/)
- [mcp.so](https://mcp.so/)