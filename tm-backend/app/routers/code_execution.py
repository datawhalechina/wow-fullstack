"""
代码执行 API 路由
支持 Python, SQL, HTML, CSS, JavaScript, Vue 代码的在线执行
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from app.services.python_executor import PythonExecutor
from app.services.sql_executor import SQLExecutor
from app.services.web_executor import WebExecutor

router = APIRouter()

# 创建执行器实例
python_executor = PythonExecutor()
sql_executor = SQLExecutor()
web_executor = WebExecutor()


class CodeExecutionRequest(BaseModel):
    """代码执行请求"""
    language: str
    code: str
    timeout: int = 10  # 执行超时时间（秒）


class CodeExecutionResponse(BaseModel):
    """代码执行响应"""
    success: bool
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    error: Optional[str] = None
    exitCode: Optional[int] = None
    html: Optional[str] = None  # Web 代码预览
    rowCount: Optional[int] = None  # SQL 查询返回的行数


@router.post("/execute", response_model=dict)
async def execute_code(request: CodeExecutionRequest):
    """
    统一代码执行入口

    支持的语言:
    - Python: py, python
    - SQL: sql
    - HTML: html
    - CSS: css
    - JavaScript: js, javascript
    - Vue: vue
    """
    language = request.language.lower()

    try:
        # Python 代码执行
        if language in ['python', 'py']:
            result = await python_executor.execute(
                request.code,
                request.timeout
            )
            return {
                'code': 200,
                'data': result
            }

        # SQL 代码执行
        elif language == 'sql':
            result = await sql_executor.execute(request.code)
            return {
                'code': 200,
                'data': result
            }

        # Web 代码执行 (HTML, CSS, JavaScript, Vue)
        elif language in ['html', 'css', 'javascript', 'js', 'vue']:
            result = await web_executor.execute(language, request.code)
            return {
                'code': 200,
                'data': result
            }

        # 不支持的语言
        else:
            raise HTTPException(
                status_code=400,
                detail=f"不支持的语言: {request.language}。"
                       f"支持的语言: Python, SQL, HTML, CSS, JavaScript, Vue"
            )

    except HTTPException:
        raise
    except Exception as e:
        return {
            'code': 500,
            'message': f'执行错误: {str(e)}',
            'data': {
                'success': False,
                'stdout': '',
                'stderr': str(e),
                'exitCode': -1
            }
        }


@router.get("/languages")
async def get_supported_languages():
    """获取支持的语言列表"""
    return {
        'code': 200,
        'data': {
            'languages': [
                {
                    'id': 'python',
                    'name': 'Python',
                    'extensions': ['py', 'python'],
                    'description': 'Python 3.11 代码执行'
                },
                {
                    'id': 'sql',
                    'name': 'SQL',
                    'extensions': ['sql'],
                    'description': 'SQLite 内存数据库执行'
                },
                {
                    'id': 'html',
                    'name': 'HTML',
                    'extensions': ['html'],
                    'description': 'HTML 代码预览'
                },
                {
                    'id': 'css',
                    'name': 'CSS',
                    'extensions': ['css'],
                    'description': 'CSS 样式预览'
                },
                {
                    'id': 'javascript',
                    'name': 'JavaScript',
                    'extensions': ['js', 'javascript'],
                    'description': 'JavaScript 代码执行'
                },
                {
                    'id': 'vue',
                    'name': 'Vue',
                    'extensions': ['vue'],
                    'description': 'Vue 3 代码预览'
                }
            ]
        }
    }
