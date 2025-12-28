import { useState, useEffect, useContext, useReducer, useCallback, useMemo, useRef, createContext, ReactNode } from 'react'
import { CodeBlock, CodeSection } from '../components/CodeBlock'

// 样式常量（避免每次渲染创建新对象）
const DEMO_STYLES = {
  container: {
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
    marginBottom: '1.5rem'
  } as const,
  innerCard: {
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '0.375rem',
    border: '1px solid #e2e8f0'
  } as const,
  infoBox: {
    padding: '0.75rem',
    backgroundColor: '#dbeafe',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    color: '#1e40af'
  } as const
}

const BUTTON_STYLES = {
  small: {
    padding: '0.5rem 1rem',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem'
  } as const,
  medium: {
    padding: '0.75rem 1.5rem',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500'
  } as const
}

// 创建一个主题上下文用于演示 useContext
const ThemeContext = createContext<{
  theme: string
  toggleTheme: () => void
}>({
  theme: 'light',
  toggleTheme: () => {}
})

// useReducer 的示例状态和动作
interface CounterState {
  count: number
  step: number
}

type CounterAction = 
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'set_step'; payload: number }

const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + state.step }
    case 'decrement':
      return { ...state, count: state.count - state.step }
    case 'reset':
      return { ...state, count: 0 }
    case 'set_step':
      return { ...state, step: action.payload }
    default:
      return state
  }
}

// ==================== 1. useState Hook ====================
const UseStateDemo = () => {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  const [todos, setTodos] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, inputValue])
      setInputValue('')
    }
  }

  return (
    <div style={DEMO_STYLES.container}>
      <h4 style={{ marginTop: 0, color: '#1e293b' }}>1️⃣ useState - 状态管理</h4>
      
      <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
        {/* 计数器示例 */}
        <div style={DEMO_STYLES.innerCard}>
          <h5 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#64748b' }}>
            基础计数器
          </h5>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {count}
            </span>
            <button
              onClick={() => setCount(count + 1)}
              style={{ ...BUTTON_STYLES.small, backgroundColor: '#3b82f6' }}
            >
              +1
            </button>
            <button
              onClick={() => setCount(count - 1)}
              style={{ ...BUTTON_STYLES.small, backgroundColor: '#ef4444' }}
            >
              -1
            </button>
            <button
              onClick={() => setCount(0)}
              style={{ ...BUTTON_STYLES.small, backgroundColor: '#6b7280' }}
            >
              重置
            </button>
          </div>
        </div>

        {/* 输入框示例 */}
        <div style={DEMO_STYLES.innerCard}>
          <h5 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#64748b' }}>
            表单输入
          </h5>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="输入你的名字"
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
              width: '100%'
            }}
          />
          <p style={{ margin: 0, color: '#1e293b' }}>
            你好, <strong>{name || '匿名用户'}</strong>! 👋
          </p>
        </div>

        {/* 数组状态示例 */}
        <div style={DEMO_STYLES.innerCard}>
          <h5 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#64748b' }}>
            数组状态管理
          </h5>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="添加待办事项"
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
            />
            <button
              onClick={addTodo}
              style={{ ...BUTTON_STYLES.small, backgroundColor: '#22c55e' }}
            >
              添加
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {todos.length === 0 ? (
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>
                还没有待办事项
              </p>
            ) : (
              todos.map((todo, index) => (
                <div
                  key={index}
                  style={{
                    padding: '0.5rem',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '0.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.875rem'
                  }}
                >
                  <span>{todo}</span>
                  <button
                    onClick={() => setTodos(todos.filter((_, i) => i !== index))}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#fee2e2',
                      border: 'none',
                      borderRadius: '0.25rem',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    删除
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div style={DEMO_STYLES.infoBox}>
        <strong>💡 说明：</strong>useState 是最基本的 Hook，用于在函数组件中添加状态。
        可以管理任何类型的数据：数字、字符串、数组、对象等。
      </div>
    </div>
  )
}

// ==================== 2. useEffect Hook ====================
const UseEffectDemo = () => {
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // 定时器效果
  useEffect(() => {
    let interval: number | null = null
    
    if (isRunning) {
      interval = window.setInterval(() => {
        setSeconds(s => s + 1)
      }, 1000)
    }
    
    // 清理函数
    return () => {
      if (interval) window.clearInterval(interval)
    }
  }, [isRunning])

  // 模拟数据获取
  const fetchData = () => {
    setLoading(true)
    setData(null)
    
    setTimeout(() => {
      setData('数据加载成功！ ✅')
      setLoading(false)
    }, 1500)
  }

  return (
    <div style={DEMO_STYLES.container}>
      <h4 style={{ marginTop: 0, color: '#1e293b' }}>2️⃣ useEffect - 副作用处理</h4>
      
      <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
        {/* 定时器示例 */}
        <div style={DEMO_STYLES.innerCard}>
          <h5 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#64748b' }}>
            定时器（带清理）
          </h5>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#3b82f6',
            marginBottom: '0.75rem',
            textAlign: 'center'
          }}>
            {seconds}秒
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <button
              onClick={() => setIsRunning(!isRunning)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: isRunning ? '#ef4444' : '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {isRunning ? '⏸️ 暂停' : '▶️ 开始'}
            </button>
            <button
              onClick={() => setSeconds(0)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              🔄 重置
            </button>
          </div>
        </div>

        {/* 数据获取示例 */}
        <div style={DEMO_STYLES.innerCard}>
          <h5 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#64748b' }}>
            模拟数据获取
          </h5>
          <button
            onClick={fetchData}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: loading ? '#cbd5e1' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              marginBottom: '0.75rem'
            }}
          >
            {loading ? '⏳ 加载中...' : '📡 获取数据'}
          </button>
          {data && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#dcfce7',
              borderRadius: '0.375rem',
              color: '#166534',
              fontSize: '0.875rem'
            }}>
              {data}
            </div>
          )}
        </div>
      </div>

      <div style={DEMO_STYLES.infoBox}>
        <strong>💡 说明：</strong>useEffect 用于处理副作用，如 API 调用、定时器、订阅等。
        返回的清理函数会在组件卸载或依赖变化前执行。
      </div>
    </div>
  )
}

// ==================== 3. useContext Hook ====================
const UseContextDemo = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <div style={DEMO_STYLES.container}>
      <h4 style={{ marginTop: 0, color: '#1e293b' }}>3️⃣ useContext - 上下文订阅</h4>
      
      <div style={{
        padding: '1.5rem',
        backgroundColor: theme === 'dark' ? '#1e293b' : 'white',
        color: theme === 'dark' ? 'white' : '#1e293b',
        borderRadius: '0.375rem',
        border: '1px solid #e2e8f0',
        marginBottom: '1rem',
        transition: 'all 0.3s'
      }}>
        <div style={{
          fontSize: '3rem',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </div>
        <p style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.125rem' }}>
          当前主题: <strong>{theme === 'dark' ? '暗色模式' : '亮色模式'}</strong>
        </p>
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={toggleTheme}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: theme === 'dark' ? '#f59e0b' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            切换主题
          </button>
        </div>
      </div>

      <div style={DEMO_STYLES.infoBox}>
        <strong>💡 说明：</strong>useContext 用于订阅 React 上下文，
        避免通过多层组件传递 props（避免 props drilling）。
      </div>
    </div>
  )
}

// ==================== 4. useReducer Hook ====================
const UseReducerDemo = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, step: 1 })

  return (
    <div style={DEMO_STYLES.container}>
      <h4 style={{ marginTop: 0, color: '#1e293b' }}>4️⃣ useReducer - 复杂状态管理</h4>
      
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '0.375rem',
        border: '1px solid #e2e8f0',
        marginBottom: '1rem'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#3b82f6',
            marginBottom: '0.5rem'
          }}>
            {state.count}
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#64748b'
          }}>
            步长: {state.step}
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          <button
            onClick={() => dispatch({ type: 'increment' })}
              style={{ ...BUTTON_STYLES.medium, backgroundColor: '#22c55e' }}
          >
            +{state.step}
          </button>
          <button
            onClick={() => dispatch({ type: 'decrement' })}
              style={{ ...BUTTON_STYLES.medium, backgroundColor: '#ef4444' }}
          >
            -{state.step}
          </button>
          <button
            onClick={() => dispatch({ type: 'reset' })}
              style={{ ...BUTTON_STYLES.medium, backgroundColor: '#6b7280' }}
          >
            重置
          </button>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>
            调整步长:
          </label>
          <input 
            type="number" 
            value={state.step}
            onChange={(e) => dispatch({ 
              type: 'set_step', 
              payload: parseInt(e.target.value) || 1 
            })}
            min="1"
            max="10"
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              width: '5rem'
            }}
          />
        </div>
      </div>

      <div style={DEMO_STYLES.infoBox}>
        <strong>💡 说明：</strong>useReducer 适用于复杂状态逻辑，
        类似于 Redux 的 reducer，通过 action 来管理状态变化。
      </div>
    </div>
  )
}

// ==================== 5. useCallback & useMemo ====================
const UseCallbackMemoDemo = () => {
  const [count, setCount] = useState(0)
  const [items, setItems] = useState<number[]>([1, 2, 3, 4, 5])
  const renderCountRef = useRef(0)

  // 每次渲染时增加计数（使用 ref 不会触发重渲染）
  renderCountRef.current += 1

  // useCallback 缓存函数
  const handleIncrement = useCallback(() => {
    setCount(c => c + 1)
  }, [])

  // useMemo 缓存计算结果
  const expensiveValue = useMemo(() => {
    console.log('🔄 正在计算平方和...')
    return items.reduce((sum, item) => sum + item * item, 0)
  }, [items])

  const addItem = () => {
    setItems([...items, items.length + 1])
  }

  return (
    <div style={DEMO_STYLES.container}>
      <h4 style={{ marginTop: 0, color: '#1e293b' }}>
        5️⃣ useCallback & useMemo - 性能优化
      </h4>
      
      <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
        {/* 渲染次数 */}
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef3c7',
          borderRadius: '0.375rem',
          border: '1px solid #fbbf24',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#92400e', marginBottom: '0.25rem' }}>
            组件渲染次数
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#92400e' }}>
            {renderCountRef.current}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#92400e', marginTop: '0.25rem' }}>
            (使用 ref 追踪，不触发重渲染)
          </div>
        </div>

        {/* useCallback 示例 */}
        <div style={DEMO_STYLES.innerCard}>
          <h5 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#64748b' }}>
            useCallback 示例
          </h5>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {count}
            </span>
            <button
              onClick={handleIncrement}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              增加 (缓存的函数)
            </button>
          </div>
        </div>

        {/* useMemo 示例 */}
        <div style={DEMO_STYLES.innerCard}>
          <h5 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#64748b' }}>
            useMemo 示例
          </h5>
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
              数组: [{items.join(', ')}]
            </div>
            <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#22c55e' }}>
              平方和: {expensiveValue}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              (只在数组变化时重新计算)
            </div>
          </div>
          <button
            onClick={addItem}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            添加项目
          </button>
        </div>
      </div>

      <div style={DEMO_STYLES.infoBox}>
        <strong>💡 说明：</strong>
        <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
          <li><strong>useCallback</strong>: 缓存函数引用，避免每次渲染都创建新函数</li>
          <li><strong>useMemo</strong>: 缓存计算结果，只在依赖变化时重新计算（查看控制台日志）</li>
          <li><strong>渲染计数</strong>: 使用 useRef 追踪，不会因为计数更新而触发额外渲染</li>
          <li>点击"增加"按钮会触发渲染，但"添加项目"才会重新计算平方和</li>
        </ul>
      </div>
    </div>
  )
}

// ==================== 6. useRef Hook ====================
const UseRefDemo = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const countRef = useRef(0)
  const [stateCount, setStateCount] = useState(0)

  const focusInput = () => {
    inputRef.current?.focus()
  }

  const incrementRef = () => {
    countRef.current += 1
    console.log('Ref count:', countRef.current)
    alert(`Ref 计数已增加到: ${countRef.current}\n(不会触发重新渲染)`)
  }

  const incrementState = () => {
    setStateCount(c => c + 1)
  }

  return (
    <div style={DEMO_STYLES.container}>
      <h4 style={{ marginTop: 0, color: '#1e293b' }}>6️⃣ useRef - 引用管理</h4>
      
      <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
        {/* DOM 引用示例 */}
        <div style={DEMO_STYLES.innerCard}>
          <h5 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#64748b' }}>
            DOM 元素引用
          </h5>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="点击按钮聚焦我"
              style={{
                flex: 1,
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem'
              }}
            />
            <button
              onClick={focusInput}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              🎯 聚焦
            </button>
          </div>
        </div>

        {/* 值存储示例 */}
        <div style={DEMO_STYLES.innerCard}>
          <h5 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#64748b' }}>
            存储可变值（不触发重渲染）
          </h5>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#fef3c7',
              borderRadius: '0.375rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#92400e', marginBottom: '0.25rem' }}>
                Ref 计数 (不触发渲染)
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#92400e' }}>
                {countRef.current}
              </div>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: '#dbeafe',
              borderRadius: '0.375rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#1e40af', marginBottom: '0.25rem' }}>
                State 计数 (触发渲染)
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af' }}>
                {stateCount}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={incrementRef}
              style={{
                flex: 1,
                padding: '0.5rem 1rem',
                backgroundColor: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              增加 Ref
            </button>
            <button
              onClick={incrementState}
              style={{
                flex: 1,
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              增加 State
            </button>
          </div>
          <p style={{
            margin: '0.75rem 0 0 0',
            fontSize: '0.75rem',
            color: '#64748b',
            textAlign: 'center'
          }}>
            💡 点击"增加 Ref"不会触发重渲染，但值已更新
          </p>
        </div>
      </div>

      <div style={DEMO_STYLES.infoBox}>
        <strong>💡 说明：</strong>useRef 用于引用 DOM 元素或存储可变值。
        与 useState 不同，修改 ref.current 不会触发组件重新渲染。
      </div>
    </div>
  )
}

// ==================== 主题提供者组件 ====================
const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState('light')

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ==================== 主组件 ====================
const ReactHooks = () => {
  return (
    <ThemeProvider>
      <div className="tutorial-section">
        <h2>11 - React Hooks 深入解析</h2>
        <p>全面掌握 React Hooks 的使用方法和最佳实践</p>
        
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#fef3c7',
          borderRadius: '0.5rem',
          border: '1px solid #f59e0b',
          marginBottom: '2rem'
        }}>
          <h3 style={{ marginTop: 0, color: '#92400e' }}>🎯 本章节内容</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>1️⃣</span>
              <div>
                <strong>useState</strong>
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>状态管理</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>2️⃣</span>
              <div>
                <strong>useEffect</strong>
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>副作用处理</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>3️⃣</span>
              <div>
                <strong>useContext</strong>
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>上下文订阅</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>4️⃣</span>
              <div>
                <strong>useReducer</strong>
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>复杂状态管理</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>5️⃣</span>
              <div>
                <strong>useCallback & useMemo</strong>
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>性能优化</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>6️⃣</span>
              <div>
                <strong>useRef</strong>
                <div style={{ fontSize: '0.875rem', color: '#92400e' }}>引用管理</div>
              </div>
            </div>
          </div>
        </div>

        {/* 所有 Hook 演示 */}
        <UseStateDemo />
        <UseEffectDemo />
        <UseContextDemo />
        <UseReducerDemo />
        <UseCallbackMemoDemo />
        <UseRefDemo />

        {/* 代码示例 */}
        <CodeSection title="Hooks 代码示例" icon="💻">
          <CodeBlock title="useState 基础用法" showLineNumbers>
{`import { useState } from 'react'

function Counter() {
  // 声明状态变量
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>计数: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(prev => prev + 1)}>+1 (函数式)</button>
    </div>
  )
}`}
          </CodeBlock>

          <CodeBlock title="useEffect 常见用法" showLineNumbers>
{`import { useState, useEffect } from 'react'

function DataFetcher() {
  const [data, setData] = useState(null)
  
  // 1. 组件挂载时执行（空依赖数组）
  useEffect(() => {
    console.log('组件已挂载')
    return () => console.log('组件将卸载')
  }, [])
  
  // 2. 依赖变化时执行
  useEffect(() => {
    fetchData().then(setData)
  }, [/* 依赖项 */])
  
  // 3. 每次渲染都执行（无依赖数组）
  useEffect(() => {
    console.log('组件已渲染')
  })
  
  return <div>{data}</div>
}`}
          </CodeBlock>

          <CodeBlock title="useContext 使用示例" showLineNumbers>
{`import { createContext, useContext } from 'react'

// 1. 创建 Context
const ThemeContext = createContext('light')

// 2. 提供 Context
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  )
}

// 3. 使用 Context
function Child() {
  const theme = useContext(ThemeContext)
  return <div>当前主题: {theme}</div>
}`}
          </CodeBlock>

          <CodeBlock title="useReducer 完整示例" showLineNumbers>
{`import { useReducer } from 'react'

// 1. 定义 reducer
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      return state
  }
}

// 2. 使用 reducer
function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 })
  
  return (
    <div>
      <p>计数: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  )
}`}
          </CodeBlock>

          <CodeBlock title="useCallback & useMemo 对比" showLineNumbers>
{`import { useCallback, useMemo, useState } from 'react'

function Example() {
  const [count, setCount] = useState(0)
  const [items, setItems] = useState([1, 2, 3])
  
  // useCallback: 缓存函数
  const handleClick = useCallback(() => {
    console.log('点击了按钮')
  }, []) // 依赖为空，函数永远不变
  
  // useMemo: 缓存计算结果
  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item, 0)
  }, [items]) // 只在 items 变化时重新计算
  
  return (
    <div>
      <p>总和: {total}</p>
      <button onClick={handleClick}>点击</button>
    </div>
  )
}`}
          </CodeBlock>

          <CodeBlock title="useRef 多种用途" showLineNumbers>
{`import { useRef, useEffect } from 'react'

function Example() {
  // 1. 引用 DOM 元素
  const inputRef = useRef<HTMLInputElement>(null)
  
  // 2. 存储可变值（不触发渲染）
  const countRef = useRef(0)
  
  // 3. 存储上一次的值
  const prevValueRef = useRef()
  
  useEffect(() => {
    // 访问 DOM
    inputRef.current?.focus()
    
    // 修改可变值
    countRef.current += 1
  })
  
  return <input ref={inputRef} />
}`}
          </CodeBlock>
        </CodeSection>

        {/* 最佳实践 */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#f0fdf4',
          borderRadius: '0.5rem',
          border: '1px solid #86efac',
          marginTop: '2rem'
        }}>
          <h3 style={{ marginTop: 0, color: '#166534' }}>🚀 Hooks 最佳实践</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '0.375rem',
              border: '1px solid #86efac'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534' }}>
                1. 只在顶层调用 Hooks
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                ❌ 不要在循环、条件语句或嵌套函数中调用 Hooks<br />
                ✅ 始终在函数组件的顶层使用 Hooks
              </p>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '0.375rem',
              border: '1px solid #86efac'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534' }}>
                2. 正确设置 useEffect 依赖
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                ✅ 包含所有使用的外部变量<br />
                ✅ 使用 ESLint 插件检查依赖<br />
                ✅ 考虑使用函数式更新避免依赖
              </p>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '0.375rem',
              border: '1px solid #86efac'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534' }}>
                3. 谨慎使用性能优化 Hooks
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                ⚠️ 不要过早优化<br />
                ✅ 先测量性能问题<br />
                ✅ 在确实需要时才使用 useMemo/useCallback
              </p>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '0.375rem',
              border: '1px solid #86efac'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#166534' }}>
                4. 创建自定义 Hooks
              </h4>
              <p style={{ margin: 0, fontSize: '0.875rem' }}>
                ✅ 提取可复用的逻辑<br />
                ✅ 以 "use" 开头命名<br />
                ✅ 可以组合多个内置 Hooks
              </p>
            </div>
          </div>
        </div>

        {/* 进阶技巧 */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: '#eff6ff',
          borderRadius: '0.5rem',
          border: '1px solid #3b82f6',
          marginTop: '1.5rem'
        }}>
          <h3 style={{ marginTop: 0, color: '#1e40af' }}>💡 进阶技巧</h3>
          <ul style={{ marginBottom: 0 }}>
            <li>使用 <code>useReducer</code> 替代复杂的 <code>useState</code></li>
            <li>结合 <code>useContext</code> 和 <code>useReducer</code> 实现全局状态管理</li>
            <li>使用 <code>useRef</code> 存储不需要触发重渲染的值</li>
            <li>善用 <code>useCallback</code> 优化子组件性能（配合 React.memo）</li>
            <li>通过自定义 Hooks 封装复杂逻辑（如数据获取、表单处理等）</li>
            <li>使用 <code>useLayoutEffect</code> 处理 DOM 测量和同步更新</li>
          </ul>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default ReactHooks
