有两个库可以操作word，一个是python-docx，一个是win32com。我们接下来会对比着这两个库来进行学习。

这两个库的优缺点恰好互补。所以我们可以按需选择用哪个库。

python-docx的优点就是win32com的缺点：
- 轻量级，速度快
- 无需启动电脑本身的word程序
- python-docx可以直接打开网络接收的流文件

python-docx的缺点就是win32com的优点：
- 功能不全
- 样式失真
- 所见不能所得

安装方法：
- pip install python-docx
- pip install pywin32

python-docx 只支持docx格式的文档。win32com对doc和docx都支持


### 体验python-docx
python-docx可以跑一下官方给的例子，先感受一下。  
https://python-docx.readthedocs.io/en/latest/

```python
from docx import Document
from docx.shared import Inches

document = Document()

document.add_heading('Document Title', 0)

p = document.add_paragraph('A plain paragraph having some ')
p.add_run('bold').bold = True
p.add_run(' and some ')
p.add_run('italic.').italic = True

document.add_heading('Heading, level 1', level=1)
document.add_paragraph('Intense quote', style='Intense Quote')

document.add_paragraph(
    'first item in unordered list', style='List Bullet'
)
document.add_paragraph(
    'first item in ordered list', style='List Number'
)

document.add_picture('data/monty-truth.png', width=Inches(1.25))

records = (
    (3, '101', 'Spam'),
    (7, '422', 'Eggs'),
    (4, '631', 'Spam, spam, eggs, and spam')
)

table = document.add_table(rows=1, cols=3)
hdr_cells = table.rows[0].cells
hdr_cells[0].text = 'Qty'
hdr_cells[1].text = 'Id'
hdr_cells[2].text = 'Desc'
for qty, id, desc in records:
    row_cells = table.add_row().cells
    row_cells[0].text = str(qty)
    row_cells[1].text = id
    row_cells[2].text = desc

document.add_page_break()

document.save('data/demo.docx')
```

### 体验win32com
虽然安装的时候是安装pywin32，但是我们导入的时候是另一个名称，就是win32com模块，win32com下面还有client模块，client模块有我们会具体用到的模块。例如：
```python
from win32com.client import Dispatch
import os

# 启动word程序
# WPS也没问题
word = Dispatch('Word.Application') 

# 默认Visible是False，就是在后台运行
# 如果想要看到word界面，可以设为True
word.Visible = True

# Documents.Open打开文档，
# 注意必须是绝对路径
# 不然会到C:\\Users\\Administrator\\Documents\\
# 先获取当前绝对路径
abspath = os.getcwd()
# 再拼接路径
cpath = os.path.join(abspath, 'data/demo.docx')
doc=word.Documents.Open(cpath)
```

这样，就打开了一个word窗口。打开的这个word就是刚才用python-docx创建的。

有了doc句柄，就可以用来对打开的这个word文件做各种操作了

例如，输出各个段落的样式：
```python
for p in doc.paragraphs:
    print(p.style.name)
```
Title
Normal
Heading 1
Intense Quote
List Bullet
List Number
Normal
Normal

再如，查看有几个表格：
```python
# 给出有几个表格
len(doc.tables)
```
1

最后，保存word文件，关闭文档，关闭窗口。
```python
# 保存文件
doc.Save()
# 关闭文件
doc.Close()
# 退出word程序
word.Quit()
```


