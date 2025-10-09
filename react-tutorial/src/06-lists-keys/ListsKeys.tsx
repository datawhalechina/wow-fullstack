import { useState } from 'react'
import { CodeBlock } from '../components/CodeBlock'

// 定义类型
interface Todo {
  id: number
  text: string
  completed: boolean
}

interface User {
  id: number
  name: string
  email: string
  role: string
}

// 演示1：基本列表渲染
const BasicList = () => {
  const fruits = ['🍎 Apple', '🍌 Banana', '🍊 Orange', '🍇 Grapes', '🍓 Strawberry']

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#f0f9ff', 
      borderRadius: '0.5rem',
      border: '1px solid #0ea5e9'
    }}>
      <h4>🍎 基本列表渲染</h4>
      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
        使用 map() 方法渲染简单数组
      </p>
      <ul style={{ 
        listStyle: 'none', 
        padding: 0,
        margin: 0,
        display: 'grid',
        gap: '0.5rem'
      }}>
        {fruits.map((fruit, index) => (
          <li 
            key={index}
            style={{ 
              padding: '0.75rem',
              backgroundColor: 'white',
              borderRadius: '0.375rem',
              border: '1px solid #e0e7ff',
              fontSize: '0.95rem'
            }}
          >
            {fruit}
          </li>
        ))}
      </ul>
      <p style={{ 
        marginTop: '1rem', 
        fontSize: '0.75rem', 
        color: '#f59e0b',
        fontWeight: 'bold'
      }}>
        ⚠️ 注意：这里使用索引作为 key 仅因为列表是静态的
      </p>
    </div>
  )
}

// 演示2：动态 Todo 列表（展示 key 的重要性）
const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: '学习 React 基础', completed: true },
    { id: 2, text: '掌握 Hooks 用法', completed: false },
    { id: 3, text: '构建实际项目', completed: false }
  ])
  const [inputValue, setInputValue] = useState('')
  const [nextId, setNextId] = useState(4)

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { id: nextId, text: inputValue, completed: false }])
      setNextId(nextId + 1)
      setInputValue('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#f0fdf4', 
      borderRadius: '0.5rem',
      border: '1px solid #22c55e'
    }}>
      <h4>✅ 动态 Todo 列表</h4>
      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
        演示列表的增删改操作和 key 的使用
      </p>
      
      {/* 添加 Todo */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input 
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="输入新任务..."
          style={{ 
            flex: 1,
            maxWidth: '25rem',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem'
          }}
        />
        <button 
          onClick={addTodo}
          style={{ 
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
          添加
        </button>
      </div>

      {/* Todo 列表 */}
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {todos.map(todo => (
          <div 
            key={todo.id}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              backgroundColor: 'white',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb'
            }}
          >
            <input 
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              style={{ width: '1.125rem', height: '1.125rem', cursor: 'pointer' }}
            />
            <span style={{ 
              flex: 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? '#9ca3af' : '#1f2937',
              fontSize: '0.9rem'
            }}>
              {todo.text}
            </span>
            <span style={{ 
              fontSize: '0.75rem',
              color: '#9ca3af',
              fontFamily: 'monospace'
            }}>
              ID: {todo.id}
            </span>
            <button 
              onClick={() => deleteTodo(todo.id)}
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
              删除
            </button>
          </div>
        ))}
      </div>

      {todos.length === 0 && (
        <div style={{ 
          padding: '2rem',
          textAlign: 'center',
          color: '#9ca3af',
          backgroundColor: '#f9fafb',
          borderRadius: '0.375rem',
          border: '1px dashed #d1d5db'
        }}>
          暂无任务，添加一个开始吧！
        </div>
      )}
    </div>
  )
}

// 演示3：过滤和排序
const UserList = () => {
  const [users] = useState<User[]>([
    { id: 1, name: 'Alice Wang', email: 'alice@example.com', role: 'admin' },
    { id: 2, name: 'Bob Chen', email: 'bob@example.com', role: 'user' },
    { id: 3, name: 'Charlie Li', email: 'charlie@example.com', role: 'user' },
    { id: 4, name: 'Diana Zhang', email: 'diana@example.com', role: 'admin' },
    { id: 5, name: 'Eve Liu', email: 'eve@example.com', role: 'user' }
  ])

  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'id'>('id')

  // 过滤
  const filteredUsers = users.filter(user => {
    if (roleFilter === 'all') return true
    return user.role === roleFilter
  })

  // 排序
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name)
    }
    return a.id - b.id
  })

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#fef3c7', 
      borderRadius: '0.5rem',
      border: '1px solid #f59e0b'
    }}>
      <h4>👥 过滤和排序</h4>
      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
        对列表进行过滤和排序操作
      </p>

      {/* 控制按钮 */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '1rem',
        flexWrap: 'wrap'
      }}>
        <div>
          <span style={{ fontSize: '0.875rem', fontWeight: 'bold', marginRight: '0.5rem' }}>
            角色筛选:
          </span>
          <button 
            onClick={() => setRoleFilter('all')}
            style={{ 
              padding: '0.375rem 0.75rem',
              backgroundColor: roleFilter === 'all' ? '#3b82f6' : 'white',
              color: roleFilter === 'all' ? 'white' : '#4b5563',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              marginRight: '0.25rem'
            }}
          >
            全部 ({users.length})
          </button>
          <button 
            onClick={() => setRoleFilter('admin')}
            style={{ 
              padding: '0.375rem 0.75rem',
              backgroundColor: roleFilter === 'admin' ? '#3b82f6' : 'white',
              color: roleFilter === 'admin' ? 'white' : '#4b5563',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              marginRight: '0.25rem'
            }}
          >
            管理员 ({users.filter(u => u.role === 'admin').length})
          </button>
          <button 
            onClick={() => setRoleFilter('user')}
            style={{ 
              padding: '0.375rem 0.75rem',
              backgroundColor: roleFilter === 'user' ? '#3b82f6' : 'white',
              color: roleFilter === 'user' ? 'white' : '#4b5563',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.75rem'
            }}
          >
            用户 ({users.filter(u => u.role === 'user').length})
          </button>
        </div>

        <div>
          <span style={{ fontSize: '0.875rem', fontWeight: 'bold', marginRight: '0.5rem' }}>
            排序:
          </span>
          <button 
            onClick={() => setSortBy('id')}
            style={{ 
              padding: '0.375rem 0.75rem',
              backgroundColor: sortBy === 'id' ? '#8b5cf6' : 'white',
              color: sortBy === 'id' ? 'white' : '#4b5563',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.75rem',
              marginRight: '0.25rem'
            }}
          >
            按 ID
          </button>
          <button 
            onClick={() => setSortBy('name')}
            style={{ 
              padding: '0.375rem 0.75rem',
              backgroundColor: sortBy === 'name' ? '#8b5cf6' : 'white',
              color: sortBy === 'name' ? 'white' : '#4b5563',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.75rem'
            }}
          >
            按姓名
          </button>
        </div>
      </div>

      {/* 用户列表 */}
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {sortedUsers.map(user => (
          <div 
            key={user.id}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{ 
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              backgroundColor: user.role === 'admin' ? '#fbbf24' : '#60a5fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}>
              {user.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                {user.name}
                {user.role === 'admin' && (
                  <span style={{ 
                    marginLeft: '0.5rem',
                    padding: '0.125rem 0.5rem',
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    fontSize: '0.7rem',
                    borderRadius: '62.4375rem',
                    fontWeight: 'normal'
                  }}>
                    👑 管理员
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                {user.email}
              </div>
            </div>
            <div style={{ 
              fontSize: '0.75rem',
              color: '#9ca3af',
              fontFamily: 'monospace'
            }}>
              #{user.id}
            </div>
          </div>
        ))}
      </div>

      {sortedUsers.length === 0 && (
        <div style={{ 
          padding: '2rem',
          textAlign: 'center',
          color: '#9ca3af',
          backgroundColor: '#f9fafb',
          borderRadius: '0.375rem',
          border: '1px dashed #d1d5db'
        }}>
          没有找到匹配的用户
        </div>
      )}
    </div>
  )
}

// 演示4：嵌套列表
const CategoryList = () => {
  const [categories] = useState([
    {
      id: 1,
      name: '水果',
      icon: '🍎',
      products: [
        { id: 101, name: '苹果', price: 5 },
        { id: 102, name: '香蕉', price: 3 },
        { id: 103, name: '橙子', price: 4 }
      ]
    },
    {
      id: 2,
      name: '蔬菜',
      icon: '🥬',
      products: [
        { id: 201, name: '西红柿', price: 6 },
        { id: 202, name: '黄瓜', price: 4 },
        { id: 203, name: '生菜', price: 5 }
      ]
    },
    {
      id: 3,
      name: '饮料',
      icon: '🥤',
      products: [
        { id: 301, name: '可乐', price: 3 },
        { id: 302, name: '果汁', price: 8 }
      ]
    }
  ])

  const [expandedCategories, setExpandedCategories] = useState<number[]>([1])

  const toggleCategory = (id: number) => {
    setExpandedCategories(prev => 
      prev.includes(id) 
        ? prev.filter(catId => catId !== id)
        : [...prev, id]
    )
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#fae8ff', 
      borderRadius: '0.5rem',
      border: '1px solid #a855f7'
    }}>
      <h4>📦 嵌套列表</h4>
      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
        演示多层嵌套列表的渲染和交互
      </p>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {categories.map(category => {
          const isExpanded = expandedCategories.includes(category.id)
          const totalItems = category.products.length
          const totalPrice = category.products.reduce((sum, p) => sum + p.price, 0)

          return (
            <div 
              key={category.id}
              style={{ 
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb',
                overflow: 'hidden'
              }}
            >
              {/* 分类头部 */}
              <div 
                onClick={() => toggleCategory(category.id)}
                style={{ 
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  backgroundColor: isExpanded ? '#f9fafb' : 'white',
                  transition: 'background-color 0.2s'
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{category.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                    {category.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    {totalItems} 个商品 · 总价 ¥{totalPrice}
                  </div>
                </div>
                <div style={{ 
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                  fontSize: '0.875rem',
                  color: '#9ca3af'
                }}>
                  ▼
                </div>
              </div>

              {/* 商品列表 */}
              {isExpanded && (
                <div style={{ 
                  padding: '0 1rem 1rem 1rem',
                  backgroundColor: '#f9fafb'
                }}>
                  {category.products.map(product => (
                    <div 
                      key={product.id}
                      style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        marginTop: '0.5rem',
                        backgroundColor: 'white',
                        borderRadius: '0.375rem',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.875rem'
                      }}
                    >
                      <span>{product.name}</span>
                      <span style={{ 
                        fontWeight: 'bold',
                        color: '#059669'
                      }}>
                        ¥{product.price}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// 演示5：Key 的对比
const KeyComparison = () => {
  const [items, setItems] = useState(['Item A', 'Item B', 'Item C'])
  const [useIndex, setUseIndex] = useState(false)

  const shuffleItems = () => {
    setItems([...items].sort(() => Math.random() - 0.5))
  }

  const addItemAtStart = () => {
    const newItem = `Item ${String.fromCharCode(65 + items.length)}`
    setItems([newItem, ...items])
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#fee2e2', 
      borderRadius: '0.5rem',
      border: '1px solid #ef4444'
    }}>
      <h4>🔑 Key 的重要性对比</h4>
      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
        观察使用 ID 和索引作为 key 的不同表现
      </p>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button 
          onClick={shuffleItems}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          🔀 随机排序
        </button>
        <button 
          onClick={addItemAtStart}
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
          ➕ 在开头添加
        </button>
        <label style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'white',
          borderRadius: '0.375rem',
          border: '1px solid #d1d5db',
          cursor: 'pointer'
        }}>
          <input 
            type="checkbox"
            checked={useIndex}
            onChange={(e) => setUseIndex(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.875rem' }}>
            使用索引作为 key (不推荐)
          </span>
        </label>
      </div>

      <div style={{ 
        padding: '1rem',
        backgroundColor: useIndex ? '#fef3c7' : '#d1fae5',
        borderRadius: '0.375rem',
        border: `2px solid ${useIndex ? '#f59e0b' : '#10b981'}`,
        marginBottom: '1rem'
      }}>
        <div style={{ 
          fontSize: '0.875rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: useIndex ? '#92400e' : '#065f46'
        }}>
          {useIndex ? '⚠️ 使用索引作为 Key' : '✅ 使用唯一 ID 作为 Key'}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
          {useIndex 
            ? '当列表变化时，可能导致组件状态错位和性能问题'
            : 'React 能正确识别每个项，即使顺序改变也能保持状态'}
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {items.map((item, index) => (
          <div 
            key={useIndex ? index : item}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              backgroundColor: 'white',
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb'
            }}
          >
            <span style={{ 
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              {item}
            </span>
            <input 
              type="text"
              defaultValue={`Input for ${item}`}
              style={{ 
                flex: 1,
                maxWidth: '12.5rem',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '0.875rem'
              }}
            />
            <span style={{ 
              fontSize: '0.75rem',
              color: '#9ca3af',
              fontFamily: 'monospace'
            }}>
              {useIndex ? `index: ${index}` : `key: ${item}`}
            </span>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: '#fffbeb',
        borderRadius: '0.375rem',
        border: '1px solid #fbbf24',
        fontSize: '0.75rem',
        color: '#92400e'
      }}>
        💡 提示：尝试在输入框中输入内容，然后点击"随机排序"或"在开头添加"，
        观察使用不同 key 时输入框内容的变化！
      </div>
    </div>
  )
}

// 主组件
const ListsKeys = () => {
  return (
    <div className="tutorial-section">
      <h2>06 - 列表与 Keys</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>📚 理论学习</h3>
        <p>
          在 React 中，我们使用 JavaScript 的 <span className="highlight">map()</span> 方法
          将数组转换为 JSX 元素列表。<span className="highlight">Key</span> 是一个特殊属性，
          帮助 React 识别哪些项发生了变化。
        </p>
        <ul>
          <li><strong>列表渲染</strong>：使用 map() 将数组转换为 JSX 元素</li>
          <li><strong>Keys</strong>：帮助 React 识别元素变化，提高性能</li>
          <li><strong>唯一性</strong>：Key 应该在兄弟元素间唯一且稳定</li>
          <li><strong>避免索引</strong>：动态列表不要使用索引作为 key</li>
          <li><strong>不可变更新</strong>：使用新数组而不是直接修改原数组</li>
        </ul>
      </div>

      <div className="interactive-demo">
        <h3>🎮 交互式演示</h3>
        
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(21.875rem, 1fr))' }}>
          {/* 演示1：基本列表 */}
          <BasicList />

          {/* 演示2：动态 Todo 列表 */}
          <TodoList />

          {/* 演示3：过滤和排序 */}
          <UserList />

          {/* 演示4：嵌套列表 */}
          <CategoryList />

          {/* 演示5：Key 对比 */}
          <KeyComparison />
        </div>
      </div>

      <div className="demo-container">
        <h3>🔍 关键概念解释</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
            <h4>📝 基本列表渲染</h4>
            <p>使用 map() 方法将数组转换为 JSX：</p>
            <CodeBlock language="typescript" title="列表渲染" showLineNumbers>
{`const fruits = ['Apple', 'Banana', 'Orange']

function FruitList() {
  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={fruit}>{fruit}</li>
      ))}
    </ul>
  )
}`}
            </CodeBlock>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
            <h4>🔑 选择合适的 Key</h4>
            <p>Key 的选择原则：</p>
            <CodeBlock language="typescript" title="Key 的选择" showLineNumbers>
{`// ✅ 最佳：使用唯一 ID
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}

// ⚠️ 谨慎：只在静态列表中使用索引
{staticList.map((item, index) => (
  <div key={index}>{item}</div>
))}

// ❌ 避免：动态列表使用索引
{todos.map((todo, index) => (
  <TodoItem key={index} todo={todo} />
))}

// ❌ 避免：使用随机值
{items.map(item => (
  <Item key={Math.random()} item={item} />
))}`}
            </CodeBlock>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#fefce8', borderRadius: '0.5rem', border: '1px solid #fde047' }}>
            <h4>➕ 列表操作</h4>
            <p>保持不可变性的列表操作：</p>
            <CodeBlock language="typescript" title="列表操作示例" showLineNumbers>
{`const [items, setItems] = useState([])

// 添加
setItems([...items, newItem])          // 末尾
setItems([newItem, ...items])          // 开头

// 删除
setItems(items.filter(item => item.id !== id))

// 更新
setItems(items.map(item => 
  item.id === id 
    ? { ...item, completed: !item.completed } 
    : item
))

// 排序（创建新数组）
setItems([...items].sort((a, b) => a.name.localeCompare(b.name)))`}
            </CodeBlock>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#faf5ff', borderRadius: '0.5rem', border: '1px solid #e9d5ff' }}>
            <h4>🎯 过滤和排序</h4>
            <p>对列表进行过滤和排序：</p>
            <CodeBlock language="typescript" title="过滤排序示例" showLineNumbers>
{`function FilteredList() {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  
  // 先过滤
  const filtered = items.filter(item => {
    if (filter === 'active') return !item.completed
    if (filter === 'completed') return item.completed
    return true
  })
  
  // 再排序
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'date') return b.id - a.id
    return a.name.localeCompare(b.name)
  })
  
  return (
    <div>
      {sorted.map(item => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  )
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
          <li>使用 map() 方法渲染列表</li>
          <li>每个列表项都需要一个唯一的 key 属性</li>
          <li>Key 帮助 React 识别变化，提高渲染性能</li>
          <li>优先使用稳定的唯一标识符（如 ID）作为 key</li>
          <li>避免在动态列表中使用索引作为 key</li>
          <li>列表操作要保持不可变性（创建新数组）</li>
          <li>可以对列表进行过滤、排序等操作</li>
          <li>嵌套列表中，每层都需要自己的 key</li>
        </ol>
      </div>
    </div>
  )
}

export default ListsKeys
