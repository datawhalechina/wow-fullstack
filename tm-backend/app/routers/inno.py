from fastapi import APIRouter, Form, Depends, HTTPException, status, Request
from datetime import datetime, timedelta
from app.dependencies import check_jwt_token, get_db
from sqlalchemy.orm import Session
from app.core.schemas.users import UserBase
from app.core.models.users import Users, Base
from app.database import engine
import json, os, ast, re


Base.metadata.create_all(bind=engine)

# 文件存储基础目录
STORAGE_BASE_DIR = os.path.abspath("static/tm")


def sanitize_user_id(user_id: int) -> int:
    """
    验证并返回用户ID
    安全修复: 防止SQL注入和路径遍历攻击
    """
    # 确保user_id是有效的正整数
    if not isinstance(user_id, int) or user_id <= 0:
        raise HTTPException(
            status_code=400,
            detail="无效的用户ID"
        )
    return user_id


def validate_file_path(filename: str, base_dir: str = STORAGE_BASE_DIR) -> str:
    """
    验证文件路径安全性
    安全修复: 防止路径遍历攻击
    """
    # 确保文件名只包含安全字符（字母、数字、下划线、连字符）
    if not re.match(r'^[a-zA-Z0-9_\-]+$', filename):
        raise HTTPException(
            status_code=400,
            detail="无效的文件名"
        )
    
    # 构建完整路径
    full_path = os.path.join(base_dir, f"{filename}.txt")
    
    # 规范化路径并验证是否在允许的目录内
    abs_path = os.path.abspath(full_path)
    if not abs_path.startswith(base_dir):
        raise HTTPException(
            status_code=403,
            detail="无权访问该文件"
        )
    
    return abs_path


inno = APIRouter(
    prefix="/api/inno",
    tags=["inno"],
    responses={404: {"description": "Not found"}},
)


@inno.get('/get_tm/{user_id}')
async def get_tm(user_id: int, user: UserBase = Depends(check_jwt_token)):
    """
    获取时间管理数据
    安全修复: 添加错误处理和用户验证
    """
    # 验证用户ID
    userid = sanitize_user_id(user_id)
    
    # 验证用户只能访问自己的数据
    if user.id != user_id:
        raise HTTPException(
            status_code=403,
            detail="无权访问其他用户的数据"
        )
    
    pr = []
    fn = []
    
    # 安全构建文件路径
    pr_file = validate_file_path(f"t{userid}")
    fn_file = validate_file_path(f"f{userid}")
    
    # 确保目录存在
    if not os.path.exists(STORAGE_BASE_DIR):
        os.makedirs(STORAGE_BASE_DIR)
    
    # 读取任务列表
    if os.path.exists(pr_file):
        try:
            with open(pr_file, "r", encoding="utf-8") as f:
                pr = f.readlines()
        except (IOError, OSError) as e:
            raise HTTPException(
                status_code=500,
                detail=f"读取任务文件失败: {str(e)}"
            )
    
    # 安全解析文件内容
    parsed_pr = []
    for line in pr:
        line = line.strip()
        if not line:
            continue
        try:
            parsed_pr.append(ast.literal_eval(line))
        except (ValueError, SyntaxError):
            # 跳过无效的行
            continue
    
    # 读取完成列表
    if os.path.exists(fn_file):
        try:
            with open(fn_file, "r", encoding="utf-8") as f:
                fn = f.readlines()
        except (IOError, OSError) as e:
            raise HTTPException(
                status_code=500,
                detail=f"读取完成文件失败: {str(e)}"
            )
    
    # 安全解析文件内容
    parsed_fn = []
    for line in fn:
        line = line.strip()
        if not line:
            continue
        try:
            parsed_fn.append(ast.literal_eval(line))
        except (ValueError, SyntaxError):
            # 跳过无效的行
            continue
    
    parsed_fn.reverse()
    return {"pr": parsed_pr, "fn": parsed_fn}

@inno.get('/get_pr/{user_id}')
async def get_pr(user_id: int, user: UserBase = Depends(check_jwt_token)):
    """
    获取任务列表
    安全修复: 添加错误处理和用户验证
    """
    # 验证用户ID
    userid = sanitize_user_id(user_id)
    
    # 验证用户只能访问自己的数据
    if user.id != user_id:
        raise HTTPException(
            status_code=403,
            detail="无权访问其他用户的数据"
        )
    
    pr = []
    # 安全构建文件路径
    pr_file = validate_file_path(f"t{userid}")
    
    # 确保目录存在
    if not os.path.exists(STORAGE_BASE_DIR):
        os.makedirs(STORAGE_BASE_DIR)
    
    if os.path.exists(pr_file):
        try:
            with open(pr_file, "r", encoding="utf-8") as f:
                pr = f.readlines()
        except (IOError, OSError) as e:
            raise HTTPException(
                status_code=500,
                detail=f"读取任务文件失败: {str(e)}"
            )
    
    # 安全解析文件内容
    parsed_pr = []
    for line in pr:
        line = line.strip()
        if not line:
            continue
        try:
            parsed_pr.append(ast.literal_eval(line))
        except (ValueError, SyntaxError):
            # 跳过无效的行
            continue
    
    return parsed_pr

@inno.put('/save_pr/{user_id}')
async def save_pr(request: Request, user_id: int, user: UserBase = Depends(check_jwt_token)):
    """
    保存任务列表
    安全修复: 添加错误处理和用户验证
    """
    # 验证用户只能修改自己的数据
    if user.id != user_id:
        raise HTTPException(
            status_code=403,
            detail="无权修改其他用户的数据"
        )
    
    # 验证用户ID
    userid = sanitize_user_id(user_id)
    form_data = await request.form()
    
    try:
        taskinfo = form_data.get("params[taskinfo]")
        if not taskinfo:
            raise HTTPException(
                status_code=400,
                detail="缺少任务信息参数"
            )
        tasklist = json.loads(taskinfo)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=400,
            detail="无效的JSON格式"
        )
    
    # 确保目录存在
    if not os.path.exists(STORAGE_BASE_DIR):
        os.makedirs(STORAGE_BASE_DIR)
    
    # 安全构建文件路径
    pr_file = validate_file_path(f"t{userid}")
    try:
        with open(pr_file, "w", encoding="utf-8") as f:
            for line in tasklist:
                f.write(str(line) + "\n")
    except (IOError, OSError) as e:
        raise HTTPException(
            status_code=500,
            detail=f"保存任务文件失败: {str(e)}"
        )
    
    return {"code": "200"}

@inno.put('/finish_tm/{user_id}')
async def finish_tm(request: Request, user_id: int, user: UserBase = Depends(check_jwt_token)):
    """
    保存完成的任务
    安全修复: 添加错误处理和用户验证
    """
    # 验证用户只能修改自己的数据
    if user.id != user_id:
        raise HTTPException(
            status_code=403,
            detail="无权修改其他用户的数据"
        )
    
    # 验证用户ID
    userid = sanitize_user_id(user_id)
    form_data = await request.form()
    
    try:
        finishitem_param = form_data.get("params[finishitem]")
        if not finishitem_param:
            raise HTTPException(
                status_code=400,
                detail="缺少完成项参数"
            )
        finishitem = json.loads(finishitem_param)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=400,
            detail="无效的JSON格式"
        )
    
    # 确保目录存在
    if not os.path.exists(STORAGE_BASE_DIR):
        os.makedirs(STORAGE_BASE_DIR)
    
    finishitem.reverse()
    # 安全构建文件路径
    fn_file = validate_file_path(f"f{userid}")
    try:
        with open(fn_file, "a", encoding="utf-8") as f:
            for line in finishitem:
                f.write(str(line) + "\n")
    except (IOError, OSError) as e:
        raise HTTPException(
            status_code=500,
            detail=f"保存完成文件失败: {str(e)}"
        )
    
    return {"code": "200"}