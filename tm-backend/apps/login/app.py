from flask import Flask
import os
#from beknowmodels import *
from login.beknowmodels import *
from flask_migrate import Migrate
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = Config.SQLALCHEMY_DATABASE_URI
db.init_app(app)

migrate = Migrate(app, db)
# with app.test_request_context():
#     test1 = Users.query.filter_by(name='叶东').first()
#     print(test1.phone)