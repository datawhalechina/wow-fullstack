from fastapi import APIRouter, Form, Depends, HTTPException, status, Request
from datetime import datetime, timedelta
from app.dependencies import check_jwt_token, get_db
from sqlalchemy.orm import Session
from app.core.schemas.users import UserBase
from app.core.models.users import Users, Base
from app.database import engine
import json, os, ast


Base.metadata.create_all(bind=engine)

inno = APIRouter(
    prefix="/api/inno",
    tags=["inno"],
    responses={404: {"description": "Not found"}},
)


@inno.get('/get_tm/{user_id}')
async def get_tm(user_id:int):
    userid = str(user_id)
    pr = []
    fn = []
    if os.path.exists(f"static/tm/t{userid}.txt"):
        with open(f"static/tm/t{userid}.txt", "r", encoding="utf-8") as f:
            pr=f.readlines()
    pr = [ast.literal_eval(x) for x in pr]
    if os.path.exists(f"static/tm/f{userid}.txt"):
        with open(f"static/tm/f{userid}.txt", "r", encoding="utf-8") as f:
            fn=f.readlines()
    fn = [ast.literal_eval(x) for x in fn]
    fn.reverse()
    return {"pr":pr, "fn":fn}

@inno.get('/get_pr/{user_id}')
async def get_pr(user_id:int):
    userid = str(user_id)
    pr = []
    if os.path.exists(f"static/tm/t{userid}.txt"):
        with open(f"static/tm/t{userid}.txt", "r", encoding="utf-8") as f:
            pr=f.readlines()
    pr = [ast.literal_eval(x) for x in pr]
    return pr

@inno.put('/save_pr/{user_id}')
async def save_pr(request: Request, user_id:int):
    userid = str(user_id)
    form_data = await request.form()
    tasklist = json.loads(form_data.get("params[taskinfo]"))
    with open(f"static/tm/t{userid}.txt", "w", encoding="utf-8") as f:
        for line in tasklist:
            f.write(str(line) + "\n")
    return {"code": "200"}

@inno.put('/finish_tm/{user_id}')
async def finish_tm(request: Request, user_id:int):
    userid = str(user_id)
    form_data = await request.form()
    finishitem = json.loads(form_data.get("params[finishitem]"))
    finishitem.reverse()
    with open(f"static/tm/f{userid}.txt", "a", encoding="utf-8") as f:
        for line in finishitem:
            f.write(str(line) + "\n")
    return {"code": "200"}
