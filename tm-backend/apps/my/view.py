from flask import Blueprint, render_template, request, jsonify, send_from_directory
from flask_login import login_required, current_user
from apps.login.beknowmodels import *
import datetime
import os
import subprocess
import json


my = Blueprint('my',__name__,template_folder='./templates', static_folder="./static")
@my.route('/', methods=['GET', 'POST'])
@login_required
def usercenter():
	return render_template("usercenter.html")

@my.route('/info/')
@login_required
def info():
    return render_template("info.html")


# 填写信息并上传照片
# 如果更改上传地址，此处的保存地址需要更改
@my.route('/saveinfo/',methods=['POST','GET'])
@login_required
def saveinfo():
    usr = current_user.id
    imgData = request.files.get('upfile')
    imgData.save('./uploads/images/coworker/'+ str(usr) + '.jpg')
    useritem = Users.query.filter_by(id=usr).first()
    useritem.picnum = 1
    useritem.gender = request.form.get("gender")
    useritem.jiguan = request.form.get("jiguan")
    useritem.xingzuo = request.form.get("xingzuo")
    useritem.xueli = request.form.get("xueli")
    useritem.xuexiao = request.form.get("xuexiao")
    useritem.zhuanye = request.form.get("zhuanye")
    useritem.aihao = request.form.get("aihao")
    useritem.ziwo = request.form.get("ziwo")
    useritem.picpath = str(usr) + '.jpg'
    db.session.commit()
    return "成功"

@my.route('/showinfo/<id>')
def showinfo(id):
    datar = Users.query.filter_by(id=id).first()
    return render_template('showinfo.html',datar=datar)


@my.route('/addmember/')
@login_required
def addmember():
    return render_template("addmember.html")

#手动添加新人
@my.route('/saveadd/',methods=['POST','GET'])
@login_required
def saveadd():
    usrname = request.form.get("name")
    action = request.form.get("action")
    msg = ""
    datar = Users.query.filter_by(name=usrname).first()
    if datar: 	#如果名称已经存在，则显示出现编辑界面并提醒用户名称已经存在
        msg=usrname+"已存在" 	#将名称显示到界面上
    elif action=="submit":		#如果名称不存在，则添加名称到数据库中并提醒用户名称已
        newuseritem = Users(
            name = usrname,
            gender = request.form.get("gender"),
            shenfen = request.form.get("shenfen"),
            phone = request.form.get("phone"),
            bumen = request.form.get("bumen"),
        )
        newuseritem.set_password('111111')
        db.session.add(newuseritem)
        db.session.commit()
        msg="成功添加"+usrname
    return msg



@my.route('/transcript/', methods=['GET', 'POST'])
@login_required
def transcript():
    return render_template("transcript.html")


@my.route('/fetchtrans/', methods=['GET', 'POST'])
@login_required
def fetchtrans():
    candi = request.form.get("candiname")
    usrid = current_user.id
    namequery = Users.query.filter_by(name=candi).first()
    if namequery:
        usrid = namequery.id
    kaoguode = Paperperform.query.filter_by(user_id=usrid).all()
    alltest = []
    for kk in kaoguode:
        tp = Testpapers.query.filter_by(testpaperid=kk.paper_id).first()
        dictp = {}
        dictp["testpaper_title"]=tp.testpaper_title
        dictp["ques_amount"]=kk.ques_amount
        dictp["full_score"]=kk.fullscore
        dictp["pperformid"]=kk.pperformid
        dictp["testpaperid"]=kk.paper_id
        dictp["test_time"]=str(kk.finish_time)[:16]
        dictp["test_during"]=(kk.finish_time-kk.start_time).seconds // 60 +1
        dictp["test_score"]=kk.getscore
        dictp["baifen_score"]=int(kk.getscore / kk.fullscore * 100)
        alltest.append(dictp)
    alltest.reverse()
    return json.dumps(alltest)

@my.route('/bill/', methods=['GET', 'POST'])
@login_required
def bill():
    return render_template("bill.html")


@my.route('/fetchbill/', methods=['GET', 'POST'])
@login_required
def fetchbill():
    db.session.commit()
    candi = request.form.get("qname")
    usrid = current_user.id
    namequery = Users.query.filter_by(name=candi).first()
    if namequery:
        usrid = namequery.id
    jiesuande = Becoinitems.query.filter_by(user_id=usrid).all()
    allbilldata = {}
    allbilldata["name"]=namequery.name
    allbilldata["becoin"]=namequery.becoin
    allitems = []
    for kk in jiesuande:
        dictp = {}
        dictp["task_title"]=kk.target_title
        dictp["target_type"]=kk.target_type
        dictp["change"]=kk.change
        dictp["amount"]=kk.amount
        dictp["balance"]=kk.balance
        dictp["create_time"]=str(kk.create_time)[:16]
        dictp["comments"]=kk.comments
        allitems.append(dictp)
    allitems.reverse()
    allbilldata["allitems"]=allitems
    return json.dumps(allbilldata)

@my.route('/remit/', methods=['GET', 'POST'])
@login_required
def remit():
    usrq = Users.query.filter(Users.id!=28).all()
    usrslist = []
    for rr in usrq:
        dictu = {}
        dictu['Username']=rr.name
        dictu['Userid']=rr.id
        usrslist.append(dictu)
    return render_template("remit.html", usrsl=usrslist)


@my.route('/trasact/', methods=['POST'])
@login_required
def trasact():
    reveiver_id = request.form.get("reveiver_id")
    reveiver_name = request.form.get("reveiver_name")
    amount = float(request.form.get("amount"))
    notice = request.form.get("notice")
    # print(reveiver_id,reveiver_name,amount,notice)
    sender_item = Users.query.filter_by(id=current_user.id).first()
    sender_item.becoin = sender_item.becoin - amount
    reveiver_item = Users.query.filter_by(id=reveiver_id).first()
    reveiver_item.becoin = reveiver_item.becoin + amount
    db.session.commit()
    sender_becoin = Becoinitems(
        user_id = current_user.id,
        user_name = current_user.name,
        target_type = "转账",
        target_title = "转账",
        target_id = 0,
        oppo_type = "收款人---"+reveiver_name,
        oppo_id = reveiver_id,
        change = -1,
        amount = amount,
        balance = sender_item.becoin,
        comments = "转账---"+notice,
    )
    db.session.add(sender_becoin)

    reveiver_becoin = Becoinitems(
        user_id = reveiver_id,
        user_name = reveiver_name,
        target_title = "转账",
        target_type = "转账",
        target_id = 0,
        oppo_type = "付款人---"+current_user.name,
        oppo_id = current_user.id,
        change = 1,
        amount = amount,
        balance = reveiver_item.becoin,
        comments = "转账---"+notice,
    )
    db.session.add(reveiver_becoin)
    db.session.commit()
    ret = {'result': 'deal!'}
    return json.dumps(ret)

@my.route('/favorites/', methods=['GET', 'POST'])
@login_required
def favorites():
	return render_template("favorites.html")

@my.route('/fetchfolder/', methods=['GET', 'POST'])
@login_required
def fetchfolder():
    db.session.commit()
    fquery = db.session.query(Folders).filter_by(
        user_id = current_user.id
        ).order_by(Folders.create_time.desc()).all()
    flist=[]
    for ff in fquery:
        fdata = {}
        fdata['folderid']=ff.folderid
        fdata['folder_title']=ff.folder_title
        fdata['item_num']=ff.item_num
        fdata['selected']=False
        flist.append(fdata)
    print('读取收藏夹列表')
    print(flist)
    return json.dumps(flist)


@my.route('/newfolder/', methods=['GET', 'POST'])
@login_required
def newfolder():
    print(request.form.get("folder_name"))
    print(request.form.get("userid"))
    print(request.form.get("username"))
    newf = Folders(
            user_id = current_user.id,
            folder_title = request.form.get("folder_name"),
            create_time = datetime.datetime.now()
        )
    db.session.add(newf)
    db.session.commit()
    db.session.flush()
    print(newf.folderid)
    ret = {'result': 'OK','newfid':newf.folderid}
    return json.dumps(ret)


@my.route('/addfavor/', methods=['GET', 'POST'])
@login_required
def addfavor():
    print("收藏了")
    print(request.form.get("target_id"))
    print(request.form.get("target_type"))
    folderlist = json.loads(request.form.get("folderlist"))
    print(folderlist)
    for ff in folderlist:
        if ff['selected']==True:
            newfavor = Favorites(
                    user_id = current_user.id,
                    folder_id = ff['folderid'],
                    target_type = request.form.get("target_type"),
                    target_id = request.form.get("target_id"),
                    create_time = datetime.datetime.now()
                )
            print(ff['folder_title'])
            db.session.add(newfavor)
            db.session.commit()
            db.session.flush()
            fd = Folders.query.filter_by(folderid=ff['folderid']).first()
            fd.item_num = fd.item_num+1
    db.session.commit()
    ret = {'result': 'OK'}
    return json.dumps(ret)


@my.route('/fetchfavor/', methods=['GET', 'POST'])
@login_required
def fetchfavor():
    fid = request.form.get("fid")
    fquery = Favorites.query.filter_by(
        folder_id = fid
        ).order_by(Favorites.create_time.desc()).all()
    flist=[]
    for ff in fquery:
        fdata = {}
        fdata['favorid']=ff.favorid
        fdata['folder_id']=ff.folder_id
        fdata['target_type']=ff.target_type
        fdata['target_id']=ff.target_id
        fdata['target_title']=''
        if fdata['target_type']=='试卷':
            tt = Testpapers.query.filter_by(testpaperid=ff.target_id).first()
            fdata['target_title']=tt.testpaper_title
        elif fdata['target_type']=='课程':
            cc = Courselist.query.filter_by(courseid=ff.target_id).first()
            fdata['target_title']=cc.course_title
        elif fdata['target_type']=='视频':
            vv = Videos.query.filter_by(videoid=ff.target_id).first()
            fdata['target_title']=vv.video_title
        elif fdata['target_type']=='文章':
            aa = Biwen.query.filter_by(biwenid=ff.target_id).first()
            fdata['target_title']=aa.title
        fdata['selected']=False
        flist.append(fdata)
    return json.dumps(flist)


@my.route('/deletefavor/', methods=['GET', 'POST'])
@login_required
def deletefavor():
    fid = request.form.get("fid")
    print(fid)
    favor = Favorites.query.get(fid)
    folder = Folders.query.get(favor.folder_id)
    db.session.delete(favor)
    folder.item_num = folder.item_num - 1
    db.session.commit()
    return json.dumps('deleted')

@my.route('/zimu/')
@login_required
def zimu():
	return render_template("zimu.html")