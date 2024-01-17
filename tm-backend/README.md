## 部署方法

```
cd tm-backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8008
```

## API接口文档
启动后在API链接后加上`/docs`，即可交互式的看到api调用方法