Python 本身不支持 rar 文件的解压，需要先安装相关依赖才可使用.

RAR是个收费软件。不是开源的。

第一步：下载安装 unrar library，网址：http://www.rarlab.com/rar/UnRARDLL.exe 按照默认安装路径安装

第二步：将安装后文件夹中的 X64 文件夹加入环境变量（默认路径为 C:\Program Files (x86)\UnrarDLL\x64）其实也不用安装在C盘，安装在其他路径也可以。只要后续添加环境变量地地址是对的就行。

第三步：系统变量中新建变量，变量名输入 UNRAR_LIB_PATH，变量值为 C:\Program Files (x86)\UnrarDLL\x64\UnRAR64.dll（32位系统下的变量值为C:\Program Files (x86)\UnrarDLL\UnRAR.dll）。注意变量名只能是这个，必须一模一样

第四步：安装 unrar 模块：pip install unrar

然后就可以愉快地使用了。

```python
from unrar import rarfile
import zipfile
import os
```

```python
def un_pack(filename):    # filename是文件的绝对路径
    #判断是否存在同名文件夹，若不存在则创建同名文件夹：
    filename = os.path.abspath(filename)
    if os.path.isdir(os.path.splitext(filename)[0]):
        pass
    else:
        os.mkdir(os.path.splitext(filename)[0])
    if filename[-3:]=="rar":
        p=rarfile.RarFile(filename)
    if filename[-3:]=="zip":
        p=zipfile.ZipFile(filename)
    p.extractall(os.path.splitext(filename)[0])
    list_dir = -.namelist()
    return list_dir
names = un_pack('data/yaya.rar')
print(names)
```
['yaya\\单元二十.ppt', 'yaya\\单元二十一.ppt', 'yaya\\单元十九.ppt', 'yaya']