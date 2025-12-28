from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    SECRET_KEY:str
    ALGORITHM:str
    ACCESS_TOKEN_EXPIRE_MINUTES:int
    HOST:str
    PORT:int
    SQLALCHEMY_DATABASE_URL:str
    # SMTP 邮件配置（可选，配置后可发送密码重置邮件）
    SMTP_HOST:str = "smtp.163.com"
    SMTP_PORT:int = 465
    SMTP_USER:str = ""
    SMTP_PASSWORD:str = ""
    # 兼容旧配置名
    SMTP_USERNAME:str = ""

    model_config = SettingsConfigDict(env_file='.env', _env_file_encoding='utf-8', extra='allow')

@lru_cache
def get_settings():
    return Settings()

settings = get_settings()