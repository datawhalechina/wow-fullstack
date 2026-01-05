from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class ConfigItem(BaseModel):
    key: str
    value: str
    description: Optional[str] = None


class ConfigUpdate(BaseModel):
    configs: List[ConfigItem]


class ConfigResponse(BaseModel):
    code: int
    message: Optional[str] = None
    data: Dict[str, Any]
