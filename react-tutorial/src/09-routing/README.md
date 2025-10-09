# React Router 路由导航

本章节详细介绍 React Router 的使用方法，帮助你构建单页应用（SPA）的路由系统。

## 🎯 学习目标

- 理解单页应用路由的工作原理
- 掌握 React Router v6 的核心 API
- 学会实现动态路由和嵌套路由
- 了解如何实现路由守卫和权限控制

## 📚 内容概览

### 1. 基础路由

- **BrowserRouter**: 使用 HTML5 history API 的路由容器
- **Routes & Route**: 路由配置组件
- **Link**: 声明式导航组件
- **示例**: 创建多页面导航系统

```tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 2. 动态路由参数

- **URL 参数**: 在路径中定义动态部分
- **useParams**: 获取 URL 参数的 Hook
- **示例**: 实现用户详情页面

```tsx
import { useParams } from "react-router-dom";

// 路由配置
<Route path="/user/:userId" element={<UserDetail />} />;

// 组件中获取参数
function UserDetail() {
  const { userId } = useParams();
  return <div>用户 ID: {userId}</div>;
}
```

### 3. 编程式导航

- **useNavigate**: 编程式导航 Hook
- **useLocation**: 获取当前位置信息
- **示例**: 表单提交后跳转、历史记录操作

```tsx
import { useNavigate, useLocation } from "react-router-dom";

function MyComponent() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = () => {
    // 处理表单...
    navigate("/success");
  };

  const goBack = () => navigate(-1);

  return (
    <div>
      <p>当前路径: {location.pathname}</p>
      <button onClick={handleSubmit}>提交</button>
      <button onClick={goBack}>返回</button>
    </div>
  );
}
```

### 4. 嵌套路由

- **多层级路由**: 在父组件中定义子路由
- **Outlet**: 渲染子路由内容的占位符（可选）
- **示例**: 控制台布局与多个子页面

```tsx
// 父路由布局
function Dashboard() {
  return (
    <div>
      <nav>
        <Link to="overview">概览</Link>
        <Link to="stats">统计</Link>
      </nav>
      <Routes>
        <Route path="overview" element={<Overview />} />
        <Route path="stats" element={<Stats />} />
      </Routes>
    </div>
  );
}

// 顶层配置
<Route path="/dashboard/*" element={<Dashboard />} />;
```

### 5. 路由守卫（受保护的路由）

- **权限控制**: 根据条件决定是否允许访问
- **Navigate**: 重定向组件
- **示例**: 登录验证

```tsx
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: JSX.Element;
  isAuthenticated: boolean;
}

function ProtectedRoute({ children, isAuthenticated }: ProtectedRouteProps) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// 使用
<Route
  path="/dashboard"
  element={
    <ProtectedRoute isAuthenticated={isLoggedIn}>
      <Dashboard />
    </ProtectedRoute>
  }
/>;
```

## 🚀 最佳实践

### 1. 路由结构清晰

- 将相关路由分组
- 使用嵌套路由构建层级结构
- 保持路径命名一致性

### 2. 懒加载路由

```tsx
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  );
}
```

### 3. 404 页面处理

```tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  {/* 捕获所有未匹配的路由 */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### 4. 路由参数验证

```tsx
function UserDetail() {
  const { userId } = useParams();

  // 验证参数
  if (!userId || isNaN(Number(userId))) {
    return <Navigate to="/users" replace />;
  }

  // 正常渲染...
}
```

### 5. 使用 NavLink 显示活动状态

```tsx
import { NavLink } from "react-router-dom";

<NavLink
  to="/about"
  className={({ isActive }) => (isActive ? "active" : "")}
  style={({ isActive }) => ({
    color: isActive ? "red" : "black",
  })}
>
  关于
</NavLink>;
```

## 📋 常用 API 总结

| API               | 说明                     | 类型 |
| ----------------- | ------------------------ | ---- |
| `BrowserRouter`   | HTML5 history API 路由器 | 组件 |
| `HashRouter`      | Hash 路由器（URL 带 #）  | 组件 |
| `Routes`          | 路由配置容器             | 组件 |
| `Route`           | 单个路由定义             | 组件 |
| `Link`            | 声明式导航链接           | 组件 |
| `NavLink`         | 带活动状态的导航链接     | 组件 |
| `Navigate`        | 声明式重定向             | 组件 |
| `Outlet`          | 嵌套路由渲染位置         | 组件 |
| `useNavigate`     | 编程式导航               | Hook |
| `useParams`       | 获取 URL 参数            | Hook |
| `useLocation`     | 获取当前位置信息         | Hook |
| `useSearchParams` | 获取/设置查询参数        | Hook |

## 💡 进阶技巧

### 1. 查询参数处理

```tsx
import { useSearchParams } from "react-router-dom";

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const page = searchParams.get("page") || "1";

  const updateSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery, page: "1" });
  };

  return (
    <div>
      <input value={query} onChange={(e) => updateSearch(e.target.value)} />
      <p>当前页码: {page}</p>
    </div>
  );
}
```

### 2. 路由状态传递

```tsx
// 导航时传递状态
navigate("/profile", { state: { from: "dashboard" } });

// 目标组件中接收
const location = useLocation();
const from = location.state?.from;
```

### 3. 路由过渡动画

```tsx
import { useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition key={location.pathname} classNames="fade" timeout={300}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}
```

### 4. 面包屑导航

```tsx
import { useMatches } from "react-router-dom";

function Breadcrumbs() {
  const matches = useMatches();

  return (
    <nav>
      {matches
        .filter((match) => match.handle?.breadcrumb)
        .map((match, index) => (
          <span key={index}>
            {index > 0 && " / "}
            {match.handle.breadcrumb(match)}
          </span>
        ))}
    </nav>
  );
}
```

## 🔗 相关资源

- [React Router 官方文档](https://reactrouter.com/)
- [React Router v6 迁移指南](https://reactrouter.com/docs/en/v6/upgrading/v5)
- [React Router 示例](https://reactrouter.com/docs/en/v6/examples/basic)
- [单页应用路由原理](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)

## ⚠️ 常见问题

### 1. 路由不匹配？

- 检查 `Routes` 是否正确包裹 `Route`
- 确认路径是否以 `/` 开头
- 注意 v6 中不再支持正则表达式路径

### 2. 嵌套路由不显示？

- 父路由路径需要加 `/*` 通配符
- 或使用 `Outlet` 组件代替手动嵌套

### 3. Navigate 导致无限循环？

- 检查重定向逻辑是否形成循环
- 使用 `replace` 属性避免历史记录堆积

### 4. 刷新页面 404？

- 配置服务器支持 HTML5 history 模式
- 或使用 `HashRouter` 代替 `BrowserRouter`
