from sqlalchemy import Column, Integer, Float, VARCHAR, DateTime
from app.database import Base

class Project(Base):
    __tablename__ = 'project'

    id = Column(Integer, primary_key=True, autoincrement=True)
    publisher = Column(VARCHAR(32))
    publisher_id = Column(Integer)
    taker = Column(VARCHAR(32))
    taker_id = Column(Integer)
    task_serial = Column(VARCHAR(32))
    title = Column(VARCHAR(100))
    url= Column(VARCHAR(500))
    desc= Column(VARCHAR(500))
    create_time = Column(DateTime)
    start_date = Column(DateTime)
    deadline = Column(DateTime)
    planed_hour = Column(Float)
    half_progress = Column(VARCHAR(32))
    finish_date = Column(DateTime)
    actual_hour = Column(Float)
    total_hour = Column(Float)
    update_date = Column(DateTime)