from flask import Flask,json
from apps.login.beknowmodels import *
import datetime
from sqlalchemy import func
import pandas as pd
import re


appver = Flask(__name__)
appver.config['SQLALCHEMY_DATABASE_URI'] = Config.SQLALCHEMY_DATABASE_URI
appver.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(appver)

def classtree(req):
    action = req.form.get('action')
    print("动作为"+action)
    datalistjson = req.form.get('datalist')
    if datalistjson:
        datalist = json.loads(datalistjson)
    if req.form.get('initlist'):
        initlist = json.loads(req.form.get('initlist'))
        print(initlist)
    with appver.test_request_context():
        if action=='fetchall':
            db.session.commit()
            alldata = Classtree.query.all()
            rstlist = []
            for ad in alldata:
                rstlist.append([ad.nodeid,ad.title,ad.par_id,ad.child_num,ad.class_degree,ad.rank_num,ad.keywords])
            clm = ["id","title","par_id","child_num","class_degree","rank_num","keywords"]
            dfall = pd.DataFrame(rstlist,columns=clm)
            dfsort = dfall.sort_values(by=['class_degree','par_id','rank_num'] ,ascending=[True,True,True])
            return dfsort.values.tolist()
        elif action=='additem':
            addlist = datalist
            # 构造新节点数据，关键字不用给
            newclass = Classtree(
                title=addlist[1],
                par_id=addlist[2],
                child_num=addlist[3],
                class_degree=addlist[4],
                rank_num=addlist[5]
            )
            
            # 父节点的孩子数量加1
            if int(addlist[2])>0:
                par_item = Classtree.query.get(addlist[2])
                par_item.child_num += 1
            # 如果有兄弟节点，在它之后的兄弟节点的排名加1
            followingnotes = Classtree.query.filter(
                Classtree.rank_num>=addlist[5],
                Classtree.par_id==addlist[2]
                ).all()
            if followingnotes:
                for follown in followingnotes:
                    follown.rank_num = follown.rank_num + 1
            db.session.add(newclass)
            db.session.commit()
            db.session.flush()
            return newclass.nodeid
        elif action=='update':
            uplist = datalist
            #只需更新标题和关键字，其他不动
            nodeitem = Classtree.query.get(uplist[0])
            nodeitem.title=uplist[1]
            nodeitem.keywords=uplist[2]
            db.session.commit()
            return "updated"
        elif action=='upmove':
            movelist = datalist
            # 先把它前一个的排名后挪
            print(movelist)
            previtem = Classtree.query.filter(
                Classtree.rank_num==movelist[5],
                Classtree.par_id==movelist[2]
                ).first()
            previtem.rank_num=movelist[5]+1
            nodeitem = Classtree.query.get(movelist[0])
            nodeitem.rank_num=movelist[5]
            db.session.commit()
            return "upmoved"
        # elif action=='init':
        #     if not Classtree.query.get(1):
        #         for il in initlist:
        #             newclass = Classtree(
        #                 title=il[1],
        #                 par_id=il[2],
        #                 child_num=il[3],
        #                 class_degree=il[4],
        #                 rank_num=il[5]
        #             )
        #             db.session.add(newclass)
        #     db.session.commit()
        #     return "inited"
        elif action=='delete':
            delist = datalist
            print(delist)
            # 父节点的孩子数量减1
            par_item = Classtree.query.get(delist[2])
            par_item.child_num -= 1
            # 后续兄弟节点的排名减1
            followingnotes = Classtree.query.filter(
                Classtree.rank_num>delist[5],
                Classtree.par_id==delist[2]
                ).all()
            if followingnotes:
                for follown in followingnotes:
                    follown.rank_num = follown.rank_num - 1
            # 删除该节点
            de_item = Classtree.query.get(delist[0])
            if de_item.child_num==0:
                db.session.delete(de_item)
            db.session.commit()
            return "deleted"

def fetchclass(req):
    par_id = req.form.get('par_id')
    print(par_id)
    classdata = []
    with appver.test_request_context():
        fetchclass = Classtree.query.with_entities(
            Classtree.title,
            Classtree.nodeid
            ).filter_by(par_id=par_id).order_by(Classtree.rank_num).all()
        for rr in fetchclass:
            classdata.append([rr[0],rr[1]])
    return classdata


def addclass(req,usrid,usrname):
    fclasstext = req.form.get('fclasstext')
    sclasstext = req.form.get('sclasstext')
    nowclass = req.form.get('nowclass')
    nowtitle = req.form.get('nowtitle')
    position = "位置"
    if nowclass=="一级分类":
        position = "根节点"
    elif nowclass=="二级分类":
        position = fclasstext
    elif nowclass=="三级分类":
        position = fclasstext + "-" + sclasstext

    with appver.test_request_context():
        adminitem = Users.query.filter_by(role="admin").first()
        newnotice = Notice(
            sender_id=usrid,
            receiver_id=adminitem.id,
            catigory="新增分类",
            send_text=usrname+"想要在-"+position+"-下新增"+nowtitle
        )
        db.session.add(newnotice)
        db.session.commit()
    ret = {'result': 'ok'}
    return ret


def fetchkeywords(req):
    node_id = req.form.get('node_id')
    with appver.test_request_context():
        fetchclass = Classtree.query.get(node_id)
    return fetchclass.keywords

def addkeywords(req,usrid,usrname):
    node_id = req.form.get('node_id')
    word = req.form.get('word')
    with appver.test_request_context():
        fetchclass = Classtree.query.get(node_id)
        fetchclass.keywords = fetchclass.keywords + '，' + word
        adminitem = Users.query.filter_by(role="admin").first()
        newnotice = Notice(
            sender_id=usrid,
            receiver_id=adminitem.id,
            catigory="新增关键词",
            send_text=usrname+"新增了关键词-"+word
        )
        db.session.add(newnotice)
        db.session.commit()
    ret = {'result': 'ok'}
    return ret

def showerrors():
    with open('nohup.out', 'r', encoding="utf-8") as f:
        read_data = f.read()
    print(len(read_data))
    errors = re.findall(r'(ERROR[\s\S]*?)DEBUG', read_data)
    errors.reverse()
    return errors

def showlogins():
    with open('apps/log/login/daily/dailylogin1.log', 'r', encoding="utf-8") as f:
        logins = f.readlines()
    print(len(logins))
    logins.reverse()
    return logins