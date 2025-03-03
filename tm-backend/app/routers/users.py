from fastapi import APIRouter, Form, Depends, HTTPException, status, Request, UploadFile, File
from datetime import datetime, timedelta
from app.dependencies import check_jwt_token, get_db, verify_password, get_password_hash
from app.config import settings
from jose import jwt
import requests
import os
import json
import glob
import ast
from typing import Optional
from app.core.schemas.users import UserBase, TokenModel
from sqlalchemy.orm import Session
from sqlalchemy import func, desc 
from app.core.models.users import Base, Users, Register
from app.database import engine

Base.metadata.create_all(bind=engine)

router = APIRouter(
    prefix="/api/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """

    :param data: 需要进行JWT令牌加密的数据（解密的时候会用到）
    :param expires_delta: 令牌有效期
    :return: token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=15)
    # 添加失效时间
    to_encode.update({"exp": expire})
    # SECRET_KEY：密钥
    # ALGORITHM：JWT令牌签名算法
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def check_user(db: Session, phone, password):
    """
    :param username:
    :param password:
    :return:
    """
    # user = users_db.get(username)
    user = db.query(Users).filter(Users.phone== phone).first()
    if not user:
        return '用户不存在'
    # if not verify_password(password, user.get("password")):
    if not verify_password(password, user.password):
        return '密码错误'
    return user
def send_reset_password_email(email: str, reset_token: str):
    """
    发送密码重置邮件
    :param email: 用户邮箱
    :param reset_token: 重置密码的token
    """
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    import smtplib
    from app.core.config import settings

    # 创建邮件内容
    msg = MIMEMultipart()
    msg['From'] = settings.SMTP_USER
    msg['To'] = email
    msg['Subject'] = '密码重置'

    # 邮件正文
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
    body = f"""
    您好,

    您请求重置密码。请点击以下链接重置密码:

    {reset_link}

    此链接24小时内有效。如果您没有请求重置密码,请忽略此邮件。

    祝好,
    系统管理员
    """
    msg.attach(MIMEText(body, 'plain'))

    # 发送邮件
    try:
        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"发送邮件失败: {str(e)}"
        )

def generate_password_reset_token(user_id: int) -> str:
    """
    生成密码重置token
    """
    expires = datetime.now() + timedelta(hours=24)
    to_encode = {"exp": expires, "user_id": user_id}
    return create_access_token(data=to_encode)

@router.post("/forgot-password")
def forgot_password(phone: str, db: Session = Depends(get_db)):
    """
    忘记密码-发送重置邮件
    """
    user = db.query(Users).filter(Users.phone == phone).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="用户不存在"
        )
    
    if not user.email:
        raise HTTPException(
            status_code=400,
            detail="该用户未绑定邮箱"
        )
        
    reset_token = generate_password_reset_token(user.id)
    send_reset_password_email(user.email, reset_token)
    
    return {"message": "密码重置邮件已发送,请查收邮箱"}

@router.post("/reset-password")
def reset_password(
    token: str,
    new_password: str,
    db: Session = Depends(get_db)
):
    """
    重置密码
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(
                status_code=400,
                detail="无效的重置链接"
            )
    except jwt.JWTError:
        raise HTTPException(
            status_code=400,
            detail="无效的重置链接"
        )
        
    user = db.query(Users).filter(Users.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="用户不存在"
        )
        
    hashed_password = get_password_hash(new_password)
    user.password = hashed_password
    db.commit()
    print("密码重置成功")   
    
    return {"message": "密码重置成功"}

# import httpx 
# async def login_flask(id,name,phone,role):
#     url = 'http://127.0.0.1:8008/v1/auth/login_api'
#     headers = {"content-type": "application/x-www-form-urlencoded"} 
#     data = {"id": id, "name": name, "phone":phone, "role":role}
#     async with httpx.AsyncClient() as client:  
#         res = await client.post(url, data=data, headers=headers)  
#     return res.text



# 使用表单格式参数需要安装模块：python-multipart
@router.post("/token", response_model=TokenModel)
async def login_for_access_token(phone: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = check_user(db, phone, password)
    if  isinstance(user, str):
        user.error=user
        user.id=0
        return user
    # access过期时间
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # refresh过期时间
    refresh_token_expires = timedelta(minutes=10080)
    # 把id进行username加密，要使用str类型
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    refresh_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=refresh_token_expires
    )
    user.atoken = access_token
    user.rtoken = refresh_token
    #rtn = await login_flask(user.id,user.username,user.phone,user.role)
    #print(rtn)
    return user

@router.get("/refresh", response_model=TokenModel)
async def get_refresh_token(*, user: TokenModel = Depends(check_jwt_token)):
    # access过期时间
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # refresh过期时间
    refresh_token_expires = timedelta(minutes=10080)
    # 把id进行username加密，要使用str类型
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    refresh_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=refresh_token_expires
    )
    user.atoken = access_token
    user.rtoken = refresh_token
    return user


@router.post("/register")
async def register(request: Request, name: str = Form(...), password: str = Form(...), email: str = Form(...), phone: str = Form(...), db: Session = Depends(get_db)):
    print(name, email)
    form_data = await request.form()
    print(form_data.get("phone"))
    new_register = Register(
        name=name,
        password=get_password_hash(password),
        email=email,
        phone=phone,
        register_time=datetime.now()
    )
    db.add(new_register)
    db.commit()
    return {"code": 200, "message":"OK"}

@router.get("/fetch_registrations", dependencies=[Depends(check_jwt_token)])
async def fetch_registrations(db: Session = Depends(get_db)):
    result_proxy = db.query(Register).all()
    all_q_registrations = [{"id":row.id, "name":row.name, "phone":row.phone, "email":row.email, "notes":row.notes, "register_time":row.register_time} for row in result_proxy]
    return all_q_registrations


@router.post("/handle_registrations")
async def handle_registrations(action: str = Form(...), id: int = Form(...), db: Session = Depends(get_db)):
    registeritem = db.query(Register).filter_by(id=id).first()
    if action=="delete":
        db.delete(registeritem)
        db.commit()
    elif action=="activate":
        new_user = Users(
            username=registeritem.name,
            password=registeritem.password,
            email=registeritem.email,
            phone=registeritem.phone,
            register_time=registeritem.register_time
        )
        db.add(new_user)
        db.delete(registeritem)
        db.commit()
    return {"code": 200, "message":"OK"}

@router.post("/handle_changepass")
async def handle_changepass(newpass: str = Form(...), name: str = Form(...), user: TokenModel = Depends(check_jwt_token), db: Session = Depends(get_db)):
    useritem = db.query(Users).filter_by(id=user.id).first()
    useritem.password = get_password_hash(newpass)
    db.commit()
    return {"code": 200, "message":"OK"}

@router.post("/reset_pass")
async def reset_pass(phone: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    useritem = db.query(Users).filter_by(phone=phone).first()
    reset_list = []
    times = 0
    found = 0
    if not os.path.exists("static/am/"):
        os.makedirs("static/am/")
    if os.path.exists("static/am/reset_pass.txt"):
        with open("static/am/reset_pass.txt", "r", encoding="utf-8") as f:
            reset_list=f.readlines()
    reset_list = [ast.literal_eval(x) for x in reset_list]
    for item in reset_list:
        if item["id"] == useritem.id:
            item["times"] = item["times"] + 1
            times = item["times"]
            found = 1
            item["update_time"] = datetime.now().strftime('%Y-%m-%d')
    if found == 0:
        tmp = {}
        tmp["id"] = useritem.id
        tmp["username"] = useritem.username
        tmp["phone"] = useritem.phone
        tmp["times"] = 1
        times = 1
        tmp["create_time"] = datetime.now().strftime('%Y-%m-%d')
        tmp["update_time"] = datetime.now().strftime('%Y-%m-%d')
        reset_list.append(tmp)
    with open("static/am/reset_pass.txt", "w", encoding="utf-8") as f:
        for line in reset_list:
            f.write(str(line) + "\n")
    return {"code": 200, "times":times}

@router.get("/reset_list")
async def reset_list():
    reset_list = []
    if os.path.exists("static/am/reset_pass.txt"):
        with open("static/am/reset_pass.txt", "r", encoding="utf-8") as f:
            reset_list=f.readlines()
    reset_list = [ast.literal_eval(x) for x in reset_list]
    return reset_list

@router.post("/handle_reset_pass")
async def handle_reset_pass(action: str = Form(...), id: int = Form(...), db: Session = Depends(get_db)):
    k = -1
    if os.path.exists("static/am/reset_pass.txt"):
        with open("static/am/reset_pass.txt", "r", encoding="utf-8") as f:
            reset_list=f.readlines()
    reset_list = [ast.literal_eval(x) for x in reset_list]
    for i,item in enumerate(reset_list):
        if item["id"] == id:
            k = i
            break
    if k > -1:
        if action=="delete":
            reset_list.pop(k)
        elif action=="reset":
            reset_list.pop(k)
            useritem = db.query(Users).filter_by(id=id).first()
            useritem.password = get_password_hash("zishu")
            db.commit()
    with open("static/am/reset_pass.txt", "w", encoding="utf-8") as f:
        for line in reset_list:
            f.write(str(line) + "\n")
    return {"code": 200, "message":"OK"}

@router.post("/save_profile")
async def save_profile(request: Request):
    form: UploadFile = await request.form()
    file = form.get('file')
    contents = await file.read()
    save_base_dir = "static/uploads/profiles/"
    if not os.path.exists(save_base_dir):
        os.makedirs(save_base_dir)
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    serial = 4
    for i in range(0,5):
        pattern = str(form.get("id"))+"_"+str(i)+"*.jpg"
        if not glob.glob(os.path.join(save_base_dir, pattern)):
            serial = i
            break
    filename = str(form.get("id"))+"_"+ str(serial) +"_"+timestamp+".jpg"
    fout = open(os.path.join(save_base_dir, filename), 'wb')
    fout.write(contents)
    fout.close()
    return {"code": 200, "message":"OK"}

@router.get("/get_profile/{user_id}", dependencies=[Depends(check_jwt_token)])
async def get_profile(*, user_id: int, db: Session = Depends(get_db)):
    useritem = db.query(Users).filter_by(id=user_id).first()
    rtn = {}
    rtn['name']=useritem.username or ''
    rtn['gender']=useritem.gender or ''
    rtn['location']=useritem.location or ''
    rtn['desc']=useritem.desc or ''
    save_base_dir = "static/uploads/profiles/"
    if not os.path.exists(save_base_dir):
        os.makedirs(save_base_dir)
    tmplist = []
    for i in range(0,5):
        pattern = str(user_id)+"_"+str(i)+"*.jpg"
        findfile = glob.glob(os.path.join(save_base_dir, pattern))
        if findfile:
            tmpdict = {
                "name":'api/'+ findfile[0],
                "url":'api/'+ findfile[0]
                }
            tmplist.append(tmpdict)
    rtn["profiles"]=tmplist
    return rtn

@router.post("/delete_profile", dependencies=[Depends(check_jwt_token)])
async def delete_profile(filename: str = Form(...)):
    #save_base_dir = "static/uploads/profiles/"
    if os.path.exists(filename):
        os.remove(filename)
    return {"code": 200, "message":"OK"}

@router.post("/submit_profile")
async def submit_profile(info: str = Form(...), 
                user: UserBase = Depends(check_jwt_token), 
                db: Session = Depends(get_db)):
    useritem = db.query(Users).filter_by(id=user.id).first()
    userinfo = json.loads(info)
    useritem.username = userinfo["name"]
    useritem.gender = userinfo["gender"]
    useritem.location = userinfo["region"]
    useritem.desc = userinfo["desc"]
    db.commit()
    return {"code": 200, "message":"OK"}


@router.get("/fetch_all_users")
async def fetch_all_users(db: Session = Depends(get_db)):
    users = db.query(Users).order_by(desc(Users.id)).all()
    rtn = []
    for user in users:
        user_dict = user.__dict__
        if "_sa_instance_state" in user_dict:
            del user_dict["_sa_instance_state"]
        rtn.append(user_dict)
    return rtn

