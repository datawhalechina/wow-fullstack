先打开文件
```python
import pymupdf
doc = pymupdf.open("data/创新者的基因加密.pdf")
```

```python
# 查看是否已经加密
doc.is_encrypted
```
True

```python
doc.permissions & pymupdf.PDF_PERM_PRINT
```
0

```python
# 查看文档权限
doc.permissions & pymupdf.PDF_PERM_MODIFY
```
0

```python
# 获取第一页
page = doc[0]
```

ValueError: document closed or encrypted


```python
# 输入密码
# 返回值的含义
# 1代表这个pdf根本没有加密
# 2代表这个密码是用户密码
# 4代表这个密码是拥有者密码
# 6代表这个文档的用户密码和拥有者密码相同
doc.authenticate("654321")
```
2

```python
# 再次查看是否已经加密
# 输入密码后就表示解密了
doc.is_encrypted
```
False

接下来可以对文档进行操作，包括换一个密码

```python
# 获取第一页
page = doc[0]
```

```python
# 输出某个页面的所有文字
text = page.get_text()
text
```

```python
# 输入用户密码和拥有者密码均可以
# 对文档解密或更改密码
doc.authenticate("654321")
```

https://pymupdf.readthedocs.io/en/latest/vars.html#permissioncodes

去掉密码
```python
encrypt_meth = pymupdf.PDF_ENCRYPT_NONE  # 不加密
doc.save(
    "data/创新者的基因去除密码.pdf",
    encryption=encrypt_meth,  # 设置加密方式
)
```

换个密码
```python
perm = int(
    pymupdf.PDF_PERM_ACCESSIBILITY  # 必填
    | pymupdf.PDF_PERM_PRINT  # 允许打印
    | pymupdf.PDF_PERM_COPY  # 允许复制
    | pymupdf.PDF_PERM_ANNOTATE  # 允许注释
)
owner_pass = "abcd"  # 拥有者密码
user_pass = "dcba"  # 用户密码
encrypt_meth = pymupdf.PDF_ENCRYPT_AES_256  # 强加密
doc.save(
    "data/创新者的基因更改密码.pdf",
    encryption=encrypt_meth,  # 设置加密方式
    owner_pw=owner_pass,  # 设置拥有者密码
    user_pw=user_pass,  # 设置用户密码
    permissions=perm,  # 设置权限
)
```