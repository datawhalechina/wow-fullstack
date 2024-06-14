先导包

```python
import zipfile
```

```python
# 新建压缩包，放文件进去,若压缩包已经存在，将覆盖。也可选择用a模式，追加
azip = zipfile.ZipFile('data/例子13.zip', 'w')
# 必须保证路径存在,将data件夹（及其下fan.pdf文件）添加到压缩包,压缩算法LZMA
# 第一个参数是文件在硬盘中的路径
# 第二个参数是文件在压缩包中的路径
azip.write('data/fan.pdf','示例/fan.pdf', compress_type=zipfile.ZIP_LZMA)
# 关闭资源
azip.close()
```

```python
azip = zipfile.ZipFile('data/例子14.zip', 'w')
# 其实也可以不用指定算法
# 连续添加多个到压缩包中
azip.write('data/fan.pdf','示例/fan.pdf')
azip.write('data/141.pdf','示例/141.pdf')
azip.write('data/141.pdf','示例1/141.pdf')
# 关闭资源
azip.close()
```

```python
# 往已经存在的压缩包中追加文件
azip = zipfile.ZipFile('data/例子14.zip', 'a')
azip.write('data/软垫.pdf','示例1/软垫.pdf')
# 关闭资源
azip.close()
```

上面这样也会把data/示例文件夹添加到压缩包内。

```python
import os
azip = zipfile.ZipFile('data/例子15.zip', 'w')
for current_path, subfolders, filesname in os.walk('data/示例'):
    #print(current_path, subfolders, filesname)
    #  filesname是一个列表，我们需要里面的每个文件名和当前路径组合
    for file in filesname:
        # 将当前路径与当前路径下的文件名组合，就是当前文件的绝对路径
        filepath = os.path.join(current_path, file)
        # 相对路径就是在压缩包里面的路径
        writepath = os.path.relpath(filepath, 'data')
        # 第一个参数是硬盘中的路径
        # 第二个参数是压缩包中的路径
        azip.write(filepath, writepath)
# 关闭资源
azip.close()
```

正确选用变量，元组中第一个是当前路径，而第三个是当前路径下的文件，两者一组合刚好就是文件的绝对路径。

这样就可以实现添加整个文件夹添加到压缩包了。而且是这些路径下所有的文件夹和其下的文件全部添加。也就是说，保留了原文件夹的结构层次。

再构造一个相对路径，就可以指定压缩包中的路径结构了。