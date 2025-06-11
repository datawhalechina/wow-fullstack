# tm-backend

## 部署方法

```bash
cd tm-backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8008 --evn-file .env
```

### uv 部署

```bash
cd tm-backend
uv venv
source venv/bin/activate
uv add -r requirements.txt
uv run fastapi dev
```

### Docker 部署

```bash
cd tm-backend
docker build -t tm-backend .
docker run -d -p 8008:8008 tm-backend 
```

### Docker Compose 部署

```bash
cd tm-backend
docker-compose up -d
```

## API接口文档

启动后在API链接后加上`/docs`，即可交互式的看到api调用方法