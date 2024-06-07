我们首先打开一个Excel文件：

```python
import xlwings as xw
app=xw.App(visible=True,add_book=False)
abspath = os.getcwd()
cpath = os.path.join(abspath, 'data/123.xlsx')
wb=app.books.open(cpath)
sht = wb.sheets[0]
```

打开带有密码的excel：
wb=app.books.open(cpath,password=None)

保存excel文件
wb.save(path=None, password=None)


把excel保存成pdf
wb.to_pdf(path=None)

关闭excel
wb.close()
