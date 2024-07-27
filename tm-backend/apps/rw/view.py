from flask import Flask, render_template, request, send_from_directory
from flask import Blueprint, redirect, url_for
from apps.login.beknowmodels import *
from flask_login import login_required,current_user
from sqlalchemy import or_, and_
import sys
import os
import shutil
import json
import time
import datetime

UPLOAD_PATH = "./uploads/"
rw = Blueprint('rw',__name__,template_folder='./templates', static_folder='./static')
@rw.route('/')
@login_required
def admin():
    tall = Tasks.query.filter_by(
        hidden=0,
        task_taker=current_user.id,
        finished=0
        ).order_by(Tasks.create_time.desc()).all()
    tlist = []
    for tt in tall:
        tmp = {}
        tmp['taskid'] = tt.taskid
        tmp['task_title'] = tt.task_title
        tmp['task_type'] = tt.task_type
        tmp['admin_name'] = tt.admin_name
        tmp['admin_id'] = tt.admin_id
        tmp['bonus'] = tt.bonus
        tmp['task_phase'] = tt.task_phase
        tmp['deadline'] = str(tt.deadline)
        tlist.append(tmp)
    pall = Tasks.query.filter_by(
        hidden=0,
        admin_id=current_user.id,
        finished=0
        ).order_by(Tasks.create_time.desc()).all()
    plist = []
    for pp in pall:
        tmp = {}
        tmp['taskid'] = pp.taskid
        tmp['task_title'] = pp.task_title
        tmp['task_type'] = pp.task_type
        tmp['taker_name'] = pp.taker_name
        tmp['task_taker'] = pp.task_taker
        tmp['bonus'] = pp.bonus
        tmp['task_phase'] = pp.task_phase
        tmp['deadline'] = str(pp.deadline)
        plist.append(tmp)
    fall = Tasks.query.filter_by(
        hidden=0,
        task_taker=current_user.id,
        finished=1
        ).order_by(Tasks.create_time.desc()).limit(100).all()
    flist = []
    for ff in fall:
        tmp = {}
        tmp['taskid'] = ff.taskid
        tmp['task_title'] = ff.task_title
        tmp['task_type'] = ff.task_type
        tmp['admin_name'] = ff.admin_name
        tmp['admin_id'] = ff.admin_id
        tmp['bonus'] = ff.bonus
        tmp['task_phase'] = ff.task_phase
        tmp['finish_time'] = str(ff.finish_time)
        flist.append(tmp)
    rall = Tasks.query.filter_by(
        hidden=0,
        admin_id=current_user.id,
        finished=1
        ).order_by(Tasks.create_time.desc()).limit(100).all()
    rlist = []
    for rr in rall:
        tmp = {}
        tmp['taskid'] = rr.taskid
        tmp['task_title'] = rr.task_title
        tmp['task_type'] = rr.task_type
        tmp['taker_name'] = rr.taker_name
        tmp['task_taker'] = rr.task_taker
        tmp['bonus'] = rr.bonus
        tmp['task_phase'] = rr.task_phase
        tmp['finish_time'] = str(rr.finish_time)
        rlist.append(tmp)
    return render_template("taskindex.html",tdata=tlist,pdata=plist,fdata=flist,rdata=rlist)

@rw.route('/mall/')
def mall():
    tmall = Tasks.query.filter_by(
        hidden=0,
        task_taker=None,
        finished=0
        ).all()
    usrinfo = {}
    if current_user.is_authenticated:
        usrinfo["usrid"] = current_user.id
        usrinfo["usrname"] = current_user.name
    else:
        usrinfo["usrid"] = 0
        usrinfo["usrname"] = ""
    malldata=[]
    for tt in tmall:
        mdata = {}
        mdata['taskid']=tt.taskid
        mdata['task_title']=tt.task_title
        mdata['task_type']=tt.task_type
        mdata['admin_name']=tt.admin_name
        mdata['deadline']=str(tt.deadline)
        mdata['bonus']=tt.bonus
        malldata.append(mdata)

    return render_template("taskmall.html",tmall=malldata, usrinfo=usrinfo)



@rw.route('/newproject/')
def newproject():
    return render_template("newproject.html")



@rw.route('/addnewproject/', methods=['POST'])
@login_required
def addnewproject():
    newpro = Projects(
        project_admin = current_user.id,
        project_title = request.form.get("project_title"),
        project_desc = request.form.get("project_desc"),
    )
    db.session.add(newpro)
    db.session.flush()
    db.session.commit()
    print('已添加--'+newpro.project_title)
    ret = {'result': 'OK'}
    return json.dumps(ret)

@rw.route('/showproject/')
@login_required
def showproject():
    pall = Projects.query.filter_by(hidden=0).all()
    allpro = []
    for pitem in pall:
        dictp = {}
        adminid = pitem.project_admin
        dictp["projectid"]=pitem.projectid
        dictp["project_title"]=pitem.project_title
        dictp["project_author"]=Users.query.filter_by(id=adminid).first().name
        allpro.append(dictp)
    return render_template("showproject.html", pdata = allpro)

@rw.route('/viewproject/<pro_id>')
def viewproject(pro_id):
    pr = Projects.query.filter_by(projectid=pro_id).first()
    return render_template("viewproject.html", pr=pr)

@rw.route('/editproject/<pro_id>')
@login_required
def editproject(pro_id):
    pr = Projects.query.filter_by(projectid=pro_id).first()
    return render_template("editproject.html", pr=pr)

@rw.route('/saveproject/', methods=['POST'])
@login_required
def saveproject():
    pro_id = request.form.get("pro_id")
    pr = Projects.query.filter_by(projectid=pro_id).first()
    tasklist = json.loads(request.form.get("taskinfo"))
    deletelist = json.loads(request.form.get("deleteditem"))
    for i,tt in enumerate(tasklist):
        if tt[0]==0:
            newtask = Tasks(
                project_id=pro_id,
                admin_name=Users.query.filter_by(id=pr.project_admin).first().name,
                currentnode=str(i+1),
                lastnode=tt[1],
                nextnode=tt[2],
                task_title=tt[3],
                task_taker = Users.query.filter_by(name=tt[4]).first().id,
                deadline=tt[5],
                take_time=datetime.datetime.now()
            )
            db.session.add(newtask)
            db.session.commit()
            db.session.flush()
            tt[0]=newtask.taskid

        elif int(tt[0])>0:
            ta = Tasks.query.filter_by(taskid=int(tt[0])).first()
            ta.project_id=pro_id,
            ta.admin_name=Users.query.filter_by(id=pr.project_admin).first().name,
            ta.currentnode=str(i+1),
            ta.lastnode=tt[1],
            ta.nextnode=tt[2],
            ta.task_title=tt[3],
            ta.task_taker = Users.query.filter_by(name=tt[4]).first().id,
            ta.deadline=tt[5],
            ta.take_time=datetime.datetime.now()
    pr.sln_desc = json.dumps(tasklist)
    db.session.commit()
    for dd in deletelist:
        ta = Tasks.query.filter_by(taskid=int(dd[0])).first()
        ta.hidden = 1
    db.session.commit()
    print('已更新--'+pr.project_title)
    ret = {'result': pr.project_title}
    return json.dumps(ret)


@rw.route('/deletepro/', methods=['POST'])
@login_required
def deletepro():
    pro_id = int(request.form.get('pro_id'))
    pr = Projects.query.filter_by(projectid=pro_id).first()
    pr.hidden = 1
    db.session.commit()
    ret = {'result': 'deleted'}
    return json.dumps(ret)

import ast


@rw.route('/editotm/')
@login_required
def editotm():
    userid = str(current_user.id)
    pr = []
    fn = []
    if os.path.exists(f"./apps/rw/static/otm/t{userid}.txt"):
        with open(f"./apps/rw/static/otm/t{userid}.txt", "r", encoding="utf-8") as f:
            pr=f.readlines()
    pr = [ast.literal_eval(x) for x in pr]
    if os.path.exists(f"./apps/rw/static/otm/f{userid}.txt"):
        with open(f"./apps/rw/static/otm/f{userid}.txt", "r", encoding="utf-8") as f:
            fn=f.readlines()
    fn = [ast.literal_eval(x) for x in fn]
    fn.reverse()
    return render_template("otm.html", pr=pr, fn=fn)

@rw.route('/get_pr/', methods=['GET'])
@login_required
def get_pr():
    userid = str(current_user.id)
    pr = []
    if os.path.exists(f"./apps/rw/static/otm/t{userid}.txt"):
        with open(f"./apps/rw/static/otm/t{userid}.txt", "r", encoding="utf-8") as f:
            pr=f.readlines()
    pr = [ast.literal_eval(x) for x in pr]
    return json.dumps(pr)

@rw.route('/saveotm/', methods=['POST'])
@login_required
def saveotm():
    userid = str(current_user.id)
    tasklist = json.loads(request.form.get("taskinfo"))
    with open(f"./apps/rw/static/otm/t{userid}.txt", "w", encoding="utf-8") as f:
        for line in tasklist:
            f.write(str(line) + "\n")
    return json.dumps("successsave")

@rw.route('/finishotm/', methods=['POST'])
@login_required
def finishotm():
    userid = str(current_user.id)
    finishitem = json.loads(request.form.get("finishitem"))
    finishitem.reverse()
    with open(f"./apps/rw/static/otm/f{userid}.txt", "a", encoding="utf-8") as f:
        for line in finishitem:
            f.write(str(line) + "\n")
    return json.dumps("successfinish")

@rw.route('/edit_motm/')
@login_required
def edit_motm():
    # motm 全称 manage object time management
    userid = str(current_user.id)
    magage_items = []
    if os.path.exists(f"./apps/rw/static/otm/m{userid}.txt"):
        with open(f"./apps/rw/static/otm/m{userid}.txt", "r", encoding="utf-8") as f:
            magage_items=f.readlines()
    magage_items = [ast.literal_eval(x) for x in magage_items]
    return render_template("motm.html", m_items=magage_items)

@rw.route('/save_motm/', methods=['POST'])
@login_required
def save_motm():
    userid = str(current_user.id)
    motm_list = json.loads(request.form.get("motm_info"))
    with open(f"./apps/rw/static/otm/m{userid}.txt", "w", encoding="utf-8") as f:
        for line in motm_list:
            f.write(str(line) + "\n")
    return json.dumps("successsave")

@rw.route('/view_motm/', methods=['POST'])
@login_required
def view_motm():
    view_item = json.loads(request.form.get("view_info"))
    all_otm = []
    name_list = view_item[2].split("、")
    for name in name_list:
        if len(name)>1:
            userid = Users.query.filter_by(name=name).first().id
            pr=[]
            if os.path.exists(f"./apps/rw/static/otm/t{userid}.txt"):
                with open(f"./apps/rw/static/otm/t{userid}.txt", "r", encoding="utf-8") as f:
                    pr=f.readlines()
            pr = [ast.literal_eval(x) for x in pr]
            fn=[]
            if os.path.exists(f"./apps/rw/static/otm/f{userid}.txt"):
                with open(f"./apps/rw/static/otm/f{userid}.txt", "r", encoding="utf-8") as f:
                    fn=f.readlines()
            fn = [ast.literal_eval(x) for x in fn]
            fn.reverse()
            pr = pr+fn
            if view_item[0]=="" and view_item[1]=="":
                for x in pr:
                    x.append(name)
                all_otm.extend(pr)
            elif view_item[0]!="" and view_item[1]=="":
                for x in pr:
                    if x[0]==view_item[0]:
                        x.append(name)
                        all_otm.append(x)
            else:
                for x in pr:
                    if x[0]==view_item[0] and x[1]==view_item[1]:
                        x.append(name)
                        all_otm.append(x)
    return json.dumps(all_otm)


@rw.route('/send_motm/', methods=['POST'])
@login_required
def send_motm():
    motm_items = json.loads(request.form.get("motm_info"))
    for item in motm_items:
        user = Users.query.filter_by(name=item[2]).first()
        if user:
            with open(f"./apps/rw/static/otm/t{user.id}.txt", "a", encoding="utf-8") as f:
                line = [item[0], item[1], item[3],'','','','','','']
                f.write(str(line) + "\n")
    return json.dumps("successsend")





@rw.route('/newtask/')
@login_required
def newtask():
    usrq = Users.query.all()
    usrslist = []
    for rr in usrq:
        dictu = {}
        dictu['Username']=rr.name
        dictu['Userid']=rr.id
        usrslist.append(dictu)
    return render_template("newtask.html", usrsl=usrslist)





@rw.route('/edittask/<ta_id>')
@login_required
def edittask(ta_id):
    usrq = Users.query.all()
    usrslist = []
    for rr in usrq:
        dictu = {}
        dictu['Username']=rr.name
        dictu['Userid']=rr.id
        usrslist.append(dictu)
    ta = Tasks.query.filter_by(taskid=int(ta_id)).first()
    dictt = {}
    takerid = ta.task_taker
    dictt["taskid"]=ta.taskid
    dictt["task_title"]=ta.task_title
    dictt["task_desc"]=ta.task_desc
    dictt["bonus"]=ta.bonus
    dictt["task_phase"]=ta.task_phase
    dictt["pubpic_url"]=ta.pubpic_url
    dictt["pubfile_url"]=ta.pubfile_url
    dictt["pubfile_name"]=ta.pubfile_url
    if takerid:
        dictt["task_taker"]=Users.query.filter_by(id=takerid).first().name
    else:
        dictt["task_taker"]=""
    dictt["takerid"]=ta.task_taker
    dictt["deadline"]=ta.deadline.strftime("%Y-%m-%d %H:%M:%S")
    return render_template("edittask.html", dta=dictt, usrsl=usrslist)

@rw.route('/createtask/', methods=['GET','POST'])
@login_required
def createtask():
    taker = request.form.get("task_taker")
    learnjson = request.form.get("learnlist")
    list_papers = []
    list_courses = []
    if learnjson:
        learnlist = json.loads(learnjson)
        for it in learnlist:
            if it[1] == '试卷':
                list_papers.append(str(it[0]))
            elif it[1] == '课程':
                list_courses.append(str(it[0]))
    takername = request.form.get("task_takername")
    if int(taker)==0:
        taker=None
        takername = None
    descpic = request.files.get('descposter')
    newtask = Tasks(
        admin_name = current_user.name,
        admin_id = current_user.id,
        task_title = request.form.get("task_title"),
        task_desc = request.form.get("task_desc"),
        task_type = request.form.get('task_type'),
        task_repeat = int(request.form.get('task_repeat')),
        learn_papers = ",".join(list_papers),
        learn_courses = ",".join(list_courses),
        bonus = request.form.get("bonus"),
        deadline = datetime.datetime.strptime(request.form.get("deadline"), "%Y-%m-%d %H:%M:%S"),
        take_time=datetime.datetime.now(),
        task_taker = taker,
        taker_name = takername,
        task_phase = "发布",
    )
    db.session.add(newtask)
    db.session.commit()
    db.session.flush()
    ta_id = newtask.taskid
    ta = Tasks.query.filter_by(taskid=int(ta_id)).first()
    if request.form.get('task_type')=='问答任务':
        itemjson = request.form.get("querylist")
        print('创建问答任务')
        itemlist = json.loads(itemjson)
        for i in range(4):
            if i+1>len(itemlist):
                itemlist.append(None)
        tempques = Questions(
                ques_type = request.form.get("ques_type"),
                item_a = itemlist[0],
                item_b = itemlist[1],
                item_c = itemlist[2],
                item_d = itemlist[3],
                rel_taskid = ta_id
            )
        db.session.add(tempques)
        db.session.commit()
        db.session.flush()
        
        ta.rel_quesid = tempques.quesid
        db.session.commit()
    if request.form.get('descposter_has') and descpic:
        newtask.pubpic_url = str(ta_id)+"_pub"+".jpg"
        descpic.save(UPLOAD_PATH + 'rw/images/'+ str(ta_id)+"_pub"+".jpg")
    db.session.commit()

    usritem = Users.query.filter_by(id=current_user.id).first()
    miditem = Users.query.filter_by(role="trans").first()
    blce = usritem.becoin - newtask.bonus
    newbecoin = Becoinitems(
        user_id = current_user.id,
        user_name = current_user.name,
        target_title = newtask.task_title,
        target_type = newtask.task_type,
        target_id = newtask.taskid,
        oppo_type = "系统",
        oppo_name = "转存",
        oppo_id = miditem.id,
        change = -1,
        amount = newtask.bonus,
        balance = blce,
        comments = "发布"+newtask.task_title,
        create_time = datetime.datetime.now()
    )
    db.session.add(newbecoin)
    usritem.becoin = blce
    
    miditem.becoin = miditem.becoin + newtask.bonus
    db.session.commit()

    if request.form.get('online_coding')=="true":
        print(request.form.get("py_content"))
        tempcode = Cocode(
                user_id = current_user.id,
                user_name = current_user.name,
                task_id = ta_id,
                code_type = "task",
                lang = str(request.form.get("show_editor")),
                code1 = request.form.get("html_content"),
                code2 = request.form.get("js_content"),
                code3 = request.form.get("py_content")
            )
        db.session.add(tempcode)
        db.session.commit()
        db.session.flush()
        ta.rel_codeid = tempcode.codeid
        db.session.commit()
    print('已添加--'+newtask.task_title)
    ret = {'result': ta_id}
    return json.dumps(ret)

@rw.route('/savetask/', methods=['GET','POST'])
@login_required
def savetask():
    ta_id = 0
    if request.form.get("task_action")=="edit":
        ta_id = request.form.get("ta_id")
        print("开始编辑任务")
        print(ta_id)
        db.session.commit()
        ta = Tasks.query.filter_by(taskid=int(ta_id)).first()
        ta.task_title = request.form.get("task_title")
        ta.task_desc = request.form.get("task_desc")
        ta.bonus = request.form.get("bonus")
        if request.form.get("task_taker")=='null':
            ta.task_taker = None
            ta.taker_name = None
            ta.task_phase = '发布'
        else:
            ta.task_taker = request.form.get("task_taker")
            ta.taker_name = request.form.get("taker_name")
        ta.deadline = request.form.get("deadline")
        if request.form.get("pic_update"):
            descpic = request.files.get('descposter')
            ta.pubpic_url = str(ta_id)+"_pub"+".jpg"
            descpic.save(UPLOAD_PATH + 'rw/images/'+ str(ta.taskid)+"_pub"+".jpg")
        elif not request.form.get('descposter_has'):
            ta.pubpic_url = None
            try:
                os.remove(UPLOAD_PATH + 'rw/images/'+ str(ta.taskid)+"_pub"+".jpg")
            except:
                pass

        if request.form.get("file_update"):
            # 把文件从tmp移动到文件夹
            tmpname = request.form.get("file_tmpname")
            oriname = request.form.get("file_oriname")
            file_type = tmpname.split(".")[-1]
            start_path = UPLOAD_PATH + 'rw/tmp/'+ request.form.get("file_tmpname")
            end_path = UPLOAD_PATH + 'rw/files/'+ str(ta_id)+"_pub"+"."+file_type
            ta.pubfile_url = str(ta_id)+"_pub"+"."+file_type
            ta.pubfile_name = oriname
            shutil.move(start_path, end_path)
            
        elif not request.form.get('descfile_has'):
            ta.pubfile_url = None
            try:
                os.remove(UPLOAD_PATH + 'rw/files/' + str(ta_id)+"_pub"+"."+file_type)
            except:
                pass
        db.session.commit()
        print('已编辑--'+ta.task_title)
    elif request.form.get("task_action")=="submit":
        ta_id = request.form.get("ta_id")
        ta = Tasks.query.filter_by(taskid=ta_id).first()
        ta.sln_desc = request.form.get("task_rst")
        if request.form.get("task_type")=="问答任务":
            print("提交答案")
            print(request.form.get("daan"))
            qu = Questions.query.filter_by(quesid=ta.rel_quesid).first()
            qu.answer = request.form.get("daan")
            qu.item_a = request.form.get("item_a")
            qu.item_b = request.form.get("item_b")
            qu.item_c = request.form.get("item_c")
            qu.item_d = request.form.get("item_d")
        if request.form.get("slnposter_update"):
            slnposter = request.files.get('slnposter')
            ta.slnpic_url = str(ta_id)+"_sln"+".jpg"
            slnposter.save(UPLOAD_PATH + 'rw/images/'+ str(ta.taskid)+"_sln"+".jpg")
        elif not request.form.get('slnposter_has'):
            ta.slnpic_url = None
            try:
                os.remove(UPLOAD_PATH + 'rw/images/'+ str(ta.taskid)+"_sln"+".jpg")
            except:
                pass

        if request.form.get("slnfile_update"):
            # 把文件从tmp移动到文件夹
            tmpname = request.form.get("file_tmpname")
            file_type = tmpname.split(".")[-1]
            start_path = UPLOAD_PATH + 'rw/tmp/' + request.form.get("file_tmpname")
            end_path = UPLOAD_PATH + 'rw/files/' + str(ta_id)+"_sln"+"."+file_type
            ta.slnfile_url = str(ta_id)+"_sln"+"."+file_type
            ta.slnfile_name = request.form.get("file_oriname")
            shutil.move(start_path, end_path)
            
        elif not request.form.get('slnfile_has'):
            ta.pubfile_url = None
            try:
                os.remove(UPLOAD_PATH + 'rw/files/' + str(ta_id)+"_sln"+"."+file_type)
            except:
                pass
        ta.task_phase = "提交"
        ta.submitted = 1
        ta.submit_time = datetime.datetime.now()
        db.session.commit()
        print('已提交--'+ta.task_title)
    ret = {'result': ta_id}
    return json.dumps(ret)


@rw.route('/jieshoutask/', methods=['POST'])
@login_required
def jieshoutask():
    ta_id = int(request.form.get("ta_id"))
    ta = Tasks.query.filter_by(taskid=ta_id).first()
    deci = request.form.get("jieshou")
    ta.task_phase = deci
    if deci=='拒接':
        ta.task_taker = None
        ta.taker_name = None
    db.session.commit()
    ret = {'result': ta_id}
    return json.dumps(ret)



@rw.route('/showtask/')
@login_required
def showtask():
    tall = Tasks.query.filter_by(hidden=0).order_by(Tasks.create_time.desc()).all()
    allta = []
    for titem in tall:
        dictt = {}
        takerid = titem.task_taker
        dictt["taskid"]=titem.taskid
        dictt["task_title"]=titem.task_title
        dictt["task_phase"]=titem.task_phase
        if takerid:
            dictt["task_taker"]=Users.query.filter_by(id=takerid).first().name
        else:
            dictt["task_taker"]="待接手"
        allta.append(dictt)
    return render_template("showtask.html", tdata = allta)

@rw.route('/viewtask/<ta_id>')
def viewtask(ta_id):
    ta = Tasks.query.filter_by(taskid=ta_id).first()
    dictt = {}
    takerid = ta.task_taker
    dictt["taskid"]=ta.taskid
    dictt["task_title"]=ta.task_title
    dictt["task_desc"]=ta.task_desc
    dictt["task_type"]=ta.task_type
    dictt["admin_name"]=ta.admin_name
    if current_user.is_authenticated:
        dictt["usrid"] = current_user.id
        dictt["usrname"] = current_user.name
    else:
        dictt["usrid"] = 0
        dictt["usrname"] = ""
    if ta.task_type=='学习任务':
        learntali = []
        if ta.learn_papers:
            learnpali = ta.learn_papers.split(',')
            for it in learnpali:
                tt = Testpapers.query.filter_by(testpaperid=int(it)).first()
                pp = Paperperform.query.filter(
                    and_(
                        Paperperform.paper_id == int(it),
                        Paperperform.user_id == takerid,
                        Paperperform.finish_time>ta.create_time
                        )
                    ).all()
                curscore = 0
                if pp:
                    for itpp in pp:
                        if int(itpp.getscore / itpp.fullscore * 100) > curscore:
                            curscore = int(itpp.getscore / itpp.fullscore * 100)
                learntali.append([it,'试卷',tt.testpaper_title,curscore])
        dictt['learnlist']=learntali
    if ta.task_type=="问答任务":
        qu = Questions.query.filter_by(quesid=ta.rel_quesid).first()
        dictt["ques_type"]=qu.ques_type
        dictt["item_a"]=qu.item_a
        dictt["item_b"]=qu.item_b
        dictt["item_c"]=qu.item_c
        dictt["item_d"]=qu.item_d
        dictt["daan"]=qu.answer
    dictt["admin_name"]=ta.admin_name
    if takerid:
        dictt["task_taker"]=Users.query.filter_by(id=takerid).first().name
    else:
        dictt["task_taker"]="待接手"

    if ta.rel_codeid:
        code = Cocode.query.filter_by(codeid=ta.rel_codeid).first()
        dictt["online_coding"]="true"
        dictt["lang"]=code.lang
        dictt["code1"]=code.code1
        dictt["code2"]=code.code2
        dictt["code3"]=code.code3
    
    dictt["curcode1"]=""
    dictt["curcode2"]=""
    dictt["curcode3"]=""
    curcode = Cocode.query.filter_by(task_id=ta_id,code_type='sln',user_id=takerid).first()
    if curcode:
        if curcode.code1:
            dictt["curcode1"]=curcode.code1
        if curcode.code2:
            dictt["curcode2"]=curcode.code2
        if curcode.code3:
            dictt["curcode3"]=curcode.code3
    else:
        if "code1" in dictt:
            dictt["curcode1"]=dictt["code1"]
        if "code2" in dictt:
            dictt["curcode2"]=dictt["code2"]
        if "code3" in dictt:
            dictt["curcode3"]=dictt["code3"]
    
    dictt["deadline"]=ta.deadline.strftime("%Y-%m-%d %H:%M:%S")
    dictt["task_phase"]=ta.task_phase
    dictt["pubpic_url"]=ta.pubpic_url
    dictt["pubfile_url"]=ta.pubfile_url
    dictt["pubfile_name"]=ta.pubfile_name
    dictt["sln_desc"]=ta.sln_desc
    dictt["slnpic_url"]=ta.slnpic_url
    dictt["slnfile_url"]=ta.slnfile_url
    dictt["slnfile_name"]=ta.slnfile_name
    return render_template("viewtask.html", dta=dictt)



@rw.route('/uptaskfile/', methods=['POST'])
@login_required
def uptaskfile():
    f = request.files['descfi']
    file_name_ori = f.filename
    file_type = file_name_ori.split(".")[-1]
    file_name_tmp = datetime.datetime.now().strftime('%Y%m%d%H%M%S') + '.' + file_type
    file_path = UPLOAD_PATH + 'rw/tmp/'+file_name_tmp
    f.save(file_path)
    ret = {'ori': file_name_ori, 'tmp':file_name_tmp}
    return json.dumps(ret)


@rw.route('/deleteta/', methods=['POST'])
@login_required
def deleteta():
    ta_id = int(request.form.get('ta_id'))
    ta = Tasks.query.filter_by(taskid=ta_id).first()
    ta.hidden = 1
    db.session.commit()
    ret = {'result': 'deleted'}
    return json.dumps(ret)

@rw.route('/dotask/<ta_id>', methods=['GET','POST'])
@login_required
def dotask(ta_id):
    ta = Tasks.query.filter_by(taskid=ta_id).first()
    dictt = {}
    takerid = ta.task_taker
    dictt["taskid"]=ta.taskid
    dictt["task_title"]=ta.task_title
    dictt["task_desc"]=ta.task_desc
    dictt["task_type"]=ta.task_type
    if ta.task_type=='学习任务':
        learntali = []
        courseli = []
        if ta.learn_courses:
            courseids = ta.learn_courses.split(',')
            for cid in courseids:
                cc = Courselist.query.filter_by(courseid=int(cid)).first()
                courseli.append([cid,'课程',cc.course_title,cc.video_num])
        if ta.learn_papers:
            learnpali = ta.learn_papers.split(',')
            for it in learnpali:
                tt = Testpapers.query.filter_by(testpaperid=int(it)).first()
                pp = Paperperform.query.filter(
                    and_(
                        Paperperform.paper_id == int(it),
                        Paperperform.user_id == takerid,
                        Paperperform.finish_time>ta.create_time
                        )
                    ).all()
                curscore = "无"
                if pp:
                    curscore = 0
                    for itpp in pp:
                        if int(itpp.getscore / itpp.fullscore * 100) > curscore:
                            curscore = int(itpp.getscore / itpp.fullscore * 100)
                learntali.append([it,'试卷',tt.testpaper_title,curscore])
        dictt['learnlist']=courseli+learntali

    if ta.task_type=='问答任务':
        qu = Questions.query.filter_by(quesid=ta.rel_quesid).first()
        dictt["ques_type"]=qu.ques_type
        dictt["item_a"]=qu.item_a
        dictt["item_b"]=qu.item_b
        dictt["item_c"]=qu.item_c
        dictt["item_d"]=qu.item_d
        dictt["daan"]=qu.answer
    
    if ta.rel_codeid:
        code = Cocode.query.filter_by(codeid=ta.rel_codeid).first()
        dictt["online_coding"]="true"
        dictt["lang"]=code.lang
        dictt["code1"]=code.code1
        dictt["code2"]=code.code2
        dictt["code3"]=code.code3
    
    dictt["curcode1"]=""
    dictt["curcode2"]=""
    dictt["curcode3"]=""
    curcode = Cocode.query.filter_by(task_id=ta_id,code_type='sln',user_id=current_user.id).first()
    if curcode:
        if curcode.code1:
            dictt["curcode1"]=curcode.code1
        if curcode.code2:
            dictt["curcode2"]=curcode.code2
        if curcode.code3:
            dictt["curcode3"]=curcode.code3
    else:
        if "code1" in dictt:
            dictt["curcode1"]=dictt["code1"]
        if "code2" in dictt:
            dictt["curcode2"]=dictt["code2"]
        if "code3" in dictt:
            dictt["curcode3"]=dictt["code3"]
        

    dictt["task_phase"]=ta.task_phase
    dictt["curr_comments"]=ta.curr_comments
    dictt["task_taker"]=Users.query.filter_by(id=takerid).first().name
    dictt["deadline"]=ta.deadline.strftime("%Y-%m-%d %H:%M:%S")
    dictt["pubpic_url"]=ta.pubpic_url
    dictt["pubfile_url"]=ta.pubfile_url
    dictt["pubfile_name"]=ta.pubfile_name
    dictt["sln_desc"]=ta.sln_desc
    dictt["slnpic_url"]=ta.slnpic_url
    dictt["slnfile_url"]=ta.slnfile_url
    dictt["slnfile_name"]=ta.slnfile_url

    return render_template("dotask.html", dta=dictt)


@rw.route('/savecode/', methods=['POST'])
@login_required
def savecode():
    ta_id = int(request.form.get('task_id'))
    code = Cocode.query.filter_by(task_id=ta_id,code_type='sln',user_id=current_user.id).first()
    if not code:
        code = Cocode(
            user_id = current_user.id,
            user_name = current_user.name,
            task_id = ta_id,
            code_type = "sln",
            lang = str(request.form.get("show_editor"))
        )
        db.session.add(code)
        db.session.commit()
        db.session.flush()
    if str(request.form.get("show_editor"))=="0":
        code.code1 = request.form.get("html_code")
    elif str(request.form.get("show_editor"))=="1":
        code.code1 = request.form.get("html_code")
        code.code2 = request.form.get("js_code")
    elif str(request.form.get("show_editor"))=="2":
        code.code3 = request.form.get("py_code")
    code.edit_time = datetime.datetime.now()
    db.session.commit()
    ret = {'result': 'code saved!'}
    return json.dumps(ret)


@rw.route('/completeta/', methods=['POST'])
@login_required
def completeta():
    ta_id = int(request.form.get('taskid'))
    ta = Tasks.query.filter_by(taskid=ta_id).first()
    ta.decision = request.form.get('jueding')
    if request.form.get('jueding')=="返工":
        ta.curr_comments = request.form.get('fangongdesc')
        ta.task_phase = "返工"
    elif request.form.get('jueding')=="合格":
        ta.finished = 1
        ta.finish_time = datetime.datetime.now()
        ta.task_phase = "完成"
        coinitem = Becoinitems.query.filter_by(target_id=ta_id,user_id=current_user.id).first()
        if coinitem:
            coinitem.oppo_type = "执行人"
            coinitem.oppo_name = ta.taker_name
            coinitem.oppo_id = ta.task_taker
            usritem = Users.query.filter_by(id=ta.task_taker).first()
            usritem.becoin = usritem.becoin + ta.bonus*0.9
            db.session.commit()
            newbecoin = Becoinitems(
                user_id = ta.task_taker,
                user_name = ta.taker_name,
                target_title = ta.task_title,
                target_type = ta.task_type,
                target_id = ta.taskid,
                oppo_type = "发布人",
                oppo_id = current_user.id,
                oppo_name = current_user.name,
                change = 1,
                amount = ta.bonus*0.9,
                balance = usritem.becoin,
                comments = "完成"+ta.task_title,
                create_time = datetime.datetime.now()
            )
            db.session.add(newbecoin)
            sysitem = Users.query.filter_by(role="sys").first()
            sysitem.becoin = sysitem.becoin + ta.bonus*0.1
            newbecoin2 = Becoinitems(
                user_id = sysitem.id,
                user_name = "系统",
                target_title = ta.task_title,
                target_type = ta.task_type,
                target_id = ta.taskid,
                oppo_type = "执行人",
                oppo_id = ta.task_taker,
                oppo_name = ta.taker_name,
                change = 1,
                amount = ta.bonus*0.1,
                balance = sysitem.becoin,
                comments = ta.taker_name+"完成"+ta.task_title,
                create_time = datetime.datetime.now()
            )
            db.session.add(newbecoin2)
            miditem = Users.query.filter_by(role="trans").first()
            miditem.becoin = miditem.becoin - ta.bonus
            db.session.commit()
        if request.form.get('task_type')=='问答任务':
            if request.form.get('pub_ques')=='true':
                print(request.form.get('pub_ques'))
                qu = Questions.query.filter_by(quesid=ta.rel_quesid).first()
                qu.ques_title = ta.task_title
                qu.ques_desc = ta.task_desc
                qu.explain = ta.sln_desc
                qu.ques_authorid = ta.admin_id
                qu.examiner_id = 35
    db.session.commit()
    ret = {'result': 'commented'}
    return json.dumps(ret)

@rw.route('/applyta/', methods=['POST'])
@login_required
def applyta():
    ta_id = int(request.form.get('ta_id'))
    usrid = int(request.form.get('usrid'))
    deadlinetime = datetime.datetime.now() + datetime.timedelta(days=4)
    ta = Tasks.query.filter_by(taskid=ta_id).first()
    tacheck = Tasks.query.filter_by(
        hidden=0,
        task_taker=current_user.id,
        task_title=ta.task_title,
        finished=0
        ).first()
    if ta and not tacheck:
        if ta.task_repeat==0 or ta.task_repeat>1:
            repeatnum = 0 if ta.task_repeat==0 else ta.task_repeat-1
            newtask = Tasks(
                admin_name = ta.admin_name,
                admin_id = ta.admin_id,
                task_title = ta.task_title,
                task_desc = ta.task_desc,
                task_type = ta.task_type,
                task_repeat = repeatnum,
                learn_papers = ta.learn_papers,
                bonus = ta.bonus,
                deadline = deadlinetime,
                task_phase = "申领",
                take_time=datetime.datetime.now(),
                task_taker = usrid,
                taker_name = request.form.get('usrname'),
            )
            db.session.add(newtask)
            db.session.commit()
        else:
            ta.task_phase = "申领"
            ta.task_taker = usrid
            ta.taker_name = request.form.get('usrname')
            db.session.commit()
    ret = {'result': 'applied'}
    return json.dumps(ret)

@rw.route('/reapplyta/', methods=['POST'])
@login_required
def reapplyta():
    ta_id = int(request.form.get('taskid'))
    ta = Tasks.query.filter_by(taskid=ta_id).first()
    ta.decision = request.form.get('shenling')
    if request.form.get('shenling')=="拒绝":
        ta.curr_comments = request.form.get('refudesc')
        if ta.task_repeat==1:
            ta.task_phase = "发布"
            ta.task_taker = None
            ta.taker_name = None
        else:
            ta.hidden = 1
            ta.hidden_time = datetime.datetime.now()
    elif request.form.get('shenling')=="同意":
        ta.task_phase = "接手"
        usritem = Users.query.filter_by(id=current_user.id).first()
        miditem = Users.query.filter_by(role="trans").first()
        blce = usritem.becoin - ta.bonus
        newbecoin = Becoinitems(
            user_id = current_user.id,
            user_name = current_user.name,
            target_title = ta.task_title,
            target_type = ta.task_type,
            target_id = ta.taskid,
            oppo_type = "系统",
            oppo_name = "转存",
            oppo_id = miditem.id,
            change = -1,
            amount = ta.bonus,
            balance = blce,
            comments = "同意" + ta.taker_name + "申领" + ta.task_title,
            create_time = datetime.datetime.now()
        )
        db.session.add(newbecoin)
        usritem.becoin = blce
        
        miditem.becoin = miditem.becoin + ta.bonus
        db.session.commit()
    db.session.commit()
    ret = {'result': 'determined'}
    return json.dumps(ret)