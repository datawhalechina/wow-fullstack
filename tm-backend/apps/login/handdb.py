from flask import Flask
import os
from beknowmodels import *
# from flask_migrate import Migrate
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.root_path, 'userdatabk.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# migrate = Migrate(app, db)

users = [
    {'name':'黎伟','phone':'15821123639','role':'admin','password':'111111'},
    {'name':'钟华','phone':'13761474605','role':'supervisor','password':'111111'},
    {'name':'唐成吉','phone':'18621086798','role':'developer','password':'111111'},
    {'name':'叶东','phone':'15351862361','role':'developer','password':'111111'},
    {'name':'孟成','phone':'15221532779','role':'researcher','password':'111111'},
    {'name':'水文钰','phone':'13916997621','role':'researcher','password':'111111'},
    {'name':'陈帅君','phone':'18362962391','role':'user','password':'111111'}
]

import pandas as pd
import numpy as np
data = pd.read_excel(r"\\ad-server\2.9人事行政\5.人事共享信息\弼兴员工通讯录.xlsx",header=2, sheet_name = None)
dflist = [data[dd] for dd in data]
df = pd.concat(dflist)
df = df.dropna(axis=0,subset = ["工号"])
df.drop_duplicates(subset=["工号"],keep='first',inplace=True)
df = df.reset_index(drop=True)
for i in range(len(df)):
    if len(df["手机"][i])>13:
        df["手机"][i]=df["手机"][i][:13]
    if not pd.isna(df["工号"][i]):
        df["手机"][i]=df["手机"][i].replace("-", "")
for i in range(1,len(df)):
    if not pd.isna(df["工号"][i]):
        if pd.isna(df["部门"][i]):
            if not pd.isna(df["部门"][i-1]):
                df["部门"][i]=df["部门"][i-1]
df = df[["手机","姓名","工号","部门"]]
df = df.sort_values(by="工号")
df = df.reset_index(drop=True)
df['工号']=df['工号'].astype(np.int64)





with app.test_request_context():
    
    for i in range(len(df)):
        user = Users(name=df['姓名'][i], phone=df["手机"][i],gonghao=int(df["工号"][i]),bumen=df["部门"][i])
        user.set_password('111111')
        db.session.add(user)
    for u in users:
        user = Users.query.filter_by(name=u['name']).first()
        user.role = u['role']
    db.session.commit()

    last_day = datetime.datetime(2021, 12, 31)
    cur_day = datetime.datetime(2021, 11, 1)
    while (last_day - cur_day).days>=0:
        cur_day = (cur_day + datetime.timedelta(days=1))
        weekno = cur_day.weekday()
        if weekno==1:
            db.session.add(Cornerstone(reporter_id=3,report_role="developer",report_time=cur_day.strftime("%Y-%m-%d")))
            db.session.add(Cornerstone(reporter_id=4,report_role="developer",report_time=cur_day.strftime("%Y-%m-%d")))
            db.session.add(Cornerstone(reporter_id=5,report_role="researcher",report_time=cur_day.strftime("%Y-%m-%d")))
            db.session.add(Cornerstone(reporter_id=6,report_role="researcher",report_time=cur_day.strftime("%Y-%m-%d")))
    db.session.commit()


    db.session.add(Videos(video_title="虚方法",video_authorid=7,video_url="xu"))
    db.session.add(Videos(video_title="列表",video_authorid=7,video_url="lie"))
    db.session.add(Videos(video_title="字典",video_authorid=7,video_url="zi"))
    db.session.add(Videos(video_title="函数",video_authorid=7,video_url="han"))
    db.session.commit()

    courses = [
        {'course_title':'专利代理','course_publisherid':2},
        {'course_title':'专利流程','course_publisherid':5}
    ]
    for c in courses:
        course = Courselist(course_title=c['course_title'], course_publisherid=c['course_publisherid'])
        db.session.add(course)
    db.session.commit()




    queses = [
        {'ques_title':'下列属于专利的是：','item_a':'发明','item_b':'实用新型','item_c':'外观设计','item_d':'商标','answer':'abc','ques_authorid':7},
        {'ques_title':'下列期限不可延长的是：','item_a':'答复审','item_b':'专利保护期限届满','item_c':'优先权','item_d':'两年诉讼时效','answer':'bcd','ques_authorid':7},
        {'ques_title':'会引起不予受理的缺陷是：','item_a':'实用新型缺少附图','item_b':'发明缺少摘要','item_c':'生物缺少摘要附图','item_d':'缺少专利代理委托书','answer':'a','ques_authorid':7}
    ]
    for q in queses:
        ques = Questions(ques_title=q['ques_title'], item_a=q['item_a'],item_b=q['item_b'],item_c=q['item_c'],item_d=q['item_d'],answer=q['answer'],ques_authorid=q['ques_authorid'])
        db.session.add(ques)
    db.session.commit()

    tests = [
        {'testpaper_title':'专利代理','testpaper_authorid':2},
        {'testpaper_title':'专利流程','testpaper_authorid':5}
    ]
    for t in tests:
        test = Testpapers(testpaper_title=t['testpaper_title'], testpaper_authorid=t['testpaper_authorid'])
        db.session.add(test)
    db.session.commit()

    test2 = Testpapers.query.filter_by(testpaperid=2).first()
    ques2 = Questions.query.filter_by(quesid=2).first()
    ques2.rela_papers.append(test2)
    ques3 = Questions.query.filter_by(quesid=3).first()
    ques3.rela_papers.append(test2)

    test1 = Testpapers.query.filter_by(testpaperid=1).first()
    ques1 = Questions.query.filter_by(quesid=1).first()
    ques1.rela_papers.append(test1)

    db.session.commit()

    course1 = Courselist.query.filter_by(courseid=1).first()
    video1 = Videos.query.filter_by(videoid=1).first()
    video1.rela_courses.append(course1)

    course2 = Courselist.query.filter_by(courseid=2).first()
    video2 = Videos.query.filter_by(videoid=2).first()
    video2.rela_courses.append(course2)
    video3 = Videos.query.filter_by(videoid=3).first()
    video3.rela_courses.append(course2)
    video4 = Videos.query.filter_by(videoid=4).first()
    video4.rela_courses.append(course2)

    db.session.commit()