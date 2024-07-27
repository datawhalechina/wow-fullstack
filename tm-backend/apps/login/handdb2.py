from flask import Flask
import os
from beknowmodels import *
# from flask_migrate import Migrate
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:liwei0062@localhost:3306/christarter"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

users = [
    {'name':'黎伟','phone':'15821123639','role':'admin'},
    {'name':'系统','phone':'15888888888','role':'sys'},
    {'name':'转存','phone':'15999999999','role':'trans'}
]

with app.test_request_context():
    for u in users:
        user = Users(name=u['name'], phone=u['phone'],role=u['role'])
        user.set_password('111111')
        db.session.add(user)
    db.session.commit()