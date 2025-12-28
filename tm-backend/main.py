import uvicorn
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.wsgi import WSGIMiddleware

from app.routers import users
from app.routers import inno

from app.config import settings
import os

app = FastAPI()
app.mount("/api/static", StaticFiles(directory="static"), name="static")

# 安全修复: 根据环境变量严格配置CORS
# 生产环境应该设置具体的源，例如: ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com
# 禁止在生产环境使用通配符 "*"
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
if allowed_origins_env:
    allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",")]
    # 安全检查: 确保不是通配符
    if "*" in allowed_origins:
        raise ValueError("安全警告: 生产环境禁止使用通配符 '*' 作为CORS来源")
else:
    # 开发环境默认允许的源
    allowed_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]

# 安全检查: 如果是生产环境（通过环境变量判断），必须设置具体的源
is_production = os.getenv("ENVIRONMENT", "").lower() == "production"
if is_production and (not allowed_origins or allowed_origins == ["*"]):
    raise ValueError("安全警告: 生产环境必须通过 ALLOWED_ORIGINS 环境变量设置具体的CORS来源")

app.add_middleware(
    CORSMiddleware,
    # 允许跨域的源列表，生产环境必须是具体的源
    allow_origins=allowed_origins,
    # 跨域请求是否支持 cookie
    # 注意: 如果为 True，allow_origins 不能是通配符
    allow_credentials=True,
    # 允许跨域请求的 HTTP 方法列表
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    # 允许跨域请求的 HTTP 请求头列表
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin", "Cache-Control", "X-Requested-With"],
    # 可以被浏览器访问的响应头
    expose_headers=["Content-Length", "Content-Type"],
    # 浏览器缓存 CORS 响应的最长时间
    max_age=600
)

app.include_router(users.router)
app.include_router(inno.inno)

@app.get("/")
def read_root():
    return {"Hello": "World"}


if __name__ == '__main__':
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)