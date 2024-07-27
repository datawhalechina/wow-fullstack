from flask import Flask, render_template
#from datetime import timedelta
from apps.login.beknowmodels import db,Config
#from flask_cors import CORS
#import os



def create_app():
    app = Flask(__name__)
    app.jinja_env.auto_reload = True
    app.config.from_object(Config)
    # app.config['TEMPLATES_AUTO_RELOAD'] = True
    # app.config['SEND_FILE_MAX_AGE_DEFAULT'] = timedelta(seconds=5)
    # app.config['CSRF_ENABLED'] = True
    # app.config['SECRET_KEY'] = 'guanguanjuju'
    # app.config['UPLOAD_PATH'] = './uploads/'
    # app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:liwei0062@localhost:3306/christarter"
    # app.config['SQLALCHEMY_POOL_RECYCLE'] = 10
    # app.config['SQLALCHEMY_POOL_SIZE'] = 8000
    # app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    from apps.sp.view import sp as sp_bp
    from apps.tw.view import tw as tw_bp
    from apps.nt.view import nt as nt_bp
    from apps.tm.view import tm as tm_bp
    from apps.jc.view import jc as jc_bp
    from apps.rz.view import rz as rz_bp
    from apps.rw.view import rw as rw_bp
    from apps.my.view import my as my_bp
    from apps.login.view import auth as auth_bp
    from apps.am.view import am as am_bp

    
    app.register_blueprint(sp_bp,url_prefix='/sp')
    app.register_blueprint(tw_bp,url_prefix='/tw')
    app.register_blueprint(nt_bp,url_prefix='/nt')
    app.register_blueprint(tm_bp,url_prefix='/tm')
    app.register_blueprint(jc_bp,url_prefix='/jc')
    app.register_blueprint(rz_bp,url_prefix='/rz')
    app.register_blueprint(rw_bp,url_prefix='/rw')
    app.register_blueprint(my_bp,url_prefix='/my')
    app.register_blueprint(auth_bp,url_prefix='/auth')
    app.register_blueprint(am_bp,url_prefix='/am')

    db.init_app(app=app)


    return app
