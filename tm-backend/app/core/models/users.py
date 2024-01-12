# Author Tom.Yang (https://github.com/7n8fail)

# from typing import Optional
# from pydantic import BaseModel, EmailStr

# class UserBase(BaseModel):
#     id: Optional[int] = False
#     username: str = None
#     # pip install pydantic[email] 使用email验证的时候需要增加这个库
#     email: Optional[EmailStr] = None

# class TokenModel(UserBase):
#     token: str = None

# class LoginModel(BaseModel):
#     username: str = None
#     password: str = None

# class CreateModel(UserBase):
#     password: str
from sqlalchemy import Column, Integer, VARCHAR, Sequence
from app.database import Base

class Users(Base):
    __tablename__ = 'USERS'
    __table_args__ = ({'schema': 'wow_ts'})

    id = Column(Integer,Sequence('USERS_id_seq', start=1), primary_key=True)
    username = Column(VARCHAR(200), nullable=False)
    email = Column(VARCHAR(200), nullable=False)
    password = Column(VARCHAR(500), nullable=True)