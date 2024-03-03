from fastapi import APIRouter, Form, Depends, HTTPException, status, Request
from datetime import datetime, timedelta
from app.dependencies import check_jwt_token, get_db, verify_password, get_password_hash
from app.config import settings
import jwt
from typing import Optional
from app.core.schemas.course import CourseModel
from app.core.schemas.users import UserBase
from sqlalchemy.orm import Session
from app.core.models.course import Base, Course, Chapter, Selection, Report
from app.database import engine
import json

Base.metadata.create_all(bind=engine)

course = APIRouter(
    prefix="/course",
    tags=["course"],
    responses={404: {"description": "Not found"}},
)


@course.post("/save_course")
async def save_course(request: Request,
                      user: UserBase = Depends(check_jwt_token), 
                      db: Session = Depends(get_db)):
    form_data = await request.form()
    course_id =  form_data.get("courseid")
    course_title = form_data.get("title")
    course_desc = form_data.get("desc")
    course_chapters = form_data.get("chapters")
    chapter_content = json.loads(course_chapters)
    if int(course_id) == 0:
        new_course = Course(
            title=course_title,
            director_id=user.id,
            director_name=user.username,
            desc=course_desc,
            create_time=datetime.now()
        )
        db.add(new_course)
        db.flush()
        db.commit()
        course_id = new_course.id
        
        for i,chapter in enumerate(chapter_content):
            new_chapter = Chapter(
                title=chapter['title'],
                course_id=course_id,
                serial=i+1,
                author_id=user.id,
                author_name=user.username,
                period=chapter['period'],
                url=chapter['url'],
                create_time=datetime.now()
            )
            db.add(new_chapter)
            db.commit()
    else:
        course = db.query(Course).filter_by(id=course_id).first()
        course.title = course_title
        course.desc = course_desc
        course.director_id = user.id
        course.director_name = user.username
        db.commit()
        for i,chapter in enumerate(chapter_content):
            chapter_id = int(chapter['id'])
            if chapter_id>0:
                chapter_obj = db.query(Chapter).filter_by(id=chapter_id).first()
                chapter_obj.title = chapter['title']
                chapter_obj.serial = chapter['serial']
                chapter_obj.period = chapter['period']
                chapter_obj.url = chapter['url']
                chapter_obj.author_id = user.id
                chapter_obj.author_name = user.username
            else:
                new_chapter = Chapter(
                    title=chapter['title'],
                    course_id=course_id,
                    serial=i+1,
                    author_id=user.id,
                    author_name=user.username,
                    period=chapter['period'],
                    url=chapter['url'],
                    create_time=datetime.now()
                )
                db.add(new_chapter)
            db.commit()
    return {"code": "200"}
    
@course.get("/fetch_course")
async def fetch_course(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    rtn = []
    for course in courses:
        course_dict = course.__dict__
        if "_sa_instance_state" in course_dict:
            del course_dict["_sa_instance_state"]
        rtn.append(course_dict)
    return rtn

@course.post("/select_course")
async def select_course(id: int = Form(...), courseid: int = Form(...), db: Session = Depends(get_db)):
    new_selection = Selection(
        user_id=id,
        course_id=courseid,
        create_time=datetime.now(),
        update_time=datetime.now(),
        current_serial=1,
    )
    db.add(new_selection)
    db.commit()
    return {"code": "200"}

def get_deadline(start,period):
    if period[-1].lower()=="天":
        days_to_add = int(period[:-1])
        new_date = start + timedelta(days=days_to_add)
    elif period[-1].lower()=="月":
        months_to_add = int(period[:-1])
        new_date = start.replace(month=start.month + months_to_add)
    else:
        raise Exception("周期格式错误")
    return new_date




@course.get("/fetch_current_selections")
async def fetch_current_selections(user: UserBase = Depends(check_jwt_token), db: Session = Depends(get_db)):
    selections = db.query(Selection).filter_by(user_id=user.id,finish_time=None).all()
    rtn = []
    for sele in selections:
        sele_dict = {}
        course = db.query(Course).filter_by(id=sele.course_id).first()
        chapter = db.query(Chapter).filter_by(course_id=sele.course_id,serial=sele.current_serial).first()
        sele_dict['sele_id'] = sele.id
        sele_dict['course_title'] = course.title
        sele_dict['course_id'] = chapter.course_id
        sele_dict['chapter_title'] = chapter.title
        sele_dict['chapter_id'] = chapter.id
        sele_dict['current_serial'] = sele.current_serial
        sele_dict['deadline'] = get_deadline(sele.update_time,chapter.period)
        sele_dict['url'] = chapter.url
        rtn.append(sele_dict)
    return rtn

@course.post("/report_learn")
async def report_learn(
    chapter_id:int = Form(...),
    course_id:int = Form(...),
    chapter_title:str = Form(...),
    sele_id:int = Form(...),
    reported_hour:str = Form(...),
    user: UserBase = Depends(check_jwt_token), 
    db: Session = Depends(get_db)):
    selection = db.query(Selection).filter_by(id=sele_id).first()
    new_report = Report(
        user_id=user.id,
        chapter_id=chapter_id,
        chapter_title=chapter_title,
        time_reported=float(reported_hour),
        report_time=datetime.now(),
        time_granted=float(reported_hour),
        grant_time=datetime.now()
    )
    #db.add(new_report)
    next_serial = selection.current_serial + 1
    next_chapter = db.query(Chapter).filter_by(course_id=course_id,serial=next_serial).first()
    print(chapter_id)
    print(next_serial)
    if next_chapter:
        selection.current_serial=next_serial
        selection.update_time=datetime.now()
    else:
        selection.finish_time=datetime.now()
    db.commit()
    return {"code": "200"}