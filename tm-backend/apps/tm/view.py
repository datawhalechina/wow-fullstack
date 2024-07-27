from flask import Flask, Blueprint, render_template, request,  redirect, url_for
from apps.login.beknowmodels import *
from flask_login import login_required,current_user
from concurrent.futures import ThreadPoolExecutor
executor = ThreadPoolExecutor(3)
from sqlalchemy import or_, and_
from sqlalchemy import text
from importlib import reload
import os
import sys
sys.path.append(os.path.abspath('./apps/tm'))
import apps.tm.tmmodel as tmmodel
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

UPLOADS = "../../uploads/"
tm = Blueprint('tm',__name__,template_folder='./templates', static_folder="./static")

@tm.route('/showques/', methods=['GET','POST'])
def showques():
    qa = Questions.query.filter_by(hidden=0).order_by(Questions.create_time.desc()).limit(100).all()
    qall = []
    for qq in qa:
        tmp = {}
        tmp['quesid']=qq.quesid
        tmp['ques_title']=qq.ques_title
        tmp['item_a']=qq.item_a
        tmp['item_b']=qq.item_b
        tmp['item_c']=qq.item_c
        tmp['item_d']=qq.item_d
        tmp['answer']=qq.answer
        tmp['ques_type']=qq.ques_type
        tmp['ques_desc']=qq.ques_desc
        tmp['descpic_url']=qq.descpic_url
        tmp['explain']=qq.explain
        tmp['explainpic_url']=qq.explainpic_url
        tmp['reply'] = []
        tmp['check'] = False
        qall.append(tmp)

    return render_template("doques.html", qdata = qall)

@tm.route('/searchques/', methods=['GET','POST'])
def searchques():
    qreveived = request.form.get('querywords')
    querywords = json.loads(qreveived)
    filters3 =[]
    for it in querywords:
        if " or " in it[1]:
            tmp = []
            slalist = it[0].split("/")
            orlist = it[1].split(" or ")
            for k in slalist:
                for oo in orlist:
                    tmp.append(Questions.__dict__[k].contains(oo))
            filters3.append(or_(*tmp))
        elif  " and " in it[1]:
            tmpout = []
            slalist = it[0].split("/")
            andlist = it[1].split(" and ")
            for k in slalist:
                tmp = []
                for aa in andlist:
                    tmp.append(Questions.__dict__[k].contains(aa))
                tmpout.append(and_(*tmp))
            filters3.append(or_(*tmpout))
        elif  " " in it[1]:
            tmpout = []
            slalist = it[0].split("/")
            andlist = it[1].split(" ")
            for k in slalist:
                tmp = []
                for aa in andlist:
                    tmp.append(Questions.__dict__[k].contains(aa))
                tmpout.append(and_(*tmp))
            filters3.append(or_(*tmpout))
        else:
            slalist = it[0].split("/")
            tmpout = []
            for k in slalist:
                tmpout.append(Questions.__dict__[k].contains(it[1]))
            filters3.append(or_(*tmpout))

    filters3.append(Questions.__dict__['hidden']==0)
    qa = Questions.query.filter(*filters3).order_by(Questions.create_time.desc()).limit(100).all()
    qall = []
    for qq in qa:
        tmp = {}
        tmp['quesid']=qq.quesid
        tmp['ques_title']=qq.ques_title
        tmp['item_a']=qq.item_a
        tmp['item_b']=qq.item_b
        tmp['item_c']=qq.item_c
        tmp['item_d']=qq.item_d
        tmp['answer']=qq.answer
        tmp['ques_type']=qq.ques_type
        tmp['ques_desc']=qq.ques_desc
        tmp['descpic_url']=qq.descpic_url
        tmp['explain']=qq.explain
        tmp['explainpic_url']=qq.explainpic_url
        tmp['reply'] = []
        tmp['check'] = False
        qall.append(tmp)

    return json.dumps(qall)



@tm.route('/showtest/', methods=['GET'])
@login_required
def showtest():
    tall = Testpapers.query.filter_by(hidden=0).all()
    alltest = []
    for testitem in tall:
        dictq = {}
        authorid = testitem.testpaper_authorid
        dictq["testpaperid"]=testitem.testpaperid
        dictq["favored"]=db.session.query(Favorites).filter_by(target_id=testitem.testpaperid,target_type='试卷',user_id=current_user.id).count()
        dictq["favor_count"]=db.session.query(Favorites).filter_by(target_id=testitem.testpaperid,target_type='试卷').count()
        dictq["testpaper_title"]=testitem.testpaper_title
        dictq["testpaper_author"]=Users.query.filter_by(id=authorid).first().name
        alltest.append(dictq)
    return render_template("showtest.html", tdata = alltest)

@tm.route('/edittest/<testid>', methods=['GET','POST'])
@login_required
def edittest(testid):
    allquiz = []
    db.session.commit()
    paper_title = ''
    gongkai = 0
    if int(testid)>0:
        paperitem = Testpapers.query.filter_by(testpaperid=testid).first()
        if paperitem:
            paper_title = paperitem.testpaper_title
            gongkai = paperitem.reviewed or 0
            sql = '''
            SELECT quesid, ques_num, ques_value, ques_part from quizitems
            where testpaperid=%s
            order by ques_num
            '''% testid
            test = db.session.execute(text(sql))
            for tt in test:
                quesitem = Questions.query.filter_by(quesid=tt[0]).first()
                dictq = {}
                dictq["quesid"]=quesitem.quesid
                dictq["ques_value"]=tt[2]
                dictq["ques_part"]=tt[3]
                dictq["ques_title"]=quesitem.ques_title
                dictq["ques_desc"]=quesitem.ques_desc
                dictq["isshow"]=False
                dictq["item_a"]=quesitem.item_a
                dictq["item_b"]=quesitem.item_b
                dictq["item_c"]=quesitem.item_c
                dictq["item_d"]=quesitem.item_d
                dictq["answer"]=quesitem.answer
                dictq["explain"]=quesitem.explain
                dictq["ques_type"]=quesitem.ques_type
                dictq["descpic_url"]=quesitem.descpic_url
                allquiz.append(dictq)
        else:
            return redirect(url_for(tm.edittest(0)))

    return render_template("edittest.html", edata = allquiz, papername = paper_title, gongkai = gongkai)

@tm.route('/newques/')
@login_required
def newques():
    return render_template("newques.html")

@tm.route('/addnewqu/', methods=['GET','POST'])
@login_required
def addnewqu():
    #newquesobj = request.form.get('message')
    #quesobj = json.loads(newquesobj)
    adminitem = Users.query.filter_by(role='admin').first()
    reviewd=0
    exami_id = adminitem.id
    if current_user.id==exami_id:
        reviewd=1
    descpic = request.files.get('descposter')
    explainpic = request.files.get('explainposter')
    ques_updateid = request.form.get('ques_updateid')
    if ques_updateid:
        ques = Questions.query.filter_by(quesid=ques_updateid).first()
        ques.ques_title=request.form.get('ques_title')
        ques.ques_desc=request.form.get('ques_desc')
        ques.item_a=request.form.get('item_a')
        ques.item_b=request.form.get('item_b')
        ques.item_c=request.form.get('item_c')
        ques.item_d=request.form.get('item_d')
        ques.answer=request.form.get('answer').lower()
        ques.explain=request.form.get('explain')
        if request.form.get('descposter_has') and descpic:
            ques.descpic_url = str(ques_updateid)+"_desc"+".jpg"
            descpic.save(UPLOADS + 'images/quespic/'+ str(ques_updateid)+"_desc"+".jpg")
        else:
            if ques.descpic_url:
                ques.descpic_url = None

        if request.form.get('explainposter_has') and explainpic:
            ques.explainpic_url = str(ques_updateid)+"_explain"+".jpg"
            explainpic.save(UPLOADS + 'images/quespic/'+ str(ques_updateid)+"_explain"+".jpg")
        else:
            if ques.explainpic_url:
                ques.explainpic_url = None
    else:
        # print(request.form.get('item_a'))
        # print(request.form.get('item_b'))
        # print(request.form.get('item_c'))
        # print(request.form.get('item_d'))
        # print(request.form.get('answer'))
        
        ques = Questions(
            ques_title=request.form.get('ques_title'),
            ques_desc=request.form.get('ques_desc'),
            item_a=request.form.get('item_a'),
            item_b=request.form.get('item_b'),
            item_c=request.form.get('item_c'),
            item_d=request.form.get('item_d'),
            answer=request.form.get('answer'),
            explain=request.form.get('explain'),
            ques_type=request.form.get('ques_type'),
            examiner_id=exami_id,
            reviewed=reviewd,
            ques_authorid=request.form.get('ques_authorid'))
        db.session.add(ques)
        db.session.flush()
        if request.form.get('descposter_has') and descpic:
            ques.descpic_url = str(ques.quesid)+"_desc"+".jpg"
            descpic.save(UPLOADS + 'images/quespic/'+ str(ques.quesid)+"_desc"+".jpg")

        if request.form.get('explainposter_has') and explainpic:
            ques.explainpic_url = str(ques.quesid)+"_explain"+".jpg"
            explainpic.save(UPLOADS + 'images/quespic/'+ str(ques.quesid)+"_explain"+".jpg")

    db.session.commit()

    dictq = {}
    dictq['quesid']=ques.quesid
    dictq['ques_title']=ques.ques_title
    dictq['item_a']=ques.item_a
    dictq['item_b']=ques.item_b
    dictq['item_c']=ques.item_c
    dictq['item_d']=ques.item_d
    dictq['answer']=ques.answer
    dictq['explain']=ques.explain
    ret = {'result': dictq}
    print(dictq)
    return json.dumps(ret)

@tm.route('/editques/<quesid>')
@login_required
def editques(quesid):
    quesitem = Questions.query.filter_by(quesid=quesid).first()
    return render_template("editques.html", qitem=quesitem)

@tm.route('/begintest/<testid>')
@login_required
def begintest(testid):
    allquiz = []
    tp = Testpapers.query.filter_by(testpaperid=testid).first()
    sql = '''
    SELECT quizitemid, quesid, ques_num, ques_value, ques_part from quizitems
    where testpaperid=%s
    order by ques_num
    '''% testid
    test = db.session.execute(text(sql))
    for tt in test:
        quesitem = Questions.query.filter_by(quesid=tt[1]).first()
        dictq = {}
        dictq["quizitemid"]=tt[0]
        dictq["quesid"]=tt[1]
        dictq["ques_value"]=tt[3]
        dictq["ques_part"]=tt[4]
        dictq["ques_title"]=quesitem.ques_title
        dictq["ques_desc"]=quesitem.ques_desc
        dictq["isshow"]=False
        dictq["item_a"]=quesitem.item_a
        dictq["item_b"]=quesitem.item_b
        dictq["item_c"]=quesitem.item_c
        dictq["item_d"]=quesitem.item_d
        dictq["ques_type"]=quesitem.ques_type
        dictq["descpic_url"]=quesitem.descpic_url
        dictq["reply"]=''
        allquiz.append(dictq)
    return render_template("begintest.html", qdata = allquiz, paper =tp)

@tm.route('/beginexam/<testid>')
@login_required
def beginexam(testid):
    allquiz = []
    db.session.commit()
    tp = Testpapers.query.filter_by(testpaperid=testid).first()
    sql = '''
    SELECT quizitemid, quesid, ques_num, ques_value, ques_part from quizitems
    where testpaperid=%s
    order by ques_num
    '''% testid
    test = db.session.execute(text(sql))
    for tt in test:
        quesitem = Questions.query.filter_by(quesid=tt[1]).first()
        dictq = {}
        dictq["quizitemid"]=tt[0]
        dictq["quesid"]=tt[1]
        dictq["ques_value"]=tt[3]
        dictq["ques_part"]=tt[4]
        dictq["ques_title"]=quesitem.ques_title
        dictq["ques_desc"]=quesitem.ques_desc
        dictq["isshow"]=False
        dictq["item_a"]=quesitem.item_a
        dictq["item_b"]=quesitem.item_b
        dictq["item_c"]=quesitem.item_c
        dictq["item_d"]=quesitem.item_d
        dictq["ques_type"]=quesitem.ques_type
        dictq["descpic_url"]=quesitem.descpic_url
        dictq["reply"]=''
        allquiz.append(dictq)
    return render_template("beginexam.html", qdata = allquiz, paper =tp)

def save_account(s_dict):
    print(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    print(s_dict["user_name"],s_dict["target_title"],s_dict["score"])
    with app2.test_request_context():
        usritem = Users.query.filter_by(id=s_dict["user_id"]).first()
        usrblce = usritem.becoin - 0.01*s_dict["ques_nums"]
        newbecoin = Becoinitems(
            user_id = s_dict["user_id"],
            user_name = s_dict["user_name"],
            target_title = s_dict["target_title"],
            target_type = s_dict["target_type"],
            target_id = s_dict["target_id"],
            oppo_type = "试卷作者",
            oppo_name = s_dict["author_name"],
            oppo_id = s_dict["author_id"],
            change = -1,
            amount = 0.01*s_dict["ques_nums"],
            balance = usrblce,
            comments = s_dict["user_name"]+"考核"+s_dict["target_title"],
            create_time = datetime.datetime.now()
        )
        db.session.add(newbecoin)
        usritem.becoin = usrblce
        db.session.commit()

        pubitem = Users.query.filter_by(id=s_dict["author_id"]).first()
        pubblce = pubitem.becoin + 0.004*s_dict["ques_nums"]
        newbecoin2 = Becoinitems(
            user_id = s_dict["author_id"],
            user_name = s_dict["author_name"],
            target_title = s_dict["target_title"],
            target_type = s_dict["target_type"],
            target_id = s_dict["target_id"],
            oppo_type = "考生",
            oppo_name = s_dict["user_name"],
            oppo_id = s_dict["user_id"],
            change = 1,
            amount = 0.004*s_dict["ques_nums"],
            balance = pubblce,
            comments = s_dict["user_name"]+"考核"+s_dict["target_title"],
            create_time = datetime.datetime.now()
        )
        db.session.add(newbecoin2)
        pubitem.becoin = pubblce
        db.session.commit()

        sysitem = Users.query.filter_by(role='sys').first()
        sysblce = sysitem.becoin + 0.001*s_dict["ques_nums"]
        newbecoin3 = Becoinitems(
            user_id = 28,
            user_name = "系统",
            target_title = s_dict["target_title"],
            target_type = s_dict["target_type"],
            target_id = s_dict["target_id"],
            oppo_type = "考生",
            oppo_name = s_dict["user_name"],
            oppo_id = s_dict["user_id"],
            change = 1,
            amount = 0.001*s_dict["ques_nums"],
            balance = sysblce,
            comments = s_dict["user_name"]+"考核"+s_dict["target_title"],
            create_time = datetime.datetime.now()
        )
        db.session.add(newbecoin3)
        sysitem.becoin = sysblce
        db.session.commit()

        for quesdata in s_dict["quesitems"]:
            qt = Questions.query.filter_by(quesid=quesdata["quesid"]).first()
            authoritem = Users.query.filter_by(id=qt.ques_authorid).first()
            authorblce = authoritem.becoin + 0.005
            newbecoinqt = Becoinitems(
                user_id = qt.ques_authorid,
                user_name = authoritem.name,
                target_title = qt.ques_title,
                target_type = "题目",
                target_id = qt.quesid,
                oppo_type = "考生",
                oppo_name = s_dict["user_name"],
                oppo_id = s_dict["user_id"],
                change = 1,
                amount = 0.005,
                balance = authorblce,
                comments = s_dict["user_name"]+"考核"+s_dict["target_title"],
                create_time = datetime.datetime.now()
            )
            db.session.add(newbecoinqt)
            authoritem.becoin = authorblce

        db.session.commit()
    print(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))



@tm.route('/checkreply/', methods=['POST'])
@login_required
def checkreply():
    reply = request.form.get('message')
    quizitemids = request.form.get('quizitemids')
    userid = request.form.get('userid')
    paper_id = request.form.get('paper_id')
    start_Date = request.form.get('start_Date')
    finish_Date = request.form.get('finish_Date')
    stime = datetime.datetime.fromtimestamp(int(start_Date)/1000.0)
    ftime = datetime.datetime.fromtimestamp(int(finish_Date)/1000.0)
    reply_array = json.loads(reply)
    quizitemids_array = json.loads(quizitemids)
    score = 0
    tp = Testpapers.query.filter_by(testpaperid=paper_id).first()
    newpaperperf = Paperperform(user_id=userid,paper_id=paper_id,examiner_id=tp.testpaper_authorid,
                                start_time=stime,finish_time=ftime,getscore=score,
                                fullscore=tp.full_score,ques_amount=tp.ques_amount)
    db.session.add(newpaperperf)
    db.session.flush()
    checkout = []
    saveobj=[]
    settle = {}
    settle["user_id"] = current_user.id
    settle["user_name"] = current_user.name
    settle["author_id"] = tp.testpaper_authorid
    settle["author_name"] = tp.testpaper_authorname
    settle["ques_nums"] = len(quizitemids_array)
    settle["target_type"] = "试卷"
    settle["target_title"] = tp.testpaper_title
    settle["target_id"] = tp.testpaperid
    
    quesitems = json.loads(tp.answers)
    settle["quesitems"] = quesitems
    jianda = 0
    for i,e in enumerate(quizitemids_array):
        if quesitems[i]["ques_type"] == "选择题":
            hecheng_reply = "".join(sorted(reply_array[i]))
        elif quesitems[i]["ques_type"] == "填空题":
            hecheng_reply = ",".join(reply_array[i])
        elif quesitems[i]["ques_type"] == "判断题":
            hecheng_reply = "".join(reply_array[i])
        else:
            hecheng_reply = "".join(reply_array[i])
            jianda += 1
        itemscore = 0
        if hecheng_reply==quesitems[i]["answer"]:
            score+=e[2]
            itemscore = e[2]
            checkout.append(1)
        else:
            checkout.append(0)
        newquesperf = Quesperform(
            pperformid=newpaperperf.pperformid,
            user_id=userid,
            ques_id=e[1],
            did_date=ftime,
            ques_type=quesitems[i]["ques_type"],
            answer=quesitems[i]["answer"],
            reply=hecheng_reply,
            fullscore=e[2],
            getscore=itemscore)
        saveobj.append(newquesperf)
    db.session.add_all(saveobj)
    newpaperperf.getscore = score
    newpaperperf.jianda_amount = jianda
    db.session.commit()
    settle["score"] = score
    executor.submit(save_account,settle)
    ret = {'result': score, 'checkout':checkout}
    return json.dumps(ret)

@tm.route('/showcuoti/<ppid>', methods=['GET'])
@login_required
def showcuoti(ppid):
    qall = Quesperform.query.filter_by(pperformid=ppid).all()
    ppf = Paperperform.query.filter_by(pperformid=ppid).first()
    tp = Testpapers.query.filter_by(testpaperid=ppf.paper_id).first()
    allcuoti = []
    generalinfo = {}
    generalinfo['tptitle'] = tp.testpaper_title
    generalinfo['exami_state'] = ppf.exami_state
    for qq in qall:
        qt = Questions.query.filter_by(quesid=qq.ques_id).first()
        sql = '''
        SELECT ques_value, ques_part from quizitems
        where testpaperid=%s and quesid=%s
        '''% (ppf.paper_id,qq.ques_id)
        quiz = db.session.execute(text(sql)).fetchone()
        fs = 0
        qp = ''
        if quiz:
            fs=quiz[0]
            qp=quiz[1]
        cuotmp = {}
        cuotmp['ques_title']=qt.ques_title
        cuotmp['ques_desc']=qt.ques_desc
        cuotmp['descpic_url']=qt.descpic_url
        cuotmp['ques_type']=qt.ques_type
        cuotmp['item_a']=qt.item_a
        cuotmp['item_b']=qt.item_b
        cuotmp['item_c']=qt.item_c
        cuotmp['item_d']=qt.item_d
        cuotmp['reply']=qq.reply
        cuotmp['getscore']=qq.getscore
        cuotmp['fullscore']=fs
        cuotmp['ques_part']=qp
        if ppf.getscore/ppf.fullscore >0.8:
            cuotmp['answer']=qt.answer
            cuotmp['explain']=qt.explain
            cuotmp['explainpic_url']=qt.explainpic_url
        else:
            cuotmp['answer']=None
            cuotmp['explain']=None
            cuotmp['explainpic_url']=None
        if ppf.exami_state>0 and qt.ques_type=="简答题":
            cuotmp['comments']=qq.comments
            cuotmp['examiner']=qq.examiner
            cuotmp['exami_date']=str(qq.exami_date)[:16]

        allcuoti.append(cuotmp)
    return render_template("showcuoti.html", qdata = allcuoti, ginfo=generalinfo)

@tm.route('/queryques/', methods=['POST'])
@login_required
def queryques():
    queryword = request.form.get('message')
    if len(queryword)==0:
        qall = Questions.query.filter_by(hidden=0).all()
        #with_entities(Questions.ques_title,Questions.item_a,Questions.item_b)
    else:
        qall = Questions.query.filter(
                            or_(Questions.ques_title.like("%" + queryword + "%") if queryword is not None else "",
                            Questions.item_a.like("%" + queryword + "%") if queryword is not None else "",
                            Questions.item_b.like("%" + queryword + "%") if queryword is not None else "",
                            Questions.item_c.like("%" + queryword + "%") if queryword is not None else "",
                            Questions.item_d.like("%" + queryword + "%") if queryword is not None else "")
                            ).all()
    listq = []
    for qq in qall:
        dictq = {}
        dictq['quesid']=qq.quesid
        dictq['ques_title']=qq.ques_title
        dictq['ques_desc']=qq.ques_desc
        dictq['item_a']=qq.item_a
        dictq['item_b']=qq.item_b
        dictq['item_c']=qq.item_c
        dictq['item_d']=qq.item_d
        dictq['answer']=qq.answer
        dictq['ques_type']=qq.ques_type
        dictq['descpic_url']=qq.descpic_url
        listq.append(dictq)
        #print(model_to_dict(qq))
        #print(dictq)
    ret = {'result': listq}
    return json.dumps(ret)

@tm.route('/savepaper/', methods=['POST'])
@login_required
def savepaper():
    paper_id = int(request.form.get('paper_id'))
    paper_title = request.form.get('paper_title')
    gongkai = request.form.get('gongkai')
    ques_num = request.form.get('ques_num')
    score_sum = request.form.get('score_sum')
    author_id = request.form.get('author_id')
    deleted_data = request.form.get('deleted_data')
    paper_data = request.form.get('paper_data')
    print(paper_id)
    print(paper_title)
    print(json.loads(deleted_data))
    print(json.loads(paper_data))
    if paper_id == 0:
        newpaper = Testpapers(testpaper_title=paper_title, testpaper_authorid=author_id,ques_amount=ques_num,full_score=score_sum,answers=paper_data)
        db.session.add(newpaper)
        db.session.flush()
        paper_id = newpaper.testpaperid
        db.session.commit()
        if json.loads(paper_data):
            for i,ad in enumerate(json.loads(paper_data)):
                sql = '''INSERT into quizitems (testpaperid, quesid, ques_num, ques_value, ques_part)
                values (%d, %d, %d, %d, '%s')
                '''% (paper_id, ad['quesid'], i,ad['ques_value'],ad['ques_part'])
                tmpadd = db.session.execute(text(sql))
            db.session.commit()
    else:
        tp = Testpapers.query.filter_by(testpaperid=paper_id).first()
        print(tp.testpaper_title)
        tp.testpaper_title = paper_title
        tp.reviewed = gongkai
        tp.ques_amount=ques_num
        tp.full_score=score_sum
        tp.answers=paper_data
        db.session.commit()
        if json.loads(deleted_data):
            for dd in json.loads(deleted_data):
                sql = '''
                DELETE from quizitems
                where testpaperid=%s and quesid = %d
                '''% (paper_id, dd)
                tmpdelete = db.session.execute(text(sql))
            db.session.commit()
        if json.loads(paper_data):
            for i,ad in enumerate(json.loads(paper_data)):
                sql = '''
                SELECT quizitemid from quizitems
                where testpaperid=%d and quesid=%d
                '''% (paper_id,ad['quesid'])
                test = db.session.execute(text(sql)).first()
                #print(dir(test))
                
                if test:
                    sql = '''
                    UPDATE quizitems
                    set ques_num = %d, ques_value = %d, ques_part = '%s'
                    where testpaperid=%d and quesid=%d
                    '''% (i,ad['ques_value'],ad['ques_part'], paper_id, ad['quesid'])
                    tmpadd = db.session.execute(text(sql))
                else:
                    sql = '''
                    INSERT into quizitems (testpaperid, quesid, ques_num, ques_value, ques_part)
                    values (%d, %d, %d, %d, '%s')
                    '''% (paper_id, ad['quesid'], i,ad['ques_value'],ad['ques_part'])
                    tmpadd = db.session.execute(text(sql))
                    print("插入一条数据")
            db.session.commit()
    ret = {'result': 'ok'}
    return json.dumps(ret)





@tm.route('/deletepaper/', methods=['POST'])
@login_required
def deletepaper():
    paper_id = int(request.form.get('paper_id'))
    tp = Testpapers.query.filter_by(testpaperid=paper_id).first()
    tp.hidden = 1
    db.session.commit()
    ret = {'result': 'deleted'}
    return json.dumps(ret)

@tm.route('/deleteques/', methods=['POST'])
@login_required
def deleteques():
    ques_id = int(request.form.get('ques_id'))
    qe = Questions.query.filter_by(quesid=ques_id).first()
    qe.hidden = 1
    db.session.commit()
    ret = {'result': 'deleted'}
    return json.dumps(ret)


@tm.route('/reviews/')
@login_required
def reviews():
    return render_template("showreview.html")

@tm.route('/reviewques/', methods=['POST'])
@login_required
def reviewques():
    qall = Questions.query.filter(
        Questions.examiner_id==current_user.id,
        Questions.reviewed==0,
        Questions.hidden==0
        ).all()
    quesre = []
    for qq in qall:
        dictq = {}
        dictq["quesid"]=qq.quesid
        dictq["create_time"]=str(qq.create_time)[:16]
        dictq["author_name"]=Users.query.filter_by(id=qq.ques_authorid).first().name
        dictq["ques_title"]=qq.ques_title
        quesre.append(dictq)
    return json.dumps(quesre)


@tm.route('/beginreques/<quesid>')
@login_required
def beginreques(quesid):
    ques = Questions.query.filter_by(quesid=quesid).first()
    dictq = {}
    dictq['quesid']=ques.quesid
    dictq['ques_type']=ques.ques_type
    dictq["author_name"]=Users.query.filter_by(id=ques.ques_authorid).first().name
    dictq['ques_title']=ques.ques_title
    dictq['ques_desc']=ques.ques_desc
    dictq['descpic_url']=ques.descpic_url
    dictq['item_a']=ques.item_a
    dictq['item_b']=ques.item_b
    dictq['item_c']=ques.item_c
    dictq['item_d']=ques.item_d
    dictq['answer']=ques.answer
    dictq['explain']=ques.explain
    dictq['explainpic_url']=ques.explainpic_url
    return render_template("beginreques.html", qdata=dictq)

@tm.route('/savereques/', methods=['POST'])
@login_required
def savereques():
    ques_data = request.form.get('message')
    rp_updateid = request.form.get('rp_updateid')
    ques = Questions.query.filter_by(quesid=rp_updateid).first()
    updata = json.loads(ques_data)
    deci = ''
    if updata[6]==1:
        deci = '合格'
        ques.reviewed=1
        ques.reviewed_time=datetime.datetime.now()
    elif updata[6]==2:
        deci = '修改'
    newexa = Examination(
        examiner_id=current_user.id,
        candidate_id=ques.ques_authorid,
        target_type='题目',
        target_id=rp_updateid,
        target_stage='审核',
        scarcity=updata[0],
        scomments=updata[1],
        progressiveness=updata[2],
        pcomments=updata[3],
        operability=updata[4],
        ocomments=updata[5],
        create_time=datetime.datetime.now(),
        decision=deci
        )
    db.session.add(newexa)
    db.session.flush()
    db.session.commit()
    print(updata)
    ret = {'result': 'ok'}
    return json.dumps(ret)


@tm.route('/reviewjianda/', methods=['POST'])
@login_required
def reviewjianda():
    jdall = Paperperform.query.filter(
        Paperperform.examiner_id==current_user.id,
        Paperperform.jianda_amount>1,
        Paperperform.exami_state==0
        ).all()
    jiandapapers = []
    for jj in jdall:
        dictj = {}
        dictj["pperformid"]=jj.pperformid
        dictj["test_time"]=str(jj.finish_time)[:16]
        dictj["user_name"]=Users.query.filter_by(id=jj.user_id).first().name
        dictj["paper_title"]=Testpapers.query.filter_by(testpaperid=jj.paper_id).first().testpaper_title
        jiandapapers.append(dictj)
    return json.dumps(jiandapapers)

@tm.route('/beginrejianda/<ppid>')
@login_required
def beginrejianda(ppid):
    alljianda = []
    jall = Quesperform.query.filter_by(
        pperformid=ppid,
        ques_type='简答题'
        ).all()
    for jj in jall:
        qq = Questions.query.filter_by(quesid=jj.ques_id).first()
        dictj = {}
        dictj["qperformid"]=jj.qperformid
        dictj["ques_title"]=qq.ques_title
        dictj["did_date"]=str(jj.did_date)[:16]
        dictj["ques_desc"]=qq.ques_desc
        dictj["descpic_url"]=qq.descpic_url
        dictj["answer"]=qq.answer
        dictj["explain"]=qq.explain
        dictj["explainpic_url"]=qq.explainpic_url
        dictj["fullscore"]=jj.fullscore
        dictj["reply"]=jj.reply
        
        alljianda.append(dictj)
    return render_template("beginrejianda.html", jddata = alljianda)

@tm.route('/saverejianda/', methods=['POST'])
@login_required
def saverejianda():
    jianda_data = request.form.get('message')
    pp_updateid = request.form.get('pp_updateid')
    
    updata = json.loads(jianda_data)
    newscore = 0
    for up in updata:
        upone = Quesperform.query.filter_by(qperformid=up[0]).first()
        upone.examiner = up[1]
        upone.getscore = up[2]
        upone.comments = up[3]
        upone.exami_date = datetime.datetime.now()
        newscore += int(up[2])
    db.session.commit()

    jdup = Paperperform.query.filter_by(pperformid=pp_updateid).first()
    jdup.exami_state = 1
    jdup.getscore = jdup.getscore + newscore
    db.session.commit()
    ret = {'result': 'ok'}
    return json.dumps(ret)

# 小程序相关接口

@tm.route('/fetchqueses/', methods=['POST'])
def fetchqueses():
    reload(tmmodel)
    rstdic = tmmodel.fetch_queses(request)
    return json.dumps(rstdic)

@tm.route('/fetchpapers/', methods=['POST'])
def fetchpapers():
    reload(tmmodel)
    rstdic = tmmodel.fetchpapers(request)
    return json.dumps(rstdic)