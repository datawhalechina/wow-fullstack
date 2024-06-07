我们首先打开一个Excel文件：

```python
import xlwings as xw
app=xw.App(visible=True,add_book=False)
abspath = os.getcwd()
cpath = os.path.join(abspath, 'data/123.xlsx')
wb=app.books.open(cpath)
sht = wb.sheets[0]
```

这里的sht = wb.sheets[0]指的是打开一个excel文件中的第一个sheet，也就是表格下方sheet名称最左边的那个。sht = wb.sheets[1]就是打开左边数第二个sheet。这个中括号中也可以传入sheet的名称，例如sht = wb.sheets['Sheet1']、sht = wb.sheets['销售额']。

一些sheet相关的方法

```python
# 激活sheet并把它返回
sht.activate()    
```


在整个工作表中对行、列或者两者同时根据内容进行自适应。
sht.autofit(axis=None)
```python
# 要做行自适应，用 rows 或 r
sht.autofit('r')
# 要做列自适应，用 columns 或 c
sht.autofit('c')
# 同时做行和列的自适应，不需要参数。
sht.autofit()
```


清除

```python
# 重新格式化工作表，清除所有内容及格式。
sht.clear()

# 清除工作表的所有内容但是保留原有格式。
sht.clear_contents()

# 清除工作表的所有格式但是保留原有内容。
clear_formats()
```

复制工作表
copy(before=None, after=None, name=None)
将一个工作表复制到当前工作簿或新工作簿中。默认情况下，它将在当前工作簿中所有现有工作表之后放置复制的工作表。返回复制后的工作表。

before：工作表对象
你想要将新工作表放置在其前面的工作表对象

after：工作表对象
你想要将新工作表放置在哪个现有工作表之后，默认情况下，它会放置在所有现有工作表之后。

```python
first_book = xw.Book()
second_book = xw.Book()
# Copy to second Book requires to use before or after
first_book.sheets[0].copy(after=second_book.sheets[0])
```

删除工作表。

sht.delete()

保存成pdf
to_pdf(path=None)
PDF文件的路径，默认为工作簿所在目录中的工作表名称。对于未保存的工作簿，它默认保存在当前工作目录中。
sht.to_pdf()

一些sheets相关的方法
shts = wb.sheets


返回活动的工作表(Sheet)。
shts.active


创建一个新的工作表并设为活动工作表。
add(name=None, before=None, after=None)

namestr, default None
新工作表的名字，如果没有就使用Excel给的缺省名字。

before:Sheet, default None
在新增工作表前面的工作表对象。

after:Sheet, default None
在新增工作表后面的工作表对象。
