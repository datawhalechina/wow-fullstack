from flask import Blueprint, render_template, request, session, redirect, url_for, send_from_directory
from importlib import reload
from geventwebsocket.websocket import WebSocket,WebSocketError
from apps.login.beknowmodels import *
from flask_login import login_required,current_user
import json
import xmind
import sys
import os
sys.path.append(os.path.abspath('./apps/nt'))
import brainmodel



userlist = ["15821123639","13761474605","18852956159","13501788974"]
pwd = "111111"
nt = Blueprint('nt',__name__,template_folder='./templates', static_folder="./static")


@nt.route('/')
def brain():
    map_search = Brainmap.query.with_entities(
        Brainmap.root_id,
        Brainmap.root_topic,
        ).filter_by(hidden=0).order_by(Brainmap.create_time.desc()).all()
    return render_template("brain-coedit.html", minddata=map_search)



uuidlist = []
@nt.route('/genuuid/',methods=['POST'])
def genuuid():
    generatedid = request.form.get('message')
    print(generatedid)
    brainmodel.anaq(uuidlist,generatedid)
    return "ok"

@nt.route('/brains/<brainid>')
def brains(brainid):
    reload(brainmodel)
    brainbackdata = brainmodel.searchbrainid(brainid)
    print(uuidlist)
    if brainbackdata:
        return render_template("newbrain1.html",brainid=brainbackdata)
    elif brainid in uuidlist:
        
        return render_template("newbrain1.html",brainid=brainid)
    else:
        return render_template("notfound.html")


UserData = {
    '15821123639':{'imgurl':'../static/img/liwei.png','name':'黎伟','details':'山东 代理师'},
    '13761474605':{'imgurl':'../static/img/einstein.png','name':'钟华','details':'瑞士 物理学家'},
    '18852956159':{'imgurl':'../static/img/einstein.png','name':'王彦','details':'英国 物理学家'},
    '13501788974':{'imgurl':'../static/img/einstein.png','name':'李季洪','details':'英国 数学家'},
    'crowdall':{'imgurl':'../static/img/einstein.png','name':'知识图谱交流群','details':'我们是追求知识的群体'},
}


user_socket_dict={}
OnlineData = {'crowdall':{'imgurl':'../static/img/einstein.png','name':'知识图谱交流群','details':'我们是追求知识的群体'}}
@nt.route('/ws/')
def ws():
    username = request.args.get('un')
    gb = request.args.get('gid')
    user_socket=request.environ.get("wsgi.websocket")
    print(user_socket)
    if not user_socket:
        return "请以WEBSOCKET方式连接"
    print(username + "已连接到" + gb)
    if username in UserData:
        who_send_msg={
            "send_user":username,
            "send_msg":{"action":"login_data", "LoginDict":UserData[username]}
        }
        user_socket.send(json.dumps(who_send_msg))
        who_send_msg={
            "send_user":username,
            "send_msg":{"action":"online_data", "OnlineDict":OnlineData}
        }
        user_socket.send(json.dumps(who_send_msg))


    if len(OnlineData)>1:
        print(OnlineData)
        for user_name,u_socket in user_socket_dict.items():

            who_send_msg={
                "send_user":username,
                "send_msg":{"action":"new_member", "member_data":UserData[username]}
            }

            u_socket.send(json.dumps(who_send_msg))
    user_socket_dict[username]=user_socket
    if username in UserData:
        OnlineData[username]=UserData[username]
    print(user_socket_dict)
    while True:
        try:
            user_msg = user_socket.receive()
            if username and user_msg:
                print(username + "说：" + user_msg)
            user_msg_dic = json.loads(user_msg)
            if user_msg_dic['action']=='chatmsg' and user_msg_dic['target'] != 'crowdall':
                who_send_msg={
                    "send_user":username,
                    "send_msg":user_msg
                }
                user_socket_dict[user_msg_dic['target']].send(json.dumps(who_send_msg))
            else:
                for user_name,u_socket in user_socket_dict.items():

                    who_send_msg={
                        "send_user":username,
                        "send_msg":user_msg
                    }

                    if user_socket == u_socket:
                        continue
                    u_socket.send(json.dumps(who_send_msg))
        except:
            user_socket_dict.pop(username)



@nt.route('/savemind/' ,methods=['GET','POST'])
def savemind():
    mind = request.form.get('data')
    dele = request.form.get('dele')
    ret ={'result': "已保存"}
    reload(brainmodel)
    brainmodel.savebrain(mind,dele)
    return json.dumps(ret)

@nt.route('/search/',methods=['POST'])
def search():
    S = request.values.get('question')
    map_search = Brainmap.query.filter_by(root_id=S).first()
    

    if map_search:
        return redirect('/nt/brains/'+S)
    else:
        item_search = Brainitem.query.filter(Brainitem.itemtopic.contains(S)).all()
        total = len(item_search) #一共这么多个
        print("共查询到%d条数据"%total)
        print(S)
        for tt in item_search:
            print(tt.itemtopic)
        return render_template('search.html',items=item_search,total=total, cjss=S)

@nt.route('/uploadmind/',methods=['POST'])
def uploadmind():
    upmindfile = request.files.get('upfile')
    upmindname = request.form.get('mindname')
    mindpath = os.path.abspath('./apps/nt') + '/static/uploads/'+ upmindname
    upmindfile.save(mindpath)
    reload(brainmodel)
    workbook = xmind.load(mindpath)
    retarray = brainmodel.xmind2jsmind(workbook.getData())
    return json.dumps(retarray)

xmind_path = os.path.abspath('./apps/nt/static/xmindfiles/')

@nt.route('/downloadmind/',methods=['POST'])
def downloadmind():
    reload(brainmodel)
    downmind = request.form.get('virtualpost')
    dataload=json.loads(downmind)
    for p in dataload:
        if "isroot" in p and p["isroot"]==True:
            roottopic = p["topic"]
            rootid = p["id"]
    brainmodel.genxmind(dataload, roottopic, rootid)
    return send_from_directory(xmind_path, roottopic + ".xmind", as_attachment=True)
