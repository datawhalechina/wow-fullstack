from fastapi import APIRouter, Form, Header, Depends, HTTPException
from datetime import datetime, timedelta
import jwt

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

from passlib.context import CryptContext
# 使用的算法是Bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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


SECRET_KEY = "eac77e4e9a9a767b792779132e84ea37b1f4c31bec56714607f617a3fbdfbd53"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

users_db = {
    "mockuser":{
        "id": 1,
        "username": "mockuser",
        "email": "mock@user.com",
        "password": "$2b$12$sErK932BEaLyIisz30PubepN7w91RLwkISWbAFYgUgoIqh8goJLEW",
    }
}


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
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def check_user(username, password):
    """
    校验用户（真实的应该是跟DB进行校验，这里只是做演示）
    :param username:
    :param password:
    :return:
    """
    user = users_db.get(username)
    if not user:
        return False
    if not verify_password(password, user.get("password")):
        return False
    return user

# 使用表单格式参数需要安装模块：python-multipart
@router.post("/token", response_model=TokenModel)
async def login_for_access_token(username: str = Form(...), password: str = Form(...)):
    user = check_user(username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误"
        )
    # 过期时间
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    # 把id进行username加密，要使用str类型
    access_token = create_access_token(
        data={"sub": user.get("username")}, expires_delta=access_token_expires
    )
    user.update({"token": access_token})
    return user


def check_jwt_token(token: Optional[str] = Header("")):
    """
    验证token
    :param token:
    :return: 返回用户信息
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        username: str = payload.get("sub")
        # 通过解析得到的username,获取用户信息,并返回
        return users_db.get(username)
    except (jwt.JWTError, jwt.ExpiredSignatureError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                'code': 5000,
                'message': "Token Error",
                'data': "Token Error",
            }
        )


# 定义返回数据格式为UserBase模型格式数据
# 把校验token函数当做依赖项进行赋值给user
# 验证成功，并返回user
@router.get("/", response_model=UserBase)
async def get_user(*, user: UserBase = Depends(check_jwt_token)):
    return user


# 当不需要依赖项的返回值时，可以将依赖项添加到路径中，只做验证使用
@router.get("/pro", dependencies=[Depends(check_jwt_token)])
async def get_projects():
    return {"projects": "pro"}

