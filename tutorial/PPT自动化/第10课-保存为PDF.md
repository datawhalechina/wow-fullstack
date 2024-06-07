导入相关的库

```python
import os
from win32com.client import Dispatch
```

转格式函数
```python
def ppt2pdf(filename):
    '''
    ppt 和 pptx 文件转换
    '''
    name = os.path.basename(filename).split('.')[0] + '.pdf'
    export_folder = os.path.dirname(filename)
    exportfile = os.path.join(export_folder, name)
    absfilename = os.path.abspath(filename)
    absexportfile = os.path.abspath(exportfile)
    p = Dispatch("PowerPoint.Application")
    ppt = p.Presentations.Open(absfilename, False, False, False)
    ppt.ExportAsFixedFormat(absexportfile, 2, PrintRange=None)
    print('成功保存PDF文件：', name)
    p.Quit()
```

运行函数
```python
ppt2pdf('data/ppt_example.pptx')
```