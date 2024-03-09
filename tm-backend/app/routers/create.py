from fastapi import APIRouter, Form, Depends, HTTPException, status, Request
from datetime import datetime, timedelta
from app.dependencies import check_jwt_token, get_db
from sqlalchemy.orm import Session
from app.core.schemas.users import UserBase
from app.core.models.create import Base, Project
from app.core.models.users import Users
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

@create.post("/add_project")
async def add_project(request: Request, 
                      user: UserBase = Depends(check_jwt_token), 
                      db: Session = Depends(get_db)):
    form_data = await request.form()
    new_project = Project(
        publisher=user.username,
        publisher_id=user.id,
        director_name=user.username,
        task_serial=form_data.get("task_serial"),
        title=form_data.get("title"),
        url=form_data.get("url"),
        desc=form_data.get("desc"),
        start_date=form_data.get("start_date"),
        deadline=form_data.get("deadline"),
        planed_hour=float(form_data.get("planed_hour")),
        create_time=datetime.now()
    )
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
    if form_data.get("action") == "edit":
        project_obj.title=form_data.get("title")
        project_obj.url=form_data.get("url")
        project_obj.desc=form_data.get("desc")
        project_obj.start_date=form_data.get("start_date")
        project_obj.deadline=form_data.get("deadline")
        project_obj.planed_hour=float(form_data.get("planed_hour"))
    elif form_data.get("action") == "half_report":
        project_obj.half_progress=form_data.get("half_progress")
    elif form_data.get("action") == "finish_report":
        project_obj.finish_date=form_data.get("finish_date")
        project_obj.actual_hour=float(form_data.get("actual_hour"))
        useritem = db.query(Users).filter_by(id=user.id).first()
        project_obj.total_hour=useritem.create_hour+float(form_data.get("actual_hour"))
    project_obj.update_date = datetime.now()
    db.commit()
    return {"code": "200"}