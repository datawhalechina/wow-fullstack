import { useState } from 'react'
import { CodeBlock, CodeSection } from '../components/CodeBlock'

// 样式常量（避免每次渲染创建新对象）
const CARD_STYLES = {
  success: {
    padding: '1.5rem',
    border: '0.125rem solid #22c55e',
    borderRadius: '0.5rem',
    backgroundColor: '#f0fdf4',
    marginBottom: '1rem'
  } as const,
  info: {
    padding: '1.5rem',
    border: '0.125rem solid #3b82f6',
    borderRadius: '0.5rem',
    backgroundColor: '#eff6ff',
    marginBottom: '1rem'
  } as const,
  warning: {
    padding: '1.5rem',
    border: '0.125rem solid #f59e0b',
    borderRadius: '0.5rem',
    backgroundColor: '#fffbeb',
    marginBottom: '1rem'
  } as const,
  purple: {
    padding: '1.5rem',
    border: '0.125rem solid #8b5cf6',
    borderRadius: '0.5rem',
    backgroundColor: '#faf5ff',
    marginBottom: '1rem'
  } as const,
  cyan: {
    padding: '1.5rem',
    border: '0.125rem solid #06b6d4',
    borderRadius: '0.5rem',
    backgroundColor: '#ecfeff',
    marginBottom: '1rem'
  } as const
}

const BUTTON_STYLES = {
  base: {
    padding: '0.75rem 1.25rem',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  } as const
}

// 演示组件1：什么是组件
const SimpleComponent = () => {
  return (
    <div style={CARD_STYLES.success}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#15803d' }}>🎯 这是一个 React 组件</h4>
      <p style={{ margin: '0.5rem 0', color: '#166534' }}>
        组件是 React 应用的基本构建块，就像乐高积木一样可以组合使用。
      </p>
      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#16a34a' }}>
        ✨ 这个组件是一个简单的函数，返回 JSX（看起来像 HTML 的 JavaScript 扩展）
      </p>
    </div>
  )
}

// 演示组件2：Props 的使用
interface GreetingProps {
  name: string
  age?: number
  hobby?: string
}

const Greeting = ({ name, age, hobby }: GreetingProps) => {
  return (
    <div style={CARD_STYLES.info}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e40af' }}>👋 你好，{name}!</h4>
      {age && <p style={{ margin: '0.25rem 0', color: '#1e40af' }}>🎂 你今年 {age} 岁了</p>}
      {hobby && <p style={{ margin: '0.25rem 0', color: '#1e40af' }}>💖 你喜欢：{hobby}</p>}
      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#3b82f6' }}>
        💡 这个组件通过 <strong>props</strong> 接收数据，就像函数参数一样！
      </p>
    </div>
  )
}

// 演示组件3：State 的使用
const Counter = () => {
  const [count, setCount] = useState(0)
  const [step, setStep] = useState(1)

  return (
    <div style={CARD_STYLES.warning}>
      <h4 style={{ margin: '0 0 1rem 0', color: '#92400e' }}>🔢 计数器演示 (State)</h4>
      
      <div style={{ 
        textAlign: 'center',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        marginBottom: '1rem',
        border: '1px solid #fbbf24'
      }}>
        <p style={{ fontSize: '2.5rem', margin: '0', fontWeight: 'bold', color: '#d97706' }}>
          {count}
        </p>
        <p style={{ fontSize: '0.875rem', margin: '0.5rem 0 0 0', color: '#92400e' }}>
          当前计数
        </p>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#92400e' }}>
          步长: {step}
        </label>
        <input 
          type="range"
          min="1"
          max="10"
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          style={{ width: '100%', maxWidth: '31.25rem' }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          onClick={() => setCount(count - step)}
          style={{ ...BUTTON_STYLES.base, backgroundColor: '#ef4444' }}
        >
          -{step}
        </button>
        <button 
          onClick={() => setCount(0)}
          style={{ ...BUTTON_STYLES.base, backgroundColor: '#6b7280' }}
        >
          重置
        </button>
        <button 
          onClick={() => setCount(count + step)}
          style={{ ...BUTTON_STYLES.base, backgroundColor: '#22c55e' }}
        >
          +{step}
        </button>
      </div>

      <p style={{ margin: '1rem 0 0 0', fontSize: '0.875rem', color: '#92400e', textAlign: 'center' }}>
        💡 <strong>State</strong> 是组件的内部数据，当它改变时，组件会自动重新渲染！
      </p>
    </div>
  )
}

// 演示组件4：声明式 vs 命令式
const DeclarativeDemo = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [bgColor, setBgColor] = useState('#eff6ff')

  const colors = [
    { name: '蓝色', value: '#eff6ff', border: '#3b82f6' },
    { name: '绿色', value: '#f0fdf4', border: '#22c55e' },
    { name: '紫色', value: '#faf5ff', border: '#a855f7' },
    { name: '粉色', value: '#fdf2f8', border: '#ec4899' }
  ]

  return (
    <div style={CARD_STYLES.purple}>
      <h4 style={{ margin: '0 0 1rem 0', color: '#6b21a8' }}>🎭 声明式编程演示</h4>
      
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => setIsVisible(!isVisible)}
          style={{ 
            ...BUTTON_STYLES.base, 
            backgroundColor: '#8b5cf6',
            marginRight: '0.5rem'
          }}
        >
          {isVisible ? '隐藏' : '显示'} 内容
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ marginBottom: '0.5rem', fontWeight: 'bold', color: '#6b21a8' }}>选择背景颜色：</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {colors.map(color => (
            <button
              key={color.value}
              onClick={() => setBgColor(color.value)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: color.value,
                color: '#374151',
                border: `0.125rem solid ${bgColor === color.value ? color.border : '#d1d5db'}`,
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontWeight: bgColor === color.value ? 'bold' : 'normal',
                fontSize: '0.875rem'
              }}
            >
              {color.name}
            </button>
          ))}
        </div>
      </div>
      
      {isVisible && (
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: bgColor, 
          borderRadius: '0.5rem',
          border: '0.125rem solid #8b5cf6',
          transition: 'all 0.3s ease'
        }}>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#6b21a8' }}>
            ✨ 这是声明式的条件渲染！
          </p>
          <p style={{ margin: '0', color: '#7c3aed' }}>
            我们只需要描述"<em>如果 isVisible 为 true，就显示这个内容</em>"，
            React 会自动处理 DOM 的显示和隐藏。
          </p>
        </div>
      )}

      <p style={{ margin: '1rem 0 0 0', fontSize: '0.875rem', color: '#7c3aed' }}>
        💡 <strong>声明式</strong>：我们描述"要什么"，React 负责"怎么做"
      </p>
    </div>
  )
}

// 演示组件5：组件组合
interface TodoItemProps {
  text: string
  completed: boolean
  onToggle: () => void
}

const TodoItem = ({ text, completed, onToggle }: TodoItemProps) => {
  return (
    <div 
      onClick={onToggle}
      style={{
        padding: '0.75rem',
        backgroundColor: completed ? '#f0fdf4' : 'white',
        border: `1px solid ${completed ? '#22c55e' : '#e5e7eb'}`,
        borderRadius: '0.375rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        transition: 'all 0.2s'
      }}
    >
      <span style={{ 
        fontSize: '1.25rem',
        filter: completed ? 'grayscale(0%)' : 'grayscale(100%)'
      }}>
        {completed ? '✅' : '⬜'}
      </span>
      <span style={{
        flex: 1,
        textDecoration: completed ? 'line-through' : 'none',
        color: completed ? '#16a34a' : '#374151'
      }}>
        {text}
      </span>
    </div>
  )
}

const TodoList = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 React 基础概念', completed: true },
    { id: 2, text: '理解组件、Props 和 State', completed: false },
    { id: 3, text: '掌握声明式编程', completed: false }
  ])

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const completedCount = todos.filter(t => t.completed).length

  return (
    <div style={CARD_STYLES.cyan}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h4 style={{ margin: 0, color: '#0e7490' }}>📝 学习任务列表</h4>
        <span style={{ 
          padding: '0.25rem 0.75rem',
          backgroundColor: '#06b6d4',
          color: 'white',
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
          fontWeight: 'bold'
        }}>
          {completedCount}/{todos.length} 完成
        </span>
      </div>
      
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            text={todo.text}
            completed={todo.completed}
            onToggle={() => toggleTodo(todo.id)}
          />
        ))}
      </div>

      <p style={{ margin: '1rem 0 0 0', fontSize: '0.875rem', color: '#0e7490' }}>
        💡 这个列表展示了<strong>组件组合</strong>：TodoList 组件使用了多个 TodoItem 组件
      </p>
    </div>
  )
}

// 主组件
const BasicConcepts = () => {
  const [currentName, setCurrentName] = useState('React 学习者')
  const [currentAge, setCurrentAge] = useState(25)
  const [currentHobby, setCurrentHobby] = useState('编程')

  return (
    <div className="tutorial-section">
      <h2>01 - React 基础概念</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>📚 什么是 React？</h3>
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#f9fafb', 
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
          marginBottom: '1rem'
        }}>
          <p style={{ margin: '0 0 1rem 0', fontSize: '1.125rem' }}>
            <strong>React</strong> 是一个用于构建用户界面的 JavaScript 库，
            由 Facebook（现 Meta）开发并维护。它让构建交互式的 Web 应用变得简单而高效。
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'white', 
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>🧩 组件化</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                将 UI 拆分成独立、可复用的组件，就像搭积木一样构建应用
              </p>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'white', 
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>✨ 声明式</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                描述你想要什么，而不是如何实现，让代码更容易理解和维护
              </p>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'white', 
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>⚡ 高效</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                使用 Virtual DOM 技术，智能地更新页面，提供流畅的用户体验
              </p>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'white', 
              borderRadius: '0.375rem',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>🔄 单向数据流</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                数据从父组件流向子组件，使应用更容易理解和调试
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="interactive-demo">
        <h3>🎮 交互式演示</h3>
        
        {/* 个性化输入区域 */}
        <div style={{ 
          padding: '1.5rem', 
          backgroundColor: '#faf5ff', 
          borderRadius: '0.5rem',
          border: '2px solid #a855f7',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#7c3aed' }}>🎨 自定义你的信息</h4>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#7c3aed' }}>
                你的名字:
              </label>
              <input 
                type="text"
                value={currentName}
                onChange={(e) => setCurrentName(e.target.value)}
                style={{ 
                  padding: '0.5rem 0.75rem', 
                  borderRadius: '0.375rem', 
                  border: '2px solid #a855f7',
                  fontSize: '0.875rem'
                }}
                placeholder="输入名字..."
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#7c3aed' }}>
                你的年龄: {currentAge}
              </label>
              <input 
                type="range"
                min="1"
                max="100"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                style={{ width: '100%', maxWidth: '31.25rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#7c3aed' }}>
                你的爱好:
              </label>
              <input 
                type="text"
                value={currentHobby}
                onChange={(e) => setCurrentHobby(e.target.value)}
                style={{ 
                  padding: '0.5rem 0.75rem', 
                  borderRadius: '0.375rem', 
                  border: '2px solid #a855f7',
                  fontSize: '0.875rem'
                }}
                placeholder="输入爱好..."
              />
            </div>
          </div>
        </div>

        {/* 演示组件展示 */}
        <div style={{ display: 'grid', gap: '1rem' }}>
          <SimpleComponent />
          
          <Greeting name={currentName} age={currentAge} hobby={currentHobby} />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <Counter />
            <DeclarativeDemo />
          </div>

          <TodoList />
        </div>
      </div>

      <div className="demo-container">
        <h3>🔍 核心概念详解</h3>
        
        <CodeSection title="组件 (Components)" icon="📦" backgroundColor="#f0fdf4">
          <p>组件是 React 的核心。每个组件都是一个独立的 JavaScript 函数，返回要渲染的内容。</p>
          <CodeBlock language="typescript" title="组件示例" showLineNumbers>
{`// 最简单的组件
const Welcome = () => {
  return <h1>Hello, React!</h1>
}

// 接收 props 的组件
interface Props {
  name: string
  age: number
}

const UserCard = ({ name, age }: Props) => {
  return (
    <div>
      <h2>{name}</h2>
      <p>年龄: {age}</p>
    </div>
  )
}

// 使用组件
<UserCard name="张三" age={25} />`}
          </CodeBlock>
        </CodeSection>
        
        <CodeSection title="Props (属性)" icon="🔗" backgroundColor="#f0f9ff">
          <p>Props 是组件之间传递数据的方式，就像函数参数一样。Props 是只读的，子组件不能修改它。</p>
          <CodeBlock language="typescript" title="Props 使用示例" showLineNumbers>
{`// 定义 Props 类型
interface ButtonProps {
  text: string
  color?: string  // 可选属性
  onClick: () => void
}

// 使用 Props，并提供默认值
const Button = ({ 
  text, 
  color = 'blue',  // 默认值
  onClick 
}: ButtonProps) => {
  return (
    <button 
      onClick={onClick}
      style={{ backgroundColor: color }}
    >
      {text}
    </button>
  )
}

// 传递 Props
<Button 
  text="点击我" 
  color="red" 
  onClick={() => console.log('Clicked!')} 
/>`}
          </CodeBlock>
        </CodeSection>
        
        <CodeSection title="State (状态)" icon="📊" backgroundColor="#fefce8">
          <p>State 是组件的内部数据。当 state 改变时，React 会自动重新渲染组件。</p>
          <CodeBlock language="typescript" title="State 使用示例" showLineNumbers>
{`import { useState } from 'react'

const Counter = () => {
  // 声明状态: [当前值, 更新函数] = useState(初始值)
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>当前: {count}</p>
      {/* 点击按钮更新 state */}
      <button onClick={() => setCount(count + 1)}>
        增加
      </button>
    </div>
  )
}

// 对象状态
const [user, setUser] = useState({
  name: '张三',
  age: 25
})

// 更新对象状态（保持不可变性）
setUser({ ...user, age: 26 })`}
          </CodeBlock>
        </CodeSection>
        
        <CodeSection title="声明式编程" icon="🎭" backgroundColor="#faf5ff">
          <p>声明式编程让我们描述"要什么"，而不是"怎么做"。React 会自动处理 DOM 更新。</p>
          <CodeBlock language="typescript" title="声明式 vs 命令式" showLineNumbers>
{`// ❌ 命令式（传统 DOM 操作）
const button = document.createElement('button')
button.textContent = '点击'
button.onclick = () => {
  const div = document.getElementById('message')
  div.style.display = 'block'
  div.textContent = '已点击'
}
document.body.appendChild(button)

// ✅ 声明式（React）
const [clicked, setClicked] = useState(false)

return (
  <div>
    <button onClick={() => setClicked(true)}>
      点击
    </button>
    {clicked && <div>已点击</div>}
  </div>
)

// React 自动处理 DOM 更新，代码更清晰！`}
          </CodeBlock>
        </CodeSection>

        <CodeSection title="Virtual DOM" icon="🌲" backgroundColor="#ecfeff">
          <p>React 使用 Virtual DOM 提高性能。它是真实 DOM 的轻量级副本，存在于内存中。</p>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'white', 
            borderRadius: '0.375rem',
            border: '1px solid #e5e7eb',
            marginBottom: '1rem'
          }}>
            <h5 style={{ margin: '0 0 0.5rem 0' }}>工作流程：</h5>
            <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
              <li><strong>状态改变</strong> → React 创建新的 Virtual DOM 树</li>
              <li><strong>Diff 算法</strong> → 比较新旧 Virtual DOM，找出差异</li>
              <li><strong>最小化更新</strong> → 只更新实际改变的 DOM 节点</li>
              <li><strong>批量处理</strong> → 合并多次更新，减少重绘次数</li>
            </ol>
          </div>
          <CodeBlock language="typescript" title="为什么需要 Virtual DOM？" showLineNumbers>
{`// 问题：直接操作 DOM 很慢
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div')
  div.textContent = 'Item ' + i
  document.body.appendChild(div)  // 每次都触发重排！
}

// 解决：Virtual DOM 批量更新
const items = Array.from({ length: 1000 }, (_, i) => (
  <div key={i}>Item {i}</div>
))

// React 智能地批量更新真实 DOM
return <div>{items}</div>`}
          </CodeBlock>
        </CodeSection>
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        backgroundColor: '#f0f9ff', 
        borderRadius: '0.5rem',
        border: '2px solid #0ea5e9'
      }}>
        <h3 style={{ marginTop: 0 }}>🎯 本节重点总结</h3>
        <div style={{ 
          display: 'grid', 
          gap: '0.75rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
        }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'white', 
            borderRadius: '0.375rem',
            border: '1px solid #bae6fd'
          }}>
            <strong style={{ color: '#0369a1' }}>📦 组件</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#0c4a6e' }}>
              React 应用由组件构成，组件是可复用的 UI 构建块
            </p>
          </div>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'white', 
            borderRadius: '0.375rem',
            border: '1px solid #bae6fd'
          }}>
            <strong style={{ color: '#0369a1' }}>🔗 Props</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#0c4a6e' }}>
              Props 用于组件间传递数据，是只读的
            </p>
          </div>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'white', 
            borderRadius: '0.375rem',
            border: '1px solid #bae6fd'
          }}>
            <strong style={{ color: '#0369a1' }}>📊 State</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#0c4a6e' }}>
              State 是组件的内部数据，改变时触发重新渲染
            </p>
          </div>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'white', 
            borderRadius: '0.375rem',
            border: '1px solid #bae6fd'
          }}>
            <strong style={{ color: '#0369a1' }}>✨ 声明式</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#0c4a6e' }}>
              描述"要什么"而不是"怎么做"，让代码更简洁
            </p>
          </div>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'white', 
            borderRadius: '0.375rem',
            border: '1px solid #bae6fd'
          }}>
            <strong style={{ color: '#0369a1' }}>🌲 Virtual DOM</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#0c4a6e' }}>
              通过 Diff 算法智能更新，提高性能
            </p>
          </div>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: 'white', 
            borderRadius: '0.375rem',
            border: '1px solid #bae6fd'
          }}>
            <strong style={{ color: '#0369a1' }}>🔄 单向数据流</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#0c4a6e' }}>
              数据从父组件流向子组件，使应用易于理解
            </p>
          </div>
        </div>
      </div>

      <div style={{ 
        marginTop: '1.5rem', 
        padding: '1rem', 
        backgroundColor: '#fef3c7', 
        borderRadius: '0.5rem',
        border: '1px solid #f59e0b'
      }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#92400e' }}>💡 学习建议</h4>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#92400e' }}>
          <li>多动手实践，修改上面的示例代码，观察效果</li>
          <li>理解组件、Props 和 State 的区别和联系</li>
          <li>尝试创建自己的简单组件</li>
          <li>下一节我们将学习 JSX 语法，让你更好地编写 React 代码</li>
        </ul>
      </div>
    </div>
  )
}

export default BasicConcepts
