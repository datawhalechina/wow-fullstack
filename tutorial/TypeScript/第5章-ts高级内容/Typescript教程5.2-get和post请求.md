这节课的内容没办法在网页上运行，必须在本地电脑安装环境依赖才能做。

首先确保你已经安装了 Node.js(推荐使用最新的稳定版)。然后在命令行中运行以下命令来全局安装 Vite:

`npm install -g create-vite`

使用 Vite 创建一个新的 Vue 3 + TypeScript 项目。运行以下命令并替换 vue3ts 为你的项目的名称：
`create-vite vue3ts --template vue-ts`

安装依赖：
`npm install`

启动开发服务器：
`npm run dev`

启动后可以打开浏览器输入`http://localhost:5173/`

能看到页面即可

然后打开文件`src\components\HelloWorld.vue`


## 单文件组件​
在大多数启用了构建工具的 Vue 项目中，我们可以使用一种类似 HTML 格式的文件来书写 Vue 组件，它被称为单文件组件 (也被称为 *.vue 文件，英文 Single-File Components，缩写为 SFC)。顾名思义，Vue 的单文件组件会将一个组件的逻辑 (JavaScript)，模板 (HTML) 和样式 (CSS) 封装在同一个文件里。
HelloWorld.vue就是一个单文件组件。

我们观察里面的代码：
```html
<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>
```

到这一步说明本地环境搭建成功，接下来我们来引入网络请求库axios。

当在TS中使用axios库进行网络请求时，需要如下操作：

## 1. 安装Axios
`npm install axios`

## 2. 导入Axios模块
`import axios from 'axios';`

## 3. 发起网络请求
使用Axios提供的方法（get、post等）去发送网络请求
```html
<script setup lang='ts'>
// 发起 GET 请求
axios.get('https://api.example.com/data')
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
 
// 发起 POST 请求
axios.post('https://api.example.com/data', { name: 'John', age: 25 })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
</script>
```

用FastAPI起一个后端。

FastAPI最好用python3.8以上。版本太低了不支持。我们这里采用的是python3.10.5

```python
import sys
print(sys.version)
```

输出：3.10.5 (tags/v3.10.5:f377153, Jun  6 2022, 16:14:13) [MSC v.1929 64 bit (AMD64)]

然后安装fastapi
直接 `pip install fastapi -i https://pypi.tuna.tsinghua.edu.cn/simple`

安装fastapi会自动安装uvicorn，所以可以直接建立一个 `test.py` 文件，文件里贴上下面的代码即可。

后端测试代码：
```python
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    # 允许跨域的源列表，例如 ["http://www.example.org"] 等等，["*"] 表示允许任何源
    allow_origins=["*"],
    # 跨域请求是否支持 cookie，默认是 False，如果为 True，allow_origins 必须为具体的源，不可以是 ["*"]
    allow_credentials=False,
    # 允许跨域请求的 HTTP 方法列表，默认是 ["GET"]
    allow_methods=["*"],
    # 允许跨域请求的 HTTP 请求头列表，默认是 []，可以使用 ["*"] 表示允许所有的请求头
    # 当然 Accept、Accept-Language、Content-Language 以及 Content-Type 总之被允许的
    allow_headers=["*"],
    # 可以被浏览器访问的响应头, 默认是 []，一般很少指定
    expose_headers=["*"]
    # 设定浏览器缓存 CORS 响应的最长时间，单位是秒。默认为 600，一般也很少指定
    # max_age=1000
)
@app.get("/")
async def root():
    return {"message": "Hello World"}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8009)

```

在`test.py`所在的目录下打开终端，输入 python test.py，就可以在终端看到以下内容：
INFO:     Started server process [16524]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8009 (Press CTRL+C to quit)

虽然启动后下面会出现 Uvicorn running on http://0.0.0.0:8009 。但是如果你直接点击这个链接，会发现打不开的。原因是0.0.0.0不是一个ip地址。它的含义是允许任何ip访问这个fastapi后端。因此你需要用一个有效的ip地址去访问它。如果是本机，那就打开浏览器访问 http://127.0.0.1:8009 。或者http://localhost:8009 。


如果是局域网的其它电脑，你需要获知本台部署了fastapi的电脑的ip地址，这通常在cmd窗口输入 ipconfig可以查到，一般是192.168 开头的，192.168代表你们是在同一个局域网内。

你将在浏览器页面看到如下的 JSON 
```json
{"message": "Hello World"}
```
交互式 API 文档  
在浏览器中输入 http://127.0.0.1:8009/docs。

你将会看到自动生成的交互式 API 文档（由 Swagger UI 提供）






把原来的HelloWorld.vue内容清空，换成下面这些代码。
```html
<template>
    <button @click="get_query()">发起GET请求</button>
</template>

<script setup lang='ts'>
import axios from 'axios'
interface TestData {
  message: string;
}
const get_query = ()=>{
  // 发起GET请求
  axios.get<TestData>('http://127.0.0.1:8009/')
  .then(response => {
    const testData: TestData = response.data;
    console.log(testData.message);
  })
  .catch(error => {
    console.error(error);
  });
}
</script>
```
按F12打开浏览器的控制台。
点击按钮后控制台会看到Hello World



post请求后端测试代码：
```python
import uvicorn
from fastapi import Body, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Annotated
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    # 允许跨域的源列表，例如 ["http://www.example.org"] 等等，["*"] 表示允许任何源
    allow_origins=["*"],
    # 跨域请求是否支持 cookie，默认是 False，如果为 True，allow_origins 必须为具体的源，不可以是 ["*"]
    allow_credentials=False,
    # 允许跨域请求的 HTTP 方法列表，默认是 ["GET"]
    allow_methods=["*"],
    # 允许跨域请求的 HTTP 请求头列表，默认是 []，可以使用 ["*"] 表示允许所有的请求头
    # 当然 Accept、Accept-Language、Content-Language 以及 Content-Type 总之被允许的
    allow_headers=["*"],
    # 可以被浏览器访问的响应头, 默认是 []，一般很少指定
    expose_headers=["*"]
    # 设定浏览器缓存 CORS 响应的最长时间，单位是秒。默认为 600，一般也很少指定
    # max_age=1000
)
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/items/")
async def read_item(item_id: Annotated[int, Body()], name: Annotated[str, Body()]):
    return {"item_id": item_id, "name": name}

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8009)

```


把原来的HelloWorld.vue内容清空，换成下面这些代码。
```vue
<template>
    <button @click="get_query()">发起POST请求</button>
</template>

<script setup lang='ts'>
import axios from 'axios'
// 发起POST请求
interface TestData {
  item_id:string;
  name: string;
}
const get_query = ()=>{
  axios.post<TestData>('http://127.0.0.1:8009/items/',{item_id: "5", name: "hello"})
  .then(response => {
    const testData: TestData = response.data;
    console.log(testData.item_id);
    console.log(testData.name);
  })
  .catch(error => {
    console.error(error);
  });
}
</script>
```
按F12打开浏览器的控制台。
点击按钮后控制台会看到
5
hello

