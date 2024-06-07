```python
import pymupdf
from itertools import product
import os
from PIL import Image
# doc = pymupdf.open("data/水印5.pdf")
```

参考了以下的博客  
https://blog.csdn.net/qq_20144897/article/details/127948224  
先把PDF转换为图片后再进行水印去除

```python
# 将PDF转换为PNG图片文件
def remove_pdf(pdf_file, out_file):
    if not os.path.exists(out_file):
        os.mkdir(out_file)
    page_num = 0
    pdf = pymupdf.open(pdf_file)
    for page in pdf:
        pixmap = page.get_pixmap()
        for pos in product(range(pixmap.width), range(pixmap.height)):
            rgb = pixmap.pixel(pos[0], pos[1])
            if(sum(rgb) > 620):
                pixmap.set_pixel(pos[0], pos[1], (255, 255, 255))
        pixmap.pil_save(os.path.join(out_file, '%d.png'%page_num))
        page_num = page_num + 1
```

```python
# 将图片文件重新合并为PDF文件
def pic2pdf(pic_dir):
    pdf = pymupdf.open()
    img_files = sorted(os.listdir(pic_dir),key=lambda x:int(str(x).split('.')[0]))
    for img in img_files:
        imgdoc = pymupdf.open(pic_dir + '/' + img)  
        pdfbytes = imgdoc.convert_to_pdf()
        imgpdf = pymupdf.open("pdf", pdfbytes)
        pdf.insert_pdf(imgpdf)
    pdf.save("data/去水印5.pdf")
    pdf.close()
```

```python
pdf_file = 'data/水印5.pdf'
out_file = 'data/tmp'
remove_pdf(pdf_file, out_file)
pic2pdf(out_file)
```

去水印之后，原本的向量格式的pdf变成了位图格式的pdf，清晰度下降不少。