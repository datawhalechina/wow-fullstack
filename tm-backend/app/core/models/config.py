from sqlalchemy import Column, Integer, VARCHAR, DateTime
from datetime import datetime
from app.database import Base


class SystemConfig(Base):
    """系统配置模型"""
    __tablename__ = 'system_config'

    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(VARCHAR(100), unique=True, nullable=False, index=True)
    value = Column(VARCHAR(500))
    description = Column(VARCHAR(200))
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
