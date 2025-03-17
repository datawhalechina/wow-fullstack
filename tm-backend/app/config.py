from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    SECRET_KEY:str
    ALGORITHM:str
    ACCESS_TOKEN_EXPIRE_MINUTES:int
    HOST:str
    PORT:int
    SQLALCHEMY_DATABASE_URL:str
    # SMTP_HOST:str
    # SMTP_PORT:int
    # SMTP_USER:str
    # SMTP_PASSWORD:str

    model_config = SettingsConfigDict(env_file='.env', _env_file_encoding='utf-8', extra='allow')

@lru_cache
def get_settings():
    return Settings()

settings = get_settings()