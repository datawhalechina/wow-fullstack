# Author Tom.Yang (https://github.com/7n8fail)

from . import config
from .database import users_db
from functools import lru_cache
from typing import Optional
from fastapi import Header, HTTPException, status
import jwt
from pydantic import ValidationError

from passlib.context import CryptContext
# 使用的算法是Bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@lru_cache
def get_settings():
    return config.Settings()

settings = get_settings()

def get_password_hash(password):
    """
    哈希来自用户的密码
    :param password: 原密码
    :return: 哈希后的密码
    """
    return pwd_context.hash(password)
# 哈希后的密码
# $2b$12$sErK932BEaLyIisz30PubepN7w91RLwkISWbAFYgUgoIqh8goJLEW

def verify_password(plain_password, hashed_password):
    """
    校验接收的密码是否与存储的哈希值匹配
    :param plain_password: 原密码
    :param hashed_password: 哈希后的密码
    :return: 返回值为bool类型，校验成功返回True,反之False
    """
    return pwd_context.verify(plain_password, hashed_password)

def check_jwt_token(token: Optional[str] = Header("")):
    """
    验证token
    :param token:
    :return: 返回用户信息
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=settings.ALGORITHM)
        username: str = payload.get("sub")
        # 通过解析得到的username,获取用户信息,并返回
        return users_db.get(username)
    except (jwt.PyJWTError, jwt.ExpiredSignatureError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                'code': 5000,
                'message': "Token Error",
                'data': "Token Error",
            }
        )