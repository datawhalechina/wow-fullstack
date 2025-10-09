import { useState, ReactNode } from 'react'
import { CodeBlock } from '../components/CodeBlock'

// 演示1：简单的函数组件
const WelcomeMessage = () => {
  return (
    <div style={{ 
      padding: '1rem', 
      backgroundColor: '#dbeafe', 
      borderRadius: '0.375rem',
      marginBottom: '0.5rem'
    }}>
      <h4>👋 欢迎来到 React 世界！</h4>
      <p>这是一个最简单的函数组件，不接收任何 props。</p>
    </div>
  )
}

// 演示2：接收 Props 的组件
interface UserCardProps {
  name: string
  age: number
  role: string
  avatar?: string
}

const UserCard = ({ name, age, role, avatar = '👤' }: UserCardProps) => {
  return (
    <div style={{ 
      padding: '1.5rem', 
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ fontSize: '3rem' }}>{avatar}</div>
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>{name}</h4>
          <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>年龄: {age} 岁</p>
          <p style={{ margin: '0.25rem 0', color: '#6b7280' }}>职位: {role}</p>
        </div>
      </div>
    </div>
  )
}

// 演示3：带有默认值的 Props
interface ButtonProps {
  text: string
  color?: 'blue' | 'green' | 'red' | 'gray'
  size?: 'small' | 'medium' | 'large'
  onClick?: () => void
}

const CustomButton = ({ 
  text, 
  color = 'blue', 
  size = 'medium',
  onClick 
}: ButtonProps) => {
  const colorMap = {
    blue: '#3b82f6',
    green: '#22c55e',
    red: '#ef4444',
    gray: '#6b7280'
  }
  
  const sizeMap = {
    small: { padding: '0.25rem 0.75rem', fontSize: '0.75rem' },
    medium: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    large: { padding: '0.75rem 1.5rem', fontSize: '1rem' }
  }
  
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: colorMap[color],
        color: 'white',
        border: 'none',
        borderRadius: '0.375rem',
        cursor: 'pointer',
        fontWeight: '500',
        margin: '0.25rem',
        ...sizeMap[size]
      }}
    >
      {text}
    </button>
  )
}

// 演示4：Children Props（组件组合）
interface CardProps {
  title: string
  children: ReactNode
  color?: string
}

const Card = ({ title, children, color = '#f0f9ff' }: CardProps) => {
  return (
    <div style={{ 
      border: '1px solid #cbd5e1',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      marginBottom: '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ 
        backgroundColor: color,
        padding: '1rem',
        borderBottom: '1px solid #cbd5e1',
        fontWeight: 'bold'
      }}>
        {title}
      </div>
      <div style={{ padding: '1rem', backgroundColor: 'white' }}>
        {children}
      </div>
    </div>
  )
}

// 演示5：Props 类型验证和复杂 Props
interface ProductProps {
  id: number
  name: string
  price: number
  inStock: boolean
  tags: string[]
  onBuy: (productId: number) => void
}

const Product = ({ id, name, price, inStock, tags, onBuy }: ProductProps) => {
  return (
    <div style={{ 
      padding: '1rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      backgroundColor: inStock ? 'white' : '#f3f4f6',
      marginBottom: '0.75rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>{name}</h4>
          <p style={{ margin: '0.25rem 0', fontSize: '1.25rem', fontWeight: 'bold', color: '#059669' }}>
            ¥{price.toFixed(2)}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            {tags.map((tag, index) => (
              <span 
                key={index}
                style={{ 
                  backgroundColor: '#e0e7ff',
                  color: '#4338ca',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div style={{ marginLeft: '1rem' }}>
          {inStock ? (
            <button
              onClick={() => onBuy(id)}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.875rem'
              }}
            >
              购买
            </button>
          ) : (
            <span style={{ 
              color: '#dc2626',
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}>
              已售罄
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// 演示6：组件的组合和嵌套
interface CommentProps {
  author: string
  text: string
  date: string
  avatar?: string
}

const Comment = ({ author, text, date, avatar = '👤' }: CommentProps) => {
  return (
    <div style={{ 
      display: 'flex',
      gap: '0.75rem',
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb'
    }}>
      <div style={{ fontSize: '2rem' }}>{avatar}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <strong style={{ color: '#1f2937' }}>{author}</strong>
          <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{date}</span>
        </div>
        <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.5' }}>{text}</p>
      </div>
    </div>
  )
}

const CommentList = () => {
  const comments = [
    { author: '张三', text: 'React 真的很好用！Props 让组件之间的数据传递变得很简单。', date: '2分钟前', avatar: '👨' },
    { author: '李四', text: '我刚学会了如何使用 TypeScript 定义 Props 类型，感觉代码更安全了！', date: '10分钟前', avatar: '👩' },
    { author: '王五', text: '组件组合的概念很强大，可以构建复杂的 UI。', date: '1小时前', avatar: '🧑' }
  ]
  
  return (
    <div style={{ 
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      backgroundColor: 'white',
      overflow: 'hidden'
    }}>
      <div style={{ 
        padding: '1rem',
        backgroundColor: '#f9fafb',
        borderBottom: '1px solid #e5e7eb',
        fontWeight: 'bold'
      }}>
        💬 评论列表 ({comments.length})
      </div>
      {comments.map((comment, index) => (
        <Comment key={index} {...comment} />
      ))}
    </div>
  )
}

// 主组件
const ComponentsProps = () => {
  const [message, setMessage] = useState('')
  const [buttonClickCount, setButtonClickCount] = useState<Record<string, number>>({})

  const handleButtonClick = (buttonName: string) => {
    setMessage(`你点击了 ${buttonName} 按钮！`)
    setButtonClickCount(prev => ({
      ...prev,
      [buttonName]: (prev[buttonName] || 0) + 1
    }))
  }

  const handleProductBuy = (productId: number) => {
    setMessage(`你购买了商品 ID: ${productId}`)
  }

  return (
    <div className="tutorial-section">
      <h2>03 - 组件与 Props</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>📚 理论学习</h3>
        <p>
          <span className="highlight">组件（Components）</span>是 React 的核心概念。组件让你可以将 UI 拆分成独立、可复用的部分。
          <span className="highlight">Props（Properties）</span>是组件之间传递数据的方式。
        </p>
        <ul>
          <li><strong>函数组件</strong>：使用 JavaScript 函数定义的组件</li>
          <li><strong>Props 传递</strong>：通过属性将数据从父组件传递给子组件</li>
          <li><strong>Props 是只读的</strong>：组件不能修改自己接收到的 props</li>
          <li><strong>TypeScript 类型定义</strong>：使用接口定义 props 的类型，提供类型安全</li>
          <li><strong>默认值</strong>：可以为 props 提供默认值</li>
          <li><strong>Children</strong>：特殊的 prop，用于传递组件的子元素</li>
        </ul>
      </div>

      <div className="interactive-demo">
        <h3>🎮 交互式演示</h3>
        
        {/* 演示1：简单组件 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ color: '#1f2937', marginBottom: '1rem' }}>1️⃣ 简单的函数组件</h4>
          <WelcomeMessage />
        </div>

        {/* 演示2：Props 传递 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ color: '#1f2937', marginBottom: '1rem' }}>2️⃣ 使用 Props 的用户卡片组件</h4>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(17.5rem, 1fr))' }}>
            <UserCard name="张小明" age={28} role="前端工程师" avatar="👨‍💻" />
            <UserCard name="李小红" age={25} role="UI 设计师" avatar="👩‍🎨" />
            <UserCard name="王大力" age={32} role="产品经理" avatar="👨‍💼" />
          </div>
        </div>

        {/* 演示3：带默认值和回调函数的 Props */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ color: '#1f2937', marginBottom: '1rem' }}>3️⃣ 自定义按钮组件（默认值 + 事件处理）</h4>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f9fafb', 
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <p style={{ marginBottom: '1rem' }}>尝试点击不同的按钮：</p>
            <div style={{ marginBottom: '1rem' }}>
              <CustomButton text="小按钮" size="small" color="blue" onClick={() => handleButtonClick('小蓝色')} />
              <CustomButton text="中等按钮" size="medium" color="green" onClick={() => handleButtonClick('中绿色')} />
              <CustomButton text="大按钮" size="large" color="red" onClick={() => handleButtonClick('大红色')} />
              <CustomButton text="默认按钮" onClick={() => handleButtonClick('默认')} />
            </div>
            {message && (
              <div style={{ 
                padding: '0.75rem',
                backgroundColor: '#dbeafe',
                borderRadius: '0.375rem',
                color: '#1e40af'
              }}>
                📢 {message}
              </div>
            )}
            {Object.keys(buttonClickCount).length > 0 && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                点击统计: {Object.entries(buttonClickCount).map(([key, value]) => `${key}(${value}次)`).join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* 演示4：Children Props */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ color: '#1f2937', marginBottom: '1rem' }}>4️⃣ 组件组合（Children Props）</h4>
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(18.75rem, 1fr))' }}>
            <Card title="📘 知识卡片" color="#dbeafe">
              <p><strong>什么是 Children？</strong></p>
              <p>children 是一个特殊的 prop，代表组件标签之间的内容。它让我们可以像使用 HTML 标签一样嵌套组件。</p>
            </Card>
            
            <Card title="💡 提示" color="#fef3c7">
              <p>使用 children 可以创建更灵活的组件！</p>
              <ul style={{ marginBottom: 0 }}>
                <li>提高代码复用性</li>
                <li>增强组件灵活性</li>
                <li>更符合 HTML 的使用习惯</li>
              </ul>
            </Card>
            
            <Card title="✅ 最佳实践" color="#d1fae5">
              <p>Card 组件可以包含任何内容：</p>
              <CustomButton text="按钮也可以" color="green" size="small" />
              <CustomButton text="放在里面！" color="blue" size="small" />
            </Card>
          </div>
        </div>

        {/* 演示5：复杂 Props */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ color: '#1f2937', marginBottom: '1rem' }}>5️⃣ 复杂 Props（数组、对象、函数）</h4>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f9fafb', 
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb'
          }}>
            <Product
              id={1}
              name="React 完全学习指南"
              price={99.99}
              inStock={true}
              tags={['编程', '前端', '畅销']}
              onBuy={handleProductBuy}
            />
            <Product
              id={2}
              name="TypeScript 实战"
              price={79.99}
              inStock={true}
              tags={['编程', 'TypeScript', '新书']}
              onBuy={handleProductBuy}
            />
            <Product
              id={3}
              name="JavaScript 高级程序设计"
              price={129.99}
              inStock={false}
              tags={['编程', '经典', 'JavaScript']}
              onBuy={handleProductBuy}
            />
          </div>
        </div>

        {/* 演示6：组件嵌套 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ color: '#1f2937', marginBottom: '1rem' }}>6️⃣ 组件的组合与嵌套</h4>
          <CommentList />
        </div>
      </div>

      <div className="demo-container">
        <h3>🔍 关键概念解释</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
            <h4>📦 组件的定义</h4>
            <p>函数组件就是一个返回 JSX 的 JavaScript 函数。</p>
            <CodeBlock language="typescript" title="MyComponent.tsx" showLineNumbers>
{`const MyComponent = () => {
  return <div>Hello World</div>
}`}
            </CodeBlock>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
            <h4>🔗 Props 的类型定义</h4>
            <p>使用 TypeScript 接口定义 props 的类型，可选属性使用 `?`，默认值在函数参数中设置。</p>
            <CodeBlock language="typescript" title="Props 类型定义" showLineNumbers>
{`interface Props {
  name: string        // 必需
  age?: number        // 可选
  onClick: () => void // 函数类型
}`}
            </CodeBlock>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#fefce8', borderRadius: '0.5rem', border: '1px solid #fde047' }}>
            <h4>🔄 Props 的单向数据流</h4>
            <p>Props 是只读的，从父组件流向子组件。子组件不能修改 props，只能通过回调函数通知父组件更新数据。</p>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#faf5ff', borderRadius: '0.5rem', border: '1px solid #e9d5ff' }}>
            <h4>👶 Children Props</h4>
            <p>`children` 是一个特殊的 prop，代表组件开始和结束标签之间的内容。类型通常是 `ReactNode`。</p>
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
          <li>组件是可复用的 UI 构建块，通过 props 接收数据</li>
          <li>Props 使用 TypeScript 接口定义类型，提供类型安全</li>
          <li>Props 是只读的，遵循单向数据流原则</li>
          <li>可以为 props 设置默认值和可选属性</li>
          <li>Children prop 允许组件嵌套，实现更灵活的组合</li>
          <li>回调函数作为 props 传递，实现子组件向父组件的通信</li>
        </ol>
      </div>
    </div>
  )
}

export default ComponentsProps