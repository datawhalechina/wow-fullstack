# Author Tom.Yang (https://github.com/7n8fail)

from typing import Optional
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    id: Optional[int] = False
    username: str = None
    # pip install pydantic[email] 使用email验证的时候需要增加这个库
    email: Optional[EmailStr] = None

class TokenModel(UserBase):
    token: str = None

class LoginModel(BaseModel):
    username: str = None
    password: str = None

class CreateModel(UserBase):
    password: str