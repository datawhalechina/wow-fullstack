import { useState, ChangeEvent, FormEvent, CSSProperties } from 'react'
import { CodeBlock } from '../components/CodeBlock'

// ============ 样式定义 ============
const styles = {
  demoBox: (borderColor: string, bgColor: string): CSSProperties => ({
    padding: '1.5rem',
    border: `2px solid ${borderColor}`,
    borderRadius: '0.75rem',
    backgroundColor: bgColor,
    marginBottom: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  }),
  button: (bgColor: string): CSSProperties => ({
    padding: '0.625rem 1.25rem',
    backgroundColor: bgColor,
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    marginRight: '0.5rem',
    marginBottom: '0.5rem'
  }),
  input: {
    padding: '0.625rem 0.875rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s'
  } as CSSProperties,
  codeExample: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #e9ecef',
    marginTop: '0.75rem',
    fontFamily: 'monospace',
    fontSize: '0.875rem'
  } as CSSProperties,
  inlineCode: {
    padding: '0.25rem 0.625rem',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    borderRadius: '0.375rem',
    fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
    fontSize: '0.875rem',
    border: '1px solid #e2e8f0',
    fontWeight: '500',
    whiteSpace: 'nowrap' as const
  } as CSSProperties,
  codeBlock: {
    display: 'block' as const,
    marginTop: '0.75rem',
    padding: '0.875rem 1rem',
    backgroundColor: '#1e293b',
    color: '#e2e8f0',
    borderRadius: '0.5rem',
    fontFamily: '"Consolas", "Monaco", "Courier New", monospace',
    fontSize: '0.875rem',
    border: '1px solid #334155',
    overflow: 'auto' as const,
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
  } as CSSProperties
}

// ============ 1. JSX 表达式嵌入演示 ============
const ExpressionDemo = () => {
  const userName = 'React 开发者'
  const age = 25
  const currentTime = new Date().toLocaleTimeString('zh-CN')
  
  const getGreeting = (hour: number) => {
    if (hour < 12) return '早上好'
    if (hour < 18) return '下午好'
    return '晚上好'
  }
  
  const currentHour = new Date().getHours()
  
  return (
    <div style={styles.demoBox('#22c55e', '#f0fdf4')}>
      <h4>🎯 表达式嵌入 - 在 JSX 中使用 JavaScript</h4>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {/* 变量嵌入 */}
        <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
          <p><strong>变量嵌入：</strong>你好，{userName}！</p>
          <code style={styles.codeBlock}>
            {`{userName}`}
          </code>
        </div>
        
        {/* 表达式计算 */}
        <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
          <p><strong>表达式计算：</strong>你今年 {age} 岁，明年 {age + 1} 岁</p>
          <code style={styles.codeBlock}>
            {`{age + 1}`}
          </code>
        </div>
        
        {/* 函数调用 */}
        <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
          <p><strong>函数调用：</strong>{getGreeting(currentHour)}，现在是 {currentTime}</p>
          <code style={styles.codeBlock}>
            {`{getGreeting(currentHour)}`}
          </code>
        </div>
        
        {/* 三元运算符 */}
        <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
          <p><strong>三元运算符：</strong>你是{age >= 18 ? '成年人' : '未成年人'}</p>
          <code style={styles.codeBlock}>
            {`{age >= 18 ? '成年人' : '未成年人'}`}
          </code>
        </div>
      </div>
      
      <div style={styles.codeExample}>
        <strong>💡 提示：</strong>在 JSX 中使用 {`{}`} 可以嵌入任何有效的 JavaScript 表达式
      </div>
    </div>
  )
}

// ============ 2. 条件渲染演示 ============
const ConditionalDemo = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<'admin' | 'user' | 'guest'>('guest')
  const [showAlert, setShowAlert] = useState(true)
  const [messageCount, setMessageCount] = useState(3)
  
  return (
    <div style={styles.demoBox('#3b82f6', '#eff6ff')}>
      <h4>🔀 条件渲染 - 多种方式显示或隐藏内容</h4>
      
      {/* 控制按钮 */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          style={styles.button(isLoggedIn ? '#ef4444' : '#22c55e')}
        >
          {isLoggedIn ? '🚪 退出登录' : '🔑 登录'}
        </button>
        
        <select 
          value={userRole} 
          onChange={(e) => setUserRole(e.target.value as any)}
          style={{ ...styles.input, marginRight: '0.5rem' }}
        >
          <option value="guest">👤 访客</option>
          <option value="user">👨‍💼 用户</option>
          <option value="admin">👑 管理员</option>
        </select>
        
        <button 
          onClick={() => setShowAlert(!showAlert)}
          style={styles.button('#f59e0b')}
        >
          {showAlert ? '隐藏提示' : '显示提示'}
        </button>
        
        <button 
          onClick={() => setMessageCount(prev => prev + 1)}
          style={styles.button('#8b5cf6')}
        >
          新消息 ({messageCount})
        </button>
      </div>

      {/* 示例1: 三元运算符 */}
      <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', marginBottom: '1rem' }}>
        <strong>方式1 - 三元运算符 ( ? : )</strong>
        <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.375rem' }}>
          {isLoggedIn ? (
            <div>
              <p>✅ 欢迎回来！你已登录为 <strong style={{ color: '#3b82f6' }}>{userRole}</strong></p>
            </div>
          ) : (
            <p>❌ 请先登录以查看内容</p>
          )}
        </div>
        <code style={styles.codeBlock}>
          {`{isLoggedIn ? <WelcomeMsg /> : <LoginPrompt />}`}
        </code>
      </div>

      {/* 示例2: 逻辑 && 运算符 */}
      <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', marginBottom: '1rem' }}>
        <strong>方式2 - 逻辑 && 运算符</strong>
        <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.375rem' }}>
          {showAlert && (
            <div style={{ padding: '0.75rem', backgroundColor: '#fef3c7', borderRadius: '0.375rem', border: '1px solid #fbbf24' }}>
              ⚠️ 这是一条重要提示信息！
            </div>
          )}
          
          {messageCount > 0 && (
            <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#dbeafe', borderRadius: '0.375rem' }}>
              📬 你有 <strong>{messageCount}</strong> 条新消息
            </div>
          )}
        </div>
        <code style={styles.codeBlock}>
          {`{showAlert && <Alert />}`}
        </code>
      </div>

      {/* 示例3: 嵌套条件 */}
      <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
        <strong>方式3 - 嵌套条件渲染</strong>
        <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '0.375rem' }}>
          {isLoggedIn && (
            <>
              {userRole === 'admin' && (
                <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '2px solid #ef4444', borderRadius: '0.375rem' }}>
                  👑 管理员权限：可访问所有功能和设置
                </div>
              )}
              {userRole === 'user' && (
                <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '0.375rem' }}>
                  👤 普通用户：可访问基本功能
                </div>
              )}
              {userRole === 'guest' && (
                <div style={{ padding: '0.75rem', backgroundColor: '#fafaf9', border: '2px solid #a8a29e', borderRadius: '0.375rem' }}>
                  👥 访客模式：功能受限
                </div>
              )}
            </>
          )}
        </div>
        <code style={styles.codeBlock}>
          {`{isLoggedIn && userRole === 'admin' && <AdminPanel />}`}
        </code>
      </div>
      
      <div style={styles.codeExample}>
        <strong>💡 注意：</strong>使用 && 运算符时，避免在左侧使用数字 0，因为 0 会被渲染出来
      </div>
    </div>
  )
}

// ============ 3. 列表渲染演示 ============
const ListDemo = () => {
  // 定义数据类型
  type TodoItem = { id: number; text: string; completed: boolean; priority: 'high' | 'medium' | 'low' }
  type Product = { id: number; name: string; price: number; stock: number; category: string }
  
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: '学习 React 基础', completed: true, priority: 'high' },
    { id: 2, text: '理解 JSX 语法', completed: true, priority: 'high' },
    { id: 3, text: '掌握组件通信', completed: false, priority: 'medium' },
    { id: 4, text: '学习 Hooks', completed: false, priority: 'medium' }
  ])
  
  const products: Product[] = [
    { id: 1, name: 'React 实战教程', price: 99, stock: 50, category: '图书' },
    { id: 2, name: 'TypeScript 指南', price: 89, stock: 30, category: '图书' },
    { id: 3, name: '编程键盘', price: 599, stock: 15, category: '硬件' },
    { id: 4, name: '机械鼠标', price: 299, stock: 0, category: '硬件' }
  ]
  
  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }
  
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#22c55e'
      default: return '#6b7280'
    }
  }
  
  return (
    <div style={styles.demoBox('#f59e0b', '#fffbeb')}>
      <h4>📋 列表渲染 - 使用 map() 遍历数组</h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* 示例1: 任务列表（可交互） */}
        <div>
          <h5 style={{ marginBottom: '0.75rem' }}>✅ 任务列表 (可点击切换状态)</h5>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
            {todos.map(todo => (
              <div 
                key={todo.id}
                onClick={() => toggleTodo(todo.id)}
                style={{ 
                  margin: '0.5rem 0',
                  padding: '0.75rem',
                  backgroundColor: todo.completed ? '#f0fdf4' : '#fafafa',
                  border: `2px solid ${todo.completed ? '#22c55e' : '#e5e7eb'}`,
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>
                    {todo.completed ? '✅' : '⬜'}
                  </span>
                  <span style={{ 
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#6b7280' : '#000'
                  }}>
                    {todo.text}
                  </span>
                </div>
                <span style={{ 
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  backgroundColor: getPriorityColor(todo.priority),
                  color: 'white',
                  fontWeight: '600'
                }}>
                  {todo.priority}
                </span>
              </div>
            ))}
            <code style={styles.codeBlock}>
              {`{items.map(item => <div key={item.id}>...</div>)}`}
            </code>
          </div>
        </div>
        
        {/* 示例2: 商品列表 */}
        <div>
          <h5 style={{ marginBottom: '0.75rem' }}>🛍️ 商品列表 (条件样式)</h5>
          <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
            {products.map(product => (
              <div 
                key={product.id}
                style={{ 
                  margin: '0.5rem 0',
                  padding: '0.75rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  backgroundColor: product.stock === 0 ? '#fef2f2' : '#fafafa',
                  opacity: product.stock === 0 ? 0.6 : 1
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                      {product.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {product.category}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#ef4444', fontWeight: '700', fontSize: '1.125rem' }}>
                      ¥{product.price}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: product.stock > 0 ? '#22c55e' : '#ef4444' }}>
                      {product.stock > 0 ? `库存: ${product.stock}` : '已售罄'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <code style={styles.codeBlock}>
              使用条件表达式设置不同样式
            </code>
          </div>
        </div>
      </div>
      
      <div style={styles.codeExample}>
        <strong>💡 重要：</strong>使用 map() 渲染列表时，每个元素必须有唯一的 key 属性，推荐使用稳定的 ID，避免使用索引
      </div>
    </div>
  )
}

// ============ 4. 样式处理演示 ============
const StyleDemo = () => {
  const [isDark, setIsDark] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [borderRadius, setBorderRadius] = useState(8)
  const [primaryColor, setPrimaryColor] = useState('#3b82f6')
  
  // 动态样式对象
  const dynamicStyle: CSSProperties = {
    backgroundColor: isDark ? '#1f2937' : '#f9fafb',
    color: isDark ? '#f9fafb' : '#1f2937',
    fontSize: `${fontSize}px`,
    padding: '1.5rem',
    borderRadius: `${borderRadius}px`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isDark ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
  }
  
  return (
    <div style={styles.demoBox('#8b5cf6', '#faf5ff')}>
      <h4>🎨 样式处理 - 内联样式与动态样式</h4>
      
      {/* 控制面板 */}
      <div style={{ 
        padding: '1.5rem', 
        backgroundColor: 'white', 
        borderRadius: '0.5rem', 
        marginBottom: '1.5rem',
        border: '1px solid #e5e7eb'
      }}>
        <h5 style={{ marginTop: 0, marginBottom: '1rem' }}>⚙️ 样式控制面板</h5>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {/* 字体大小控制 */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              📏 字体大小: {fontSize}px
            </label>
            <input 
              type="range"
              min="12"
              max="32"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              style={{ width: '100%', maxWidth: '20rem' }}
            />
          </div>
          
          {/* 圆角控制 */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              ⭕ 边框圆角: {borderRadius}px
            </label>
            <input 
              type="range"
              min="0"
              max="32"
              value={borderRadius}
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              style={{ width: '100%', maxWidth: '20rem' }}
            />
          </div>
          
          {/* 颜色选择 */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label style={{ fontWeight: '500' }}>🎨 主题色:</label>
            <input 
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              style={{ width: '50px', height: '35px', cursor: 'pointer', border: '2px solid #d1d5db', borderRadius: '0.375rem' }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'].map(color => (
                <button
                  key={color}
                  onClick={() => setPrimaryColor(color)}
                  style={{
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: color,
                    border: primaryColor === color ? '3px solid #000' : '1px solid #ddd',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
          
          {/* 深色模式切换 */}
          <div>
            <button 
              onClick={() => setIsDark(!isDark)}
              style={styles.button(isDark ? '#fbbf24' : '#374151')}
            >
              {isDark ? '🌞 切换到浅色模式' : '🌙 切换到深色模式'}
            </button>
          </div>
        </div>
      </div>
      
      {/* 效果展示区 */}
      <div style={dynamicStyle}>
        <h5 style={{ marginTop: 0 }}>✨ 动态样式效果展示</h5>
        <p style={{ lineHeight: '1.6' }}>
          这是一个完全由 JavaScript 控制的动态样式示例。
          所有样式属性都是通过 state 动态计算的。
        </p>
        <p style={{ lineHeight: '1.6' }}>
          在 JSX 中，样式对象的属性使用<strong>驼峰命名法</strong>，
          例如 <code style={styles.inlineCode}>backgroundColor</code> 而不是 <code style={styles.inlineCode}>background-color</code>。
        </p>
      </div>
      
      <div style={styles.codeExample}>
        <strong>💡 提示：</strong>JSX 样式对象示例：
        <code style={styles.codeBlock}>
{`style={{
  backgroundColor: isDark ? '#333' : '#fff',
  fontSize: \`\${fontSize}px\`,
  borderRadius: '8px'
}}`}
        </code>
      </div>
    </div>
  )
}

// ============ 5. 事件处理演示 ============
const EventDemo = () => {
  const [message, setMessage] = useState('等待用户操作...')
  const [inputValue, setInputValue] = useState('')
  const [clicks, setClicks] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [keyPressed, setKeyPressed] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  
  const handleButtonClick = (buttonName: string, e: React.MouseEvent) => {
    setMessage(`🖱️ 点击了 "${buttonName}" 按钮 (坐标: ${e.clientX}, ${e.clientY})`)
    setClicks(prev => prev + 1)
  }
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setMessage(`✏️ 输入内容: "${e.target.value}"`)
  }
  
  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setMessage(`✅ 表单提交成功: "${inputValue}"`)
      setInputValue('')
    } else {
      setMessage('⚠️ 请输入内容后再提交')
    }
  }
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setKeyPressed(e.key)
    setMessage(`⌨️ 按下了键: "${e.key}" (代码: ${e.keyCode})`)
  }
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({ 
      x: Math.floor(e.clientX - rect.left), 
      y: Math.floor(e.clientY - rect.top) 
    })
  }
  
  const handleDoubleClick = () => {
    setMessage('🖱️ 双击事件触发！')
    setClicks(prev => prev + 2)
  }
  
  return (
    <div style={styles.demoBox('#64748b', '#f8fafc')}>
      <h4>⚡ 事件处理 - 多种用户交互</h4>
      
      {/* 状态显示区 */}
      <div style={{ 
        padding: '1rem', 
        backgroundColor: 'white', 
        borderRadius: '0.5rem', 
        marginBottom: '1.5rem',
        border: '2px solid #e5e7eb'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>总点击次数</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6' }}>{clicks}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>最后按键</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#8b5cf6' }}>
              {keyPressed || '-'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>鼠标位置</div>
            <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#22c55e' }}>
              X: {mousePosition.x}, Y: {mousePosition.y}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f0f9ff', borderRadius: '0.375rem' }}>
          <strong>📢 消息：</strong>{message}
        </div>
      </div>
      
      {/* 点击事件 */}
      <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', marginBottom: '1rem' }}>
        <h5 style={{ marginTop: 0 }}>🖱️ 点击事件 (onClick)</h5>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={(e) => handleButtonClick('红色', e)} style={styles.button('#ef4444')}>
            红色按钮
          </button>
          <button onClick={(e) => handleButtonClick('蓝色', e)} style={styles.button('#3b82f6')}>
            蓝色按钮
          </button>
          <button onClick={(e) => handleButtonClick('绿色', e)} style={styles.button('#22c55e')}>
            绿色按钮
          </button>
          <button onDoubleClick={handleDoubleClick} style={styles.button('#f59e0b')}>
            双击我试试
          </button>
        </div>
        <code style={styles.codeBlock}>
          {`<button onClick={(e) => handleClick(e)}>Click</button>`}
        </code>
      </div>
      
      {/* 输入事件 */}
      <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', marginBottom: '1rem' }}>
        <h5 style={{ marginTop: 0 }}>⌨️ 输入事件 (onChange, onKeyPress)</h5>
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input 
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => {
              setIsFocused(true)
              setMessage('🎯 输入框获得焦点')
            }}
            onBlur={() => {
              setIsFocused(false)
              setMessage('👋 输入框失去焦点')
            }}
            placeholder="输入文字并按回车..."
            style={{ 
              ...styles.input,
              flex: '1',
              minWidth: '200px',
              borderColor: isFocused ? '#3b82f6' : '#d1d5db',
              borderWidth: isFocused ? '2px' : '1px'
            }}
          />
          <button type="submit" style={styles.button('#64748b')}>
            提交
          </button>
        </form>
        <code style={styles.codeBlock}>
          {`<input onChange={(e) => setValue(e.target.value)} />`}
        </code>
      </div>
      
      {/* 鼠标移动事件 */}
      <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
        <h5 style={{ marginTop: 0 }}>🖱️ 鼠标移动 (onMouseMove)</h5>
        <div 
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setMessage('🎯 鼠标进入区域')}
          onMouseLeave={() => setMessage('👋 鼠标离开区域')}
          style={{ 
            height: '150px',
            backgroundColor: '#f0f9ff',
            border: '2px dashed #3b82f6',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'crosshair',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              在这里移动鼠标 🖱️
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              X: {mousePosition.x}px, Y: {mousePosition.y}px
            </div>
          </div>
          {/* 跟随鼠标的点 */}
          <div style={{
            position: 'absolute',
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            width: '10px',
            height: '10px',
            backgroundColor: '#ef4444',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            transition: 'all 0.1s ease'
          }} />
        </div>
        <code style={styles.codeBlock}>
          {`<div onMouseMove={(e) => setPosition({x: e.clientX, y: e.clientY})}>`}
        </code>
      </div>
      
      <div style={styles.codeExample}>
        <strong>💡 提示：</strong>React 事件是合成事件(SyntheticEvent)，跨浏览器兼容。记得使用驼峰命名：onClick, onChange 等
      </div>
    </div>
  )
}

// ============ 6. Fragment 和特殊语法演示 ============
const FragmentDemo = () => {
  type DataItem = { id: number; term: string; description: string }
  
  const glossary: DataItem[] = [
    { id: 1, term: 'JSX', description: 'JavaScript XML，React 的语法扩展' },
    { id: 2, term: 'Component', description: 'React 的基本构建块' },
    { id: 3, term: 'Props', description: '组件之间传递数据的方式' }
  ]
  
  return (
    <div style={styles.demoBox('#ec4899', '#fdf2f8')}>
      <h4>🔷 Fragment - 避免额外 DOM 节点</h4>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {/* Fragment 短语法 */}
        <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
          <h5 style={{ marginTop: 0 }}>方式1: Fragment 短语法 {'<>...</>'}</h5>
          <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.375rem' }}>
            <>
              <p style={{ margin: '0.5rem 0' }}>这是第一个段落</p>
              <p style={{ margin: '0.5rem 0' }}>这是第二个段落</p>
              <p style={{ margin: '0.5rem 0' }}>它们没有被 div 包裹</p>
            </>
          </div>
          <code style={styles.codeBlock}>
            {`<><p>First</p><p>Second</p></>`}
          </code>
        </div>
        
        {/* Fragment 完整语法（带 key） */}
        <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem' }}>
          <h5 style={{ marginTop: 0 }}>方式2: Fragment 完整语法（可以有 key）</h5>
          <dl style={{ margin: 0, padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.375rem' }}>
            {glossary.map(item => (
              // 使用 React.Fragment 可以添加 key 属性
              <div key={item.id} style={{ marginBottom: '1rem' }}>
                <dt style={{ fontWeight: '700', color: '#ec4899', marginBottom: '0.25rem' }}>
                  {item.term}
                </dt>
                <dd style={{ margin: 0, paddingLeft: '1rem', color: '#6b7280' }}>
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>
          <code style={styles.codeBlock}>
            {`<React.Fragment key={item.id}>...</React.Fragment>`}
          </code>
        </div>
      </div>
      
      <div style={styles.codeExample}>
        <strong>💡 说明：</strong>Fragment 让你可以返回多个元素，而不会在 DOM 中添加额外的节点
      </div>
    </div>
  )
}

// ============ 主组件 ============
const JSXIntroduction = () => {
  return (
    <div className="tutorial-section">
      <h2>02 - JSX 语法介绍</h2>
      
      {/* 理论介绍 */}
      <div style={{ 
        marginBottom: '2rem', 
        padding: '1.5rem', 
        backgroundColor: '#f0f9ff', 
        borderRadius: '0.75rem',
        border: '2px solid #0ea5e9'
      }}>
        <h3 style={{ marginTop: 0 }}>📚 什么是 JSX？</h3>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
          <span className="highlight">JSX (JavaScript XML)</span> 是 React 中用于描述用户界面的语法扩展。
          它允许你在 JavaScript 代码中编写类似 HTML 的标记，使得代码更加直观和易于理解。
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔧</div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0284c7' }}>表达式嵌入</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
              使用 {`{}`} 在 JSX 中嵌入 JavaScript 表达式
            </p>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📝</div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0284c7' }}>驼峰命名</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
              属性使用驼峰命名法（className, onClick）
            </p>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔐</div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0284c7' }}>标签闭合</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
              所有标签必须闭合（{`<img />`}, {`<br />`}）
            </p>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎯</div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#0284c7' }}>单一根元素</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>
              JSX 必须有一个根元素或使用 Fragment
            </p>
          </div>
        </div>
      </div>

      {/* 交互式演示 */}
      <div className="interactive-demo">
        <h3 style={{ 
          fontSize: '1.75rem', 
          marginBottom: '1.5rem',
          paddingBottom: '0.75rem',
          borderBottom: '3px solid #e5e7eb'
        }}>
          🎮 交互式演示
        </h3>
        
        <ExpressionDemo />
        <ConditionalDemo />
        <ListDemo />
        <StyleDemo />
        <EventDemo />
        <FragmentDemo />
      </div>

      {/* 代码示例 */}
      <div className="demo-container" style={{ marginTop: '2rem' }}>
        <h3 style={{ 
          fontSize: '1.75rem', 
          marginBottom: '1.5rem',
          paddingBottom: '0.75rem',
          borderBottom: '3px solid #e5e7eb'
        }}>
          💻 常用代码模式
        </h3>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* 表达式嵌入 */}
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f0fdf4', 
            borderRadius: '0.75rem',
            border: '2px solid #22c55e'
          }}>
            <h4 style={{ marginTop: 0, color: '#15803d', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🔧</span> 表达式嵌入
            </h4>
            <p style={{ color: '#166534', marginBottom: '1rem' }}>
              在 JSX 中使用 {`{}`} 嵌入 JavaScript 表达式、变量、函数调用等
            </p>
            <CodeBlock language="typescript">
{`// 变量和表达式
<p>你好，{userName}!</p>
<p>总价: {price * quantity}</p>

// 函数调用
<p>{formatDate(new Date())}</p>

// 三元运算符
<p>{age >= 18 ? '成年' : '未成年'}</p>

// 逻辑运算符
{isLoggedIn && <Dashboard />}
{count > 0 && <Badge count={count} />}`}
            </CodeBlock>
          </div>
          
          {/* 条件渲染 */}
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#eff6ff', 
            borderRadius: '0.75rem',
            border: '2px solid #3b82f6'
          }}>
            <h4 style={{ marginTop: 0, color: '#1e40af', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>⚖️</span> 条件渲染
            </h4>
            <p style={{ color: '#1e3a8a', marginBottom: '1rem' }}>
              使用三元运算符、逻辑运算符或 if 语句实现条件渲染
            </p>
            <CodeBlock language="typescript">
{`// 三元运算符
{isLoggedIn ? <UserPanel /> : <LoginForm />}

// 逻辑 && 运算符
{showWarning && <Warning message="注意" />}

// if 语句（在组件函数中）
if (isLoading) return <Loading />
if (error) return <Error />
return <Content />`}
            </CodeBlock>
          </div>
          
          {/* 列表渲染 */}
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#fffbeb', 
            borderRadius: '0.75rem',
            border: '2px solid #f59e0b'
          }}>
            <h4 style={{ marginTop: 0, color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📋</span> 列表渲染
            </h4>
            <p style={{ color: '#92400e', marginBottom: '1rem' }}>
              使用 map() 方法遍历数组并渲染列表，每个元素必须有唯一的 key
            </p>
            <CodeBlock language="typescript">
{`// 基础列表
{users.map(user => (
  <div key={user.id}>
    {user.name}
  </div>
))}

// 复杂列表
{products.map(product => (
  <ProductCard 
    key={product.id}
    name={product.name}
    price={product.price}
  />
))}`}
            </CodeBlock>
          </div>
          
          {/* 样式处理 */}
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#faf5ff', 
            borderRadius: '0.75rem',
            border: '2px solid #8b5cf6'
          }}>
            <h4 style={{ marginTop: 0, color: '#6b21a8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🎨</span> 样式处理
            </h4>
            <p style={{ color: '#581c87', marginBottom: '1rem' }}>
              使用 style 属性传递对象，或使用 className 引用 CSS 类
            </p>
            <CodeBlock language="typescript">
{`// 内联样式（对象）
<div style={{
  backgroundColor: '#f0f0f0',
  padding: '1rem',
  borderRadius: '8px'
}}>

// 动态样式
<div style={{
  color: isActive ? 'green' : 'gray',
  fontSize: \`\${size}px\`
}}>

// CSS 类名
<div className="container">
<div className={isActive ? 'active' : 'inactive'}>`}
            </CodeBlock>
          </div>
        </div>
      </div>

      {/* 本节重点 */}
      <div style={{ 
        marginTop: '2.5rem', 
        padding: '1.5rem', 
        backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        borderRadius: '0.75rem',
        border: '2px solid #0ea5e9'
      }}>
        <h3 style={{ marginTop: 0, color: '#075985', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🎯</span> 本节重点总结
        </h3>
        <ul style={{ 
          fontSize: '1.05rem', 
          lineHeight: '1.8',
          color: '#0c4a6e',
          margin: 0,
          paddingLeft: '1.5rem'
        }}>
          <li>JSX 是 JavaScript 的语法扩展，让你在 JS 中编写类似 HTML 的代码</li>
          <li>使用 <code style={styles.inlineCode}>{`{}`}</code> 嵌入 JavaScript 表达式、变量和函数调用</li>
          <li>JSX 属性使用驼峰命名法：<code style={styles.inlineCode}>className</code>, <code style={styles.inlineCode}>onClick</code></li>
          <li>所有标签必须正确闭合，包括自闭合标签</li>
          <li>通过三元运算符和 {`&&`} 实现条件渲染</li>
          <li>使用 <code style={styles.inlineCode}>map()</code> 渲染列表，每个元素需要唯一的 <code style={styles.inlineCode}>key</code></li>
          <li>事件处理器使用驼峰命名，传递函数引用而非字符串</li>
          <li>使用 Fragment (<code style={styles.inlineCode}>{`<>...</>`}</code>) 避免额外的 DOM 节点</li>
        </ul>
      </div>
    </div>
  )
}

export default JSXIntroduction