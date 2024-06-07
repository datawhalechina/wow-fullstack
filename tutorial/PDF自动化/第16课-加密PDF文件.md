先打开文件
```python
import pymupdf
doc = pymupdf.open("data/创新者的基因.pdf")
```

https://pymupdf.readthedocs.io/en/latest/recipes-general.html#how-to-deal-with-pdf-encryption

https://pymupdf.readthedocs.io/en/latest/vars.html#permissioncodes

```python
perm = int(
    pymupdf.PDF_PERM_ACCESSIBILITY  # 必填
    | pymupdf.PDF_PERM_PRINT  # 允许打印
    | pymupdf.PDF_PERM_COPY  # 允许复制
    | pymupdf.PDF_PERM_ANNOTATE  # 允许注释
)
owner_pass = "123456"  # 拥有者密码
user_pass = "654321"  # 用户密码
encrypt_meth = pymupdf.PDF_ENCRYPT_AES_256  # 强加密
doc.save(
    "data/创新者的基因加密.pdf",
    encryption=encrypt_meth,  # 设置加密方式
    owner_pw=owner_pass,  # 设置拥有者密码
    user_pw=user_pass,  # 设置用户密码
    permissions=perm,  # 设置权限
)
```

