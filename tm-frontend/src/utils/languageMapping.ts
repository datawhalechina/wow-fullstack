/**
 * 语言映射工具
 * 用于代码编辑器的语言选择和课程名称到语言的映射
 */

export interface LanguageOption {
  id: string
  name: string
  monacoLanguage: string
  executable: boolean
}

/**
 * 用于下拉框的唯一语言选项（去重）
 */
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { id: 'python', name: 'Python', monacoLanguage: 'python', executable: true },
  { id: 'typescript', name: 'TypeScript', monacoLanguage: 'typescript', executable: true },
  { id: 'javascript', name: 'JavaScript', monacoLanguage: 'javascript', executable: true },
  { id: 'vue', name: 'Vue', monacoLanguage: 'html', executable: true },
  { id: 'html', name: 'HTML', monacoLanguage: 'html', executable: true },
  { id: 'css', name: 'CSS', monacoLanguage: 'css', executable: true },
  { id: 'sql', name: 'SQL', monacoLanguage: 'sql', executable: true },
  { id: 'plaintext', name: 'Plain Text', monacoLanguage: 'plaintext', executable: false },
]

/**
 * 语言别名映射（内部使用，用于规范化语言标识符）
 */
export const LANGUAGE_ALIASES: Record<string, string> = {
  'py': 'python',
  'ts': 'typescript',
  'js': 'javascript',
}

/**
 * 课程名称到默认语言的映射
 */
export const COURSE_LANGUAGE_MAP: Record<string, string> = {
  'Vue3': 'vue',
  'Vue': 'vue',
  'TypeScript': 'typescript',
  'TS': 'typescript',
  'FastAPI': 'python',
  'Elementui-plus': 'vue',
  'Element Plus': 'vue',
  'ElementUI': 'vue',
  'Excel自动化': 'python',
  'PDF自动化': 'python',
  'PPT自动化': 'python',
  'Word自动化': 'python',
  '键鼠自动化': 'python',
  '压缩包自动化': 'python',
  'css教程导论': 'css',
  'CSS': 'css',
}

/**
 * 根据课程名称获取默认语言
 */
export function getDefaultLanguageForCourse(courseName: string): string {
  if (!courseName) return 'plaintext'

  // 精确匹配
  if (COURSE_LANGUAGE_MAP[courseName]) {
    return COURSE_LANGUAGE_MAP[courseName]
  }

  // 部分匹配（如 "Vue3基础" 匹配 "Vue3"）
  for (const [key, lang] of Object.entries(COURSE_LANGUAGE_MAP)) {
    if (courseName.includes(key)) {
      return lang
    }
  }

  return 'plaintext'
}

/**
 * 规范化语言标识符
 */
export function normalizeLanguage(language: string): string {
  if (!language) return 'plaintext'
  const lang = language.toLowerCase()

  // 先检查是否是别名
  if (LANGUAGE_ALIASES[lang]) {
    return LANGUAGE_ALIASES[lang]
  }

  // 检查是否是已知的语言
  const option = LANGUAGE_OPTIONS.find((opt) => opt.id === lang)
  return option?.id || lang
}

/**
 * 获取 Monaco 编辑器语言标识符
 */
export function getMonacoLanguage(language: string): string {
  const option = LANGUAGE_OPTIONS.find((opt) => opt.id === language)
  return option?.monacoLanguage || 'plaintext'
}

/**
 * 获取语言显示名称
 */
export function getLanguageDisplayName(language: string): string {
  const option = LANGUAGE_OPTIONS.find((opt) => opt.id === language)
  return option?.name || language
}

/**
 * 判断语言是否可执行
 */
export function isLanguageExecutable(language: string): boolean {
  const option = LANGUAGE_OPTIONS.find((opt) => opt.id === language)
  return option?.executable || false
}

/**
 * 向后兼容：SUPPORTED_LANGUAGES 别名
 * @deprecated 使用 LANGUAGE_OPTIONS 代替
 */
export const SUPPORTED_LANGUAGES = LANGUAGE_OPTIONS
