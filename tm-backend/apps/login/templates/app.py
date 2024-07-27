from flask_migrate import Migrate
from flask import Flask
import os
from models2 import db, Users, Questions, Comments
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.root_path, 'userdatatry.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
migrate = Migrate(app, db)

#with app.test_request_context():
    #print(Users.query.get(1).username)
    #user = Users(username="liwei", phone="15821123639",password="123456")
    #db.session.add(user)
    #db.session.commit()
    
