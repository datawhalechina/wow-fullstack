from sqlalchemy import Column, Integer, Float, VARCHAR, DateTime, Boolean
from app.database import Base

class Course(Base):
    __tablename__ = 'course'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(VARCHAR(100))
    type = Column(VARCHAR(32))
    director_id = Column(Integer)
    director_name = Column(VARCHAR(32))
    desc = Column(VARCHAR(200))
    create_time = Column(DateTime)

class Chapter(Base):
    __tablename__ = 'chapter'

    id = Column(Integer, primary_key=True, autoincrement=True)
    course_id = Column(Integer)
    serial = Column(Integer)
    title = Column(VARCHAR(100))
    author_id = Column(Integer)
    author_name = Column(VARCHAR(32))
    period = Column(VARCHAR(32))
    create_time = Column(DateTime)
    url= Column(VARCHAR(500))

class Selection(Base):
    __tablename__ = 'selection'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer)
    shushi_id = Column(Integer)
    course_id = Column(Integer)
    create_time = Column(DateTime)
    current_serial = Column(Integer)
    update_time = Column(DateTime)
    finish_time = Column(DateTime)

class Report(Base):
    __tablename__ = 'report'

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer)
    chapter_id = Column(Integer)
    chapter_title = Column(VARCHAR(100))
    time_reported = Column(Float)
    report_time = Column(DateTime)
    time_granted = Column(Float)
    grant_time = Column(DateTime)
    derive = Column(Boolean)
    source_id = Column(Integer)