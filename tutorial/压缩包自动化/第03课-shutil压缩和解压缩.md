shuitl模块有个函数，可以方便地添加整个整个文件夹到压缩包。

```python
import shutil
# 第一个参数是归档文件名称，不要写后缀
# 第二个参数是指定的格式，
# 支持“zip”, “tar”, “bztar”，“gztar”，“xztar”
# 第三个参数是要压缩文件/文件夹的路径
# 第四个参数可以为空，空着就意味着第三个参数下的所有
# 这段代码的意思是在data下面找到示例文件夹，把这个文件夹打包，命名为例子7.zip
# 第四个参数的内容必须能够在第三个参数的路径下被找到
shutil.make_archive('data/例子7', 'zip', 'data','示例')
# shutil.get_archive_formats() 可以查看支持的格式
```

```python
# 这段代码的意思是把data/示例下面的所有内容打包，命名为例子7.zip
# 这样的打包剥离了data/示例这个文件夹，只有原始文件夹下的文件和文件夹。
shutil.make_archive('data/例子7', 'zip', 'data/示例')
```

当然也可以解压缩，可指定第二个参数为解压目录，只写第一个参数默认解压到当前工作目录。

```python
shutil.unpack_archive('data/jsMind-master.zip','data')
# shutil.get_unpack_formats() 可以查看支持的格式
```

```python
shutil.get_unpack_formats()
```
[('bztar', ['.tar.bz2', '.tbz2'], "bzip2'ed tar-file"),
 ('gztar', ['.tar.gz', '.tgz'], "gzip'ed tar-file"),
 ('tar', ['.tar'], 'uncompressed tar file'),
 ('xztar', ['.tar.xz', '.txz'], "xz'ed tar-file"),
 ('zip', ['.zip'], 'ZIP file')]

```python
shutil.get_archive_formats()
```
[('bztar', "bzip2'ed tar-file"),
 ('gztar', "gzip'ed tar-file"),
 ('tar', 'uncompressed tar file'),
 ('xztar', "xz'ed tar-file"),
 ('zip', 'ZIP file')]
