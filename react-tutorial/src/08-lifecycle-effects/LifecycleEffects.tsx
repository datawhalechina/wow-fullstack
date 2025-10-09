import { useState, useEffect } from 'react'
import { CodeBlock } from '../components/CodeBlock'

// 样式常量（避免每次渲染创建新对象）
const DEMO_STYLES = {
  container: {
    padding: '1.5rem',
    borderRadius: '0.5rem',
    border: '1px solid'
  } as const,
  button: {
    padding: '0.5rem 1rem',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600'
  } as const
}

// 演示1：基本 useEffect
const BasicEffect = () => {
  const [count, setCount] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [isClearing, setIsClearing] = useState(false)

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // 仅首次渲染后执行
  useEffect(() => {
    addLog('✅ 组件挂载 (只执行一次)')
    
    return () => {
      addLog('❌ 组件卸载')
    }
  }, [])

  // count 改变时执行
  useEffect(() => {
    if (count > 0) {
      addLog(`🔄 count 改变为: ${count}`)
    }
  }, [count])

  // 当 isClearing 变为 false 时重置
  useEffect(() => {
    if (isClearing) {
      setIsClearing(false)
    }
  }, [isClearing])

  const handleIncrement = () => {
    setCount(prevCount => prevCount + 1)
  }

  const handleClearLogs = () => {
    setIsClearing(true)
    setLogs([])
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#f0f9ff', 
      borderRadius: '0.5rem',
      border: '1px solid #0ea5e9'
    }}>
      <h4>🎯 基本 useEffect</h4>
      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
        观察不同依赖数组的执行时机
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ 
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#0ea5e9'
        }}>
          Count: {count}
        </div>
        <button 
          onClick={handleIncrement}
          style={{ 
            ...DEMO_STYLES.button,
            backgroundColor: '#3b82f6',
            marginRight: '0.5rem'
          }}
        >
          增加
        </button>
        <button 
          onClick={handleClearLogs}
          style={{ ...DEMO_STYLES.button, backgroundColor: '#6b7280' }}
        >
          清空日志
        </button>
      </div>

      {/* 日志显示 */}
      <div style={{ 
        backgroundColor: '#1e293b',
        borderRadius: '0.375rem',
        padding: '1rem',
        maxHeight: '12.5rem',
        overflowY: 'auto',
        fontFamily: 'monospace',
        fontSize: '0.75rem'
      }}>
        {logs.length === 0 ? (
          <div style={{ color: '#64748b', textAlign: 'center' }}>
            暂无日志
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} style={{ 
              color: '#e2e8f0',
              marginBottom: '0.25rem',
              padding: '0.25rem',
              borderLeft: '0.125rem solid #3b82f6'
            }}>
              {log}
            </div>
          ))
        )}
      </div>

      <div style={{ 
        marginTop: '0.75rem',
        padding: '0.75rem',
        backgroundColor: '#dbeafe',
        borderRadius: '0.375rem',
        fontSize: '0.75rem',
        color: '#1e40af'
      }}>
        💡 提示：
        <ul style={{ margin: '0.5rem 0 0 1.5rem', paddingLeft: 0 }}>
          <li>✅ 组件挂载时执行一次（空依赖数组 <code>[]</code>）</li>
          <li>🔄 count 改变时执行（依赖数组 <code>[count]</code>）</li>
          <li>点击"增加"按钮观察执行时机</li>
        </ul>
      </div>
    </div>
  )
}

// 演示2：清理副作用（定时器）
const TimerEffect = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)

    // 清理函数：清除定时器
    return () => {
      clearInterval(interval)
    }
  }, [isRunning])

  const reset = () => {
    setIsRunning(false)
    setSeconds(0)
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#f0fdf4', 
      borderRadius: '0.5rem',
      border: '1px solid #22c55e'
    }}>
      <h4>⏱️ 清理副作用 - 定时器</h4>
      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
        演示定时器的设置和清理
      </p>

      <div style={{ 
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#d1fae5',
        borderRadius: '0.5rem',
        marginBottom: '1rem'
      }}>
        <div style={{ 
          fontSize: '3rem',
          fontWeight: 'bold',
          color: '#065f46',
          fontFamily: 'monospace'
        }}>
          {String(Math.floor(seconds / 60)).padStart(2, '0')}:
          {String(seconds % 60).padStart(2, '0')}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button 
          onClick={() => setIsRunning(!isRunning)}
          style={{ 
            padding: '0.75rem 1.5rem',
            backgroundColor: isRunning ? '#f59e0b' : '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}
        >
          {isRunning ? '暂停' : '开始'}
        </button>
        <button 
          onClick={reset}
          style={{ 
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}
        >
          重置
        </button>
      </div>

      <div style={{ 
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: '#ecfdf5',
        borderRadius: '0.375rem',
        fontSize: '0.75rem',
        color: '#065f46'
      }}>
        ✅ useEffect 返回的清理函数会在组件卸载或下次 effect 执行前调用
      </div>
    </div>
  )
}

// 演示3：事件监听
const EventListenerEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isTracking, setIsTracking] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  // 鼠标移动监听
  useEffect(() => {
    if (!isTracking) return

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    // 清理：移除事件监听
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [isTracking])

  // 点击计数
  useEffect(() => {
    if (!isTracking) return

    const handleClick = () => {
      setClickCount(c => c + 1)
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [isTracking])

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#fef3c7', 
      borderRadius: '0.5rem',
      border: '1px solid #f59e0b'
    }}>
      <h4>🖱️ 事件监听</h4>
      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
        添加和移除事件监听器
      </p>

      <button 
        onClick={() => {
          setIsTracking(!isTracking)
          if (isTracking) {
            setClickCount(0)
          }
        }}
        style={{ 
          padding: '0.75rem 1.5rem',
          backgroundColor: isTracking ? '#ef4444' : '#f59e0b',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '0.875rem',
          marginBottom: '1rem'
        }}
      >
        {isTracking ? '停止追踪' : '开始追踪'}
      </button>

      {isTracking && (
        <div>
          <div style={{ 
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #fbbf24',
            marginBottom: '0.75rem'
          }}>
            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <strong>鼠标位置:</strong>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              X: {mousePosition.x}px, Y: {mousePosition.y}px
            </div>
          </div>

          <div style={{ 
            padding: '1rem',
            backgroundColor: 'white',
            borderRadius: '0.375rem',
            border: '1px solid #fbbf24'
          }}>
            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <strong>点击次数:</strong>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {clickCount}
            </div>
          </div>

          <div style={{ 
            marginTop: '0.75rem',
            padding: '0.75rem',
            backgroundColor: '#fffbeb',
            borderRadius: '0.375rem',
            fontSize: '0.75rem',
            color: '#92400e'
          }}>
            💡 移动鼠标和点击页面试试！
          </div>
        </div>
      )}
    </div>
  )
}

// 演示4：数据获取
const DataFetchingEffect = () => {
  interface Post {
    id: number
    title: string
    body: string
  }

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [postId, setPostId] = useState(1)

  useEffect(() => {
    // 使用 AbortController 处理组件卸载时的清理
    const abortController = new AbortController()
    
    const fetchData = async () => {
      setLoading(true)
      setError('')
      
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_limit=3&_page=${postId}`,
          { signal: abortController.signal }
        )
        
        if (!response.ok) {
          throw new Error('Failed to fetch')
        }
        
        const data = await response.json()
        setPosts(data)
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || '获取数据失败')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // 清理：中止请求
    return () => {
      abortController.abort()
    }
  }, [postId])

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#fae8ff', 
      borderRadius: '0.5rem',
      border: '1px solid #a855f7'
    }}>
      <h4>📡 数据获取</h4>
      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
        从 API 获取数据 + 加载状态 + 错误处理
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button 
          onClick={() => setPostId(Math.max(1, postId - 1))}
          disabled={loading || postId === 1}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: postId === 1 ? '#d1d5db' : '#a855f7',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: postId === 1 ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem'
          }}
        >
          ← 上一页
        </button>
        <button 
          onClick={() => setPostId(postId + 1)}
          disabled={loading}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: loading ? '#d1d5db' : '#a855f7',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '0.875rem'
          }}
        >
          下一页 →
        </button>
        <div style={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.875rem',
          fontWeight: 'bold',
          color: '#6b7280'
        }}>
          页码: {postId}
        </div>
      </div>

      {loading && (
        <div style={{ 
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#f5f3ff',
          borderRadius: '0.375rem',
          border: '1px dashed #a855f7'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏳</div>
          <div style={{ color: '#7c3aed', fontWeight: 'bold' }}>加载中...</div>
        </div>
      )}

      {error && (
        <div style={{ 
          padding: '1rem',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '0.375rem',
          border: '1px solid #ef4444',
          fontSize: '0.875rem'
        }}>
          ❌ 错误: {error}
        </div>
      )}

      {!loading && !error && posts.length > 0 && (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {posts.map(post => (
            <div 
              key={post.id}
              style={{ 
                padding: '1rem',
                backgroundColor: 'white',
                borderRadius: '0.375rem',
                border: '1px solid #e9d5ff'
              }}
            >
              <h5 style={{ 
                margin: '0 0 0.5rem 0',
                fontSize: '0.95rem',
                color: '#7c3aed'
              }}>
                #{post.id} - {post.title}
              </h5>
              <p style={{ 
                margin: 0,
                fontSize: '0.8rem',
                color: '#6b7280',
                lineHeight: 1.5
              }}>
                {post.body.slice(0, 100)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// 演示5：文档标题同步
const DocumentTitleEffect = () => {
  const [title, setTitle] = useState('React 教程')
  const [updateTitle, setUpdateTitle] = useState(false)

  useEffect(() => {
    if (updateTitle) {
      document.title = title
    }

    // 清理：恢复默认标题
    return () => {
      if (updateTitle) {
        document.title = 'React Tutorial'
      }
    }
  }, [title, updateTitle])

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#eff6ff', 
      borderRadius: '0.5rem',
      border: '1px solid #3b82f6'
    }}>
      <h4>📄 文档标题同步</h4>
      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
        使用 useEffect 修改页面标题
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '0.75rem',
          cursor: 'pointer'
        }}>
          <input 
            type="checkbox"
            checked={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
            启用标题同步
          </span>
        </label>

        <input 
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入新标题"
          disabled={!updateTitle}
          style={{ 
            maxWidth: '31.25rem',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            opacity: updateTitle ? 1 : 0.5
          }}
        />
      </div>

      <div style={{ 
        padding: '1rem',
        backgroundColor: updateTitle ? '#dbeafe' : '#f3f4f6',
        borderRadius: '0.375rem',
        border: `1px solid ${updateTitle ? '#3b82f6' : '#d1d5db'}`,
        fontSize: '0.875rem'
      }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>当前浏览器标题:</strong>
        </div>
        <div style={{ 
          fontFamily: 'monospace',
          color: updateTitle ? '#1e40af' : '#6b7280',
          fontWeight: 'bold'
        }}>
          {updateTitle ? title : '(未启用同步)'}
        </div>
      </div>

      <div style={{ 
        marginTop: '0.75rem',
        padding: '0.75rem',
        backgroundColor: '#f0f9ff',
        borderRadius: '0.375rem',
        fontSize: '0.75rem',
        color: '#1e40af'
      }}>
        💡 勾选复选框并修改输入框，查看浏览器标签页标题的变化！
      </div>
    </div>
  )
}

// 演示6：LocalStorage 同步
const LocalStorageEffect = () => {
  const [name, setName] = useState(() => {
    // 从 localStorage 读取初始值
    const saved = localStorage.getItem('userName')
    return saved || ''
  })

  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('userPreferences')
    return saved ? JSON.parse(saved) : { darkMode: false, notifications: true }
  })

  // 同步 name 到 localStorage
  useEffect(() => {
    localStorage.setItem('userName', name)
  }, [name])

  // 同步 preferences 到 localStorage
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences))
  }, [preferences])

  const clearAll = () => {
    setName('')
    setPreferences({ darkMode: false, notifications: true })
    localStorage.removeItem('userName')
    localStorage.removeItem('userPreferences')
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#fef2f2', 
      borderRadius: '0.5rem',
      border: '1px solid #ef4444'
    }}>
      <h4>💾 LocalStorage 同步</h4>
      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
        自动保存数据到 localStorage
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {/* 用户名 */}
        <div>
          <label style={{ 
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            用户名:
          </label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入你的名字"
            style={{ 
              maxWidth: '31.25rem',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem'
            }}
          />
        </div>

        {/* 偏好设置 */}
        <div>
          <div style={{ 
            fontSize: '0.875rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            偏好设置:
          </div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}>
              <input 
                type="checkbox"
                checked={preferences.darkMode}
                onChange={(e) => setPreferences({
                  ...preferences,
                  darkMode: e.target.checked
                })}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.875rem' }}>深色模式</span>
            </label>
            <label style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}>
              <input 
                type="checkbox"
                checked={preferences.notifications}
                onChange={(e) => setPreferences({
                  ...preferences,
                  notifications: e.target.checked
                })}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.875rem' }}>通知</span>
            </label>
          </div>
        </div>

        {/* 显示存储的数据 */}
        <div style={{ 
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.375rem',
          border: '1px solid #fecaca'
        }}>
          <div style={{ 
            fontSize: '0.875rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem'
          }}>
            localStorage 中的数据:
          </div>
          <pre style={{ 
            margin: 0,
            fontSize: '0.75rem',
            color: '#6b7280',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap'
          }}>
            {JSON.stringify({
              userName: name,
              userPreferences: preferences
            }, null, 2)}
          </pre>
        </div>

        <button 
          onClick={clearAll}
          style={{ 
            padding: '0.75rem',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}
        >
          清空所有数据
        </button>

        <div style={{ 
          padding: '0.75rem',
          backgroundColor: '#fff5f5',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
          color: '#991b1b'
        }}>
          💡 刷新页面，数据仍然存在！
        </div>
      </div>
    </div>
  )
}

// 主组件
const LifecycleEffects = () => {
  return (
    <div className="tutorial-section">
      <h2>08 - 生命周期与副作用</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>📚 理论学习</h3>
        <p>
          <span className="highlight">useEffect</span> 是 React 中用于处理副作用的 Hook。
          副作用是指那些在渲染过程之外进行的操作，如数据获取、订阅、手动修改 DOM 等。
        </p>
        <ul>
          <li><strong>副作用</strong>：渲染之外的操作（API 调用、订阅、定时器等）</li>
          <li><strong>依赖数组</strong>：控制 effect 何时执行</li>
          <li><strong>清理函数</strong>：清理副作用，防止内存泄漏</li>
          <li><strong>执行时机</strong>：渲染完成后执行</li>
          <li><strong>常见用途</strong>：数据获取、事件监听、订阅管理</li>
        </ul>
      </div>

      <div className="interactive-demo">
        <h3>🎮 交互式演示</h3>
        
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
          {/* 演示1：基本 useEffect */}
          <BasicEffect />

          {/* 演示2：定时器 */}
          <TimerEffect />

          {/* 演示3：事件监听 */}
          <EventListenerEffect />

          {/* 演示4：数据获取 */}
          <DataFetchingEffect />

          {/* 演示5：文档标题 */}
          <DocumentTitleEffect />

          {/* 演示6：localStorage */}
          <LocalStorageEffect />
        </div>
      </div>

      <div className="demo-container">
        <h3>🔍 关键概念解释</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
            <h4>📝 基本用法</h4>
            <p>useEffect 接收两个参数：</p>
            <CodeBlock language="typescript" title="useEffect 基本语法" showLineNumbers>
{`useEffect(() => {
  // 副作用代码
  console.log('Effect runs')
  
  // 可选：返回清理函数
  return () => {
    console.log('Cleanup runs')
  }
}, [/* 依赖数组 */])`}
            </CodeBlock>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
            <h4>🎯 依赖数组</h4>
            <p>控制 effect 的执行时机：</p>
            <CodeBlock language="typescript" title="不同的依赖数组" showLineNumbers>
{`// 每次渲染后都执行
useEffect(() => {
  console.log('Runs after every render')
})

// 仅首次渲染后执行
useEffect(() => {
  console.log('Runs only once')
}, [])

// 当依赖改变时执行
useEffect(() => {
  console.log('Runs when count changes')
}, [count])`}
            </CodeBlock>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#fefce8', borderRadius: '0.5rem', border: '1px solid #fde047' }}>
            <h4>🧹 清理函数</h4>
            <p>清理副作用，避免内存泄漏：</p>
            <CodeBlock language="typescript" title="清理副作用示例" showLineNumbers>
{`// 清理定时器
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick')
  }, 1000)
  
  return () => clearInterval(timer)
}, [])

// 清理事件监听
useEffect(() => {
  const handler = () => console.log('Resize')
  window.addEventListener('resize', handler)
  
  return () => {
    window.removeEventListener('resize', handler)
  }
}, [])`}
            </CodeBlock>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#faf5ff', borderRadius: '0.5rem', border: '1px solid #e9d5ff' }}>
            <h4>📡 数据获取</h4>
            <p>使用 useEffect 获取数据：</p>
            <CodeBlock language="typescript" title="数据获取示例" showLineNumbers>
{`useEffect(() => {
  const controller = new AbortController()
  
  const fetchData = async () => {
    try {
      const res = await fetch('/api/data', {
        signal: controller.signal
      })
      const data = await res.json()
      setData(data)
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err)
      }
    }
  }
  
  fetchData()
  
  // 清理：中止请求
  return () => controller.abort()
}, [userId])`}
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
          <li>useEffect 用于处理副作用（数据获取、订阅、DOM 操作等）</li>
          <li>依赖数组控制 effect 何时执行</li>
          <li>空依赖数组 [] 表示仅在挂载时执行一次</li>
          <li>返回清理函数来清理副作用</li>
          <li>清理函数在组件卸载和下次 effect 执行前调用</li>
          <li>总是正确声明依赖，不要"欺骗"依赖数组</li>
          <li>使用 AbortController 中止 fetch 请求</li>
          <li>分离关注点，使用多个 useEffect</li>
        </ol>
      </div>
    </div>
  )
}

export default LifecycleEffects
