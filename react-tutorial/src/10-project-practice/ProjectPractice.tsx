import { useState, useReducer } from 'react'
import { CodeBlock, CodeSection } from '../components/CodeBlock'

// ==================== 项目 1: Todo List 应用 ====================
interface Todo {
  id: number
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
}

const TodoListApp = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputText, setInputText] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

  // 添加待办事项
  const addTodo = () => {
    if (inputText.trim() === '') return

    const newTodo: Todo = {
      id: Date.now(),
      text: inputText,
      completed: false,
      priority: priority,
      createdAt: new Date()
    }

    setTodos([...todos, newTodo])
    setInputText('')
  }

  // 切换完成状态
  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  // 删除待办事项
  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  // 编辑待办事项
  const editTodo = (id: number, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ))
  }

  // 清除已完成
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  // 过滤待办事项
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  // 统计
  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  }

  // 优先级颜色
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#22c55e'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0',
      maxWidth: '50rem'
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>📝 Todo List 应用</h3>

      {/* 统计面板 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          padding: '1rem',
          backgroundColor: '#dbeafe',
          borderRadius: '0.375rem',
          textAlign: 'center',
          border: '1px solid #3b82f6'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#1e40af' }}>总计</div>
        </div>
        <div style={{
          padding: '1rem',
          backgroundColor: '#fef3c7',
          borderRadius: '0.375rem',
          textAlign: 'center',
          border: '1px solid #f59e0b'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#92400e' }}>
            {stats.active}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#92400e' }}>进行中</div>
        </div>
        <div style={{
          padding: '1rem',
          backgroundColor: '#dcfce7',
          borderRadius: '0.375rem',
          textAlign: 'center',
          border: '1px solid #22c55e'
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#166534' }}>
            {stats.completed}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#166534' }}>已完成</div>
        </div>
      </div>

      {/* 添加表单 */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        marginBottom: '1rem',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="输入待办事项..."
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
          <button
            onClick={addTodo}
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
            添加
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: '500' }}>优先级:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            style={{
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>
      </div>

      {/* 过滤器 */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1rem',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: filter === f ? '#3b82f6' : 'white',
                color: filter === f ? 'white' : '#64748b',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              {f === 'all' ? '全部' : f === 'active' ? '进行中' : '已完成'}
            </button>
          ))}
        </div>
        {stats.completed > 0 && (
          <button
            onClick={clearCompleted}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            清除已完成
          </button>
        )}
      </div>

      {/* 待办列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredTodos.length === 0 ? (
          <div style={{
            padding: '2rem',
            textAlign: 'center',
            color: '#94a3b8',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            border: '1px dashed #cbd5e1'
          }}>
            {filter === 'all' ? '还没有待办事项，添加一个吧！' :
             filter === 'active' ? '没有进行中的任务' :
             '没有已完成的任务'}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
              getPriorityColor={getPriorityColor}
            />
          ))
        )}
      </div>
    </div>
  )
}

// Todo 项组件
interface TodoItemProps {
  todo: Todo
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number, text: string) => void
  getPriorityColor: (priority: string) => string
}

const TodoItem = ({ todo, onToggle, onDelete, onEdit, getPriorityColor }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText)
      setIsEditing(false)
    }
  }

  return (
    <div style={{
      padding: '1rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      transition: 'all 0.2s'
    }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        style={{
          width: '1.25rem',
          height: '1.25rem',
          cursor: 'pointer'
        }}
      />

      <div
        style={{
          width: '0.25rem',
          height: '2rem',
          backgroundColor: getPriorityColor(todo.priority),
          borderRadius: '0.125rem'
        }}
      />

      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          onBlur={handleSave}
          autoFocus
          style={{
            flex: 1,
            padding: '0.5rem',
            border: '1px solid #3b82f6',
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}
        />
      ) : (
        <div
          style={{
            flex: 1,
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? '#94a3b8' : '#1e293b',
            cursor: 'pointer'
          }}
          onClick={() => setIsEditing(true)}
        >
          {todo.text}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => setIsEditing(!isEditing)}
          style={{
            padding: '0.375rem 0.75rem',
            backgroundColor: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.75rem'
          }}
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          style={{
            padding: '0.375rem 0.75rem',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.75rem'
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

// ==================== 项目 2: 天气查询应用 ====================
interface WeatherData {
  city: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  icon: string
}

const mockWeatherData: Record<string, WeatherData> = {
  '北京': { city: '北京', temperature: 18, condition: '晴天', humidity: 45, windSpeed: 12, icon: '☀️' },
  '上海': { city: '上海', temperature: 22, condition: '多云', humidity: 65, windSpeed: 8, icon: '⛅' },
  '广州': { city: '广州', temperature: 28, condition: '阴天', humidity: 75, windSpeed: 6, icon: '☁️' },
  '深圳': { city: '深圳', temperature: 26, condition: '小雨', humidity: 80, windSpeed: 10, icon: '🌧️' },
  '成都': { city: '成都', temperature: 20, condition: '多云', humidity: 60, windSpeed: 5, icon: '⛅' },
  '杭州': { city: '杭州', temperature: 24, condition: '晴天', humidity: 55, windSpeed: 7, icon: '☀️' },
}

const WeatherApp = () => {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<string[]>([])

  const searchWeather = async () => {
    if (!city.trim()) {
      setError('请输入城市名称')
      return
    }

    setLoading(true)
    setError('')

    // 模拟 API 调用延迟
    setTimeout(() => {
      const data = mockWeatherData[city]
      
      if (data) {
        setWeather(data)
        setError('')
        // 添加到历史记录
        if (!history.includes(city)) {
          setHistory([city, ...history.slice(0, 4)])
        }
      } else {
        setWeather(null)
        setError('未找到该城市的天气信息')
      }
      
      setLoading(false)
    }, 800)
  }

  const searchFromHistory = (cityName: string) => {
    setCity(cityName)
    const data = mockWeatherData[cityName]
    if (data) {
      setWeather(data)
      setError('')
    }
  }

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0',
      maxWidth: '50rem'
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#1e293b' }}>🌤️ 天气查询应用</h3>

      <div style={{
        padding: '1.5rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        marginBottom: '1rem',
        border: '1px solid #e2e8f0'
      }}>
        {/* 搜索框 */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchWeather()}
            placeholder="输入城市名称（如：北京、上海、广州...）"
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
          <button
            onClick={searchWeather}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: loading ? '#cbd5e1' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: '0.875rem'
            }}
          >
            {loading ? '查询中...' : '查询'}
          </button>
        </div>

        {/* 快速选择 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {Object.keys(mockWeatherData).map(cityName => (
            <button
              key={cityName}
              onClick={() => {
                setCity(cityName)
                searchFromHistory(cityName)
              }}
              style={{
                padding: '0.375rem 0.75rem',
                backgroundColor: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
            >
              {cityName}
            </button>
          ))}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '0.5rem',
          color: '#991b1b',
          marginBottom: '1rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* 天气信息 */}
      {weather && (
        <div style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          border: '1px solid #e2e8f0',
          marginBottom: '1rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{weather.icon}</div>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>{weather.city}</h2>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {weather.temperature}°C
            </div>
            <div style={{ fontSize: '1.25rem', color: '#64748b' }}>{weather.condition}</div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem'
          }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f1f5f9',
              borderRadius: '0.375rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                💧 湿度
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
                {weather.humidity}%
              </div>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f1f5f9',
              borderRadius: '0.375rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.25rem' }}>
                💨 风速
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
                {weather.windSpeed} km/h
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 搜索历史 */}
      {history.length > 0 && (
        <div style={{
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: '#64748b' }}>
            📜 搜索历史
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {history.map((cityName, index) => (
              <button
                key={index}
                onClick={() => searchFromHistory(cityName)}
                style={{
                  padding: '0.375rem 0.75rem',
                  backgroundColor: '#dbeafe',
                  border: '1px solid #93c5fd',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  color: '#1e40af'
                }}
              >
                {cityName}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ==================== 项目 3: 简单电商应用 ====================
interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  stock: number
  description: string
}

interface CartItem extends Product {
  quantity: number
}

const products: Product[] = [
  { id: 1, name: 'MacBook Pro', price: 12999, image: '💻', category: '电子产品', stock: 10, description: '强大的性能，精致的设计' },
  { id: 2, name: 'iPhone 15', price: 5999, image: '📱', category: '电子产品', stock: 15, description: '创新科技，精彩体验' },
  { id: 3, name: 'AirPods Pro', price: 1999, image: '🎧', category: '配件', stock: 20, description: '沉浸式音质体验' },
  { id: 4, name: 'iPad Air', price: 4999, image: '📟', category: '电子产品', stock: 12, description: '轻薄便携，功能强大' },
  { id: 5, name: 'Apple Watch', price: 3199, image: '⌚', category: '配件', stock: 18, description: '健康生活好伴侣' },
  { id: 6, name: 'Magic Keyboard', price: 899, image: '⌨️', category: '配件', stock: 25, description: '舒适打字体验' },
]

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }

const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.find(item => item.id === action.payload.id)
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
            : item
        )
      }
      return [...state, { ...action.payload, quantity: 1 }]
    }
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload)
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, Math.min(action.payload.quantity, item.stock)) }
          : item
      )
    case 'CLEAR_CART':
      return []
    default:
      return state
  }
}

const ShoppingApp = () => {
  const [cart, dispatch] = useReducer(cartReducer, [])
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')
  const [showCart, setShowCart] = useState(false)

  const categories = ['全部', ...Array.from(new Set(products.map(p => p.category)))]

  const filteredProducts = selectedCategory === '全部'
    ? products
    : products.filter(p => p.category === selectedCategory)

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0',
      maxWidth: '70rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ margin: 0, color: '#1e293b' }}>🛍️ 简单电商应用</h3>
        <button
          onClick={() => setShowCart(!showCart)}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '0.875rem',
            position: 'relative'
          }}
        >
          🛒 购物车
          {totalItems > 0 && (
            <span style={{
              position: 'absolute',
              top: '-0.5rem',
              right: '-0.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: '1.5rem',
              height: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* 分类过滤 */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: selectedCategory === category ? '#3b82f6' : 'white',
              color: selectedCategory === category ? 'white' : '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 购物车侧边栏 */}
      {showCart && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '25rem',
          height: '100vh',
          backgroundColor: 'white',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          overflowY: 'auto',
          zIndex: 1000
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ margin: 0 }}>购物车</h3>
            <button
              onClick={() => setShowCart(false)}
              style={{
                padding: '0.5rem',
                backgroundColor: '#f1f5f9',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '1.25rem'
              }}
            >
              ✕
            </button>
          </div>

          {cart.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem 1rem',
              color: '#94a3b8'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
              <p>购物车是空的</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                {cart.map(item => (
                  <div
                    key={item.id}
                    style={{
                      padding: '1rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '0.5rem',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '2rem', marginRight: '0.75rem' }}>{item.image}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', fontSize: '0.875rem' }}>{item.name}</div>
                        <div style={{ color: '#3b82f6', fontWeight: 'bold' }}>¥{item.price}</div>
                      </div>
                      <button
                        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#fee2e2',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button
                        onClick={() => dispatch({
                          type: 'UPDATE_QUANTITY',
                          payload: { id: item.id, quantity: item.quantity - 1 }
                        })}
                        disabled={item.quantity <= 1}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: item.quantity <= 1 ? '#f1f5f9' : '#3b82f6',
                          color: item.quantity <= 1 ? '#94a3b8' : 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        -
                      </button>
                      <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: '500' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch({
                          type: 'UPDATE_QUANTITY',
                          payload: { id: item.id, quantity: item.quantity + 1 }
                        })}
                        disabled={item.quantity >= item.stock}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: item.quantity >= item.stock ? '#f1f5f9' : '#3b82f6',
                          color: item.quantity >= item.stock ? '#94a3b8' : 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        +
                      </button>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: 'auto' }}>
                        库存: {item.stock}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{
                borderTop: '1px solid #e2e8f0',
                paddingTop: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem'
                }}>
                  <span>商品数量:</span>
                  <span style={{ fontWeight: '500' }}>{totalItems} 件</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  color: '#3b82f6'
                }}>
                  <span>总计:</span>
                  <span>¥{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    alert('结算功能演示')
                    dispatch({ type: 'CLEAR_CART' })
                  }}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}
                >
                  去结算
                </button>
                <button
                  onClick={() => dispatch({ type: 'CLEAR_CART' })}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}
                >
                  清空购物车
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 遮罩层 */}
      {showCart && (
        <div
          onClick={() => setShowCart(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
        />
      )}

      {/* 产品列表 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(15rem, 1fr))',
        gap: '1rem'
      }}>
        {filteredProducts.map(product => (
          <div
            key={product.id}
            style={{
              padding: '1.5rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.2s'
            }}
          >
            <div style={{
              fontSize: '4rem',
              textAlign: 'center',
              marginBottom: '1rem'
            }}>
              {product.image}
            </div>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{product.name}</h4>
            <p style={{
              fontSize: '0.875rem',
              color: '#64748b',
              margin: '0 0 1rem 0',
              flex: 1
            }}>
              {product.description}
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem'
            }}>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#3b82f6'
              }}>
                ¥{product.price}
              </span>
              <span style={{
                fontSize: '0.75rem',
                color: '#64748b'
              }}>
                库存: {product.stock}
              </span>
            </div>
            <button
              onClick={() => dispatch({ type: 'ADD_ITEM', payload: product })}
              disabled={product.stock === 0}
              style={{
                padding: '0.75rem',
                backgroundColor: product.stock === 0 ? '#cbd5e1' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                fontSize: '0.875rem'
              }}
            >
              {product.stock === 0 ? '已售罄' : '加入购物车'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ==================== 主组件 ====================
const ProjectPractice = () => {
  return (
    <div className="tutorial-section">
      <h2>10 - 项目实践</h2>
      <p>通过完整的小项目，综合运用 React 的核心概念和技能</p>

      <div style={{
        padding: '1.5rem',
        backgroundColor: '#fef3c7',
        borderRadius: '0.5rem',
        border: '1px solid #f59e0b',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginTop: 0, color: '#92400e' }}>🎯 本章节内容</h3>
        <p style={{ marginBottom: '0.5rem' }}>本章包含三个完整的实战项目，帮助你巩固所学知识：</p>
        <ul style={{ marginBottom: 0 }}>
          <li><strong>Todo List 应用</strong> - 状态管理、表单处理、列表渲染</li>
          <li><strong>天气查询应用</strong> - API 调用模拟、异步操作、数据展示</li>
          <li><strong>简单电商应用</strong> - 复杂状态管理、购物车功能、用户交互</li>
        </ul>
      </div>

      {/* 项目 1 */}
      <CodeSection title="项目 1: Todo List 应用" icon="📝">
        <p style={{ marginBottom: '1rem' }}>
          一个功能完整的待办事项管理应用，包含添加、编辑、删除、过滤和优先级设置等功能。
        </p>
        <TodoListApp />

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          borderRadius: '0.5rem',
          border: '1px solid #86efac'
        }}>
          <h4 style={{ marginTop: 0, color: '#166534' }}>💡 学习要点</h4>
          <ul style={{ marginBottom: 0, fontSize: '0.875rem' }}>
            <li>使用 <code>useState</code> 管理多个状态</li>
            <li>数组操作：添加、删除、更新元素</li>
            <li>条件渲染和列表渲染</li>
            <li>表单输入处理</li>
            <li>组件拆分和 Props 传递</li>
          </ul>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <CodeBlock title="核心代码示例" showLineNumbers>
{`// Todo 接口定义
interface Todo {
  id: number
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

// 添加待办事项
const addTodo = () => {
  const newTodo: Todo = {
    id: Date.now(),
    text: inputText,
    completed: false,
    priority: priority
  }
  setTodos([...todos, newTodo])
}

// 切换完成状态
const toggleTodo = (id: number) => {
  setTodos(todos.map(todo =>
    todo.id === id 
      ? { ...todo, completed: !todo.completed } 
      : todo
  ))
}

// 删除待办事项
const deleteTodo = (id: number) => {
  setTodos(todos.filter(todo => todo.id !== id))
}`}
          </CodeBlock>
        </div>
      </CodeSection>

      {/* 项目 2 */}
      <CodeSection title="项目 2: 天气查询应用" icon="🌤️">
        <p style={{ marginBottom: '1rem' }}>
          一个模拟天气查询的应用，展示如何处理异步操作、加载状态和错误处理。
        </p>
        <WeatherApp />

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          borderRadius: '0.5rem',
          border: '1px solid #86efac'
        }}>
          <h4 style={{ marginTop: 0, color: '#166534' }}>💡 学习要点</h4>
          <ul style={{ marginBottom: 0, fontSize: '0.875rem' }}>
            <li>异步操作和 Loading 状态管理</li>
            <li>错误处理和用户反馈</li>
            <li>数据展示和格式化</li>
            <li>搜索历史记录功能</li>
            <li>UI 交互优化</li>
          </ul>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <CodeBlock title="异步查询示例" showLineNumbers>
{`const searchWeather = async () => {
  setLoading(true)
  setError('')
  
  // 模拟 API 调用
  setTimeout(() => {
    const data = mockWeatherData[city]
    
    if (data) {
      setWeather(data)
      setError('')
      // 添加到历史记录
      if (!history.includes(city)) {
        setHistory([city, ...history.slice(0, 4)])
      }
    } else {
      setWeather(null)
      setError('未找到该城市的天气信息')
    }
    
    setLoading(false)
  }, 800)
}`}
          </CodeBlock>
        </div>
      </CodeSection>

      {/* 项目 3 */}
      <CodeSection title="项目 3: 简单电商应用" icon="🛍️">
        <p style={{ marginBottom: '1rem' }}>
          一个包含产品展示和购物车功能的电商应用，使用 useReducer 管理复杂状态。
        </p>
        <ShoppingApp />

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f0fdf4',
          borderRadius: '0.5rem',
          border: '1px solid #86efac'
        }}>
          <h4 style={{ marginTop: 0, color: '#166534' }}>💡 学习要点</h4>
          <ul style={{ marginBottom: 0, fontSize: '0.875rem' }}>
            <li>使用 <code>useReducer</code> 管理复杂状态</li>
            <li>购物车逻辑实现</li>
            <li>产品分类和过滤</li>
            <li>侧边栏和遮罩层实现</li>
            <li>数量控制和库存管理</li>
          </ul>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <CodeBlock title="Reducer 状态管理" showLineNumbers>
{`// 定义 Action 类型
type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' }

// Reducer 函数
const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.find(item => item.id === action.payload.id)
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...state, { ...action.payload, quantity: 1 }]
    }
    case 'REMOVE_ITEM':
      return state.filter(item => item.id !== action.payload)
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
    case 'CLEAR_CART':
      return []
    default:
      return state
  }
}

// 使用 Reducer
const [cart, dispatch] = useReducer(cartReducer, [])

// 触发 Action
dispatch({ type: 'ADD_ITEM', payload: product })`}
          </CodeBlock>
        </div>
      </CodeSection>

      {/* 总结和提升 */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: '#eff6ff',
        borderRadius: '0.5rem',
        border: '1px solid #3b82f6',
        marginTop: '2rem'
      }}>
        <h3 style={{ marginTop: 0, color: '#1e40af' }}>🚀 项目扩展建议</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #93c5fd'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e40af' }}>数据持久化</h4>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              使用 localStorage 保存数据，页面刷新后数据不丢失
            </p>
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #93c5fd'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e40af' }}>实际 API 集成</h4>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              连接真实的后端 API，使用 axios 或 fetch 进行数据交互
            </p>
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #93c5fd'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e40af' }}>路由导航</h4>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              添加 React Router，实现多页面应用
            </p>
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #93c5fd'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e40af' }}>用户认证</h4>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              实现登录注册功能，添加用户权限管理
            </p>
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #93c5fd'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e40af' }}>响应式设计</h4>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              优化移动端体验，添加媒体查询和自适应布局
            </p>
          </div>
          <div style={{
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #93c5fd'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e40af' }}>性能优化</h4>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              使用 React.memo、useMemo 和 useCallback 优化性能
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectPractice
