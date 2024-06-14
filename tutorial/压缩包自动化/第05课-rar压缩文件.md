

```python
import os
def compress(input_file, output_file, root_path,
        rar_path='D:/winrar/WinRAR.exe'):
    """
    调用CMD命令压缩文件/文件夹
    Parameters
    ----------
    input_file : 需要压缩的文件/文件夹名。从哪一级目录开始，就会从哪一级开始压缩;
    output_file : 压缩文件的输出路径及其压缩的文件名;
        可以是.rar, .zip；
    root_path: input_file 所在目录;
    rar_path : WinRAR软件的安装路径,
        
    NOTE: 路径和文件名中带空格的时候一定要多加一重引号！！
    """
    cmd_command = r'%s a %s %s' % (rar_path, output_file, input_file)
    print(root_path)
    os.chdir(root_path) # 切换工作目录
    print(cmd_command)
    os.system(cmd_command)
    
    if os.system(cmd_command)==0:
        print('Successful backup to', output_file)
    else:
        print('Backup FAILED', input_file)  
```

```python
# 压缩文件夹
compress("yaya", "yaya.rar", "E:/乐理与视唱练耳/听觉训练/")
```
E:/乐理与视唱练耳/听觉训练/
D:/winrar/WinRAR.exe a yaya.rar yaya
Successful backup to yaya.rar

```python
# 直接压文件
root_path = "E:/乐理与视唱练耳/听觉训练/yaya"
lists = os.listdir(root_path)
for fp in lists:   
    input_file = '"' + fp + '"' #待压缩的文件路径及文件,多加一重引号
    output_file = 'yaya.rar' #压缩文件的输出路径及文件名,多加一重引号
    compress(input_file, output_file, root_path)
```
E:/乐理与视唱练耳/听觉训练/yaya
D:/winrar/WinRAR.exe a yaya.rar "单元二十.ppt"
Successful backup to yaya.rar
E:/乐理与视唱练耳/听觉训练/yaya
D:/winrar/WinRAR.exe a yaya.rar "单元二十一.ppt"
Successful backup to yaya.rar
E:/乐理与视唱练耳/听觉训练/yaya
D:/winrar/WinRAR.exe a yaya.rar "单元十九.ppt"
Successful backup to yaya.rar
