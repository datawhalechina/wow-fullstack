import { ReactNode, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  children: string
  language?: string
  title?: string
  showLineNumbers?: boolean
}

// 样式常量（避免每次渲染创建新对象）
const STYLES = {
  wrapper: {
    marginBottom: '1.5rem',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  } as const,
  header: {
    backgroundColor: '#2d3748',
    color: '#e2e8f0',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  } as const,
  dot: {
    display: 'inline-block',
    width: '0.75rem',
    height: '0.75rem',
    borderRadius: '50%'
  } as const,
  title: {
    marginLeft: '0.5rem',
    flex: 1
  } as const,
  copyButton: {
    padding: '0.25rem 0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#e2e8f0',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '500',
    transition: 'all 0.2s'
  } as const,
  codeFont: {
    fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace"
  } as const
}

/**
 * 代码块展示组件
 * 用于在教程中优雅地展示代码示例，支持语法高亮
 */
export const CodeBlock = ({ 
  children, 
  language = 'typescript', 
  title,
  showLineNumbers = false 
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  return (
    <div style={STYLES.wrapper}>
      {title && (
        <div style={STYLES.header}>
          <span style={{ ...STYLES.dot, backgroundColor: '#fc5c65' }}></span>
          <span style={{ ...STYLES.dot, backgroundColor: '#fed330' }}></span>
          <span style={{ ...STYLES.dot, backgroundColor: '#26de81' }}></span>
          <span style={STYLES.title}>{title}</span>
          <button
            onClick={handleCopy}
            style={STYLES.copyButton}
            title="复制代码"
          >
            {copied ? '✓ 已复制' : '📋 复制'}
          </button>
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          borderRadius: title ? '0 0 0.5rem 0.5rem' : '0.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.7'
        }}
        codeTagProps={{ style: STYLES.codeFont }}
      >
        {children.trim()}
      </SyntaxHighlighter>
    </div>
  )
}

interface CodeSectionProps {
  title: string
  icon?: string
  children: ReactNode
  backgroundColor?: string
}

// CodeSection 样式常量
const SECTION_STYLES = {
  container: {
    marginBottom: '2rem',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0'
  } as const,
  heading: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  } as const
}

/**
 * 代码段落组件
 * 用于包装代码块和说明文字
 */
export const CodeSection = ({ 
  title, 
  icon = '📝', 
  children,
  backgroundColor = '#f8fafc'
}: CodeSectionProps) => {
  return (
    <div style={{ ...SECTION_STYLES.container, backgroundColor }}>
      <h3 style={SECTION_STYLES.heading}>
        <span>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  )
}

interface InlineCodeProps {
  children: string
}

// InlineCode 样式常量
const INLINE_CODE_STYLE = {
  backgroundColor: '#f1f5f9',
  color: '#e11d48',
  padding: '0.2rem 0.4rem',
  borderRadius: '0.25rem',
  fontSize: '0.875em',
  fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace"
} as const

/**
 * 行内代码组件
 */
export const InlineCode = ({ children }: InlineCodeProps) => {
  return (
    <code style={INLINE_CODE_STYLE}>
      {children}
    </code>
  )
}

