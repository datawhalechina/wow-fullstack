import { useState, useRef, useCallback } from 'react'
import { CodeBlock } from '../components/CodeBlock'

// 演示1：受控组件 vs 非受控组件
const ControlledVsUncontrolled = () => {
  // 受控组件
  const [controlledValue, setControlledValue] = useState('')
  
  // 非受控组件
  const uncontrolledRef = useRef<HTMLInputElement>(null)
  const [uncontrolledDisplay, setUncontrolledDisplay] = useState('')

  const showUncontrolledValue = () => {
    if (uncontrolledRef.current) {
      setUncontrolledDisplay(uncontrolledRef.current.value)
    }
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#f0f9ff', 
      borderRadius: '0.5rem',
      border: '1px solid #0ea5e9'
    }}>
      <h4>🎯 受控 vs 非受控组件</h4>
      
      {/* 受控组件 */}
      <div style={{ 
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#dbeafe',
        borderRadius: '0.375rem',
        border: '1px solid #3b82f6'
      }}>
        <h5 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}>✅ 受控组件</h5>
        <input 
          type="text"
          value={controlledValue}
          onChange={(e) => setControlledValue(e.target.value)}
          placeholder="输入文本（受控）"
          style={{ 
            maxWidth: '31.25rem',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            marginBottom: '0.5rem'
          }}
        />
        <div style={{ fontSize: '0.875rem', color: '#1e40af' }}>
          实时显示: <strong>{controlledValue}</strong>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
          💡 值由 React state 控制，每次输入都会更新
        </div>
      </div>

      {/* 非受控组件 */}
      <div style={{ 
        padding: '1rem',
        backgroundColor: '#fef3c7',
        borderRadius: '0.375rem',
        border: '1px solid #f59e0b'
      }}>
        <h5 style={{ margin: '0 0 0.75rem 0', fontSize: '0.95rem' }}>⚠️ 非受控组件</h5>
        <input 
          type="text"
          ref={uncontrolledRef}
          defaultValue="初始值"
          placeholder="输入文本（非受控）"
          style={{ 
            maxWidth: '31.25rem',
            padding: '0.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.25rem',
            fontSize: '0.875rem',
            marginBottom: '0.5rem'
          }}
        />
        <button 
          onClick={showUncontrolledValue}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
            marginBottom: '0.5rem'
          }}
        >
          获取值
        </button>
        {uncontrolledDisplay && (
          <div style={{ fontSize: '0.875rem', color: '#92400e' }}>
            获取到的值: <strong>{uncontrolledDisplay}</strong>
          </div>
        )}
        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
          💡 使用 ref 访问 DOM，只在需要时获取值
        </div>
      </div>
    </div>
  )
}

// 演示2：各种表单元素
const FormElements = () => {
  const [formData, setFormData] = useState({
    text: '',
    textarea: '',
    select: 'apple',
    radio: 'option1',
    checkbox: false,
    multiCheckbox: [] as string[],
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData({ ...formData, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleMultiCheckbox = (value: string) => {
    setFormData(prev => ({
      ...prev,
      multiCheckbox: prev.multiCheckbox.includes(value)
        ? prev.multiCheckbox.filter(item => item !== value)
        : [...prev.multiCheckbox, value]
    }))
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#f0fdf4', 
      borderRadius: '0.5rem',
      border: '1px solid #22c55e'
    }}>
      <h4>📝 各种表单元素</h4>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {/* 文本输入 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            文本输入:
          </label>
          <input 
            type="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            placeholder="输入文本"
            style={{ 
              maxWidth: '31.25rem',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }}
          />
        </div>

        {/* 多行文本 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            多行文本:
          </label>
          <textarea 
            name="textarea"
            value={formData.textarea}
            onChange={handleChange}
            rows={3}
            placeholder="输入多行文本"
            style={{ 
              maxWidth: '31.25rem',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              resize: 'vertical'
            }}
          />
        </div>

        {/* 下拉选择 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            下拉选择:
          </label>
          <select 
            name="select"
            value={formData.select}
            onChange={handleChange}
            style={{ 
              maxWidth: '31.25rem',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }}
          >
            <option value="apple">🍎 苹果</option>
            <option value="banana">🍌 香蕉</option>
            <option value="orange">🍊 橙子</option>
          </select>
        </div>

        {/* 单选按钮 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            单选按钮:
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio"
                name="radio"
                value="option1"
                checked={formData.radio === 'option1'}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.875rem' }}>选项 1</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio"
                name="radio"
                value="option2"
                checked={formData.radio === 'option2'}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.875rem' }}>选项 2</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio"
                name="radio"
                value="option3"
                checked={formData.radio === 'option3'}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '0.875rem' }}>选项 3</span>
            </label>
          </div>
        </div>

        {/* 单个复选框 */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox"
              name="checkbox"
              checked={formData.checkbox}
              onChange={handleChange}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>同意条款和条件</span>
          </label>
        </div>

        {/* 多个复选框 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            多选复选框:
          </label>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {['JavaScript', 'TypeScript', 'Python', 'Go'].map(lang => (
              <label key={lang} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={formData.multiCheckbox.includes(lang)}
                  onChange={() => handleMultiCheckbox(lang)}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.875rem' }}>{lang}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 显示表单数据 */}
        <div style={{ 
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.375rem',
          border: '1px solid #e5e7eb'
        }}>
          <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>📊 当前表单数据:</h5>
          <pre style={{ 
            margin: 0,
            fontSize: '0.75rem',
            color: '#4b5563',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

// 演示3：表单验证
const ValidatedForm = () => {
  interface FormData {
    username: string
    email: string
    password: string
    confirmPassword: string
  }

  interface FormErrors {
    username?: string
    email?: string
    password?: string
    confirmPassword?: string
  }

  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const validate = useCallback((data: FormData): FormErrors => {
    const errors: FormErrors = {}

    if (!data.username) {
      errors.username = '用户名不能为空'
    } else if (data.username.length < 3) {
      errors.username = '用户名至少需要 3 个字符'
    }

    if (!data.email) {
      errors.email = '邮箱不能为空'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = '邮箱格式不正确'
    }

    if (!data.password) {
      errors.password = '密码不能为空'
    } else if (data.password.length < 6) {
      errors.password = '密码至少需要 6 个字符'
    }

    if (data.password !== data.confirmPassword) {
      errors.confirmPassword = '两次密码不一致'
    }

    return errors
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newData = { ...formData, [name]: value }
    setFormData(newData)

    // 如果字段已被触摸，实时验证
    if (touched[name]) {
      const newErrors = validate(newData)
      setErrors(newErrors)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched({ ...touched, [name]: true })
    
    // 失焦时验证
    const newErrors = validate(formData)
    setErrors(newErrors)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 标记所有字段为已触摸
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    )
    setTouched(allTouched)

    // 验证
    const newErrors = validate(formData)
    setErrors(newErrors)

    // 如果没有错误，提交表单
    if (Object.keys(newErrors).length === 0) {
      setSubmitStatus('success')
      setTimeout(() => {
        setSubmitStatus('idle')
        setFormData({ username: '', email: '', password: '', confirmPassword: '' })
        setTouched({})
      }, 2000)
    } else {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 2000)
    }
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#fef3c7', 
      borderRadius: '0.5rem',
      border: '1px solid #f59e0b'
    }}>
      <h4>✅ 表单验证</h4>
      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
        实时验证 + 失焦验证 + 提交验证
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        {/* 用户名 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            用户名 <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input 
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="至少 3 个字符"
            style={{ 
              maxWidth: '31.25rem',
              padding: '0.5rem',
              border: `1px solid ${touched.username && errors.username ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }}
          />
          {touched.username && errors.username && (
            <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
              ⚠️ {errors.username}
            </div>
          )}
        </div>

        {/* 邮箱 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            邮箱 <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="example@email.com"
            style={{ 
              maxWidth: '31.25rem',
              padding: '0.5rem',
              border: `1px solid ${touched.email && errors.email ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }}
          />
          {touched.email && errors.email && (
            <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
              ⚠️ {errors.email}
            </div>
          )}
        </div>

        {/* 密码 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            密码 <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input 
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="至少 6 个字符"
            style={{ 
              maxWidth: '31.25rem',
              padding: '0.5rem',
              border: `1px solid ${touched.password && errors.password ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }}
          />
          {touched.password && errors.password && (
            <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
              ⚠️ {errors.password}
            </div>
          )}
        </div>

        {/* 确认密码 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            确认密码 <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input 
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="再次输入密码"
            style={{ 
              maxWidth: '31.25rem',
              padding: '0.5rem',
              border: `1px solid ${touched.confirmPassword && errors.confirmPassword ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '0.25rem',
              fontSize: '0.875rem'
            }}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
              ⚠️ {errors.confirmPassword}
            </div>
          )}
        </div>

        {/* 提交按钮 */}
        <button 
          type="submit"
          style={{ 
            padding: '0.75rem',
            backgroundColor: submitStatus === 'success' ? '#22c55e' : submitStatus === 'error' ? '#ef4444' : '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            transition: 'background-color 0.2s'
          }}
        >
          {submitStatus === 'success' ? '✅ 提交成功！' : submitStatus === 'error' ? '❌ 请检查表单' : '提交'}
        </button>
      </form>
    </div>
  )
}

// 演示4：输入格式化
const FormattedInputs = () => {
  const [phone, setPhone] = useState('')
  const [creditCard, setCreditCard] = useState('')
  const [date, setDate] = useState('')

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  const formatCreditCard = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    const groups = numbers.match(/.{1,4}/g)
    return groups ? groups.join(' ') : numbers
  }

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#fae8ff', 
      borderRadius: '0.5rem',
      border: '1px solid #a855f7'
    }}>
      <h4>🎨 输入格式化</h4>
      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
        自动格式化用户输入
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {/* 电话号码 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            电话号码:
          </label>
          <input 
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="XXX-XXXX-XXXX"
            maxLength={13}
            style={{ 
              maxWidth: '18.75rem',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontFamily: 'monospace'
            }}
          />
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
            💡 自动添加连字符
          </div>
        </div>

        {/* 信用卡号 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            信用卡号:
          </label>
          <input 
            type="text"
            value={creditCard}
            onChange={(e) => setCreditCard(formatCreditCard(e.target.value))}
            placeholder="XXXX XXXX XXXX XXXX"
            maxLength={19}
            style={{ 
              maxWidth: '18.75rem',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontFamily: 'monospace'
            }}
          />
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
            💡 每 4 位自动分组
          </div>
        </div>

        {/* 日期 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            日期:
          </label>
          <input 
            type="text"
            value={date}
            onChange={(e) => setDate(formatDate(e.target.value))}
            placeholder="MM/DD/YYYY"
            maxLength={10}
            style={{ 
              maxWidth: '12.5rem',
              padding: '0.5rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
              fontFamily: 'monospace'
            }}
          />
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
            💡 自动添加斜杠
          </div>
        </div>

        {/* 显示原始值 */}
        <div style={{ 
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.375rem',
          border: '1px solid #e5e7eb'
        }}>
          <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>📊 原始值（去除格式）:</h5>
          <div style={{ fontSize: '0.75rem', color: '#4b5563', fontFamily: 'monospace' }}>
            <div>电话: {phone.replace(/\D/g, '')}</div>
            <div>卡号: {creditCard.replace(/\D/g, '')}</div>
            <div>日期: {date.replace(/\D/g, '')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 演示5：完整注册表单
const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    gender: 'male',
    interests: [] as string[],
    newsletter: false,
    terms: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData({ ...formData, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.terms) {
      setSubmitMessage('❌ 请同意条款和条件')
      return
    }

    setIsSubmitting(true)
    setSubmitMessage('')

    // 模拟异步提交
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitMessage('✅ 注册成功！欢迎加入！')
      console.log('提交的数据:', formData)
      
      // 3秒后清除消息
      setTimeout(() => setSubmitMessage(''), 3000)
    }, 1500)
  }

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      age: '',
      gender: 'male',
      interests: [],
      newsletter: false,
      terms: false
    })
    setSubmitMessage('')
  }

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#eff6ff', 
      borderRadius: '0.5rem',
      border: '1px solid #3b82f6'
    }}>
      <h4>📋 完整注册表单</h4>
      <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
        综合示例：各种表单元素 + 提交处理
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* 用户名 */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
              用户名 *
            </label>
            <input 
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={{ 
                maxWidth: '25rem',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* 邮箱 */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
              邮箱 *
            </label>
            <input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ 
                maxWidth: '25rem',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* 密码 */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
              密码 *
            </label>
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{ 
                maxWidth: '25rem',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* 年龄 */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
              年龄
            </label>
            <input 
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="1"
              max="120"
              style={{ 
                maxWidth: '9.375rem',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* 性别 */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
              性别
            </label>
            <select 
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              style={{ 
                maxWidth: '12.5rem',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.25rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="male">男</option>
              <option value="female">女</option>
              <option value="other">其他</option>
            </select>
          </div>
        </div>

        {/* 兴趣爱好 */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            兴趣爱好:
          </label>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {['编程', '音乐', '运动', '阅读', '旅游'].map(interest => (
              <label key={interest} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={formData.interests.includes(interest)}
                  onChange={() => handleInterestChange(interest)}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.875rem' }}>{interest}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 其他选项 */}
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox"
              name="newsletter"
              checked={formData.newsletter}
              onChange={handleChange}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.875rem' }}>订阅新闻邮件</span>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input 
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
              我同意条款和条件 <span style={{ color: '#ef4444' }}>*</span>
            </span>
          </label>
        </div>

        {/* 提交按钮 */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            type="submit"
            disabled={isSubmitting}
            style={{ 
              flex: 1,
              padding: '0.75rem',
              backgroundColor: isSubmitting ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}
          >
            {isSubmitting ? '提交中...' : '提交注册'}
          </button>
          <button 
            type="button"
            onClick={resetForm}
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

        {/* 提交消息 */}
        {submitMessage && (
          <div style={{ 
            padding: '1rem',
            backgroundColor: submitMessage.startsWith('✅') ? '#d1fae5' : '#fee2e2',
            color: submitMessage.startsWith('✅') ? '#065f46' : '#991b1b',
            borderRadius: '0.375rem',
            border: `1px solid ${submitMessage.startsWith('✅') ? '#10b981' : '#ef4444'}`,
            fontSize: '0.875rem',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  )
}

// 主组件
const FormsInput = () => {
  return (
    <div className="tutorial-section">
      <h2>07 - 表单与输入</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>📚 理论学习</h3>
        <p>
          React 中的表单处理有两种方式：<span className="highlight">受控组件</span>
          和<span className="highlight">非受控组件</span>。大多数情况下推荐使用受控组件，
          因为它提供了更好的控制和验证能力。
        </p>
        <ul>
          <li><strong>受控组件</strong>：表单数据由 React state 管理（推荐）</li>
          <li><strong>非受控组件</strong>：表单数据由 DOM 本身管理</li>
          <li><strong>表单验证</strong>：实时验证、失焦验证、提交验证</li>
          <li><strong>格式化输入</strong>：自动格式化用户输入</li>
          <li><strong>异步提交</strong>：处理加载状态和错误</li>
        </ul>
      </div>

      <div className="interactive-demo">
        <h3>🎮 交互式演示</h3>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* 演示1：受控 vs 非受控 */}
          <ControlledVsUncontrolled />

          {/* 演示2：各种表单元素 */}
          <FormElements />

          {/* 演示3：表单验证 */}
          <ValidatedForm />

          {/* 演示4：输入格式化 */}
          <FormattedInputs />

          {/* 演示5：完整表单 */}
          <RegistrationForm />
        </div>
      </div>

      <div className="demo-container">
        <h3>🔍 关键概念解释</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
            <h4>🎯 受控组件</h4>
            <p>表单数据由 React state 管理：</p>
            <CodeBlock language="typescript" title="受控组件示例" showLineNumbers>
{`function ControlledInput() {
  const [value, setValue] = useState('')
  
  return (
    <input 
      type="text"
      value={value}                           // 由 state 控制
      onChange={(e) => setValue(e.target.value)}  // 更新 state
    />
  )
}`}
            </CodeBlock>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '0.5rem', border: '1px solid #bae6fd' }}>
            <h4>📝 处理多个输入</h4>
            <p>使用统一的处理函数：</p>
            <CodeBlock language="typescript" title="多输入处理" showLineNumbers>
{`function Form() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value  // 使用计算属性名
    })
  }
  
  return (
    <form>
      <input name="username" value={formData.username} onChange={handleChange} />
      <input name="email" value={formData.email} onChange={handleChange} />
      <input name="password" value={formData.password} onChange={handleChange} />
    </form>
  )
}`}
            </CodeBlock>
          </div>
          
          <div style={{ padding: '1rem', backgroundColor: '#fefce8', borderRadius: '0.5rem', border: '1px solid #fde047' }}>
            <h4>✅ 表单验证</h4>
            <p>实现完整的验证流程：</p>
            <CodeBlock language="typescript" title="表单验证" showLineNumbers>
{`function ValidatedForm() {
  const [formData, setFormData] = useState({ email: '' })
  const [errors, setErrors] = useState({})
  
  const validate = (data) => {
    const errors = {}
    
    if (!data.email) {
      errors.email = '邮箱不能为空'
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(data.email)) {
      errors.email = '邮箱格式不正确'
    }
    
    return errors
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate(formData)
    setErrors(validationErrors)
    
    if (Object.keys(validationErrors).length === 0) {
      console.log('提交成功:', formData)
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={formData.email}
        onChange={(e) => setFormData({ email: e.target.value })}
      />
      {errors.email && <span>{errors.email}</span>}
      <button type="submit">提交</button>
    </form>
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
          <li>优先使用受控组件，表单数据由 React state 管理</li>
          <li>使用 value 和 onChange 控制输入框的值</li>
          <li>统一的 handleChange 函数可以处理多个输入</li>
          <li>实现实时验证、失焦验证和提交验证</li>
          <li>使用 e.preventDefault() 阻止表单默认提交</li>
          <li>可以格式化用户输入，提供更好的体验</li>
          <li>处理异步提交，显示加载状态和错误信息</li>
          <li>文件上传必须使用非受控组件</li>
        </ol>
      </div>
    </div>
  )
}

export default FormsInput
