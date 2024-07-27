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
from app.core.models.users import Base, Users, Register, Mentors, Goals, Shuzhi, Goaltalk
from app.core.models.course import Course, Report
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
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
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
        return False
    # if not verify_password(password, user.get("password")):
    if not verify_password(password, user.password):
        return False
    return user

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

@router.post("/fetch_all_goals")
async def fetch_goal(presenter: str = Form(...), user: UserBase = Depends(check_jwt_token), db: Session = Depends(get_db)):
    if presenter == '塾师':
        mentors = db.query(Mentors).filter_by(shushi_id=user.id, end_time=None).all()
        shushengs = []
        if mentors:
            for mentoritem in mentors:
                if mentoritem.shusheng_id not in shushengs:
                    shushengs.append(mentoritem.shusheng_id)
        rtn = []
        for shusheng_id in shushengs:
            goalitem = db.query(Goals).filter_by(user_id=shusheng_id, end_time=None).first()
            goal_dict = {}
            if goalitem:
                goal_dict = goalitem.__dict__
                if "_sa_instance_state" in goal_dict:
                    goal_dict["shusheng_name"] = db.query(Users).filter_by(id=shusheng_id).first().username
                    del goal_dict["_sa_instance_state"]
            else:
                goal_dict["shusheng_id"] = shusheng_id
                goal_dict["shusheng_name"] = db.query(Users).filter_by(id=shusheng_id).first().username
            rtn.append(goal_dict)
    return rtn

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
                "name":db.query(Users).filter_by(id=mentoritem.shusheng_id).first().username,
                "course_id": mentoritem.course_id,  # Add course_id to the dictionary
                "course_title": db.query(Course).filter_by(id=mentoritem.course_id).first().title  # Add course_title to the dictionary
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
                "name":db.query(Users).filter_by(id=mentoritem.shushi_id).first().username,
                "course_id": mentoritem.course_id,  # Add course_id to the dictionary
                "course_title": db.query(Course).filter_by(id=mentoritem.course_id).first().title  # Add course_title to the dictionary
                }
            shushis.append(shushi_dict)
    return shushis


@router.post("/fetch_goaltalk")
async def fetch_goaltalk(presenter: str = Form(...), user: UserBase = Depends(check_jwt_token), db: Session = Depends(get_db)):
    rtn = []
    if presenter == '塾师':
        goal_talks = db.query(Goaltalk).filter_by(shushi_id=user.id, finish_time=None).all()
        for talk in goal_talks:
            temp = {}
            temp['id'] = talk.id
            temp['shusheng_id'] = talk.shusheng_id
            temp['shushi_id'] = talk.shushi_id
            temp['planed_time'] = talk.planed_time
            temp['planed_duration'] = talk.planed_duration
            temp['presenter'] = talk.presenter
            temp['confirmed_time'] = talk.confirmed_time
            temp['confirmer'] = talk.confirmer
            temp['access_info'] = talk.access_info
            if talk.shusheng_id:
                temp['shusheng_name'] = db.query(Users).filter_by(id=talk.shusheng_id).first().username
            rtn.append(temp)
    elif presenter == '塾生':
        goal_talks = db.query(Goaltalk).filter_by(shusheng_id=user.id, finish_time=None).all()
        for talk in goal_talks:
            temp = {}
            temp['id'] = talk.id
            temp['shusheng_id'] = talk.shusheng_id
            temp['shushi_id'] = talk.shushi_id
            temp['planed_time'] = talk.planed_time
            temp['planed_duration'] = talk.planed_duration
            temp['presenter'] = talk.presenter
            temp['confirmed_time'] = talk.confirmed_time
            temp['access_info'] = talk.access_info
            if talk.shusheng_id:
                temp['shushi_name'] = db.query(Users).filter_by(id=talk.shushi_id).first().username
            rtn.append(temp)
    return rtn

@router.post("/fetch_finished_goaltalk")
async def fetch_finished_goaltalk(presenter: str = Form(...), user: UserBase = Depends(check_jwt_token), db: Session = Depends(get_db)):
    rtn = []
    if presenter == '塾师':
        goal_talks = db.query(Goaltalk).filter(Goaltalk.shushi_id==user.id, Goaltalk.finish_time!=None).all()
        for talk in goal_talks:
            temp = {}
            temp['id'] = talk.id
            temp['shusheng_id'] = talk.shusheng_id
            temp['shushi_id'] = talk.shushi_id
            temp['finish_time'] = talk.finish_time
            temp['actual_duration'] = talk.actual_duration
            temp['content'] = talk.content
            if talk.shusheng_id:
                temp['shusheng_name'] = db.query(Users).filter_by(id=talk.shusheng_id).first().username
            rtn.append(temp)
    elif presenter == '塾生':
        goal_talks = db.query(Goaltalk).filter(Goaltalk.shusheng_id==user.id, Goaltalk.finish_time!=None).all()
        for talk in goal_talks:
            temp = {}
            temp['id'] = talk.id
            temp['shusheng_id'] = talk.shusheng_id
            temp['shushi_id'] = talk.shushi_id
            temp['finish_time'] = talk.finish_time
            temp['actual_duration'] = talk.actual_duration
            temp['content'] = talk.content
            if talk.shushi_id:
                temp['shushi_name'] = db.query(Users).filter_by(id=talk.shushi_id).first().username
            rtn.append(temp)
    return rtn

@router.post("/edit_goaltalk")
async def edit_goaltalk(request: Request,
                      user: UserBase = Depends(check_jwt_token), 
                      db: Session = Depends(get_db)):
    form_data = await request.form()
    goaltalk_id =  form_data.get("id")
    presenter =  form_data.get("presenter")
    access_info =  form_data.get("access_info")
    counter_part_id =  form_data.get("counter_part_id")
    planed_time =  form_data.get("planed_time")
    planed_duration =  form_data.get("planed_duration")
    if goaltalk_id=='0':
        goal_talk = Goaltalk(
            planed_time=planed_time,
            create_time = datetime.now(),
            planed_duration=planed_duration,
            presenter=presenter
        )
        db.add(goal_talk)
        db.flush()
    else:
        goal_talk = db.query(Goaltalk).filter_by(id=goaltalk_id).first()
        goal_talk.planed_time = planed_time
        goal_talk.planed_duration = planed_duration
        goal_talk.access_info = access_info
    if presenter=="塾师":
        goal_talk.shushi_id = user.id
        goal_talk.shusheng_id = counter_part_id
    elif presenter=="塾生":
        goal_talk.shushi_id = counter_part_id
        goal_talk.shusheng_id = user.id
    db.commit()
    return {"code": 200, "goaltalk_id":goal_talk.id}

@router.post("/confirm_talk")
async def confirm_talk(id: int = Form(...),
                       confirmer: str = Form(...),
                      user: UserBase = Depends(check_jwt_token), 
                      db: Session = Depends(get_db)):
    goal_talk = db.query(Goaltalk).filter_by(id=id).first()
    goal_talk.confirmed_time = datetime.now()
    if confirmer=="塾生":
        goal_talk.shusheng_id = user.id
    goal_talk.confirmer = confirmer
    db.commit()
    return {"code": 200}

@router.post("/confirm_reserve")
async def confirm_reserve(request: Request,
                      user: UserBase = Depends(check_jwt_token), 
                      db: Session = Depends(get_db)):
    form_data = await request.form()
    shushi_id =  int(form_data.get("shushi_id"))
    planed_time =  form_data.get("planed_time")
    planed_duration =  int(form_data.get("planed_duration"))
    print(form_data)
    goal_talk = Goaltalk(
        shushi_id = shushi_id,
        shusheng_id = user.id,
        planed_time=planed_time,
        create_time = datetime.now(),
        planed_duration=planed_duration,
        presenter='塾生'
    )
    db.add(goal_talk)
    db.flush()
    db.commit()
    return {"code": 200, "talk_id":goal_talk.id}

@router.post("/finish_talk")
async def finish_talk(id: int = Form(...),
                      actual_duration: int = Form(...),
                      content: str = Form(...),
                      user: UserBase = Depends(check_jwt_token), 
                      db: Session = Depends(get_db)):
    goal_talk = db.query(Goaltalk).filter_by(id=id).first()
    if goal_talk.shushi_id == user.id:
        goal_talk.finish_time = datetime.now()
        goal_talk.actual_duration = actual_duration
        goal_talk.content = content 
        db.commit()
    return {"code": 200}

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
