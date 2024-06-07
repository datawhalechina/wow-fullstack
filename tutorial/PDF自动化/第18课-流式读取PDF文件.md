```python
# 通过拿取post请求获取的bytes数据
# 以flask为例
from flask import request
# request获取表单文件，
# get('files')是从字典中拿取key为'files'的文件
files = request.files.get('files')  
# flask的read()方法把它读取为bytes数据
pdf_bytes = files.read()  
```

```python
import pymupdf
doc = pymupdf.Document(stream=pdf_bytes, filetype='pdf')
doc.save('data/在线接收的文档.pdf')
```

