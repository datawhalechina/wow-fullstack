from sqlalchemy import Column, Integer, Float, VARCHAR, Sequence, DateTime
from app.database import Base

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(VARCHAR(200), nullable=False)
    email = Column(VARCHAR(200), nullable=False)
    password = Column(VARCHAR(500), nullable=True)
    phone = Column(VARCHAR(80))
    gender = Column(VARCHAR(32))
    location = Column(VARCHAR(32))
    bumen = Column(VARCHAR(32))
    role = Column(VARCHAR(32))
    shuzhi = Column(Float, default=0.0)
    learn_hour = Column(Float, default=0.0)
    create_hour = Column(Float, default=0.0)
    avantar = Column(VARCHAR(256))
    desc = Column(VARCHAR(1000))
    register_time = Column(DateTime)
    last_login_time = Column(DateTime)

class Register(Base):
    __tablename__ = 'register'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(VARCHAR(200), nullable=False)
    email = Column(VARCHAR(200), nullable=False)
    password = Column(VARCHAR(500), nullable=True)
    phone = Column(VARCHAR(80))
    notes = Column(VARCHAR(500))
    register_time = Column(DateTime)


class Mentors(Base):
    __tablename__ = 'mentors'

    id = Column(Integer, primary_key=True, autoincrement=True)
    shushi_id = Column(Integer)
    course_id = Column(Integer)
    shusheng_id = Column(Integer)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    status = Column(VARCHAR(32))
    update_time = Column(DateTime)
    end_reason = Column(VARCHAR(500))

class Goals(Base):
    __tablename__ = 'goals'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer)
    content = Column(VARCHAR(500))
    start_time = Column(DateTime)
    deadline = Column(DateTime)
    process = Column(Integer)
    end_time = Column(DateTime)
    review = Column(VARCHAR(500))

class Shuzhi(Base):
	__tablename__ = 'shuzhi'
	id = Column(Integer, primary_key=True, autoincrement=True)
	user_id = Column(Integer)
	user_type = Column(VARCHAR(32))
	target_title = Column(VARCHAR(256))
	target_type = Column(VARCHAR(32))
	target_id = Column(Integer)
	oppo_type = Column(VARCHAR(32))
	oppo_id = Column(Integer)
	change = Column(Integer)
	amount = Column(Float)
	balance = Column(Float)
	comments = Column(VARCHAR(256))
	create_time = Column(DateTime)