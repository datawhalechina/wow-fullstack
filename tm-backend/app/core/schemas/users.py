from typing import Optional
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    id: Optional[int] = False
    username: str = None
    # pip install pydantic[email] 使用email验证的时候需要增加这个库
    email: Optional[EmailStr] = None
    role: Optional[str] = 'user'

    class Config:
        from_attributes = True

class TokenModel(UserBase):
    atoken: str = None
    rtoken: str = None

class LoginModel(BaseModel):
    phone: str = None
    password: str = None

    class Config:
        from_attributes = True

class CreateModel(UserBase):
    password: str
