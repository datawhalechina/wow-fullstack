import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom'
import { CodeBlock, CodeSection } from '../components/CodeBlock'

// ==================== 演示 1: 基础路由 ====================
// 定义不同的页面组件
const HomePage = () => {
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#dbeafe',
      borderRadius: '0.5rem',
      border: '1px solid #3b82f6'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#1e40af' }}>🏠 首页</h3>
      <p>欢迎来到 React Router 教程！</p>
      <p>这是首页内容。点击上方导航链接可以切换到不同的页面。</p>
    </div>
  )
}

const AboutPage = () => {
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#dcfce7',
      borderRadius: '0.5rem',
      border: '1px solid #22c55e'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#166534' }}>ℹ️ 关于页面</h3>
      <p>这是一个展示 React Router 基础功能的演示应用。</p>
      <ul>
        <li>使用 React Router v6</li>
        <li>支持声明式路由</li>
        <li>提供多种导航方式</li>
      </ul>
    </div>
  )
}

const ContactPage = () => {
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#fef3c7',
      borderRadius: '0.5rem',
      border: '1px solid #f59e0b'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#92400e' }}>📧 联系我们</h3>
      <p><strong>邮箱:</strong> contact@example.com</p>
      <p><strong>电话:</strong> 123-456-7890</p>
      <p><strong>地址:</strong> 北京市朝阳区</p>
    </div>
  )
}

// 基础路由演示组件
const BasicRoutingDemo = () => {
  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0'
    }}>
      <h4>📍 基础路由导航</h4>
      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
        使用 Link 组件在不同页面之间导航
      </p>

      <BrowserRouter basename="/routing-demo">
        <div>
          {/* 导航栏 */}
          <nav style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: '#1e293b',
            borderRadius: '0.5rem'
          }}>
            <Link 
              to="/" 
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                borderRadius: '0.375rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
            >
              首页
            </Link>
            <Link 
              to="/about"
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                backgroundColor: '#22c55e',
                borderRadius: '0.375rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
            >
              关于
            </Link>
            <Link 
              to="/contact"
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '0.5rem 1rem',
                backgroundColor: '#f59e0b',
                borderRadius: '0.375rem',
                fontWeight: '500',
                transition: 'background-color 0.2s'
              }}
            >
              联系
            </Link>
          </nav>

          {/* 路由配置 */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

// ==================== 演示 2: 动态路由参数 ====================
interface User {
  id: string
  name: string
  email: string
  role: string
}

const users: User[] = [
  { id: '1', name: '张三', email: 'zhangsan@example.com', role: '管理员' },
  { id: '2', name: '李四', email: 'lisi@example.com', role: '开发者' },
  { id: '3', name: '王五', email: 'wangwu@example.com', role: '设计师' },
]

const UserList = () => {
  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem'
    }}>
      <h4 style={{ marginTop: 0 }}>👥 用户列表</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {users.map(user => (
          <Link
            key={user.id}
            to={`/user/${user.id}`}
            style={{
              padding: '1rem',
              backgroundColor: '#f1f5f9',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              color: '#1e293b',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ fontWeight: 'bold' }}>{user.name}</div>
            <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{user.role}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

const UserDetail = () => {
  const { userId } = useParams<{ userId: string }>()
  const user = users.find(u => u.id === userId)

  if (!user) {
    return (
      <div style={{
        padding: '2rem',
        backgroundColor: '#fee2e2',
        borderRadius: '0.5rem',
        border: '1px solid #ef4444'
      }}>
        <h4 style={{ color: '#991b1b' }}>❌ 用户不存在</h4>
        <Link to="/user" style={{ color: '#dc2626' }}>返回用户列表</Link>
      </div>
    )
  }

  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#dbeafe',
      borderRadius: '0.5rem',
      border: '1px solid #3b82f6'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#1e40af' }}>👤 用户详情</h3>
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.375rem',
        marginBottom: '1rem'
      }}>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>姓名:</strong> {user.name}</p>
        <p><strong>邮箱:</strong> {user.email}</p>
        <p><strong>角色:</strong> {user.role}</p>
      </div>
      <Link 
        to="/user"
        style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.375rem',
          fontWeight: '500'
        }}
      >
        ← 返回列表
      </Link>
    </div>
  )
}

const DynamicRoutingDemo = () => {
  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0'
    }}>
      <h4>🔗 动态路由参数</h4>
      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
        使用 useParams 获取 URL 参数
      </p>

      <BrowserRouter basename="/dynamic-routing">
        <Routes>
          <Route path="/user" element={<UserList />} />
          <Route path="/user/:userId" element={<UserDetail />} />
          <Route path="*" element={<Navigate to="/user" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

// ==================== 演示 3: 编程式导航 ====================
const ProgrammaticNavigationContent = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [countdown, setCountdown] = useState(0)

  const goToPage = (path: string) => {
    navigate(path)
  }

  const goBack = () => {
    navigate(-1)
  }

  const goForward = () => {
    navigate(1)
  }

  const redirectWithDelay = () => {
    setCountdown(3)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/success')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem'
    }}>
      <h4 style={{ marginTop: 0 }}>🚀 编程式导航</h4>
      
      <div style={{
        padding: '1rem',
        backgroundColor: '#f1f5f9',
        borderRadius: '0.375rem',
        marginBottom: '1rem'
      }}>
        <p style={{ margin: '0 0 0.5rem 0' }}>
          <strong>当前路径:</strong> {location.pathname}
        </p>
        <p style={{ margin: 0 }}>
          <strong>搜索参数:</strong> {location.search || '无'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button
          onClick={() => goToPage('/')}
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}
        >
          跳转到首页
        </button>

        <button
          onClick={() => goToPage('/dashboard')}
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}
        >
          跳转到控制台
        </button>

        <button
          onClick={goBack}
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}
        >
          ← 后退
        </button>

        <button
          onClick={goForward}
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}
        >
          前进 →
        </button>

        <button
          onClick={redirectWithDelay}
          disabled={countdown > 0}
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: countdown > 0 ? '#d1d5db' : '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: countdown > 0 ? 'not-allowed' : 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}
        >
          {countdown > 0 ? `${countdown}秒后跳转...` : '延迟跳转 (3秒)'}
        </button>
      </div>
    </div>
  )
}

const ProgrammaticNavigationDemo = () => {
  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0'
    }}>
      <h4>⚡ 编程式导航</h4>
      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
        使用 useNavigate 进行编程式导航
      </p>

      <BrowserRouter basename="/programmatic-nav">
        <ProgrammaticNavigationContent />
      </BrowserRouter>
    </div>
  )
}

// ==================== 演示 4: 嵌套路由 ====================
const DashboardLayout = () => {
  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem'
    }}>
      <h4 style={{ marginTop: 0 }}>📊 控制台</h4>
      <nav style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '1.5rem',
        padding: '0.75rem',
        backgroundColor: '#f1f5f9',
        borderRadius: '0.375rem'
      }}>
        <Link
          to="overview"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          概览
        </Link>
        <Link
          to="stats"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#8b5cf6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          统计
        </Link>
        <Link
          to="settings"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#64748b',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          设置
        </Link>
      </nav>

      <div style={{
        padding: '1rem',
        backgroundColor: '#f8fafc',
        borderRadius: '0.375rem',
        border: '1px solid #e2e8f0'
      }}>
        <Routes>
          <Route path="overview" element={
            <div>
              <h5 style={{ marginTop: 0, color: '#3b82f6' }}>📈 概览</h5>
              <p>这里是控制台概览页面</p>
              <ul>
                <li>总用户数: 1,234</li>
                <li>活跃用户: 567</li>
                <li>今日访问: 890</li>
              </ul>
            </div>
          } />
          <Route path="stats" element={
            <div>
              <h5 style={{ marginTop: 0, color: '#8b5cf6' }}>📊 统计数据</h5>
              <p>这里显示详细的统计信息</p>
              <ul>
                <li>日活跃用户: 45.6%</li>
                <li>月活跃用户: 78.9%</li>
                <li>平均停留时间: 5分32秒</li>
              </ul>
            </div>
          } />
          <Route path="settings" element={
            <div>
              <h5 style={{ marginTop: 0, color: '#64748b' }}>⚙️ 系统设置</h5>
              <p>这里可以配置系统参数</p>
              <ul>
                <li>语言: 中文</li>
                <li>时区: UTC+8</li>
                <li>主题: 自动</li>
              </ul>
            </div>
          } />
          <Route path="*" element={<Navigate to="overview" replace />} />
        </Routes>
      </div>
    </div>
  )
}

const NestedRoutingDemo = () => {
  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0'
    }}>
      <h4>🗂️ 嵌套路由</h4>
      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
        在路由组件内部定义子路由
      </p>

      <BrowserRouter basename="/nested-routing">
        <Routes>
          <Route path="/dashboard/*" element={<DashboardLayout />} />
          <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

// ==================== 演示 5: 路由守卫（受保护的路由） ====================
interface ProtectedRouteProps {
  children: JSX.Element
  isAuthenticated: boolean
}

const ProtectedRoute = ({ children, isAuthenticated }: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#fef3c7',
      borderRadius: '0.5rem',
      border: '1px solid #f59e0b'
    }}>
      <h4 style={{ marginTop: 0, color: '#92400e' }}>🔐 登录页面</h4>
      <p>请先登录才能访问受保护的内容</p>
      <button
        onClick={onLogin}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '0.875rem'
        }}
      >
        登录
      </button>
    </div>
  )
}

const ProtectedContent = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <div style={{
      padding: '2rem',
      backgroundColor: '#dcfce7',
      borderRadius: '0.5rem',
      border: '1px solid #22c55e'
    }}>
      <h4 style={{ marginTop: 0, color: '#166534' }}>✅ 受保护的内容</h4>
      <p>恭喜！你已经登录，可以访问这个页面了。</p>
      <p style={{
        padding: '1rem',
        backgroundColor: '#fef3c7',
        borderRadius: '0.375rem',
        border: '1px solid #f59e0b'
      }}>
        💡 这是一个受保护的路由示例。只有登录后才能访问。
      </p>
      <button
        onClick={onLogout}
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '0.875rem',
          marginTop: '1rem'
        }}
      >
        退出登录
      </button>
    </div>
  )
}

const ProtectedRoutingDemo = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0'
    }}>
      <h4>🛡️ 路由守卫</h4>
      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
        使用受保护的路由限制访问权限
      </p>

      <div style={{
        padding: '0.75rem 1rem',
        backgroundColor: isAuthenticated ? '#dcfce7' : '#fee2e2',
        border: `1px solid ${isAuthenticated ? '#22c55e' : '#ef4444'}`,
        borderRadius: '0.375rem',
        marginBottom: '1rem'
      }}>
        <strong>当前状态:</strong> {isAuthenticated ? '✅ 已登录' : '❌ 未登录'}
      </div>

      <BrowserRouter basename="/protected-routing">
        <Routes>
          <Route 
            path="/login" 
            element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} 
          />
          <Route
            path="/protected"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ProtectedContent onLogout={() => setIsAuthenticated(false)} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/protected" : "/login"} replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

// ==================== 主组件 ====================
const Routing = () => {
  return (
    <div className="tutorial-section">
      <h2>09 - 路由导航 (React Router)</h2>
      <p>学习使用 React Router 实现单页应用的路由功能</p>

      <div style={{
        padding: '1.5rem',
        backgroundColor: '#fef3c7',
        borderRadius: '0.5rem',
        border: '1px solid #f59e0b',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginTop: 0, color: '#92400e' }}>🎯 本章节内容</h3>
        <ul style={{ marginBottom: 0 }}>
          <li><strong>基础路由</strong> - 使用 Link 和 Route 组件</li>
          <li><strong>动态路由</strong> - URL 参数和 useParams Hook</li>
          <li><strong>编程式导航</strong> - useNavigate Hook</li>
          <li><strong>嵌套路由</strong> - 创建多层级的路由结构</li>
          <li><strong>路由守卫</strong> - 实现权限控制</li>
        </ul>
      </div>

      {/* 示例 1: 基础路由 */}
      <CodeSection title="1️⃣ 基础路由" icon="📍">
        <p style={{ marginBottom: '1rem' }}>
          React Router 的基础用法：使用 <code>Link</code> 组件进行导航，使用 <code>Route</code> 定义路由。
        </p>
        <BasicRoutingDemo />
        
        <div style={{ marginTop: '1.5rem' }}>
          <CodeBlock title="基础路由示例代码" showLineNumbers>
{`import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">首页</Link>
        <Link to="/about">关于</Link>
        <Link to="/contact">联系</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  )
}`}
          </CodeBlock>
        </div>
      </CodeSection>

      {/* 示例 2: 动态路由 */}
      <CodeSection title="2️⃣ 动态路由参数" icon="🔗">
        <p style={{ marginBottom: '1rem' }}>
          使用 URL 参数创建动态路由，通过 <code>useParams</code> Hook 获取参数值。
        </p>
        <DynamicRoutingDemo />
        
        <div style={{ marginTop: '1.5rem' }}>
          <CodeBlock title="动态路由示例代码" showLineNumbers>
{`import { useParams } from 'react-router-dom'

// 路由配置
<Routes>
  <Route path="/user/:userId" element={<UserDetail />} />
</Routes>

// 组件中使用参数
function UserDetail() {
  const { userId } = useParams()
  // 使用 userId 获取用户数据
  return <div>用户 ID: {userId}</div>
}`}
          </CodeBlock>
        </div>
      </CodeSection>

      {/* 示例 3: 编程式导航 */}
      <CodeSection title="3️⃣ 编程式导航" icon="⚡">
        <p style={{ marginBottom: '1rem' }}>
          使用 <code>useNavigate</code> Hook 实现编程式导航，可以在事件处理函数中跳转路由。
        </p>
        <ProgrammaticNavigationDemo />
        
        <div style={{ marginTop: '1.5rem' }}>
          <CodeBlock title="编程式导航示例代码" showLineNumbers>
{`import { useNavigate, useLocation } from 'react-router-dom'

function MyComponent() {
  const navigate = useNavigate()
  const location = useLocation()

  // 跳转到指定路径
  const goToHome = () => {
    navigate('/')
  }

  // 带参数跳转
  const goToUser = (userId: string) => {
    navigate(\`/user/\${userId}\`)
  }

  // 后退
  const goBack = () => {
    navigate(-1)
  }

  // 前进
  const goForward = () => {
    navigate(1)
  }

  return (
    <div>
      <p>当前路径: {location.pathname}</p>
      <button onClick={goToHome}>回到首页</button>
    </div>
  )
}`}
          </CodeBlock>
        </div>
      </CodeSection>

      {/* 示例 4: 嵌套路由 */}
      <CodeSection title="4️⃣ 嵌套路由" icon="🗂️">
        <p style={{ marginBottom: '1rem' }}>
          在父路由组件内定义子路由，实现多层级的页面结构。
        </p>
        <NestedRoutingDemo />
        
        <div style={{ marginTop: '1.5rem' }}>
          <CodeBlock title="嵌套路由示例代码" showLineNumbers>
{`import { Routes, Route, Outlet } from 'react-router-dom'

// 父路由布局
function DashboardLayout() {
  return (
    <div>
      <nav>
        <Link to="overview">概览</Link>
        <Link to="stats">统计</Link>
        <Link to="settings">设置</Link>
      </nav>
      {/* 子路由内容渲染位置 */}
      <Routes>
        <Route path="overview" element={<Overview />} />
        <Route path="stats" element={<Stats />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </div>
  )
}

// 顶层路由配置
<Routes>
  <Route path="/dashboard/*" element={<DashboardLayout />} />
</Routes>`}
          </CodeBlock>
        </div>
      </CodeSection>

      {/* 示例 5: 路由守卫 */}
      <CodeSection title="5️⃣ 路由守卫（受保护的路由）" icon="🛡️">
        <p style={{ marginBottom: '1rem' }}>
          实现路由权限控制，只有满足条件的用户才能访问特定页面。
        </p>
        <ProtectedRoutingDemo />
        
        <div style={{ marginTop: '1.5rem' }}>
          <CodeBlock title="路由守卫示例代码" showLineNumbers>
{`import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: JSX.Element
  isAuthenticated: boolean
}

// 受保护的路由组件
function ProtectedRoute({ children, isAuthenticated }: ProtectedRouteProps) {
  if (!isAuthenticated) {
    // 未登录，重定向到登录页
    return <Navigate to="/login" replace />
  }
  // 已登录，显示内容
  return children
}

// 使用示例
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute isAuthenticated={isLoggedIn}>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>`}
          </CodeBlock>
        </div>
      </CodeSection>

      {/* 最佳实践 */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#f0fdf4',
        borderRadius: '0.5rem',
        border: '1px solid #22c55e',
        marginTop: '2rem'
      }}>
        <h3 style={{ marginTop: 0, color: '#166534' }}>🚀 React Router 最佳实践</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #86efac'
          }}>
            <h4 style={{ marginTop: 0, color: '#15803d' }}>1. 路由结构清晰</h4>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              合理组织路由层级，将相关的路由分组，使用嵌套路由构建清晰的页面结构。
            </p>
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #86efac'
          }}>
            <h4 style={{ marginTop: 0, color: '#15803d' }}>2. 懒加载路由</h4>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              使用 React.lazy() 和 Suspense 实现路由组件的懒加载，优化应用性能。
            </p>
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #86efac'
          }}>
            <h4 style={{ marginTop: 0, color: '#15803d' }}>3. 404 页面</h4>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              始终提供一个 404 页面处理未匹配的路由，提升用户体验。
            </p>
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #86efac'
          }}>
            <h4 style={{ marginTop: 0, color: '#15803d' }}>4. 路由参数验证</h4>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              对 URL 参数进行验证，确保数据有效性，处理异常情况。
            </p>
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #86efac'
          }}>
            <h4 style={{ marginTop: 0, color: '#15803d' }}>5. SEO 优化</h4>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              为每个页面设置合适的标题和元数据，使用服务端渲染（SSR）提升 SEO。
            </p>
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #86efac'
          }}>
            <h4 style={{ marginTop: 0, color: '#15803d' }}>6. 权限控制</h4>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              实现完善的路由守卫机制，根据用户权限控制页面访问。
            </p>
          </div>
        </div>
      </div>

      {/* 常用 API 总结 */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#eff6ff',
        borderRadius: '0.5rem',
        border: '1px solid #3b82f6',
        marginTop: '2rem'
      }}>
        <h3 style={{ marginTop: 0, color: '#1e40af' }}>📚 React Router 常用 API</h3>
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #93c5fd'
          }}>
            <code style={{ color: '#dc2626', fontWeight: 'bold' }}>BrowserRouter</code>
            <p style={{ fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
              使用 HTML5 history API 的路由器组件，支持干净的 URL
            </p>
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #93c5fd'
          }}>
            <code style={{ color: '#dc2626', fontWeight: 'bold' }}>Routes & Route</code>
            <p style={{ fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
              定义路由配置，Route 指定路径和对应的组件
            </p>
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #93c5fd'
          }}>
            <code style={{ color: '#dc2626', fontWeight: 'bold' }}>Link & NavLink</code>
            <p style={{ fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
              声明式导航组件，NavLink 支持活动状态样式
            </p>
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #93c5fd'
          }}>
            <code style={{ color: '#dc2626', fontWeight: 'bold' }}>useNavigate</code>
            <p style={{ fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
              编程式导航 Hook，用于在代码中跳转路由
            </p>
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #93c5fd'
          }}>
            <code style={{ color: '#dc2626', fontWeight: 'bold' }}>useParams</code>
            <p style={{ fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
              获取 URL 动态参数的 Hook
            </p>
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #93c5fd'
          }}>
            <code style={{ color: '#dc2626', fontWeight: 'bold' }}>useLocation</code>
            <p style={{ fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
              获取当前 location 对象的 Hook，包含 pathname、search 等信息
            </p>
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #93c5fd'
          }}>
            <code style={{ color: '#dc2626', fontWeight: 'bold' }}>Navigate</code>
            <p style={{ fontSize: '0.875rem', margin: '0.5rem 0 0 0' }}>
              声明式重定向组件，用于路由守卫和条件跳转
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Routing
