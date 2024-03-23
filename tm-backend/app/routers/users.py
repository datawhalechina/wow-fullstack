from fastapi import APIRouter, Form, Depends, HTTPException, status, Request, UploadFile, File
from datetime import datetime, timedelta
from app.dependencies import check_jwt_token, get_db, verify_password, get_password_hash
from app.config import settings
import jwt
import os
import json
import glob
from typing import Optional
from app.core.schemas.users import UserBase, TokenModel
from sqlalchemy.orm import Session
from sqlalchemy import func, desc 
from app.core.models.users import Base, Users, Register, Mentors, Goals, Shuzhi
from app.core.models.course import Report
from app.database import engine

Base.metadata.create_all(bind=engine)

router = APIRouter(
    prefix="/users",
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
    :param username:
    :param password:
    :return:
    """
    # user = users_db.get(username)
    user = db.query(Users).filter(Users.username== username).first()
    if not user:
        return False
    # if not verify_password(password, user.get("password")):
    if not verify_password(password, user.password):
        return False
    return user


# 使用表单格式参数需要安装模块：python-multipart
@router.post("/token", response_model=TokenModel)
async def login_for_access_token(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = check_user(db, username, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="用户名或密码错误"
        )
    # access过期时间
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # refresh过期时间
    refresh_token_expires = timedelta(minutes=10080)
    # 把id进行username加密，要使用str类型
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    refresh_token = create_access_token(
        data={"sub": user.username}, expires_delta=refresh_token_expires
    )
    user.atoken = access_token
    user.rtoken = refresh_token
    return user

@router.get("/refresh", response_model=TokenModel)
async def get_refresh_token(*, user: TokenModel = Depends(check_jwt_token)):
    # access过期时间
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # refresh过期时间
    refresh_token_expires = timedelta(minutes=10080)
    # 把id进行username加密，要使用str类型
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    refresh_token = create_access_token(
        data={"sub": user.username}, expires_delta=refresh_token_expires
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
async def handle_changepass(newpass: str = Form(...), name: str = Form(...), db: Session = Depends(get_db)):
    useritem = db.query(Users).filter_by(username=name).first()
    useritem.password = get_password_hash(newpass)
    db.commit()
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
                "name":findfile[0],
                "url":"http://127.0.0.1:8008/"+findfile[0]
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
    seven_days_ago = datetime.now() - timedelta(days=7) 
    for user in users:
        total_hours_7d = db.query(func.sum(Report.time_granted)).filter(
            Report.grant_time >= seven_days_ago,
            Report.user_id == user.id
            ).scalar() 
        user_dict = user.__dict__
        user_dict["total_hours_7d"] = total_hours_7d
        if "_sa_instance_state" in user_dict:
            del user_dict["_sa_instance_state"]
        rtn.append(user_dict)
    return rtn


@router.get("/fetch_goal/{user_id}")
async def fetch_goal(user_id:int, db: Session = Depends(get_db)):
    goalitem = db.query(Goals).filter_by(user_id=user_id, end_time=None).first()
    goal_dict = {}
    if goalitem:
        goal_dict = goalitem.__dict__
        if "_sa_instance_state" in goal_dict:
            del goal_dict["_sa_instance_state"]
    return goal_dict

@router.get("/fetch_reports/{user_id}")
async def fetch_reports(user_id:int, db: Session = Depends(get_db)):
    reports = db.query(Report).filter_by(user_id=user_id).order_by(desc(Report.id)).all()
    report_list = []
    if reports:
        for reportitem in reports:
            report_dict = reportitem.__dict__
            if "_sa_instance_state" in report_dict:
                del report_dict["_sa_instance_state"]
            report_list.append(report_dict)
    return report_list

@router.post("/save_goal")
async def save_goal(request: Request,
                      user: UserBase = Depends(check_jwt_token), 
                      db: Session = Depends(get_db)):
    form_data = await request.form()
    goal_id =  form_data.get("goal_id")
    content =  form_data.get("content")
    deadline = form_data.get("deadline")
    process = form_data.get("process")
    review = form_data.get("review")
    action = form_data.get("action")
    if int(goal_id) == 0:
        new_goal = Goals(
            user_id=user.id,
            content=content,
            deadline=deadline,
            process=int(process),
            review=review,
            start_time=datetime.now()
        )
        db.add(new_goal)
        db.flush()
        db.commit()
        goal_id = new_goal.id
    else:
        goalitem = db.query(Goals).filter_by(id=int(goal_id), user_id=user.id).first()
        if goalitem:
            goalitem.content = content
            goalitem.deadline = deadline
            goalitem.process = int(process)
            goalitem.review = review
            if action=="完成":
                goalitem.end_time = datetime.now()
        db.commit()
    return {"code": 200, "goal_id":goal_id}


@router.get("/fetch_shushengs/{user_id}")
async def fetch_shushengs(user_id:int, db: Session = Depends(get_db)):
    mentors = db.query(Mentors).filter_by(shushi_id=user_id, end_time=None).all()
    shushengs = []
    if mentors:
        for mentoritem in mentors:
            shusheng_dict = {
                "id":mentoritem.shusheng_id,
                "name":db.query(Users).filter_by(id=mentoritem.shusheng_id).first().username
                }
            shushengs.append(shusheng_dict)
    return shushengs

@router.get("/fetch_shushis/{user_id}")
async def fetch_shushengs(user_id:int, db: Session = Depends(get_db)):
    mentors = db.query(Mentors).filter_by(shusheng_id=user_id, end_time=None).all()
    shushis = []
    if mentors:
        for mentoritem in mentors:
            shushi_dict = {
                "id":mentoritem.shushi_id,
                "name":db.query(Users).filter_by(id=mentoritem.shushi_id).first().username
                }
            shushis.append(shushi_dict)
    return shushis

@router.get("/fetch_shuzhi/{user_id}")
async def fetch_shuzhi(user_id:int, db: Session = Depends(get_db)):
    shuzhis = db.query(Shuzhi).filter_by(user_id=user_id).order_by(desc(Shuzhi.id)).all()
    rtn = []
    for shuzhi in shuzhis:
        shuzhi_dict = shuzhi.__dict__
        if "_sa_instance_state" in shuzhi_dict:
            del shuzhi_dict["_sa_instance_state"]
        rtn.append(shuzhi_dict)
    return rtn


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
