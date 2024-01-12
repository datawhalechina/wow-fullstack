# Author Tom.Yang (https://github.com/7n8fail)

from datetime import datetime, timedelta
import jwt
from typing import Optional
from ..dependencies import verify_password
from ..config import settings
from sqlalchemy.orm import Session
from app.core.models import users

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """

    :param data: 需要进行JWT令牌加密的数据（解密的时候会用到）
    :param expires_delta: 令牌有效期
    :return: token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    # 添加失效时间
    to_encode.update({"exp": expire})
    # SECRET_KEY：密钥
    # ALGORITHM：JWT令牌签名算法
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def check_user(db: Session, username, password):
    """
    校验用户（真实的应该是跟DB进行校验，这里只是做演示）
    :param username:
    :param password:
    :return:
    """
    # user = users_db.get(username)
    user = db.query(users.Users).filter(users.Users.username== username).first()
    if not user:
        return False
    # if not verify_password(password, user.get("password")):
    if not verify_password(password, user.password):
        return False
    return user