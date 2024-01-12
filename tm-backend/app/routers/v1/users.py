# Author Tom.Yang (https://github.com/7n8fail)

from fastapi import APIRouter, Form, Depends, HTTPException, status
from datetime import timedelta
from app.dependencies import check_jwt_token, get_db
from app.config import settings
from app.core.schemas.users import UserBase, TokenModel
from app.controllers.users import check_user, create_access_token
from sqlalchemy.orm import Session
from app.core import models
from app.database import engine

models.users.Base.metadata.create_all(bind=engine)

router = APIRouter(
    prefix="/v1/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)




# 使用表单格式参数需要安装模块：python-multipart
@router.post("/token", response_model=TokenModel)
async def login_for_access_token(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = check_user(db, username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误"
        )
    # 过期时间
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # 把id进行username加密，要使用str类型
    access_token = create_access_token(
        # data={"sub": user.get("username")}, expires_delta=access_token_expires
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    # user.update({"token": access_token})
    user.token = access_token
    return user


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