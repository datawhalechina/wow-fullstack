from flask import Flask, Blueprint, render_template, request,  redirect, url_for, current_app
from apps.login.beknowmodels import *
from flask_login import login_required,current_user
from concurrent.futures import ThreadPoolExecutor
executor = ThreadPoolExecutor(3)
from sqlalchemy import or_, and_
from sqlalchemy import text
from importlib import reload
import os
import sys
sys.path.append(os.path.abspath('./apps/sp'))
import spmodel
import json
import random
import copy
import shutil
import time
import datetime

app2 = Flask(__name__)
app2.config['SQLALCHEMY_DATABASE_URI'] = Config.SQLALCHEMY_DATABASE_URI
app2.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app2)

SPSTATIC = "../../"+Config.UPLOAD_PATH
sp = Blueprint('sp',__name__,template_folder='./templates', static_folder=SPSTATIC, static_url_path="/spstatic/")
@sp.route('/')
def spstart():
    qflow = Videos.query.filter(Videos.video_class1=='知识产权').order_by(Videos.create_time.desc()).paginate(page=1, per_page=6, error_out=False)
    sendfirstvideos = {}
    allvideoquery = []
    for vitem in qflow.items:
        dictq = {}
        authorid = vitem.video_authorid
        dictq["videoid"]=vitem.videoid
        dictq["video_title"]=vitem.video_title
        dictq["poster_url"]=vitem.poster_url
        dictq["video_author"]=Users.query.filter_by(id=authorid).first().name
        allvideoquery.append(dictq)
    sendfirstvideos['vlist']=allvideoquery
    sendfirstvideos['pagenum']=1
    sendfirstvideos['pages']=qflow.pages
    sendfirstvideos['section']='知识产权'
    return render_template("showvideos.html", vdata=sendfirstvideos)

base_path = os.getcwd()
prefix = Config.UPLOAD_PATH
upload_path = os.path.join(base_path, prefix)



@sp.route('/lazyhome/', methods=['POST'])
def lazyhome():
    allvideolazy = []
    lingyu = ['人工智能','乐理']
    for ly in lingyu:
        qtmp = Videos.query.filter(Videos.video_class1==ly).order_by(Videos.create_time.desc()).paginate(page=1, per_page=6, error_out=False)
        tmpsection = {}
        tmpsection['section']=ly
        tmpsection['pagenum']=1
        tmpsection['pages']=qtmp.pages
        tmplazy = []
        if qtmp.total>0:
            for vitem in qtmp.items:
                dictq = {}
                authorid = vitem.video_authorid
                dictq["videoid"]=vitem.videoid
                dictq["video_title"]=vitem.video_title
                dictq["video_class1"]=vitem.video_class1
                dictq["poster_url"]=vitem.poster_url
                dictq["video_author"]=Users.query.filter_by(id=authorid).first().name
                tmplazy.append(dictq)
            tmpsection['vlist']=tmplazy
            allvideolazy.append(tmpsection)

    return json.dumps(allvideolazy)

@sp.route('/huanyihuan/', methods=['POST'])
def huanyihuan():
    section = request.form.get("section")
    pagenum = int(request.form.get("pagenum"))
    qflow = Videos.query.filter(Videos.video_class1==section).order_by(Videos.create_time.desc()).paginate(page=pagenum, per_page=6, error_out=False)
    allvideoquery = []
    for vitem in qflow.items:
        dictq = {}
        authorid = vitem.video_authorid
        dictq["videoid"]=vitem.videoid
        dictq["video_title"]=vitem.video_title
        dictq["poster_url"]=vitem.poster_url
        dictq["video_author"]=Users.query.filter_by(id=authorid).first().name
        allvideoquery.append(dictq)
    return json.dumps(allvideoquery)





@sp.route('/upAjax/', methods=['POST'])
def upAjax():
    f = request.files['yu']
    #file_name = f.filename
    file_name = datetime.datetime.now().strftime('%Y%m%d%H%M%S') + '.mp4'
    file_path = upload_path + 'tmp/'+file_name
    f.save(file_path)
    ret = {'result': file_name}
    return json.dumps(ret)



@sp.route('/newvideo/', methods=['GET'])
@login_required
def newvideo():
    return render_template("newvideo.html")

@sp.route('/savevideo/', methods=['POST'])
@login_required
def savevideo():
    video_title = request.form.get('video_title')
    video_tmpname = request.form.get('video_tmpname')
    video_length = request.form.get('video_length')
    video_desc = request.form.get('video_desc')
    video_fulltext = request.form.get('video_fulltext')
    video_ip = request.form.get('video_ip')
    video_fclass = request.form.get('video_fclass')
    video_sclass = request.form.get('video_sclass')
    video_tclass = request.form.get('video_tclass')
    video_tags = request.form.get('video_tags')
    rel_biwen = request.form.get('rel_biwen')
    posterData = request.files.get('upposter')
    upstyle = request.form.get('upstyle')
    video_websrc = request.form.get('video_websrc')
    action = request.form.get('action')
    videochange = request.form.get('videochange')
    cuserid = current_user.id

    if action=='new':
        newv = Videos(
            video_title=video_title,
            video_desc=video_desc,
            video_fulltext=video_fulltext,
            video_ip=video_ip,
            video_length=video_length,
            video_class1=video_fclass,
            video_class2=video_sclass,
            video_class3=video_tclass,
            keywords=video_tags,
            create_time=datetime.datetime.now(),
            video_authorid=cuserid
            )
        db.session.add(newv)
        db.session.flush()
        
    elif action=='edit':
        videoid = request.form.get('videoid')
        newv = Videos.query.filter(Videos.videoid==videoid).first()
        newv.video_title=video_title
        newv.video_desc=video_desc
        newv.video_fulltext=video_fulltext
        newv.video_length=video_length
        newv.rel_biwen=rel_biwen
    print(upstyle)
    newv.poster_url=str(newv.videoid)+".jpg"
    db.session.commit()
    posterData.save(upload_path + 'videos/'+ str(newv.videoid)+".jpg")
    if upstyle=="Local" and videochange=="yes":
        newv.video_url=str(newv.videoid)+".mp4"
        db.session.commit()
        shutil.move(upload_path + 'tmp/'+video_tmpname, upload_path + 'videos/'+ newv.video_url)
    elif upstyle=="Web" and videochange=="yes":
        newv.video_url=video_websrc
        db.session.commit()
    dictv = {}
    dictv['videoid']=newv.videoid
    dictv['video_title']=newv.video_title
    dictv['video_desc']=newv.video_desc
    dictv['video_url']=newv.video_url
    dictv['poster_url']=newv.poster_url
    dictv['video_ip']=newv.video_ip
    ret = {'result': dictv}
    print(dictv)
    return json.dumps(ret)

@sp.route('/watchvideo/<videoid>', methods=['GET'])
@login_required
def watchvideo(videoid):
    vitem = Videos.query.filter(Videos.videoid==videoid).first()
    dictq = {}
    authorid = vitem.video_authorid
    dictq["videoid"]=vitem.videoid
    dictq["video_title"]=vitem.video_title
    dictq["video_desc"]=vitem.video_desc
    dictq["video_length"]=vitem.video_length
    dictq["video_fulltext"]=vitem.video_fulltext
    dictq["video_url"]=vitem.video_url
    dictq["poster_url"]=vitem.poster_url
    dictq["video_class1"]=vitem.video_class1
    dictq["video_class2"]=vitem.video_class2
    dictq["video_class3"]=vitem.video_class3
    dictq["favored"]=db.session.query(Favorites).filter_by(target_id=vitem.videoid,target_type='视频',user_id=current_user.id).count()
    dictq["favor_count"]=db.session.query(Favorites).filter_by(target_id=vitem.videoid,target_type='视频').count()
    dictq["video_ip"]=vitem.video_ip
    dictq["rel_biwen"]=vitem.rel_biwen
    dictq["authorid"]=authorid
    dictq["video_author"]=Users.query.filter_by(id=authorid).first().name
    return render_template("watchvideo.html", vidict=dictq)

@sp.route('/fetchclsvideos/', methods=['POST'])
def fetchclsvideos():
    clsdata = request.form.get('clsdata')
    cls = json.loads(clsdata)
    if cls[1]=='二级分类':
        qall = Videos.query.filter_by(hidden=0,video_class1=cls[2],video_class2=cls[3],video_class3='').order_by(Videos.create_time.desc()).all()
        #with_entities(Questions.ques_title,Questions.item_a,Questions.item_b)
    elif cls[1]=='三级分类':
        qall = Videos.query.filter_by(hidden=0,video_class1=cls[2],video_class2=cls[3],video_class3=cls[4]).order_by(Videos.create_time.desc()).all()
    listq = []
    for qq in qall:
        dictq = {}
        dictq['videoid']=qq.videoid
        dictq['video_title']=qq.video_title
        dictq['video_desc']=qq.video_desc
        authorid=qq.video_authorid
        dictq["video_author"]=Users.query.filter_by(id=authorid).first().name
        dictq["video_length"]=qq.video_length
        dictq['video_url']=qq.video_url
        dictq['poster_url']=qq.poster_url
        dictq['zan']=qq.zan
        dictq['video_ip']=qq.video_ip

        listq.append(dictq)
        #print(model_to_dict(qq))
        #print(dictq)
    ret = {'result': listq}
    return json.dumps(ret)


@sp.route('/calfees/', methods=['POST'])
@login_required
def calfees():
    videoid = int(request.form.get('videoid'))
    video_authorid = int(request.form.get('video_authorid'))
    video_author = request.form.get('video_author')
    video_title = request.form.get('video_title')
    video_ip = request.form.get('video_ip')
    iplist = ["搬运","节选","翻录","改编","原创"]
    pos = iplist.index(video_ip)+1
    video_style = request.form.get('video_style')
    if video_style=="single":
        usritem = Users.query.filter_by(id=current_user.id).first()
        usrblce = usritem.becoin - 0.1
        newbecoin = Becoinitems(
            user_id = current_user.id,
            user_name = current_user.name,
            target_title = video_title,
            target_type = "视频",
            target_id = videoid,
            oppo_type = "视频作者",
            oppo_name = video_author,
            oppo_id = video_authorid,
            change = -1,
            amount = 0.1,
            balance = usrblce,
            comments = current_user.name+"-单看"+video_title,
            create_time = datetime.datetime.now()
        )
        db.session.add(newbecoin)
        usritem.becoin = usrblce

        authoritem = Users.query.filter_by(id=video_authorid).first()
        authorblce = authoritem.becoin + 0.09*pos*0.2
        newbecoin2 = Becoinitems(
            user_id = video_authorid,
            user_name = video_author,
            target_title = video_title,
            target_type = "视频",
            target_id = videoid,
            oppo_type = "视频观众",
            oppo_name = current_user.name,
            oppo_id = current_user.id,
            change = 1,
            amount = 0.09*pos*0.2,
            balance = authorblce,
            comments = current_user.name+"-单看"+video_title,
            create_time = datetime.datetime.now()
        )
        db.session.add(newbecoin2)
        authoritem.becoin = authorblce

        sysitem = Users.query.filter_by(role='sys').first()
        sysblce = sysitem.becoin + 0.1 - 0.09*pos*0.2
        newbecoin3 = Becoinitems(
            user_id = sysitem.id,
            user_name = "系统",
            target_title = video_title,
            target_type = "视频",
            target_id = videoid,
            oppo_type = "视频作者",
            oppo_name = video_author,
            oppo_id = video_authorid,
            change = 1,
            amount = 0.1 - 0.09*pos*0.2,
            balance = sysblce,
            comments = current_user.name+"-单看"+video_title,
            create_time = datetime.datetime.now()
        )
        db.session.add(newbecoin3)
        sysitem.becoin = sysblce

    elif video_style=="course":
        courseid = int(request.form.get('courseid'))
        course_publisherid = int(request.form.get('course_publisherid'))
        course_title = request.form.get('course_title')
        course_publishername = request.form.get('course_publishername')
        usritem = Users.query.filter_by(id=current_user.id).first()
        usrblce = usritem.becoin - 0.1
        newbecoin = Becoinitems(
            user_id = current_user.id,
            user_name = current_user.name,
            target_title = video_title,
            target_type = "视频",
            target_id = videoid,
            oppo_type = "课程作者",
            oppo_name = course_publishername,
            oppo_id = course_publisherid,
            change = -1,
            amount = 0.1,
            balance = usrblce,
            comments = current_user.name+"-合看"+video_title+"---"+course_title,
        )
        db.session.add(newbecoin)
        usritem.becoin = usrblce

        authoritem = Users.query.filter_by(id=video_authorid).first()
        authorblce = authoritem.becoin + 0.05*pos*0.2
        newbecoin2 = Becoinitems(
            user_id = video_authorid,
            user_name = video_author,
            target_title = video_title,
            target_type = "视频",
            target_id = videoid,
            oppo_type = "视频观众",
            oppo_name = current_user.name,
            oppo_id = current_user.id,
            change = 1,
            amount = 0.05*pos*0.2,
            balance = authorblce,
            comments = current_user.name+"-合看"+video_title+"---"+course_title,
            create_time = datetime.datetime.now()
        )
        db.session.add(newbecoin2)
        authoritem.becoin = authorblce

        pubitem = Users.query.filter_by(id=course_publisherid).first()
        pubblce = pubitem.becoin + 0.04
        newbecoin3 = Becoinitems(
            user_id = course_publisherid,
            user_name = course_publishername,
            target_title = video_title,
            target_type = "视频",
            target_id = videoid,
            oppo_type = "视频观众",
            oppo_name = current_user.name,
            oppo_id = current_user.id,
            change = 1,
            amount = 0.04,
            balance = pubblce,
            comments = current_user.name+"-合看"+video_title+"---"+course_title,
            create_time = datetime.datetime.now()
        )
        db.session.add(newbecoin3)
        pubitem.becoin = pubblce

        sysitem = Users.query.filter_by(role='sys').first()
        sysblce = sysitem.becoin + 0.06 - 0.05*pos*0.2
        newbecoin4 = Becoinitems(
            user_id = sysitem.id,
            user_name = "系统",
            target_title = video_title,
            target_type = "视频",
            target_id = videoid,
            oppo_type = "课程作者",
            oppo_name = course_publishername,
            oppo_id = course_publisherid,
            change = 1,
            amount = 0.06 - 0.05*pos*0.2,
            balance = sysblce,
            comments = current_user.name+"-合看"+video_title+"---"+course_title,
            create_time = datetime.datetime.now()
        )
        db.session.add(newbecoin4)
        sysitem.becoin = sysblce
    
    
    db.session.commit()
    ret = {'result': 'calfeed'}
    return json.dumps(ret)




@sp.route('/editvideo/<videoid>', methods=['GET'])
def editvideo(videoid):
    vitem = Videos.query.filter(Videos.videoid==videoid).first()
    dictq = {}
    authorid = vitem.video_authorid
    dictq["videoid"]=vitem.videoid
    dictq["video_title"]=vitem.video_title
    dictq["video_desc"]=vitem.video_desc
    dictq["video_fulltext"]=vitem.video_fulltext
    dictq["video_url"]=vitem.video_url
    dictq["poster_url"]=vitem.poster_url
    dictq["video_length"]=vitem.video_length
    dictq["video_class1"]=vitem.video_class1
    dictq["video_class2"]=vitem.video_class2
    dictq["video_ip"]=vitem.video_ip
    dictq["video_author"]=Users.query.filter_by(id=authorid).first().name
    return render_template("editvideo.html", vidict=dictq)

@sp.route('/showcourse/', methods=['GET'])
def showcourse():
    call = Courselist.query.filter_by(hidden=0).all()
    allcourse = []
    for citem in call:
        dictq = {}
        authorid = citem.course_publisherid
        dictq["courseid"]=citem.courseid
        dictq["course_title"]=citem.course_title
        dictq["course_author"]=Users.query.filter_by(id=authorid).first().name
        allcourse.append(dictq)
    return render_template("showcourse.html", cdata = allcourse)


@sp.route('/editcourse/<courseid>', methods=['GET','POST'])
@login_required
def editcourse(courseid):
    allvideo = []
    course_title = ''
    if int(courseid)>0:
        courseitem = Courselist.query.filter_by(courseid=courseid).first()
        if courseitem:
            course_title = courseitem.course_title
            sql = '''
            SELECT videoid, video_num, show_title, course_part from videoitems
            where courseid=%s
            order by video_num
            '''% courseid
            cource_query = db.session.execute(text(sql))
            for tt in cource_query:
                videoitem = Videos.query.filter_by(videoid=tt[0]).first()
                dictv = {}
                dictv["videoid"]=videoitem.videoid
                dictv["course_part"]=tt[3]
                dictv["video_title"]=videoitem.video_title
                dictv["show_title"]=tt[2]
                dictv["video_desc"]=videoitem.video_desc
                dictv["isshow"]=False
                authorid=videoitem.video_authorid
                dictv["video_author"]=Users.query.filter_by(id=authorid).first().name
                dictv["video_length"]=videoitem.video_length
                dictv["video_url"]=videoitem.video_url
                dictv["poster_url"]=videoitem.poster_url
                dictv["video_ip"]=videoitem.video_ip
                allvideo.append(dictv)
        else:
            return redirect('/sp/editcourse/0')

    return render_template("editcourse.html", edata = allvideo, coursename = course_title)


@sp.route('/queryvideo/', methods=['POST'])
@login_required
def queryvideo():
    queryword = request.form.get('message')
    if len(queryword)==0:
        qall = Videos.query.filter_by(hidden=0).all()
        #with_entities(Questions.ques_title,Questions.item_a,Questions.item_b)
    else:
        qall = Videos.query.filter(
                            or_(Videos.video_title.like("%" + queryword + "%") if queryword is not None else "",
                            Videos.video_desc.like("%" + queryword + "%") if queryword is not None else "")
                            ).all()
    listq = []
    for qq in qall:
        dictq = {}
        dictq['videoid']=qq.videoid
        dictq['video_title']=qq.video_title
        dictq['video_desc']=qq.video_desc
        authorid=qq.video_authorid
        dictq["video_author"]=Users.query.filter_by(id=authorid).first().name
        dictq["video_length"]=qq.video_length
        dictq['video_url']=qq.video_url
        dictq['poster_url']=qq.poster_url
        dictq['zan']=qq.zan
        dictq['video_ip']=qq.video_ip

        listq.append(dictq)
        #print(model_to_dict(qq))
        #print(dictq)
    ret = {'result': listq}
    return json.dumps(ret)




@sp.route('/deletecourse/', methods=['POST'])
@login_required
def deletecourse():
    course_id = int(request.form.get('course_id'))
    cl = Courselist.query.filter_by(courseid=course_id).first()
    cl.hidden = 1
    db.session.commit()
    ret = {'result': 'deleted'}
    return json.dumps(ret)


@sp.route('/fetchques/', methods=['POST'])
@login_required
def fetchques():
    videoid = int(request.form.get('videoid'))
    quesitems = Questions.query.filter_by(main_videoid=videoid).all()
    quessend = []
    if quesitems:
        for qq in quesitems:
            quesitem = {}
            quesitem["quesid"] = qq.quesid
            quesitem["ques_title"] = qq.ques_title
            quesitem["ques_desc"] = qq.ques_desc
            quesitem["descpic_url"] = qq.descpic_url
            quesitem["ques_type"] = qq.ques_type
            quesitem["item_a"] = qq.item_a
            quesitem["item_b"] = qq.item_b
            quesitem["item_c"] = qq.item_c
            quesitem["item_d"] = qq.item_d
            quesitem["answer"] = qq.answer
            quesitem["explain"] = qq.explain
            quesitem["reviewed"] = qq.reviewed
            quesitem["reply"] = []
            quessend.append(quesitem)
    return json.dumps(quessend)

@sp.route('/fetchonevideo/', methods=['POST'])
@login_required
def fetchonevideo():
    videoid = int(request.form.get('videoid'))
    vitem = Videos.query.filter(Videos.videoid==videoid).first()
    dictq = {}
    authorid = vitem.video_authorid
    dictq["videoid"]=vitem.videoid
    dictq["video_title"]=vitem.video_title
    dictq["video_desc"]=vitem.video_desc
    dictq["video_length"]=vitem.video_length
    dictq["video_fulltext"]=vitem.video_fulltext
    dictq["video_url"]=vitem.video_url
    dictq["poster_url"]=vitem.poster_url
    dictq["video_class1"]=vitem.video_class1
    dictq["video_class2"]=vitem.video_class2
    dictq["video_class3"]=vitem.video_class3
    dictq["favored"]=db.session.query(Favorites).filter_by(target_id=vitem.videoid,target_type='视频',user_id=current_user.id).count()
    dictq["favor_count"]=db.session.query(Favorites).filter_by(target_id=vitem.videoid,target_type='视频').count()
    dictq["video_ip"]=vitem.video_ip
    dictq["rel_biwen"]=vitem.rel_biwen
    dictq["authorid"]=authorid
    dictq["video_author"]=Users.query.filter_by(id=authorid).first().name
    return json.dumps(dictq)

@sp.route('/beginlearn/<courseid>')
@login_required
def beginlearn(courseid):
    allvideo = []
    courseitem = Courselist.query.filter_by(courseid=courseid).first()
    coursedata = {}
    coursedata["courseid"]=courseid
    coursedata["course_title"]=courseitem.course_title
    coursedata["course_publisherid"]=courseitem.course_publisherid
    coursedata["course_publishername"]=Users.query.filter_by(id=courseitem.course_publisherid).first().name
    sql = '''
    SELECT videoid, video_num, show_title, course_part from videoitems
    where courseid=%s
    order by video_num
    '''% courseid
    cource_query = db.session.execute(text(sql))
    for tt in cource_query:
        videoitem = Videos.query.filter_by(videoid=tt[0]).first()
        dictv = {}
        dictv["videoid"]=videoitem.videoid
        dictv["course_part"]=tt[3]
        dictv["video_title"]=videoitem.video_title
        dictv["show_title"]=tt[2]
        dictv["video_desc"]=videoitem.video_desc
        dictv["isshow"]=False
        authorid=videoitem.video_authorid
        dictv["video_authorid"]=authorid
        dictv["video_author"]=Users.query.filter_by(id=authorid).first().name
        dictv["video_length"]=videoitem.video_length
        dictv["video_url"]=videoitem.video_url
        dictv["poster_url"]=videoitem.poster_url
        dictv["video_ip"]=videoitem.video_ip
        allvideo.append(dictv)
    return render_template("beginlearn.html", vdata = allvideo, coursedata=coursedata)

@sp.route('/savecourse/', methods=['POST'])
@login_required
def savecourse():
    course_id = int(request.form.get('course_id'))
    course_title = request.form.get('course_title')
    author_id = request.form.get('author_id')
    deleted_data = request.form.get('deleted_data')
    course_data = request.form.get('course_data')
    print(course_id)
    print(course_title)
    print(json.loads(deleted_data))
    print(json.loads(course_data))
    if course_id == 0:
        newcourse = Courselist(course_title=course_title, course_publisherid=author_id)
        db.session.add(newcourse)
        db.session.flush()
        course_id = newcourse.courseid
        db.session.commit()
        if json.loads(course_data):
            for i,ad in enumerate(json.loads(course_data)):
                sql = '''
                INSERT into videoitems (courseid, videoid, video_num, show_title, course_part)
                values (%d, %d, %d, '%s', '%s')
                '''% (course_id, ad['videoid'], i,ad['show_title'],ad['course_part'])
                db.session.execute(text(sql))
            db.session.commit()
    else:
        cl = Courselist.query.filter_by(courseid=course_id).first()
        print(cl.course_title)
        cl.course_title = course_title
        db.session.commit()
        if json.loads(deleted_data):
            for dd in json.loads(deleted_data):
                sql = '''
                DELETE from videoitems
                where courseid=%s and videoid = %d
                '''% (course_id, dd)
                db.session.execute(text(sql))
            db.session.commit()
        if json.loads(course_data):
            for i,ad in enumerate(json.loads(course_data)):
                sql = '''
                SELECT videoitemid from videoitems
                where courseid=%d and videoid=%d
                '''% (course_id,ad['videoid'])
                video = db.session.execute(text(sql)).first()
                #print(dir(test))
                
                if video:
                    sql = '''
                    UPDATE videoitems
                    set video_num = %d, show_title = '%s', course_part = '%s'
                    where courseid=%d and videoid=%d
                    '''% (i,ad['show_title'], ad['course_part'], course_id, ad['videoid'])
                    db.session.execute(text(sql))
                else:
                    sql = '''
                    INSERT into videoitems (courseid, videoid, video_num, show_title, course_part)
                    values (%d, %d, %d, '%s', '%s')
                    '''% (course_id, ad['videoid'], i,ad['show_title'],ad['course_part'])
                    db.session.execute(text(sql))
                    print("插入一条数据")
            db.session.commit()
    ret = {'result': 'ok'}
    return json.dumps(ret)
