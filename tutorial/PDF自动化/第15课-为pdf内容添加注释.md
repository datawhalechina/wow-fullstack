先打开文件
```python
import pymupdf
doc = pymupdf.open("data/创新者的基因.pdf")
```

https://pymupdf.readthedocs.io/en/latest/tutorial.html

```python
page = doc[2]
word1 = '创新'
word2 = '特征'
word3 = '其中'
```

```python
# 在页面指定位置插入文本注释
# 指定横坐标和纵坐标
page.add_text_annot((200,200),'我是注释')
```

'Text' annotation on page 2 of data/创新者的基因.pdf

```python
# 设置文本高亮
for txt in page.search_for(word1):
    page.add_highlight_annot(txt)
```

```python
# 设置下划线
for txt in page.search_for(word2):
    page.add_underline_annot(txt)
```

```python
# 设置删除线
for txt in page.search_for(word3):
    page.add_strikeout_annot(txt)
```


```python
doc.save('data/创新者的基因注释版.pdf')
```
