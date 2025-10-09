import { useState, FormEvent } from 'react'
import { CodeBlock, CodeSection } from '../components/CodeBlock'

// 演示1：基本的 useState 使用
const BasicCounter = () => {
  const [count, setCount] = useState(0)

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#f0f9ff', 
      borderRadius: '0.5rem',
      border: '1px solid #0ea5e9'
    }}>
      <h4>🔢 基础计数器</h4>
      <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0', textAlign: 'center' }}>
        {count}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button 
          onClick={() => setCount(count - 1)}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          -1
        </button>
        <button 
          onClick={() => setCount(0)}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          重置
        </button>
        <button 
          onClick={() => setCount(count + 1)}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          +1
        </button>
      </div>
    </div>
  )
}

// 演示2：多个状态管理
const UserProfile = () => {
  const [name, setName] = useState('张三')
  const [age, setAge] = useState(25)
  const [isStudent, setIsStudent] = useState(false)

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#f0fdf4', 
      borderRadius: '0.5rem',
      border: '1px solid #22c55e'
    }}>
      <h4>👤 用户信息管理</h4>
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          姓名:
        </label>
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ 
            padding: '0.5rem 0.75rem', 
            borderRadius: '0.375rem', 
            border: '1px solid #d1d5db',
            maxWidth: '25rem',
            fontSize: '0.875rem'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          年龄: {age}
        </label>
        <input 
          type="range"
          min="1"
          max="100"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input 
            type="checkbox"
            checked={isStudent}
            onChange={(e) => setIsStudent(e.target.checked)}
            style={{ marginRight: '0.5rem', width: '1rem', height: '1rem', cursor: 'pointer' }}
          />
          <span style={{ fontWeight: 'bold' }}>是学生</span>
        </label>
      </div>

      <div style={{ 
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '0.375rem',
        border: '1px solid #e5e7eb'
      }}>
        <h5 style={{ margin: '0 0 0.5rem 0' }}>当前信息：</h5>
        <p style={{ margin: '0.25rem 0' }}><strong>姓名:</strong> {name}</p>
        <p style={{ margin: '0.25rem 0' }}><strong>年龄:</strong> {age} 岁</p>
        <p style={{ margin: '0.25rem 0' }}><strong>身份:</strong> {isStudent ? '学生' : '非学生'}</p>
      </div>
    </div>
  )
}

// 演示3：对象状态更新
interface FormData {
  username: string
  email: string
  password: string
}

const RegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#fef3c7', 
      borderRadius: '0.5rem',
      border: '1px solid #f59e0b'
    }}>
      <h4>📝 注册表单（对象状态）</h4>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            用户名:
          </label>
          <input 
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="请输入用户名"
            style={{ 
              padding: '0.5rem 0.75rem', 
              borderRadius: '0.375rem', 
              border: '1px solid #d1d5db',
              fontSize: '0.875rem'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            邮箱:
          </label>
          <input 
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="请输入邮箱"
            style={{ 
              padding: '0.5rem 0.75rem', 
              borderRadius: '0.375rem', 
              border: '1px solid #d1d5db',
              fontSize: '0.875rem'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            密码:
          </label>
          <input 
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="请输入密码"
            style={{ 
              padding: '0.5rem 0.75rem', 
              borderRadius: '0.375rem', 
              border: '1px solid #d1d5db',
              fontSize: '0.875rem'
            }}
            required
          />
        </div>

        <button 
          type="submit"
          style={{ 
            padding: '0.5rem 1.5rem',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            maxWidth: '18.75rem',
            fontSize: '0.875rem'
          }}
        >
          提交注册
        </button>
      </form>

      {submitted && (
        <div style={{ 
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#d1fae5',
          borderRadius: '0.375rem',
          color: '#065f46',
          fontWeight: 'bold'
        }}>
          ✅ 注册成功！欢迎，{formData.username}！
        </div>
      )}
    </div>
  )
}

// 演示4：数组状态管理
const TodoList = () => {
  const [todos, setTodos] = useState<string[]>(['学习 React', '完成作业'])
  const [newTodo, setNewTodo] = useState('')

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo])
      setNewTodo('')
    }
  }

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index))
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#fae8ff', 
      borderRadius: '0.5rem',
      border: '1px solid #a855f7'
    }}>
      <h4>✅ 待办事项列表（数组状态）</h4>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input 
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="添加新任务..."
          style={{ 
            flex: 1,
            padding: '0.5rem 0.75rem', 
            borderRadius: '0.375rem', 
            border: '1px solid #d1d5db',
            fontSize: '0.875rem'
          }}
        />
        <button 
          onClick={addTodo}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#a855f7',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}
        >
          添加
        </button>
      </div>

      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '0.375rem',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {todos.length === 0 ? (
          <div style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af' }}>
            暂无待办事项
          </div>
        ) : (
          todos.map((todo, index) => (
            <div 
              key={index}
              style={{ 
                padding: '0.75rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: index < todos.length - 1 ? '1px solid #e5e7eb' : 'none'
              }}
            >
              <span>{todo}</span>
              <button 
                onClick={() => removeTodo(index)}
                style={{ 
                  padding: '0.25rem 0.75rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}
              >
                删除
              </button>
            </div>
          ))
        )}
      </div>
      
      <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
        总计: {todos.length} 项任务
      </p>
    </div>
  )
}

// 演示5：事件处理的各种方式
const EventHandlingDemo = () => {
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const handleClick = () => {
    addLog('点击了普通按钮')
  }

  const handleClickWithParam = (name: string) => {
    addLog(`点击了 ${name} 按钮`)
  }

  const handleMouseEnter = () => {
    addLog('鼠标进入区域')
  }

  const handleMouseLeave = () => {
    addLog('鼠标离开区域')
  }

  const handleDoubleClick = () => {
    addLog('双击事件触发')
  }

  const handleInputFocus = () => {
    addLog('输入框获得焦点')
  }

  const handleInputBlur = () => {
    addLog('输入框失去焦点')
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#f8fafc', 
      borderRadius: '0.5rem',
      border: '1px solid #64748b'
    }}>
      <h4>⚡ 事件处理演示</h4>
      
      <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <button 
            onClick={handleClick}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.875rem'
            }}
          >
            普通点击事件
          </button>
        </div>

        <div>
          <button 
            onClick={() => handleClickWithParam('蓝色')}
            style={{ 
              margin: '0.25rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.875rem'
            }}
          >
            带参数的点击事件
          </button>
          <button 
            onClick={() => handleClickWithParam('绿色')}
            style={{ 
              margin: '0.25rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.875rem'
            }}
          >
            另一个参数
          </button>
        </div>

        <div 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ 
            padding: '1rem',
            backgroundColor: '#dbeafe',
            borderRadius: '0.375rem',
            textAlign: 'center',
            cursor: 'pointer'
          }}
        >
          把鼠标移到这里试试
        </div>

        <div>
          <button 
            onDoubleClick={handleDoubleClick}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.875rem'
            }}
          >
            双击我
          </button>
        </div>

        <div>
          <input 
            type="text"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="点击这里获得焦点"
            style={{ 
              padding: '0.5rem 0.75rem', 
              borderRadius: '0.375rem', 
              border: '1px solid #d1d5db',
              fontSize: '0.875rem'
            }}
          />
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '0.375rem',
        border: '1px solid #e5e7eb',
        maxHeight: '12.5rem',
        overflowY: 'auto',
        padding: '0.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <strong>事件日志:</strong>
          <button 
            onClick={() => setLogs([])}
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
            清空
          </button>
        </div>
        {logs.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>暂无事件日志</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{ 
              padding: '0.25rem 0',
              fontSize: '0.875rem',
              color: '#4b5563',
              borderBottom: index < logs.length - 1 ? '1px solid #f3f4f6' : 'none'
            }}>
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// 演示6：函数式更新和批量更新
const AdvancedCounter = () => {
  const [count, setCount] = useState(0)

  const increment3Times = () => {
    // 错误的方式（只会加1）
    // setCount(count + 1)
    // setCount(count + 1)
    // setCount(count + 1)

    // 正确的方式（会加3）
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
    setCount(prev => prev + 1)
  }

  const incrementAsync = () => {
    setTimeout(() => {
      setCount(prev => prev + 1) // 使用函数式更新确保获取最新值
    }, 1000)
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#fef2f2', 
      borderRadius: '0.5rem',
      border: '1px solid #ef4444'
    }}>
      <h4>🚀 高级状态更新</h4>
      <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0', textAlign: 'center' }}>
        {count}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
        <button 
          onClick={() => setCount(count + 1)}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}
        >
          普通 +1
        </button>
        <button 
          onClick={increment3Times}
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
          函数式更新 +3
        </button>
        <button 
          onClick={incrementAsync}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem'
          }}
        >
          1秒后 +1（异步）
        </button>
      </div>
      <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
        提示：函数式更新 setCount(prev =&gt; prev + 1) 确保基于最新的状态值更新
      </p>
    </div>
  )
}

// 主组件
const StateEvents = () => {
  return (
    <div className="tutorial-section">
      <h2>04 - State 与事件处理</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>📚 理论学习</h3>
        <p>
          <span className="highlight">State（状态）</span>是组件的内部数据，当 state 改变时组件会重新渲染。
          <span className="highlight">事件处理</span>让用户可以与应用交互。
        </p>
        <ul>
          <li><strong>useState Hook</strong>：用于在函数组件中添加状态</li>
          <li><strong>状态不可变性</strong>：不要直接修改 state，总是创建新的副本</li>
          <li><strong>函数式更新</strong>：使用 setState(prev =&gt; ...) 基于前一个状态更新</li>
          <li><strong>事件处理函数</strong>：使用驼峰命名（onClick, onChange 等）</li>
          <li><strong>事件对象</strong>：React 事件是合成事件，跨浏览器兼容</li>
          <li><strong>阻止默认行为</strong>：使用 e.preventDefault() 而不是返回 false</li>
        </ul>
      </div>

      <div className="interactive-demo">
        <h3>🎮 交互式演示</h3>
        
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(21.875rem, 1fr))' }}>
          {/* 演示1：基础计数器 */}
          <BasicCounter />

          {/* 演示2：多个状态 */}
          <UserProfile />

          {/* 演示3：对象状态 */}
          <RegistrationForm />

          {/* 演示4：数组状态 */}
          <TodoList />

          {/* 演示5：事件处理 */}
          <EventHandlingDemo />

          {/* 演示6：高级更新 */}
          <AdvancedCounter />
        </div>
      </div>

      <div className="demo-container">
        <h3>🔍 关键概念解释</h3>
        
        <CodeSection title="useState 基本用法" icon="📊" backgroundColor="#f0fdf4">
          <p>useState 返回一个数组：当前状态值和更新状态的函数。</p>
          <CodeBlock title="useState.ts" showLineNumbers>
{`const [state, setState] = useState(initialValue)
// state: 当前状态值
// setState: 更新状态的函数  
// initialValue: 初始值`}
          </CodeBlock>
        </CodeSection>
        
        <CodeSection title="状态不可变性" icon="🔄" backgroundColor="#f0f9ff">
          <p>永远不要直接修改 state。对于对象和数组，要创建新的副本：</p>
          <CodeBlock title="immutability.ts" showLineNumbers>
{`// 对象：使用展开运算符
setUser({ ...user, name: 'newName' })

// 数组：使用展开运算符或数组方法
setItems([...items, newItem])
setItems(items.filter(item => item.id !== id))`}
          </CodeBlock>
        </CodeSection>
        
        <CodeSection title="函数式更新" icon="⚡" backgroundColor="#fefce8">
          <p>当新状态依赖于前一个状态时，使用函数式更新：</p>
          <CodeBlock title="functional-update.ts" showLineNumbers>
{`// ✅ 推荐：函数式更新
setCount(prev => prev + 1)

// ❌ 避免：直接使用当前值
setCount(count + 1) // 在异步或批量更新时可能出错`}
          </CodeBlock>
        </CodeSection>
        
        <CodeSection title="事件处理" icon="🖱️" backgroundColor="#faf5ff">
          <p>React 事件处理器使用驼峰命名，传递函数而不是字符串：</p>
          <CodeBlock title="event-handling.tsx" showLineNumbers>
{`// JSX
<button onClick={handleClick}>点击</button>
<button onClick={() => handleClick(id)}>带参数</button>

// 事件对象
const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  e.preventDefault() // 阻止默认行为
  console.log(e.target.value)
}`}
          </CodeBlock>
        </CodeSection>
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
          <li>使用 useState Hook 为组件添加状态</li>
          <li>State 改变时组件会重新渲染</li>
          <li>遵循状态不可变性原则，不要直接修改 state</li>
          <li>使用函数式更新 setState(prev =&gt; ...) 确保基于最新状态更新</li>
          <li>事件处理器使用驼峰命名（onClick, onChange 等）</li>
          <li>可以管理多种类型的状态：基本类型、对象、数组</li>
        </ol>
      </div>
    </div>
  )
}

export default StateEvents