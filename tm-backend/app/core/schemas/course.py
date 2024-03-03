from typing import List
from pydantic import BaseModel

class Chapter(BaseModel):
    id:int
    title: str
    author_id: int
    author_name: str
    period: str
    url:str


class CourseModel(BaseModel):
    courseid:str
    title: str
    desc: str
    chapters:List[Chapter]