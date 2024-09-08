from flask import Flask, render_template, request, send_from_directory
from flask import Blueprint, redirect, url_for
from apps.login.beknowmodels import *
from flask_login import login_required,current_user
from sqlalchemy import or_, and_
from sqlalchemy import text
import os
from importlib import reload
import sys
sys.path.append(os.path.abspath('./apps/am'))
import json
import time
import ammodel


am = Blueprint('am',__name__,template_folder='./templates', static_folder='./static')
@am.route('/')
def admin():
    return render_template("viewerindex.html", cpath = os.getcwd())


@am.route('/issuance/')
def issuance():
    return render_template("issuance.html")

@am.route('/trasact/', methods=['POST'])
@login_required
def trasact():
    amount = request.form.get("amount")
    notice = request.form.get("notice")
    print(amount,notice)
    ret = {'result': 'deal!'}
    return json.dumps(ret)

@am.route('/mulu/',methods=['GET','POST'])
def mulu():
    hpath = request.args.get("hpath")
    hname = request.args.get("hname")
    delindex = request.args.get("delindex")
    receivedfile = request.files.get('upfile')
    fatherpath = request.form.get("uppath")
    if receivedfile:
        savepath = os.path.join(fatherpath, receivedfile.filename)
        receivedfile.save(savepath)
        hpath = fatherpath
        #print("上传成功")
    if delindex and int(delindex) == 1:
        try:
            os.remove(hpath)
        except:
            pass
        hpath = os.path.abspath(os.path.join(hpath, ".."))
    disk = []
    if hpath:
        fapath = os.path.abspath(os.path.join(hpath, ".."))
        father = {
            'path':fapath,
            'fapath':fapath,
            'size':"",
            'name':"..",
            'time':"",
            'type':"",
        }
        disk.append(father)
        if os.path.isdir(hpath):
            #print(hpath)
            #print("是文件夹")
            lujing = os.listdir(hpath)
            for item in lujing:
                tmppath = os.path.abspath(os.path.join(hpath, item))
                fsize = ""
                typepath = "文件"
                if os.path.isdir(tmppath):
                    typepath = "文件夹"
                else:
                    tmpsize = round(os.path.getsize(tmppath)/1024)
                    fsize = str(tmpsize+1) + "KB"
                temp = {
                    'path':tmppath,
                    'fapath':hpath,
                    'size':fsize,
                    'name':item,
                    'time':time.strftime("%Y-%m-%d %H:%M", time.localtime(os.path.getctime(tmppath))),
                    'type':typepath,
                }
                disk.append(temp)
        else:
            dpath = os.path.abspath(os.path.join(hpath, ".."))
            dname = hname
            return send_from_directory(dpath, dname, as_attachment=True)
    else:
        pass
    return render_template("viewer.html", disk = disk, fapath=hpath)





@am.route('/showstatus/')
def showstatus():
    return render_template("showstatus.html")

@am.route('/getprofile/', methods=['POST'])
def getprofile():
    prodata = []
    sql = '''show variables like 'max_connections';'''
    maxc = db.session.execute(text(sql)).fetchone()[1]
    prodata.append(maxc)
    sql2 = '''show global status like 'Max_used_connections';'''
    maxu = db.session.execute(text(sql2)).fetchone()[1]
    prodata.append(maxu)
    sql3 = "show status like 'Threads_connected';"
    maxtco = db.session.execute(text(sql3)).fetchone()[1]
    prodata.append(maxtco)
    return json.dumps(prodata)

@am.route('/clstree/', methods=['GET', 'POST'])
@login_required
def clstree():
	return render_template("clstree.html")

@am.route('/classtree/', methods=['POST'])
def classtree():
    reload(ammodel)
    rstdic = ammodel.classtree(request)
    return json.dumps(rstdic)

@am.route('/fetchclass/', methods=['POST'])
def fetchclass():
    reload(ammodel)
    rstdic = ammodel.fetchclass(request)
    return json.dumps(rstdic)

@am.route('/fetchkeywords/', methods=['POST'])
def fetchkeywords():
    reload(ammodel)
    rstdic = ammodel.fetchkeywords(request)
    return json.dumps(rstdic)

@am.route('/addclass/', methods=['POST'])
@login_required
def addclass():
    usrid = current_user.id
    usrname = current_user.name
    reload(ammodel)
    rstdic = ammodel.addclass(request,usrid,usrname)
    return json.dumps(rstdic)

@am.route('/addkeywords/', methods=['POST'])
@login_required
def addkeywords():
    usrid = current_user.id
    usrname = current_user.name
    reload(ammodel)
    rstdic = ammodel.addkeywords(request,usrid,usrname)
    return json.dumps(rstdic)

@am.route('/showerrors/')
@login_required
def showerrors():
    reload(ammodel)
    rstdic = ammodel.showerrors()
    return render_template("showerrors.html", errordata=rstdic)

@am.route('/showlogins/')
@login_required
def showlogins():
    reload(ammodel)
    rstdic = ammodel.showlogins()
    return render_template("showlogins.html", logindata=rstdic)