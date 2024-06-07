我们首先打开一个Excel文件：

```python
import xlwings as xw
app=xw.App(visible=True,add_book=False)
abspath = os.getcwd()
cpath = os.path.join(abspath, 'data/123.xlsx')
wb=app.books.open(cpath)
sht = wb.sheets[0]
```

App(visible=True,add_book=False)
里面的参数的含义：
visible代表会不会打开excel窗口
add_book代表会不会新增一个空的工作簿

退出应用，关闭窗口
app.quit()



