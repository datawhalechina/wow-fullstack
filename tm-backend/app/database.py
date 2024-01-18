# Author Tom.Yang (https://github.com/7n8fail)

# users_db = {
#     "mockuser":{
#         "id": 1,
#         "username": "mockuser",
#         "email": "mock@user.com",
#         "password": "$2b$12$sErK932BEaLyIisz30PubepN7w91RLwkISWbAFYgUgoIqh8goJLEW",
#     }
# }

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings


engine = create_engine(
    # settings.SQLALCHEMY_DATABASE_URL
    settings.SQLALCHEMY_DATABASE_URL_BACKUP
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

