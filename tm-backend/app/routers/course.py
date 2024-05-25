from fastapi import APIRouter, Form, Depends, HTTPException, status, Request
from datetime import datetime, timedelta
from app.dependencies import check_jwt_token, get_db
from app.config import settings
from jose import jwt
from typing import Optional
from app.core.schemas.course import CourseModel
from app.core.schemas.users import UserBase
from sqlalchemy.orm import Session
from app.core.models.course import Base, Course, Chapter, Selection, Report
from app.core.models.users import Users, Mentors, Shuzhi
from app.database import engine
import json

Base.metadata.create_all(bind=engine)

course = APIRouter(
    prefix="/api/course",
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
    
@course.get("/fetch_all_courses")
async def fetch_all_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).all()
    rtn = []
    for course in courses:
        course_dict = course.__dict__
        if "_sa_instance_state" in course_dict:
            del course_dict["_sa_instance_state"]
        rtn.append(course_dict)
    return rtn

@course.get("/get_course/{course_id}")
async def get_course(course_id:int, db: Session = Depends(get_db)):
    course = db.query(Course).filter_by(id=course_id).first()
    course_dict = course.__dict__
    if "_sa_instance_state" in course_dict:
        del course_dict["_sa_instance_state"]
    chapters = db.query(Chapter).filter_by(course_id=course_id).order_by(Chapter.serial).all()
    chapters_list = []
    for chapter in chapters:
        chapter_dict = chapter.__dict__
        # 由于下面chapter_cur查询会报错，因此这里不删除_sa_instance_state了。
        #if "_sa_instance_state" in chapter_dict:
        #    del chapter_dict["_sa_instance_state"]
        chapters_list.append(chapter_dict)
    current_selections = db.query(Selection).filter_by(course_id=course_id,finish_time=None).order_by(Selection.current_serial).all()
    current_list = []
    for sele in current_selections:
        sele_dict = {}
        chapter_cur = db.query(Chapter).filter_by(course_id=sele.course_id,serial=sele.current_serial).first()
        sele_dict['sele_id'] = sele.id
        sele_dict['user_id'] = sele.user_id
        sele_dict['user_name'] = db.query(Users).filter_by(id=sele.user_id).first().username
        sele_dict['current_serial'] = sele.current_serial
        sele_dict['deadline'] = get_deadline(sele.update_time,chapter_cur.period)
        if sele.shushi_id:
            sele_dict['shushi_id'] = sele.shushi_id
            sele_dict['shushi_name'] = db.query(Users).filter_by(id=sele.shushi_id).first().username
        current_list.append(sele_dict)
    finish_selections = db.query(Selection).filter(
        Selection.course_id==course_id,
        Selection.finish_time!=None
        ).all()
    finish_list = []
    for sele in finish_selections:
        sele_dict = {}
        sele_dict['sele_id'] = sele.id
        sele_dict['user_id'] = sele.user_id
        sele_dict['user_name'] = db.query(Users).filter_by(id=sele.user_id).first().username
        sele_dict['finish_date'] = sele.finish_time
        if sele.shushi_id:
            sele_dict['shushi_id'] = sele.shushi_id
            sele_dict['shushi_name'] = db.query(Users).filter_by(id=sele.shushi_id).first().username
        finish_list.append(sele_dict)
    return {"course":course_dict,"chapters":chapters_list,"current":current_list,"finish":finish_list}

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
        if sele.shushi_id:
            sele_dict['shushi_id'] = sele.shushi_id
            sele_dict['shushi_name'] = db.query(Users).filter_by(id=sele.shushi_id).first().username
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
    useritem = db.query(Users).filter_by(id=user.id).first()
    new_report = Report(
        user_id=user.id,
        target_type='学习',
        target_id=chapter_id,
        target_title=chapter_title,
        time_reported=float(reported_hour),
        report_time=datetime.now(),
        time_granted=float(reported_hour),
        grant_time=datetime.now()
    )
    db.add(new_report)
    
    
    if selection.shushi_id:
        new_shuzhi = Shuzhi(
            user_id=user.id,
            user_type="塾生",
            target_type="学习",
            target_id=chapter_id,
            target_title=chapter_title,
            change = 1,
            amount =float(reported_hour) * 5,
            balance = useritem.shuzhi + float(reported_hour) * 5,
            comments = useritem.username + "申报-学习-" + chapter_title,
            create_time=datetime.now()
        )
        db.add(new_shuzhi)
        shushiitem = db.query(Users).filter_by(id=selection.shushi_id).first()
        shushi_shuzhi = Shuzhi(
            user_id=selection.shushi_id,
            user_type="塾师",
            target_type="学习",
            target_id=chapter_id,
            target_title=chapter_title,
            change = 1,
            amount =float(reported_hour) * 5,
            balance = useritem.shuzhi + float(reported_hour) * 5,
            comments = useritem.username + "申报-学习-" + chapter_title,
            create_time=datetime.now()
        )
        db.add(shushi_shuzhi)
        shushiitem.shuzhi = shushiitem.shuzhi + float(reported_hour) * 5
        useritem.shuzhi = useritem.shuzhi + float(reported_hour) * 5
        useritem.learn_hour = useritem.learn_hour + float(reported_hour)
    else:
        new_shuzhi = Shuzhi(
            user_id=user.id,
            user_type="塾生",
            target_type="学习",
            target_id=chapter_id,
            target_title=chapter_title,
            change = 1,
            amount =float(reported_hour) * 10,
            balance = useritem.shuzhi + float(reported_hour) * 10,
            comments = useritem.username + "申报-学习-" + chapter_title,
            create_time=datetime.now()
        )
        db.add(new_shuzhi)
        useritem.shuzhi = useritem.shuzhi + float(reported_hour) * 10
        useritem.learn_hour = useritem.learn_hour + float(reported_hour)
    next_serial = selection.current_serial + 1
    next_chapter = db.query(Chapter).filter_by(course_id=course_id,serial=next_serial).first()
    if next_chapter:
        selection.current_serial=next_serial
        selection.update_time=datetime.now()
    else:
        selection.finish_time=datetime.now()
    db.commit()
    return {"code": "200"}


@course.get("/fetch_selections")
async def fetch_selections(db: Session = Depends(get_db)):
    selections = db.query(Selection).filter_by(finish_time=None).all()
    rtn = []
    for sele in selections:
        sele_dict = {}
        user = db.query(Users).filter_by(id=sele.user_id).first()
        course = db.query(Course).filter_by(id=sele.course_id).first()
        chapter = db.query(Chapter).filter_by(course_id=sele.course_id,serial=sele.current_serial).first()
        sele_dict['sele_id'] = sele.id
        sele_dict['user_id'] = sele.user_id
        sele_dict['user_name'] = user.username
        sele_dict['course_title'] = course.title
        sele_dict['course_id'] = chapter.course_id
        sele_dict['chapter_title'] = chapter.title
        sele_dict['chapter_id'] = chapter.id
        sele_dict['current_serial'] = sele.current_serial
        sele_dict['deadline'] = get_deadline(sele.update_time,chapter.period)
        sele_dict['url'] = chapter.url
        if sele.shushi_id:
            sele_dict['shushi_id'] = sele.shushi_id
            sele_dict['shushi_name'] = db.query(Users).filter_by(id=sele.shushi_id).first().username
        rtn.append(sele_dict)
    return rtn


@course.get("/cal_mentors")
async def cal_mentors(user: UserBase = Depends(check_jwt_token), db: Session = Depends(get_db)):
    selection = db.query(Selection).filter(
        Selection.shushi_id==None,
        Selection.user_id==user.id,
        Selection.finish_time==None
        ).first()
    rtn = {}
    finished_selections = None
    if selection:
        finished_selections = db.query(Selection).filter(
            Selection.course_id==selection.course_id,
            Selection.finish_time!=None
            ).all()
        course = db.query(Course).filter_by(id=selection.course_id).first()
        rtn['course_title'] = course.title
        rtn['course_id'] = course.id
        rtn['director_id'] = course.director_id
        rtn['director_name'] = course.director_name
        mentor_count = db.query(Mentors).filter(
        Mentors.shushi_id==course.director_id,
        Mentors.end_time!=None
        ).count()
        rtn['mentor_count'] = mentor_count
        
    seles = []
    if finished_selections:
        for f_sele in finished_selections:
            mentor_count = db.query(Mentors).filter(
            Mentors.shushi_id==f_sele.user_id,
            Mentors.end_time!=None
            ).count()
            if mentor_count<3 and f_sele.user_id!=user.id:
                sele_dict = f_sele.__dict__
                if "_sa_instance_state" in sele_dict:
                    del sele_dict["_sa_instance_state"]
                sele_dict['shushi_name'] = db.query(Users).filter_by(id=f_sele.user_id).first().username
                seles.append(sele_dict)
    rtn['mentors'] = seles
    return rtn

@course.post("/select_mentor")
async def select_mentor(shushi_id: int = Form(...), 
                        courseid: int = Form(...), 
                        user: UserBase = Depends(check_jwt_token), 
                        db: Session = Depends(get_db)):
    selection = db.query(Selection).filter_by(
        course_id=courseid,
        user_id=user.id,
        finish_time=None
    ).first()
    if selection:
        selection.shushi_id = shushi_id
    mentor = db.query(Mentors).filter_by(
        shushi_id=shushi_id,
        shusheng_id=user.id,
        end_time=None
        ).first()
    if mentor:
        mentor.course_id = courseid
        mentor.status = '改课'
    else:
        new_mentor = Mentors(
            shushi_id=shushi_id,
            shusheng_id=user.id,
            course_id=courseid,
            status='新选',
            start_time=datetime.now(),
            update_time=datetime.now(),
        )
        db.add(new_mentor)
    db.commit()
    return {"code": "200"}



@course.get("/fetch_mentors")
async def fetch_mentors(user: UserBase = Depends(check_jwt_token), db: Session = Depends(get_db)):
    mentors = db.query(Mentors).filter(
        Mentors.shusheng_id==user.id,
        Mentors.end_time==None
        ).all()
    rtn = []
    for mentor in mentors:
        mentor_dict = mentor.__dict__
        if "_sa_instance_state" in mentor_dict:
            del mentor_dict["_sa_instance_state"]
        mentor_dict['shushi_name'] = db.query(Users).filter_by(id=mentor.shushi_id).first().username
        mentor_dict['course_title'] = db.query(Course).filter_by(id=mentor.course_id).first().title
    return rtn
