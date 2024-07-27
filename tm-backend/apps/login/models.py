from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
db = SQLAlchemy()  # db_session
class User(db.Model,UserMixin):
    #__tablename__ = 'users_info'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20))
    role = db.Column(db.String(20))
    username = db.Column(db.String(20)) # 用户名
    password_hash = db.Column(db.String(128)) # 密码散列值
    def set_password(self, password): # 用来设置密码的方法，接受密码参数
        self.password_hash = generate_password_hash(password) #将生成的密码保持到对应字段
    def validate_password(self, password): # 用于验证密码的方法，受密码作为参数
        return check_password_hash(self.password_hash, password)

# class Questions(db.Model):
#     __tablename__ = 'questions_info'
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     title = db.Column(db.String(100), nullable=False)
#     content = db.Column(db.TEXT, nullable=False)
#     author_id = db.Column(db.Integer, db.ForeignKey('users_info.id'))
#     create_time = db.Column(db.DateTime, nullable=False, default=datetime.now())

#     author = db.relationship('User', backref=db.backref('questions', order_by=create_time.desc()))



# class Comments(db.Model):
#     __tablename__ = 'comments_info'
#     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
#     content = db.Column(db.TEXT, nullable=False)
#     question_id = db.Column(db.Integer, db.ForeignKey('questions_info.id'))
#     author_id = db.Column(db.Integer, db.ForeignKey('users_info.id'))
#     create_time = db.Column(db.DateTime, nullable=False, default=datetime.now())

#     author = db.relationship('User', backref=db.backref('comments'))
#     question = db.relationship('Questions', backref=db.backref('comments', order_by=create_time.desc()))



