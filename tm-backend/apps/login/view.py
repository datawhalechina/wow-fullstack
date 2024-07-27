from flask import Blueprint, render_template, request,flash,redirect,url_for,abort,json
from flask_login import login_required,LoginManager,logout_user,login_user,current_user
from apps.login.beknowmodels import *
from apps.login.logmodel import *
import traceback
import datetime
import hashlib
import time

MYSTATIC = "../static/"
auth = Blueprint('auth',__name__,template_folder='./templates', static_folder=MYSTATIC, static_url_path="/mystatic/")

@auth.route('/')
def research_index():
    return render_template("login.html")

login_manager = LoginManager()
login_manager.login_view = 'auth.login'
@login_manager.user_loader #这段代码一定要有，否则报错找不到user_loader
def load_user(user_id): # 创建用户加载回调函数，接受用户 ID 作为参数
    try:
        user = Users.query.get(int(user_id)) # 用 ID 作为 User 模型的    主键查询对应的用户
        # loginloginfo(user.name + '再次登录成功！')
    except:
        user = None
        with open('apps/log/login/error/errorlogin1.log', 'a', encoding='UTF-8') as f:
            f.write(str(user_id)+"登录失败：\n")
            f.write(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())+ "\n")
            f.write(request.environ.get('HTTP_X_REAL_IP', request.remote_addr) + "\n")
            traceback.print_exc(file=f)
            f.write(current_user.name+"\n\n")
    return user # 返回用户对象


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        phone = request.form['username']
        password = request.form['password']
        if not phone or not password:
            flash('Invalid input.')
            return redirect(url_for('auth.login'))
        user = Users.query.filter_by(phone=phone).first()
        next_page_url = request.args.get('next')
        # 验证用户名和密码是否一致
        if user and phone == user.phone and user.validate_password(password):
            try:
                login_user(user)  # 登入用户
                loginloginfo(user.name + '登录成功！')
            except:
                with open('apps/log/login/error/errorlogin1.log', 'a', encoding='UTF-8') as f:
                    f.write("登录失败：\n")
                    f.write(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())+ "\n")
                    f.write(request.environ.get('HTTP_X_REAL_IP', request.remote_addr) + "\n")
                    traceback.print_exc(file=f)
                    f.write("\n\n")
            if not next_page_url:
                return redirect(url_for('start'))  # 重定向到主页
            else:
                return redirect(next_page_url)
        flash('Invalid phone or password.')  # 如果验证失败，显示错误消息
        return redirect(url_for('auth.login'))  # 重定向回登录页面
    return render_template('login.html')

@auth.route('/login_api', methods=['GET', 'POST'])
def login_api():
    if request.method == 'POST':
        id = int(request.form['id'])
        name = request.form['name']
        phone = request.form['phone']
        role = request.form['role']
        user = Users.query.filter_by(id=id).first()
        print("收到登录请求！")
        if user and phone == user.phone:
            try:
                login_user(user)  # 登入用户
                print(user.name + '登录成功！')
                loginloginfo(user.name + '登录成功！')
            except:
                with open('apps/log/login/error/errorlogin1.log', 'a', encoding='UTF-8') as f:
                    f.write("登录失败：\n")
                    f.write(time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())+ "\n")
                    f.write(request.environ.get('HTTP_X_REAL_IP', request.remote_addr) + "\n")
                    traceback.print_exc(file=f)
                    f.write("\n\n")
        elif user and phone != user.phone:
            user.phone = phone
            user.name = name
            user.role = role
            db.session.commit()
            login_user(user)
            print(user.name + '更新后登录成功！')
        else:
            newuseritem = Users(
                id = id,
                name = name,
                phone = phone,
                role = role,
            )
            db.session.add(newuseritem)
            db.session.commit()
            user = Users.query.filter_by(id=id).first()
            login_user(user)
            print(user.name + '新建后登录成功！')
    return "ok"

@auth.route('/logout')
@login_required # 用于视图保护，后面会详细介绍
def logout():
    logout_user() # 登出用户
    flash('Goodbye.')
    return redirect(url_for('start')) # 重定向回首页


WECHAT_TOKEN = "omige"
@auth.route('/wechat')
def wechat():
    """对接微信公众号服务器"""
    #接受微信服务器发送的参数
    signature = request.args.get("signature")
    timestamp = request.args.get("timestamp")
    nonce = request.args.get("nonce")
    echostr = request.args.get("echostr")

    # 校验参数
    if not all([signature, timestamp, nonce, echostr]):
        abort(400)
    # 按照微信的流程计算签名
    li = [WECHAT_TOKEN, timestamp, nonce]
    # 排序
    li.sort()
    # 拼接字符串
    tmp_str = "".join(li)
    # 进行sha1加密，得到正确的签名值
    sign = hashlib.sha1(tmp_str.encode()).hexdigest()
    #将拼接的签名与微信的签名对比，如果一致，则证明请求来自微信。
    if signature != sign:
        # 表示请求不是微信的
        abort(403)
    else:
        return echostr

@auth.route('/trywx/', methods=['POST'])
def trywx():
    data = request.form.get('send1')
    ret = {'result': data+'flask回调成功！'}
#     print(data)
    return json.dumps(ret)