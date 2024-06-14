zip解压文件

```python
import zipfile
z = zipfile.ZipFile('data/示例压缩包.zip')
print(z.filename)
```
data/示例压缩包.zip

```python
print(z.namelist())
```
['╩╛└²╤╣╦⌡░ⁿ/', '╩╛└²╤╣╦⌡░ⁿ/FigRotate.pdf', '╩╛└²╤╣╦⌡░ⁿ/╚φ╡µ╕ⁿ╕─├▄┬δ.pdf', '╩╛└²╤╣╦⌡░ⁿ/╚φ╡µ╕ⁿ╕─├▄┬δ2.pdf']

出现中文乱码不要慌，

#### 第一种方法是去改源码。
找到zipfile这个包的绝对路径，在源码文件里直接调出搜索框搜索"cp437"，把cp437换成gbk即可。

```python
if flags & 0x800:
         # UTF-8 file names extension
        filename = filename.decode('utf-8') 
else:
     # Historical ZIP filename encoding
     # filename = filename.decode('cp437')
    filename = filename.decode('gbk')
    
    
if zinfo.flag_bits & 0x800:
    # UTF-8 filename
    fname_str = fname.decode("utf-8")
else:
    # fname_str = fname.decode("cp437")
    fname_str = fname.decode("gbk")
```
只要改掉这两处就可以正常用了

#### 第二种方法是加个补丁函数

```python
from zipfile import ZipFile
def support_gbk(zip_file: ZipFile):
    name_to_info = zip_file.NameToInfo
    # copy map first
    for name, info in name_to_info.copy().items():
        real_name = name.encode('cp437').decode('gbk')
        if real_name != name:
            info.filename = real_name
            del name_to_info[name]
            name_to_info[real_name] = info
    return zip_file
```

```python
zf = support_gbk(z)
print(zf.namelist())
```
['示例压缩包/', '示例压缩包/FigRotate.pdf', '示例压缩包/软垫更改密码.pdf', '示例压缩包/软垫更改密码2.pdf']


```python
# 压缩文件里bb文件夹下的aa.txt
zf_info = zf.getinfo('示例压缩包/FigRotate.pdf')
```

```python
# 原来文件大小
print(zf_info.file_size)
# 压缩后大小
print(zf_info.compress_size)
 
# 求压缩率，保留小数点后两位
print('压缩率为{:.2f}'.format(zf_info.file_size/zf_info.compress_size))
```
281542
279823
压缩率为1.01


```python
# 计算一下合多少KB
281542/1024
```
274.943359375

```python
# 读取其中的一个文件，得到的是一个二进制文件
a = zf.read('示例压缩包/FigRotate.pdf')
```

```python
# 把读取到的二进制文件用fitz打开
import pymupdf
doc = pymupdf.Document(stream=a, filetype='pdf')
```

```python
# 输出pdf的总页数
doc.page_count
```
9



#### 解压Zip
最为关键的功能，一句搞定。

解压缩单个指定的文件：

```python
extract(member，path=None, pwd=None)
```
含义： 
extract(指定文件(压缩包中的路径)，解压到的位置(默认为当前工作目录)，指定的密码(有些压缩包有密码))

解压缩所有的文件：
```python
extractall(path=None, pwd=None)
```
含义： 
extractall(解压到的位置, 密码)

```python
# 默认解压在当前工作目录
zf.extractall()
```

```python
# 也可以指定解压目录
zf.extractall('data')
```
