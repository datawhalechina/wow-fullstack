from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
from app.core.models.users import Users
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
engine = create_engine("sqlite:///mydatabase.db")
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()
phone = "15812345678"
password = "zishu"
user = db.query(Users).filter(Users.phone== phone).first()
rst = pwd_context.verify(password, user.password)
print(user.username)
print(rst)