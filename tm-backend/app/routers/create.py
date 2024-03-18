from fastapi import APIRouter, Form, Depends, HTTPException, status, Request
from datetime import datetime, timedelta
from app.dependencies import check_jwt_token, get_db
from sqlalchemy.orm import Session
from app.core.schemas.users import UserBase
from app.core.models.create import Base, Project
from app.core.models.users import Users, Shuzhi
from app.database import engine
import json

Base.metadata.create_all(bind=engine)

create = APIRouter(
    prefix="/create",
    tags=["create"],
    responses={404: {"description": "Not found"}},
)


@create.get("/fetch_current_projects")
async def fetch_current_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).filter_by(finish_date=None).all()
    rtn = []
    for project in projects:
        project_dict = project.__dict__
        if "_sa_instance_state" in project_dict:
            del project_dict["_sa_instance_state"]
        rtn.append(project_dict)
    return rtn

@create.get("/fetch_finished_projects")
async def fetch_finished_projects(db: Session = Depends(get_db)):
    projects = db.query(Project).filter(Project.finish_date!=None).order_by(Project.id.desc()).all()
    rtn = []
    for project in projects:
        project_dict = project.__dict__
        if "_sa_instance_state" in project_dict:
            del project_dict["_sa_instance_state"]
        rtn.append(project_dict)
    return rtn

@create.get("/fetch_next_serial/{task_type}")
async def fetch_next_serial(task_type:str, db: Session = Depends(get_db)):
    serial_type = task_type[0]
    current_project = db.query(Project).filter(Project.task_serial.like(serial_type+'%')).order_by(Project.id.desc()).first()
    next_serial = ""
    if current_project:
        number = int(current_project.task_serial[1:]) + 1
        next_serial = task_type + str(number).zfill(3)
    else:
        next_serial = task_type + '001'
    return next_serial

@create.post("/add_project")
async def add_project(request: Request, 
                      user: UserBase = Depends(check_jwt_token), 
                      db: Session = Depends(get_db)):
    form_data = await request.form()
    new_project = Project(
        publisher=user.username,
        publisher_id=user.id,
        task_serial=form_data.get("task_serial"),
        title=form_data.get("title"),
        url=form_data.get("url"),
        desc=form_data.get("desc"),
        start_date=form_data.get("start_date"),
        deadline=form_data.get("deadline"),
        planed_hour=float(form_data.get("planed_hour")),
        create_time=datetime.now()
    )
    print(form_data.get("task_serial"))
    db.add(new_project)
    db.flush()
    db.commit()
    return {"code": "200", "project_id":new_project.id}

@create.put("/edit_project/{project_id}")
async def edit_project(request: Request, 
                      project_id:int,
                      user: UserBase = Depends(check_jwt_token), 
                      db: Session = Depends(get_db)):
    form_data = await request.form()
    project_obj = db.query(Project).filter_by(id=project_id).first()
    print(form_data.get("params[action]"))
    if form_data.get("params[action]") == "edit":
        project_obj.title=form_data.get("params[title]")
        project_obj.url=form_data.get("params[url]")
        project_obj.desc=form_data.get("params[desc]")
        project_obj.start_date=form_data.get("params[start_date]")
        project_obj.deadline=form_data.get("params[deadline]")
        project_obj.planed_hour=float(form_data.get("params[planed_hour]"))
    elif form_data.get("params[action]") == "apply":
        project_obj.taker=user.username
        project_obj.taker_id=user.id
    elif form_data.get("params[action]") == "allo":
        project_obj.taker=db.query(Users).filter_by(id=int(form_data.get("params[shusheng_id]"))).first().username
        project_obj.taker_id=int(form_data.get("params[shusheng_id]"))
        project_obj.shushi=user.username
        project_obj.shushi_id=user.id
    elif form_data.get("params[action]") == "half_report":
        project_obj.half_progress=form_data.get("params[half_progress]")
    elif form_data.get("params[action]") == "finish_report":
        project_obj.finish_date=datetime.now()
        project_obj.actual_hour=float(form_data.get("params[actual_hour]"))
        useritem = db.query(Users).filter_by(id=user.id).first()
        current_create_hours = useritem.create_hour or 0.0
        project_obj.total_hour=current_create_hours+float(form_data.get("params[actual_hour]"))
        if project_obj.shushi_id>0:
            new_shuzhi = Shuzhi(
                user_id=user.id,
                user_type="创新者",
                target_type="任务",
                target_id=project_obj.id,
                target_title=project_obj.title,
                change = 1,
                amount = float(form_data.get("params[actual_hour]")) * 10,
                balance = useritem.shuzhi + float(form_data.get("params[actual_hour]")) * 10,
                comments = useritem.username + "申报创新" + project_obj.title,
                create_time=datetime.now()
            )
            db.add(new_shuzhi)
            shushiitem = db.query(Users).filter_by(id=project_obj.shushi_id).first()
            shushi_shuzhi = Shuzhi(
                user_id=project_obj.shushi_id,
                user_type="塾师",
                target_type="任务",
                target_id=project_obj.id,
                target_title=project_obj.title,
                change = 1,
                amount = float(form_data.get("params[actual_hour]")) * 10,
                balance = useritem.shuzhi + float(form_data.get("params[actual_hour]")) * 10,
                comments = useritem.username + "申报创新" + project_obj.title,
                create_time=datetime.now()
            )
            db.add(shushi_shuzhi)
            shushiitem.shuzhi = shushiitem.shuzhi + float(form_data.get("params[actual_hour]")) * 10
            useritem.shuzhi = useritem.shuzhi + float(form_data.get("params[actual_hour]")) * 10
            useritem.learn_hour = useritem.learn_hour + float(form_data.get("params[actual_hour]"))
        else:
            new_shuzhi = Shuzhi(
                user_id=user.id,
                user_type="创新者",
                target_type="任务",
                target_id=project_obj.id,
                target_title=project_obj.title,
                change = 1,
                amount =float(form_data.get("params[actual_hour]")) * 20,
                balance = useritem.shuzhi + float(form_data.get("params[actual_hour]")) * 20,
                comments = useritem.username + "申报创新" + project_obj.title,
                create_time=datetime.now()
            )
            db.add(new_shuzhi)
            useritem.shuzhi = useritem.shuzhi + float(form_data.get("params[actual_hour]")) * 20
            useritem.learn_hour = useritem.learn_hour + float(form_data.get("params[actual_hour]"))
    project_obj.update_date = datetime.now()
    db.commit()
    return {"code": "200"}