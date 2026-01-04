import { executeCodeAPI } from '@/request/tutorial/api'
import type { ExecutionOutput } from '@/components/code-editor/ExecutionResult.vue'

/**
 * 代码执行 Composable
 * 提供代码执行功能，支持 Python, SQL, HTML, CSS, JavaScript, Vue
 */
export function useCodeExecution() {
  /**
   * 执行代码
   * @param language 编程语言
   * @param code 代码内容
   * @param timeout 超时时间（秒），默认 10 秒
   */
  const execute = async (
    language: string,
    code: string,
    timeout: number = 10
  ): Promise<ExecutionOutput> => {
    try {
      const response = await executeCodeAPI({
        language,
        code,
        timeout
      })

      if (response.code === 200) {
        return {
          stdout: response.data.stdout || '',
          stderr: response.data.stderr || '',
          error: response.data.error,
          exitCode: response.data.exitCode,
          html: response.data.html,
          rowCount: response.data.rowCount,
          success: response.data.success !== undefined ? response.data.success : true
        }
      } else {
        return {
          error: response.message || '执行失败',
          exitCode: -1,
          success: false
        }
      }
    } catch (error: any) {
      console.error('代码执行错误:', error)
      return {
        error: error?.response?.data?.detail || error?.message || '网络错误，请稍后重试',
        exitCode: -1,
        success: false
      }
    }
  }

  /**
   * 快捷执行函数（无需创建 composable 实例）
   */
  const executeCode = async (language: string, code: string): Promise<ExecutionOutput> => {
    return execute(language, code)
  }

  return {
    execute,
    executeCode
  }
}

/**
 * 导出快捷函数，可以直接在组件中使用
 * @example
 * import { executeCode } from '@/composables/useCodeExecution'
 * const result = await executeCode('python', 'print("hello")')
 */
export async function executeCode(language: string, code: string): Promise<ExecutionOutput> {
  const { execute } = useCodeExecution()
  return execute(language, code)
}
