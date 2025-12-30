from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from typing import Optional, List
import os
import ast

from app.dependencies import check_jwt_token, get_db, require_admin
from app.core.schemas.users import TokenModel

router = APIRouter(prefix="/api/statistics", tags=["statistics"])


def read_user_file(filepath: str) -> List:
    """读取用户数据文件"""
    data = []
    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                for line in f.readlines():
                    line = line.strip()
                    if line:
                        try:
                            data.append(ast.literal_eval(line))
                        except:
                            continue
        except Exception as e:
            print(f"读取文件失败 {filepath}: {e}")
    return data


# ============ 个人统计 API ============

@router.get("/personal/overview")
async def get_personal_overview(
    user: TokenModel = Depends(check_jwt_token),
    db: Session = Depends(get_db)
):
    """获取个人统计数据概览"""
    from app.core.models.users import Users

    user_data = db.query(Users).filter(Users.id == user.id).first()
    if not user_data:
        raise HTTPException(status_code=404, detail="用户不存在")

    userid_str = str(user.id)

    # 读取时间管理数据
    tm_file = f"static/tm/t{userid_str}.txt"
    fn_file = f"static/tm/f{userid_str}.txt"

    total_tasks = 0
    finished_tasks = 0
    total_hours = 0

    planned_tasks = read_user_file(tm_file)
    finished_task_list = read_user_file(fn_file)

    total_tasks = len(planned_tasks)
    finished_tasks = len(finished_task_list)

    for task in planned_tasks:
        if len(task) > 7 and task[7] and task[7] > 0:
            total_hours += task[7] / 60

    return {
        "code": 200,
        "data": {
            "shuzhi": round(user_data.shuzhi or 0, 1),
            "learn_hours": round(user_data.learn_hour or 0, 1),
            "create_hours": round(user_data.create_hour or 0, 1),
            "total_tasks": total_tasks,
            "finished_tasks": finished_tasks,
            "completion_rate": round(finished_tasks / total_tasks * 100, 1) if total_tasks > 0 else 0,
            "total_hours": round(total_hours, 1)
        }
    }


@router.get("/personal/trend")
async def get_personal_trend(
    days: int = 7,
    user: TokenModel = Depends(check_jwt_token),
    db: Session = Depends(get_db)
):
    """获取个人学习时长趋势"""
    from app.core.models.users import Users
    from datetime import datetime, timedelta

    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)

    # 按天统计学习时长
    daily_stats = []
    current = start_date
    while current <= end_date:
        date_str = current.strftime("%Y-%m-%d")
        daily_stats.append({
            "date": date_str,
            "value": 0
        })
        current += timedelta(days=1)

    # 从数据库获取学习记录
    records = db.query(Users).filter(
        Users.id == user.id
    ).first()

    # 返回模拟数据（实际项目中应该从study_time表获取）
    # 这里返回最近7天的模拟数据
    import random
    trend_data = []
    for i in range(days):
        date = (end_date - timedelta(days=days - i - 1)).strftime("%Y-%m-%d")
        trend_data.append({
            "date": date,
            "value": round(random.uniform(0.5, 4.0), 1)
        })

    return {"code": 200, "data": trend_data}


@router.get("/personal/shuzhi-history")
async def get_shuzhi_history(
    user: TokenModel = Depends(check_jwt_token)
):
    """获取塾值变化历史"""
    userid_str = str(user.id)
    file_path = f"static/shuzhi/s{userid_str}.txt"

    shuzhi_list = read_user_file(file_path)

    # 格式化返回数据
    formatted_list = []
    for item in shuzhi_list:
        if isinstance(item, dict) and len(item) >= 6:
            formatted_list.append({
                "target_type": item.get("target_type", ""),
                "target_title": item.get("target_title", ""),
                "amount": item.get("amount", 0),
                "balance": item.get("balance", 0),
                "comments": item.get("comments", ""),
                "create_time": item.get("create_time", "")
            })

    return {"code": 200, "data": list(reversed(formatted_list))}


@router.get("/personal/time-distribution")
async def get_time_distribution(
    user: TokenModel = Depends(check_jwt_token),
    db: Session = Depends(get_db)
):
    """获取时间分配"""
    from app.core.models.users import Users

    user_data = db.query(Users).filter(Users.id == user.id).first()

    # 返回时间分配数据
    return {
        "code": 200,
        "data": [
            {"name": "学习", "value": user_data.learn_hour or 0},
            {"name": "创作", "value": user_data.create_hour or 0},
            {"name": "其他", "value": 20}  # 模拟数据
        ]
    }


# ============ 全局统计 API (仅管理员) ============

@router.get("/global/overview")
async def get_global_overview(
    user: TokenModel = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """获取全局统计数据"""
    from app.core.models.users import Users

    users = db.query(Users).all()

    total_users = len(users)
    total_shuzhi = sum(u.shuzhi or 0 for u in users)
    total_learn_hours = sum(u.learn_hour or 0 for u in users)
    total_create_hours = sum(u.create_hour or 0 for u in users)

    # 按角色统计
    role_stats = {}
    for u in users:
        role = u.role or 'user'
        if role not in role_stats:
            role_stats[role] = {"count": 0, "shuzhi": 0}
        role_stats[role]["count"] += 1
        role_stats[role]["shuzhi"] += u.shuzhi or 0

    # 按地区统计
    location_stats = {}
    for u in users:
        location = u.location or '未知'
        if location not in location_stats:
            location_stats[location] = 0
        location_stats[location] += 1

    return {
        "code": 200,
        "data": {
            "total_users": total_users,
            "total_shuzhi": round(total_shuzhi, 1),
            "total_learn_hours": round(total_learn_hours, 1),
            "total_create_hours": round(total_create_hours, 1),
            "role_stats": role_stats,
            "location_stats": location_stats
        }
    }


@router.get("/global/ranking")
async def get_global_ranking(
    type: str = "shuzhi",
    limit: int = 10,
    user: TokenModel = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """获取排行榜"""
    from app.core.models.users import Users

    valid_types = ["shuzhi", "learn_hour", "create_hour"]
    if type not in valid_types:
        type = "shuzhi"

    column = getattr(Users, type, Users.shuzhi)
    top_users = (
        db.query(Users)
        .order_by(desc(column))
        .limit(min(limit, 100))
        .all()
    )

    ranking_data = []
    for i, u in enumerate(top_users):
        value = getattr(u, type, 0) or 0
        ranking_data.append({
            "index": i + 1,
            "id": u.id,
            "username": u.username,
            "location": u.location or '-',
            "bumen": u.bumen or '-',
            "value": round(value, 1)
        })

    return {"code": 200, "data": ranking_data}


@router.get("/global/growth-trend")
async def get_growth_trend(
    days: int = 30,
    user: TokenModel = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """获取用户增长趋势"""
    from app.core.models.users import Users
    from datetime import datetime, timedelta
    from sqlalchemy import cast, Date

    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)

    # 按天统计注册用户数
    daily_stats = []
    current = start_date
    while current <= end_date:
        date_str = current.strftime("%Y-%m-%d")
        count = db.query(Users).filter(
            cast(Users.register_time, Date) == current.date()
        ).count()
        daily_stats.append({
            "date": date_str,
            "count": count
        })
        current += timedelta(days=1)

    return {"code": 200, "data": daily_stats}


@router.get("/global/course-stats")
async def get_course_stats(
    user: TokenModel = Depends(require_admin)
):
    """获取课程统计（模拟数据）"""
    # 模拟课程热度数据
    course_data = [
        {"name": "Vue3入门", "views": 1200, "duration": 45},
        {"name": "FastAPI实战", "views": 980, "duration": 60},
        {"name": "TypeScript精讲", "views": 850, "duration": 40},
        {"name": "Element Plus教程", "views": 720, "duration": 35},
        {"name": "Excel自动化", "views": 680, "duration": 50}
    ]

    return {"code": 200, "data": course_data}
