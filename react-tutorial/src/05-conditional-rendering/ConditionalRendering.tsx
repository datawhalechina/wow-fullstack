import { useState } from 'react'
import { CodeBlock } from '../components/CodeBlock'

// 演示1：使用 if-else 语句
const LoginStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 使用 if-else 在渲染前决定要显示的内容
  let content
  if (isLoggedIn) {
    content = (
      <div style={{ 
        padding: '1rem',
        backgroundColor: '#d1fae5',
        borderRadius: '0.375rem',
        border: '1px solid #10b981'
      }}>
        <h5 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>✅ 已登录</h5>
        <p style={{ margin: 0, color: '#047857' }}>欢迎回来！你可以访问所有功能。</p>
      </div>
    )
  } else {
    content = (
      <div style={{ 
        padding: '1rem',
        backgroundColor: '#fee2e2',
        borderRadius: '0.375rem',
        border: '1px solid #ef4444'
      }}>
        <h5 style={{ margin: '0 0 0.5rem 0', color: '#991b1b' }}>❌ 未登录</h5>
        <p style={{ margin: 0, color: '#b91c1c' }}>请先登录以访问内容。</p>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#f0f9ff', 
      borderRadius: '0.5rem',
      border: '1px solid #0ea5e9'
    }}>
      <h4>🔐 if-else 条件渲染</h4>
      <button 
        onClick={() => setIsLoggedIn(!isLoggedIn)}
        style={{ 
          padding: '0.5rem 1rem',
          backgroundColor: isLoggedIn ? '#ef4444' : '#22c55e',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontWeight: '500',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}
      >
        {isLoggedIn ? '退出登录' : '登录'}
      </button>
      {content}
    </div>
  )
}

// 演示2：三元运算符
const MessageBox = () => {
  const [hasNewMessages, setHasNewMessages] = useState(true)
  const [messageCount, setMessageCount] = useState(5)

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#f0fdf4', 
      borderRadius: '0.5rem',
      border: '1px solid #22c55e'
    }}>
      <h4>💬 三元运算符</h4>
      
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => setHasNewMessages(!hasNewMessages)}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            marginRight: '0.5rem',
            fontSize: '0.875rem'
          }}
        >
          切换消息状态
        </button>
        <button 
          onClick={() => setMessageCount(Math.floor(Math.random() * 10))}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}
        >
          随机消息数
        </button>
      </div>

      {/* 简单三元运算符 */}
      <div style={{ 
        padding: '1rem',
        backgroundColor: hasNewMessages ? '#fef3c7' : '#f3f4f6',
        borderRadius: '0.375rem',
        marginBottom: '1rem',
        border: `1px solid ${hasNewMessages ? '#f59e0b' : '#d1d5db'}`
      }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>
          {hasNewMessages ? '🔔 你有新消息！' : '📭 暂无新消息'}
        </p>
      </div>

      {/* 嵌套三元运算符（不推荐，但有时会用到） */}
      <div style={{ 
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '0.375rem',
        border: '1px solid #e5e7eb'
      }}>
        <p style={{ margin: 0 }}>
          消息数量: {messageCount}
        </p>
        <p style={{ 
          margin: '0.5rem 0 0 0',
          color: messageCount === 0 ? '#6b7280' : messageCount < 5 ? '#3b82f6' : '#ef4444',
          fontWeight: 'bold'
        }}>
          {messageCount === 0 
            ? '没有消息' 
            : messageCount < 5 
              ? '消息较少' 
              : '消息很多！'}
        </p>
      </div>
    </div>
  )
}

// 演示3：逻辑 && 运算符
const Notification = () => {
  const [showWarning, setShowWarning] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorCount, setErrorCount] = useState(0)

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#fef3c7', 
      borderRadius: '0.5rem',
      border: '1px solid #f59e0b'
    }}>
      <h4>⚠️ 逻辑 && 运算符</h4>
      
      <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input 
            type="checkbox"
            checked={showWarning}
            onChange={(e) => setShowWarning(e.target.checked)}
            style={{ marginRight: '0.5rem', width: '1rem', height: '1rem', cursor: 'pointer' }}
          />
          显示警告
        </label>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input 
            type="checkbox"
            checked={showInfo}
            onChange={(e) => setShowInfo(e.target.checked)}
            style={{ marginRight: '0.5rem', width: '1rem', height: '1rem', cursor: 'pointer' }}
          />
          显示信息
        </label>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input 
            type="checkbox"
            checked={showSuccess}
            onChange={(e) => setShowSuccess(e.target.checked)}
            style={{ marginRight: '0.5rem', width: '1rem', height: '1rem', cursor: 'pointer' }}
          />
          显示成功
        </label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span>错误数量: {errorCount}</span>
          <button 
            onClick={() => setErrorCount(errorCount + 1)}
            style={{ 
              padding: '0.25rem 0.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.75rem'
            }}
          >
            +1
          </button>
          <button 
            onClick={() => setErrorCount(0)}
            style={{ 
              padding: '0.25rem 0.5rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.75rem'
            }}
          >
            清零
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {/* 使用 && 运算符条件渲染 */}
        {showWarning && (
          <div style={{ 
            padding: '0.75rem',
            backgroundColor: '#fef3c7',
            borderRadius: '0.375rem',
            border: '1px solid #f59e0b',
            color: '#92400e'
          }}>
            ⚠️ 这是一个警告消息
          </div>
        )}
        
        {showInfo && (
          <div style={{ 
            padding: '0.75rem',
            backgroundColor: '#dbeafe',
            borderRadius: '0.375rem',
            border: '1px solid #3b82f6',
            color: '#1e40af'
          }}>
            ℹ️ 这是一个信息提示
          </div>
        )}
        
        {showSuccess && (
          <div style={{ 
            padding: '0.75rem',
            backgroundColor: '#d1fae5',
            borderRadius: '0.375rem',
            border: '1px solid #10b981',
            color: '#065f46'
          }}>
            ✅ 操作成功完成！
          </div>
        )}
        
        {/* 数字为 0 时的特殊情况 */}
        {errorCount > 0 && (
          <div style={{ 
            padding: '0.75rem',
            backgroundColor: '#fee2e2',
            borderRadius: '0.375rem',
            border: '1px solid #ef4444',
            color: '#991b1b',
            fontWeight: 'bold'
          }}>
            🚨 有 {errorCount} 个错误需要处理
          </div>
        )}
      </div>
    </div>
  )
}

// 演示4：多条件渲染
type UserRole = 'admin' | 'user' | 'guest'

const Dashboard = () => {
  const [role, setRole] = useState<UserRole>('guest')

  const renderContent = () => {
    switch (role) {
      case 'admin':
        return (
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#fef3c7',
            borderRadius: '0.375rem',
            border: '1px solid #f59e0b'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0' }}>🔧 管理员控制台</h5>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>查看所有用户</li>
              <li>管理系统设置</li>
              <li>访问分析数据</li>
              <li>修改权限</li>
            </ul>
          </div>
        )
      case 'user':
        return (
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#dbeafe',
            borderRadius: '0.375rem',
            border: '1px solid #3b82f6'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0' }}>👤 用户面板</h5>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li>查看个人资料</li>
              <li>编辑个人信息</li>
              <li>查看订单历史</li>
            </ul>
          </div>
        )
      case 'guest':
        return (
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.375rem',
            border: '1px solid #9ca3af'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0' }}>👋 访客模式</h5>
            <p style={{ margin: 0 }}>
              功能受限，请注册或登录以获得完整体验。
            </p>
          </div>
        )
    }
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#fae8ff', 
      borderRadius: '0.5rem',
      border: '1px solid #a855f7'
    }}>
      <h4>🎭 多条件渲染（switch）</h4>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button 
          onClick={() => setRole('admin')}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: role === 'admin' ? '#f59e0b' : '#e5e7eb',
            color: role === 'admin' ? 'white' : '#4b5563',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}
        >
          管理员
        </button>
        <button 
          onClick={() => setRole('user')}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: role === 'user' ? '#3b82f6' : '#e5e7eb',
            color: role === 'user' ? 'white' : '#4b5563',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}
        >
          用户
        </button>
        <button 
          onClick={() => setRole('guest')}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: role === 'guest' ? '#6b7280' : '#e5e7eb',
            color: role === 'guest' ? 'white' : '#4b5563',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}
        >
          访客
        </button>
      </div>

      {renderContent()}
    </div>
  )
}

// 演示5：元素变量
const WelcomeMessage = () => {
  const [language, setLanguage] = useState<'zh' | 'en' | 'es'>('zh')

  // 使用对象映射
  const messages = {
    zh: { greeting: '你好', welcome: '欢迎来到 React 教程！', description: '这是一个学习条件渲染的例子。' },
    en: { greeting: 'Hello', welcome: 'Welcome to React Tutorial!', description: 'This is an example of conditional rendering.' },
    es: { greeting: 'Hola', welcome: '¡Bienvenido al Tutorial de React!', description: 'Este es un ejemplo de renderizado condicional.' }
  }

  const currentMessage = messages[language]

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#f8fafc', 
      borderRadius: '0.5rem',
      border: '1px solid #64748b'
    }}>
      <h4>🌍 元素变量（多语言）</h4>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button 
          onClick={() => setLanguage('zh')}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: language === 'zh' ? '#3b82f6' : '#e5e7eb',
            color: language === 'zh' ? 'white' : '#4b5563',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}
        >
          中文
        </button>
        <button 
          onClick={() => setLanguage('en')}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: language === 'en' ? '#3b82f6' : '#e5e7eb',
            color: language === 'en' ? 'white' : '#4b5563',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}
        >
          English
        </button>
        <button 
          onClick={() => setLanguage('es')}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: language === 'es' ? '#3b82f6' : '#e5e7eb',
            color: language === 'es' ? 'white' : '#4b5563',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}
        >
          Español
        </button>
      </div>

      <div style={{ 
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '0.375rem',
        border: '1px solid #e5e7eb'
      }}>
        <h5 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>{currentMessage.greeting}! 👋</h5>
        <p style={{ margin: '0.25rem 0', fontWeight: 'bold', color: '#3b82f6' }}>{currentMessage.welcome}</p>
        <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280' }}>{currentMessage.description}</p>
      </div>
    </div>
  )
}

// 演示6：防止组件渲染
const PrivacyContent = () => {
  const [agreed, setAgreed] = useState(false)
  const [showContent, setShowContent] = useState(true)

  // 如果不同意，返回 null 阻止渲染
  if (!agreed && !showContent) {
    return null
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#fef2f2', 
      borderRadius: '0.5rem',
      border: '1px solid #ef4444'
    }}>
      <h4>🔒 防止组件渲染</h4>
      
      {!agreed ? (
        <div>
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#fef3c7',
            borderRadius: '0.375rem',
            border: '1px solid #f59e0b',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0' }}>⚠️ 隐私协议</h5>
            <p style={{ margin: '0.25rem 0', fontSize: '0.875rem' }}>
              在继续之前，请阅读并同意我们的隐私政策。我们会保护您的个人信息安全。
            </p>
          </div>
          
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '1rem' }}>
            <input 
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ marginRight: '0.5rem', width: '1rem', height: '1rem', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: 'bold' }}>我已阅读并同意隐私政策</span>
          </label>
        </div>
      ) : (
        <div>
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#d1fae5',
            borderRadius: '0.375rem',
            border: '1px solid #10b981',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>✅ 访问已授权</h5>
            <p style={{ margin: 0, color: '#047857', fontSize: '0.875rem' }}>
              感谢您的同意！现在您可以访问完整内容了。
            </p>
          </div>
          
          <div style={{ 
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #e5e7eb'
          }}>
            <h5>🎉 受保护的内容</h5>
            <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
              这是一些需要用户同意才能查看的敏感内容。通过条件渲染，我们可以控制用户看到什么。
            </p>
          </div>
          
          <button 
            onClick={() => setAgreed(false)}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: '500',
              marginTop: '1rem',
              fontSize: '0.875rem'
            }}
          >
            撤回同意
          </button>
        </div>
      )}
      
      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input 
            type="checkbox"
            checked={showContent}
            onChange={(e) => setShowContent(e.target.checked)}
            style={{ marginRight: '0.5rem', width: '1rem', height: '1rem', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            显示此组件（取消选中后，如果未同意，整个组件将返回 null）
          </span>
        </label>
      </div>
    </div>
  )
}

// 主组件
const ConditionalRendering = () => {
  return (
    <div className="tutorial-section">
      <h2>05 - 条件渲染</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>📚 理论学习</h3>
        <p>
          <span className="highlight">条件渲染</span>允许你根据不同条件显示不同的内容。
          React 中的条件渲染与 JavaScript 中的条件语句工作方式相同。
        </p>
        <ul>
          <li><strong>if-else 语句</strong>：在渲染前使用条件语句决定要显示的内容</li>
          <li><strong>三元运算符</strong>：{'{'} condition ? true : false {'}'} 用于简单的条件</li>
          <li><strong>逻辑 && 运算符</strong>：{'{'} condition && &lt;Component /&gt; {'}'} 用于条件为真时显示</li>
          <li><strong>switch 语句</strong>：处理多个条件分支</li>
          <li><strong>元素变量</strong>：将 JSX 保存在变量中，根据条件选择</li>
          <li><strong>返回 null</strong>：阻止组件渲染</li>
        </ul>
      </div>

      <div className="interactive-demo">
        <h3>🎮 交互式演示</h3>
        
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
          {/* 演示1：if-else */}
          <LoginStatus />

          {/* 演示2：三元运算符 */}
          <MessageBox />

          {/* 演示3：逻辑 && */}
          <Notification />

          {/* 演示4：switch */}
          <Dashboard />

          {/* 演示5：元素变量 */}
          <WelcomeMessage />

          {/* 演示6：返回 null */}
          <PrivacyContent />
        </div>
      </div>

      <div className="demo-container">
        <h3>🔍 关键概念解释</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
            <h4>📝 if-else 语句</h4>
            <p>在函数组件中，可以使用普通的 if-else 语句：</p>
            <CodeBlock language="typescript" title="if-else 示例" showLineNumbers>
{`if (isLoggedIn) {
  return <UserDashboard />
} else {
  return <LoginForm />
}`}
            </CodeBlock>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
            <h4>❓ 三元运算符</h4>
            <p>用于内联条件渲染，适合简单的条件：</p>
            <CodeBlock language="typescript" title="三元运算符示例" showLineNumbers>
{`{isLoggedIn ? (
  <WelcomeMessage />
) : (
  <LoginButton />
)}`}
            </CodeBlock>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#fefce8', borderRadius: '0.5rem', border: '1px solid #fde047' }}>
            <h4>&& 逻辑运算符</h4>
            <p>当条件为真时显示元素，为假时不显示任何内容：</p>
            <CodeBlock language="typescript" title="逻辑运算符示例" showLineNumbers>
{`{showWarning && (
  <WarningMessage />
)}

// 注意：避免用数字 0 作为条件
{count > 0 && <div>{count}</div>} // ✅ 正确
{count && <div>{count}</div>}     // ❌ count为0时会显示0`}
            </CodeBlock>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#faf5ff', borderRadius: '0.5rem', border: '1px solid #e9d5ff' }}>
            <h4>🔄 Switch 语句</h4>
            <p>处理多个条件分支：</p>
            <CodeBlock language="typescript" title="Switch 语句示例" showLineNumbers>
{`switch (userRole) {
  case 'admin':
    return <AdminPanel />
  case 'user':
    return <UserPanel />
  default:
    return <GuestPanel />
}`}
            </CodeBlock>
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        backgroundColor: '#f0f9ff', 
        borderRadius: '0.5rem',
        border: '1px solid #0ea5e9'
      }}>
        <h3>🎯 本节重点</h3>
        <ol>
          <li>React 中可以使用 JavaScript 的所有条件语句</li>
          <li>三元运算符 {'{'} condition ? A : B {'}'} 适合简单的二选一</li>
          <li>逻辑 && 运算符 {'{'} condition && &lt;Element /&gt; {'}'} 适合条件显示</li>
          <li>使用 switch 或 if-else 处理多个条件分支</li>
          <li>可以将 JSX 保存在变量中，提高代码可读性</li>
          <li>返回 null 可以完全阻止组件渲染</li>
          <li>注意：避免使用数字 0 作为 && 运算符的条件（会渲染 0）</li>
        </ol>
      </div>
    </div>
  )
}

export default ConditionalRendering