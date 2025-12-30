# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**wow-fullstack** is a dual-purpose project: a full-stack development tutorial with 13+ courses and a time management web application ("自塾时间管理"). Key features include task tracking, course learning, a "塾值" points system, and Coze AI chatbot integration.

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite + Pinia + Element Plus + Axios
- **Backend**: FastAPI + SQLAlchemy + Alembic + SQLite + Uvicorn
- **Python**: 3.10+ | **Node.js**: v18.18.0 | **npm**: 10.2.5

## Common Commands

### Frontend (`tm-frontend/`)
```bash
npm install              # Install dependencies
npm run dev             # Start dev server (use 192.168.x.x, not localhost:5173)
npm run build           # TypeScript check + production build
npm run preview         # Preview production build
```

### Backend (`tm-backend/`)
```bash
pip install -r requirements.txt  # Install Python dependencies

# Database migrations (Alembic)
alembic revision --autogenerate -m "migration_name"
alembic upgrade head

# Run server
python main.py
# Or: uvicorn main:app --host 0.0.0.0 --port 8008

# Seed test data
python seed.py           # Creates static folders + admin user
python check_password.py # Verify database password
```

### Docker
```bash
docker-compose up --build
```

## Architecture

```
wow-fullstack/
├── tm-frontend/          # Vue3 SPA
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── views/        # Page routes (Home, Courses, Study, Admin, etc.)
│   │   ├── router/       # Vue Router config
│   │   ├── store/        # Pinia stores (user auth state)
│   │   ├── request/      # Axios API wrappers
│   │   └── composables/  # Vue composables
│   └── vite.config.ts
│
├── tm-backend/           # FastAPI REST API
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/   # SQLAlchemy ORM models
│   │   │   └── schemas/  # Pydantic schemas
│   │   ├── routers/      # API endpoints (users, inno, tutorial)
│   │   ├── dependencies.py  # Auth/db session injection
│   │   └── database.py   # SQLAlchemy engine
│   ├── alembic/          # Database migrations
│   └── main.py
│
└── tutorial/             # 13 Markdown tutorials
```

### Key API Endpoints
- `/api/users/*` - User authentication & management
- `/api/inno/*` - Coze AI integration
- `/api/tutorial/*` - Tutorial content
- `/api/static/*` - Static file serving

### Frontend Routes
- `/` - Home
- `/user` - User center
- `/courses` - Course listing
- `/study` - Learning page
- `/admin` - Admin panel
- `/agents` - Coze AI agents

## Default Credentials

- **Admin**: Phone `15812345678`, Password `zishu`
- Admin has access to management features (user management, registration review, system config)

## Development Notes

- Frontend uses `vite-plugin-singlefile` to output a single HTML file
- Backend serves static files from `static/` directory
- All API requests go through `src/request/index.ts` wrapper
- Auth state managed via Pinia with persistence
- For API testing: access `/docs` on backend for Swagger UI documentation
