# wow-全栈

好的教程可以一路运行。
本课程由自塾团队与datawhale合作开发并在datawhale社区进行开源。我们要做一个能够一路拷贝代码运行的全栈开发教程。集成了许多优秀代码片段，在开发过程中可以随时复制。同时搭配了一个练手项目，一个用来做时间管理的项目。前端采用ts+vue3+vite架构，后端采用fastapi架构。开源项目和开源教程可以打配合。开源项目里用到的知识写入开源教程。开源教程所用到的例子来源于开源项目。互相印证。

# 网站功能

本项目不仅是一个全栈开发教程，还提供了一个完整的时间管理和学习系统：

- **时间管理** - 自塾时间管理，记录每日任务和学习时间
- **课程学习** - 13门完整教程课程，均可在线学习
- **塾值系统** - 记录学习、工作、创作等各类事务的塾值积分
- **智能体** - 集成Coze AI智能体，可进行智能对话
- **学习统计** - 全局用户学习情况统计和个人深度分析
- **系统管理** - 管理员可管理用户、配置权限、添加塾值、统计配置

# 教程使用方法

- **综合教程**：进入`tutorial`文件夹，查看以下目录：
  - [ElementUI-Plus](tutorial/Elementui-plus) - 前端UI组件教程
  - [Excel自动化](tutorial/Excel自动化) - Python Excel处理教程
  - [FastAPI入门](tutorial/FastAPI) - 后端API开发教程
  - [PDF自动化](tutorial/PDF自动化) - PDF处理教程
  - [PPT自动化](tutorial/PPT自动化) - PPT制作教程
  - [TypeScript](tutorial/TypeScript) - TypeScript教程
  - [Vue3前端开发](tutorial/Vue3) - Vue3框架教程
  - [Word自动化](tutorial/Word自动化) - Word处理教程
  - [CSS教程](tutorial/css教程导论) - CSS入门教程
  - [时间管理](tutorial/时间管理) - 时间管理方法论
  - [知识产权](tutorial/知识产权) - 知识产权基础
  - [键鼠自动化](tutorial/键鼠自动化) - 自动化脚本教程
  - [压缩包自动化](tutorial/压缩包自动化) - 文件处理教程

- **开发文档**：
  - [开发文档](tm-docs/tm开发文档.md) - 项目开发技术文档
  - [用户手册](tm-guide/tm用户手册.md) - 系统使用指南

文档都是Markdown格式，可直接阅读。代码可直接拷贝使用。

# 前后端使用方法

首先如果是首次拉取代码，用`git clone https://github.com/datawhalechina/wow-fullstack.git`，把所有代码拉取下来。如果以前有拉取过，就用`git pull`

### 确保版本正确
python需要的版本是3.10
node需要的版本是v18.18.0
npm需要的版本是10.2.5
### 安装后端依赖库
进入`tm-backend`文件夹，确保`requirement.txt`文件是在的，然后
`pip install -r requirement.txt`
### 生成数据库
如果根目录有`mydatabase.db`这个文件，其实是可以直接输入命令 `python main.py` 启动后端的，不过出于教学的目的，我们可以先把这个文件删掉，重新生成一遍。
在`alembic.ini`所在的文件夹所在的cmd窗口输入命令创建迁移脚本：
`alembic revision --autogenerate -m "my first db"`
这将在`alembic/versions` 目录下创建一个新的迁移脚本，打开脚本，确认一下upgrade函数有没有问题，是不是想要的变更？如果没问题就输入
`alembic upgrade head`
在根目录下会看到mydatabase.db这个数据库文件。这样数据库就建好了。但是数据表里还没有数据

### 填充测试数据
可以填写一些假数据，方便测试
在cmd窗口输入 `python seed.py` 即可。
这个seed.py的作用是新建一下static文件夹以及下面的profiles文件夹，然后在数据库填充管理员的账号。
运行完python seed.py可以看看mydatabase.db这个数据库文件是不是更新了，有数据了。
查看sqlite数据库可以到https://sqlitebrowser.org/ 下载一个DB Browser for SQLite这样就可以用可视化的图形界面查看sqlite数据库里的数据了。

### 测试填充数据
在cmd窗口输入 `python check_password.py` 即可。如果后端输出了
自塾
True
说明运行正确。数据库中的数据库有效。就不需要再去管seed.py。seed.py已经完成了它的历史使命。

### 启动后端
在main.py 所在的文件开启cmd窗口，输入命令 python，查看是否是python3.10 版本？如果版本不对，请自行解决python版本问题。
版本正确后，输入命令 `python main.py` 即可启动后端。

### 测试后端是否正常运行

浏览器中输入 http://127.0.0.1:8008 看是否能出现 {"Hello":"World"} ？
浏览器中输入 http://127.0.0.1:8008/docs 看是否能出现 FastAPI 各种post、get接口文档？
如果两个都没问题，就说明后端一切正常。


### 启动前端
node需要的版本是v18.18.0
npm需要的版本是10.2.5
进入 tm-frontend，输入命令 npm install
如果出现报错可尝试删除package-lock.json项目
如果运行顺利，输入 npm run dev
如果顺利，会输出浏览器链接，不要用localhost：5173。我们找一个 192.168 的贴到浏览器，就可以打开页面了。
打开前端页面后，点右上角的登录按钮，输入手机号15812345678，密码 zishu，即可进入网站。

管理员账号登录后，头像下拉菜单会显示更多管理功能：
- 个人中心
- 学习情况 - 查看所有用户的学习进度和活跃状态
- 统计分析 - 个人学习数据深度分析（学习趋势、时间分配、任务完成率等）
- 全塾用户
- 注册审核
- 系统管理
- 统计配置（管理员） - 配置不活跃阈值、通知设置


## 参与贡献

本项目由[自塾](https://zishu.co)团队负责维护,在datawhale社区进行开源。

- 如果你想参与到项目中来欢迎查看项目的 [Issue]() 查看没有被分配的任务。
- 如果你发现了一些问题，欢迎在 [Issue]() 中进行反馈。
- 如果你对本项目感兴趣想要参与进来可以通过 [Discussion]() 进行交流。

如果你对 Datawhale 很感兴趣并想要发起一个新的项目，欢迎查看 [Datawhale 贡献指南](https://github.com/datawhalechina/DOPMC#为-datawhale-做贡献)。

## 贡献者名单

需要开发的产品和对应的大写首字母有：
1.时间管理课程 Course
2.技术教程 Tutorial
3.用户使用指南 Guide
4.开发文档 Docs
5.前端代码 Frontend
6.后端代码 Backend

开发者需要根据自己的技能和兴趣选定一个开发产品作为主产品。
目前的开发人员安排：
Course：[Susan](https://github.com/Susan2048)
Tutorial：[Hoshino-wind](https://github.com/Hoshino-wind)、[KMnO4-zx](https://github.com/KMnO4-zx)
Guide：张某、[WuXiaoMing](https://xlight5.github.io)
Docs：[Kailigithub](https://github.com/Kailigithub)、[WuXiaoMing](https://xlight5.github.io)
Frontend：[lime](https://github.com/yyhhxx)、[WuXiaoMing](https://xlight5.github.io)
Backend：[Tom.Yang](https://github.com/7n8fail)、[lish](https://github.com/kevin-light)、[wu](https://github.com/AIzealotwu)、[WuXiaoMing](https://xlight5.github.io)


## 关注我们

<div align=center>
<p>扫描下方二维码关注公众号：Datawhale</p>
<img src="https://raw.githubusercontent.com/datawhalechina/pumpkin-book/master/res/qrcode.jpeg" width = "180" height = "180">
</div>

## LICENSE

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey" /></a><br />本作品采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">MIT</a>进行许可。

*注：默认使用CC 4.0协议，也可根据自身项目情况选用其他协议*
