先打开文件
```python
import pymupdf
doc = pymupdf.open("data/技术的本质.epub")
```

https://pymupdf.readthedocs.io/en/latest/tutorial.html


用到的函数：
```python
convert_to_pdf(from_page=-1, to_page=-1, rotate=0)
```

参数：

from_page (整数) – 要复制的第一页 (0为起点)， 默认是文档第一页。

to_page (整数) – 要复制的最后一页 (0为起点)，默认是文档的尾页。

rotate (整数) – 旋转角度，应当为90的倍数，默认是0 (没有旋转)。

```python
pdfbytes = doc.convert_to_pdf()
pdf = pymupdf.open("pdf", pdfbytes)
pdf.save('data/技术的本质.pdf')
```