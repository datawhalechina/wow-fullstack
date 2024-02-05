# Author Tom.Yang (https://github.com/7n8fail)

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SECRET_KEY:str
    ALGORITHM:str
    ACCESS_TOKEN_EXPIRE_MINUTES:int
    HOST:str
    PORT:int

    model_config = SettingsConfigDict(env_file='.env', _env_file_encoding='utf-8')