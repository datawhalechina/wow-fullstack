from app.core.models.users import Users
from app.dependencies import get_password_hash
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime
engine = create_engine("sqlite:///mydatabase.db")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()
new_user = Users(
    username='自塾',
    password=get_password_hash('zishu'),
    email='zishu@zishu.co',
    phone='15812345678',
    register_time=datetime.now()
)
db.add(new_user)
db.commit()