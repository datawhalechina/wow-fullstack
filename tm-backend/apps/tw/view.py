import os
import datetime
import time
from flask import Blueprint, render_template, request, jsonify, send_from_directory
from flask import Response, url_for, redirect
from flask_login import login_required, current_user
from apps.login.beknowmodels import *
from sqlalchemy import or_, and_
from sqlalchemy import text
import json


tw = Blueprint('tw',__name__,template_folder='./templates', static_folder="./static")

IMAGE_FOLDER = './uploads/tw/images'
PDF_FOLDER = './uploads/tw/pdf'
FILES_FOLDER = './uploads/tw/files'


if not os.path.exists(IMAGE_FOLDER):
    os.makedirs(IMAGE_FOLDER)

if not os.path.exists(PDF_FOLDER):
    os.makedirs(PDF_FOLDER)

if not os.path.exists(FILES_FOLDER):
    os.makedirs(FILES_FOLDER)


@tw.route('/')
def tw_index():
    usrrole = ""
    if current_user.is_authenticated:
        usrrole = current_user.role
    if usrrole=="admin":
        articleitem = Biwen.query.with_entities(
            Biwen.biwenid,
            Biwen.title,
            Biwen.author_id,
            Biwen.author_name,
            Biwen.coediting,
            ).filter_by(hidden=0).order_by(Biwen.create_time.desc()).all()
    else:
        articleitem = Biwen.query.with_entities(
            Biwen.biwenid,
            Biwen.title,
            Biwen.author_id,
            Biwen.author_name,
            Biwen.coediting,
            ).filter(Biwen.hidden==0,or_(Biwen.privacy == None, Biwen.privacy == "0")).order_by(Biwen.create_time.desc()).all()
    articlelist=[]
    for aa in articleitem:
        tmp = {}
        tmp['biwenid']=aa[0]
        tmp['title']=aa[1]
        tmp['author_id']=aa[2]
        tmp['author_name']=aa[3]
        tmp['coediting']=aa[4]
        articlelist.append(tmp)
    return render_template("bindex.html", vdata=articlelist)

@tw.route('/article/<articleid>')
def article(articleid):
    articleitem = Biwen.query.filter_by(biwenid=articleid).first()
    ret = {}
    if articleitem:
        ret['articleid'] = articleid
        ret['varticle'] = articleitem.fulltext
        ret['author_id'] = articleitem.author_id
        ret['author_name'] = articleitem.author_name
        useritem = Users.query.get(articleitem.author_id)
        ret['bumen'] = useritem.bumen
        ret['title'] = articleitem.title
        if current_user.is_authenticated:
            ret["usrid"] = current_user.id
            ret["usrname"] = current_user.name
            ret["favored"]=db.session.query(Favorites).filter_by(target_id=articleitem.biwenid,target_type='文章',user_id=current_user.id).count()
        else:
            ret["favored"]=0
        ret["favor_count"]=db.session.query(Favorites).filter_by(target_id=articleitem.biwenid,target_type='文章').count()
        ret['create_time'] = articleitem.create_time.strftime("%Y-%m-%d %H:%M:%S")
    return render_template("vditor2.html", vdata=ret)

@tw.route('/fetcharticle/', methods=['GET','POST'])
@login_required
def fetcharticle():
    ret = {}
    articleid = request.form.get('articleid')
    articleitem = Biwen.query.filter_by(biwenid=articleid).first()
    if articleitem:
        ret['varticle'] = articleitem.fulltext
        ret['author_id'] = articleitem.author_id
        ret['author_name'] = articleitem.author_name
        ret['title'] = articleitem.title
        ret['create_time'] = articleitem.create_time.strftime("%Y-%m-%d %H:%M:%S")
    return json.dumps(ret)


@tw.route('/editarticle/<articleid>')
@login_required
def editarticle(articleid):
    db.session.commit()
    if articleid=='0':
        ardata = {}
        ardata["author_id"] = current_user.id
        ardata["author_name"] = current_user.name
        ardata["title"] = ""
        ardata["private"] = "0"
        ardata["fulltext"] = ""
        return render_template("vditor.html", vdata=ardata)
    else:
        articleitem = Biwen.query.filter_by(biwenid=articleid).first()
        ardata = {}
        ardata["author_id"] = articleitem.author_id
        ardata["author_name"] = articleitem.author_name
        ardata["title"] = articleitem.title
        ardata["private"] = articleitem.privacy or "0"
        ardata["fulltext"] = articleitem.fulltext
        return render_template("vditor.html", vdata=ardata)

@tw.route('/save', methods=['GET','POST'])
@login_required
def save():
    articleid = request.form.get('articleid')
    title = request.form.get('title')
    private = request.form.get('private')
    article = request.form.get('article')
    edited = request.form.get('edited')
    print(edited)
    # article = article.replace("'","''")
    deletedpics = request.form.get('deleted')
    db.session.commit()
    lastid = 0
    if articleid=="0":
        newarticle = Biwen(
            author_id=current_user.id,
            author_name=current_user.name,
            title=title,
            privacy=private,
            fulltext=article
        )
        db.session.add(newarticle)
        db.session.flush()
        db.session.commit()
        lastid = newarticle.biwenid
    else:
        articleitem = Biwen.query.filter_by(biwenid=articleid).first()
        articleitem.title = title
        articleitem.privacy=private
        articleitem.fulltext = article
        articleitem.coediting = edited
        db.session.commit()

    for pic in json.loads(deletedpics):
        if os.path.exists(os.path.join(IMAGE_FOLDER, pic)):
            os.remove(os.path.join(IMAGE_FOLDER, pic))
        elif os.path.exists(os.path.join(PDF_FOLDER, pic)):
            os.remove(os.path.join(PDF_FOLDER, pic))
        elif os.path.exists(os.path.join(FILES_FOLDER, pic)):
            os.remove(os.path.join(FILES_FOLDER, pic))
    ret = {'result': lastid}
    return json.dumps(ret)

@tw.route('/deletearticle', methods=['GET','POST'])
@login_required
def deletearticle():
    articleid = request.form.get('articleid')
    articleitem = Biwen.query.filter_by(biwenid=articleid).first()
    articleitem.hidden = 1
    db.session.commit()
    ret = {'result': 'ok'}
    return json.dumps(ret)

@tw.route('/showzhuanlan/', methods=['GET'])
def showzhuanlan():
    # usrrole = current_user.role
    # usrid = current_user.id
    # if usrrole=="admin":
    zall = Zhuanlan.query.filter_by(hidden=0).all()
    # else:
    #     zall = Zhuanlan.query.filter_by(hidden=0,zhuanlan_publisherid=usrid).all()
    allzhuanlan = []
    for zitem in zall:
        dictz = {}
        authorid = zitem.zhuanlan_publisherid
        dictz["zhuanlanid"]=zitem.zhuanlanid
        dictz["zhuanlan_title"]=zitem.zhuanlan_title
        dictz["authorid"]=authorid
        dictz["zhuanlan_author"]=Users.query.filter_by(id=authorid).first().name
        allzhuanlan.append(dictz)
    return render_template("zindex.html", zdata = allzhuanlan)

@tw.route('/zhuanlan/<zhuanlanid>')
def zhuanlan(zhuanlanid):
    zl = Zhuanlan.query.filter_by(zhuanlanid=zhuanlanid).first()
    sql = '''
    SELECT biwenitemid, biwenid, biwen_num, show_title, zhuanlan_part from biwenitems
    where zhuanlanid=%s
    order by biwen_num
    '''% zhuanlanid
    zlall = db.session.execute(text(sql))
    zhuanlanbi = []
    for zitem in zlall:
        biwenitem = Biwen.query.filter_by(biwenid=zitem[1]).first()
        dictb = {}
        dictb["biwenitemid"]=zitem[0]
        dictb["biwenid"]=zitem[1]
        dictb["biwen_num"]=zitem[2]
        dictb["show_title"]=zitem[3]
        dictb["zhuanlan_part"]=zitem[4]
        dictb["title"]=biwenitem.title
        dictb["author_id"]=biwenitem.author_id
        dictb["author_name"]=biwenitem.author_name
        zhuanlanbi.append(dictb)
    return render_template("zhuanlan.html", zdata = zhuanlanbi, zl=zl)

@tw.route('/editzhuanlan/<zhuanlanid>', methods=['GET','POST'])
@login_required
def editzhuanlan(zhuanlanid):
    allbiwen = []
    db.session.commit()
    zhuanlan_title = ''
    if int(zhuanlanid)>0:
        zhuanlanitem = Zhuanlan.query.filter_by(zhuanlanid=zhuanlanid).first()
        if zhuanlanitem:
            zhuanlan_title = zhuanlanitem.zhuanlan_title
            sql = '''
            SELECT biwenitemid, biwenid, biwen_num, show_title, zhuanlan_part from biwenitems
            where zhuanlanid=%s
            order by biwen_num
            '''% zhuanlanid
            zlall = db.session.execute(text(sql))
            for zitem in zlall:
                biwenitem = Biwen.query.filter_by(biwenid=zitem[1]).first()
                dictb = {}
                dictb["biwenid"]=zitem[1]
                dictb["show_title"]=zitem[3]
                dictb["zhuanlan_part"]=zitem[4]
                dictb["title"]=biwenitem.title
                dictb["author_id"]=biwenitem.author_id
                dictb["author_name"]=biwenitem.author_name
                allbiwen.append(dictb)
        else:
            return redirect(url_for(tw.editzhuanlan(0)))

    return render_template("editzhuanlan.html", zdata = allbiwen, zhuanlanname = zhuanlan_title)

@tw.route('/savezhuanlan/', methods=['POST'])
@login_required
def savezhuanlan():
    zhuanlan_id = int(request.form.get('zhuanlan_id'))
    zhuanlan_title = request.form.get('zhuanlan_title')
    biwen_amount = request.form.get('biwen_amount')
    author_id = request.form.get('author_id')
    deleted_data = request.form.get('deleted_data')
    zhuanlan_data = request.form.get('zhuanlan_data')
    print(zhuanlan_id)
    print(zhuanlan_title)
    print(json.loads(deleted_data))
    print(json.loads(zhuanlan_data))
    if zhuanlan_id == 0:
        newzhuanlan = Zhuanlan(zhuanlan_title=zhuanlan_title, zhuanlan_publisherid=author_id,biwen_num=biwen_amount)
        db.session.add(newzhuanlan)
        db.session.flush()
        zhuanlan_id = newzhuanlan.zhuanlanid
        db.session.commit()
        if json.loads(zhuanlan_data):
            for i,ad in enumerate(json.loads(zhuanlan_data)):
                sql = '''INSERT into biwenitems (zhuanlanid, biwenid, biwen_num, show_title, zhuanlan_part)
                values (%d, %d, %d, '%s', '%s')
                '''% (zhuanlan_id, ad['biwenid'], i,ad['show_title'],ad['zhuanlan_part'])
                db.session.execute(text(sql))
            db.session.commit()
    else:
        zl = Zhuanlan.query.filter_by(zhuanlanid=zhuanlan_id).first()
        print(zl.zhuanlan_title)
        zl.zhuanlan_title = zhuanlan_title
        zl.biwen_num=biwen_amount
        db.session.commit()
        if json.loads(deleted_data):
            for dd in json.loads(deleted_data):
                sql = '''
                DELETE from biwenitems
                where zhuanlanid=%d and biwenid = %d
                '''% (zhuanlan_id, dd)
                db.session.execute(text(sql))
            db.session.commit()
        if json.loads(zhuanlan_data):
            for i,ad in enumerate(json.loads(zhuanlan_data)):
                sql = '''
                SELECT biwenitemid from biwenitems
                where zhuanlanid=%d and biwenid=%d
                '''% (zhuanlan_id,ad['biwenid'])
                test = db.session.execute(text(sql)).first()
                #print(dir(test))
                
                if test:
                    sql = '''
                    UPDATE biwenitems
                    set biwen_num = %d, show_title = '%s', zhuanlan_part = '%s'
                    where zhuanlanid=%d and biwenid=%d
                    '''% (i,ad['show_title'],ad['zhuanlan_part'], zhuanlan_id, ad['biwenid'])
                    db.session.execute(text(sql))
                else:
                    sql = '''
                    INSERT into biwenitems (zhuanlanid, biwenid, biwen_num, show_title, zhuanlan_part)
                    values (%d, %d, %d, '%s', '%s')
                    '''% (zhuanlan_id, ad['biwenid'], i,ad['show_title'],ad['zhuanlan_part'])
                    db.session.execute(text(sql))
                    print("插入一条数据")
            db.session.commit()
    ret = {'result': 'ok'}
    return json.dumps(ret)


@tw.route('/searchbiwen/', methods=['GET','POST'])
def searchbiwen():
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
                    tmp.append(Biwen.__dict__[k].contains(oo))
            filters3.append(or_(*tmp))
        elif  " and " in it[1]:
            tmpout = []
            slalist = it[0].split("/")
            andlist = it[1].split(" and ")
            for k in slalist:
                tmp = []
                for aa in andlist:
                    tmp.append(Biwen.__dict__[k].contains(aa))
                tmpout.append(and_(*tmp))
            filters3.append(or_(*tmpout))
        elif  " " in it[1]:
            tmpout = []
            slalist = it[0].split("/")
            andlist = it[1].split(" ")
            for k in slalist:
                tmp = []
                for aa in andlist:
                    tmp.append(Biwen.__dict__[k].contains(aa))
                tmpout.append(and_(*tmp))
            filters3.append(or_(*tmpout))
        else:
            slalist = it[0].split("/")
            tmpout = []
            for k in slalist:
                tmpout.append(Biwen.__dict__[k].contains(it[1]))
            filters3.append(or_(*tmpout))

    filters3.append(Biwen.__dict__['hidden']==0)
    filters3.append(or_(Biwen.__dict__['privacy'] == None, Biwen.__dict__['privacy'] == "0"))
    qa = Biwen.query.with_entities(
        Biwen.biwenid,
        Biwen.author_id,
        Biwen.author_name,
        Biwen.title,
        Biwen.fulltext
        ).filter(*filters3).order_by(Biwen.create_time.desc()).all()
    qall = []
    for qq in qa:
        tmp = {}
        tmp['biwenid']=qq[0]
        tmp['author_id']=qq[1]
        tmp['author_name']=qq[2]
        tmp['title']=qq[3]
        tmp['fulltext']=qq[4]
        qall.append(tmp)

    return json.dumps(qall)


@tw.route('/deletezhuanlan', methods=['GET','POST'])
@login_required
def deletezhuanlan():
    zhuanlanid = request.form.get('zhuanlanid')
    zhuanlanitem = Zhuanlan.query.filter_by(zhuanlanid=zhuanlanid).first()
    zhuanlanitem.hidden = 1
    db.session.commit()
    ret = {'result': 'ok'}
    return json.dumps(ret)



# 同域上传
@tw.route('/upload', methods=['POST'])
def upload():

    file = request.files.get('file[]') # key一定是`file[]`
    if not file:
        res = {
            'success': 0,
            'message': '上传失败',
            'code': "404"
        }
    else:
        ex = os.path.splitext(file.filename)[1]
        front = os.path.splitext(file.filename)[0]
        filename = datetime.datetime.now().strftime('%Y%m%d%H%M%S') + ex
        
        if ex==".pdf" or ex==".PDF":
            file.save(os.path.join(PDF_FOLDER, filename))
            sendurl = url_for('tw.pdf', name=filename)
        elif ex in [".jpg",".jpeg",".gif",".png"]:
            file.save(os.path.join(IMAGE_FOLDER, filename))
            sendurl = url_for('tw.image', name=filename)
        else:
            file.save(os.path.join(FILES_FOLDER, filename))
            sendurl = url_for('tw.file', name=filename)
        
        res = {
            'success': 1,
            'message': '上传成功', 
            'url': sendurl,
            'ex':ex,
            'oriname':front,
            'code': '200'
        }
    return jsonify(res)
# 返回图片
@tw.route('/image/<name>')
def image(name):
    with open(os.path.join(IMAGE_FOLDER, name), 'rb') as image_f:
        resp = Response(image_f.read(), mimetype='image/jpeg')
    return resp

@tw.route('/pdf/<name>')
def pdf(name):
    return send_from_directory(os.path.join(os.getcwd(),PDF_FOLDER), name)

@tw.route('/file/<name>')
def file(name):
    return send_from_directory(os.path.join(os.getcwd(),FILES_FOLDER), name)



