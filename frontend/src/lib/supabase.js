/**
 * Supabase 客户端配置
 * 用于连接 Supabase 后端服务
 * 
 * 注意：Supabase 免费版在 7 天不活跃后会自动暂停
 * 如果 Supabase 被暂停，相关功能会失败，但不会影响 Firebase 认证
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Supabase 配置状态
let supabaseConfigured = false
let supabaseClient = null

if (supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'https://your-project.supabase.co' && 
    supabaseAnonKey !== 'your-anon-key') {
  supabaseConfigured = true
  try {
    // 创建 Supabase 客户端
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    
    // 异步检查 Supabase 连接状态
    checkSupabaseHealth().catch(err => {
      console.warn('Supabase 健康检查失败:', err.message)
      console.warn('提示：Supabase 可能已暂停（7天不活跃会自动暂停）')
      console.warn('请访问 https://app.supabase.com 检查项目状态')
    })
  } catch (error) {
    console.error('Supabase 客户端初始化失败:', error)
  }
} else {
  console.warn('Supabase 配置缺失，相关功能将不可用')
  console.warn('提示：如果不需要 Supabase，可以忽略此警告')
}

/**
 * 检查 Supabase 健康状态
 * 如果 Supabase 被暂停，会返回错误
 */
async function checkSupabaseHealth() {
  if (!supabaseClient) {
    return { healthy: false, error: 'Supabase 未配置' }
  }
  
  try {
    // 尝试一个简单的查询来检查连接
    const { error } = await supabaseClient.from('_health_check').select('count').limit(0)
    
    // 如果错误是 404 或连接错误，可能是项目被暂停
    if (error) {
      if (error.message?.includes('paused') || 
          error.message?.includes('暂停') ||
          error.code === 'PGRST116' || // PostgREST connection error
          error.message?.includes('connection')) {
        console.error('⚠️ Supabase 项目可能已暂停！')
        console.error('请访问 https://app.supabase.com 恢复项目')
        return { healthy: false, error: 'Supabase 项目已暂停', paused: true }
      }
    }
    
    return { healthy: true }
  } catch (error) {
    // 网络错误或连接失败
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      console.warn('⚠️ 无法连接到 Supabase，项目可能已暂停')
      return { healthy: false, error: '连接失败，项目可能已暂停', paused: true }
    }
    return { healthy: false, error: error.message }
  }
}

/**
 * 安全地使用 Supabase
 * 如果 Supabase 不可用，会返回错误而不是崩溃
 */
export async function safeSupabaseOperation(operation) {
  if (!supabaseConfigured || !supabaseClient) {
    return {
      data: null,
      error: {
        message: 'Supabase 未配置或不可用',
        code: 'SUPABASE_NOT_CONFIGURED'
      }
    }
  }
  
  try {
    const health = await checkSupabaseHealth()
    if (!health.healthy && health.paused) {
      return {
        data: null,
        error: {
          message: 'Supabase 项目已暂停，请访问 https://app.supabase.com 恢复',
          code: 'SUPABASE_PAUSED',
          paused: true
        }
      }
    }
    
    return await operation(supabaseClient)
  } catch (error) {
    return {
      data: null,
      error: {
        message: error.message || 'Supabase 操作失败',
        code: error.code || 'SUPABASE_ERROR'
      }
    }
  }
}

// 导出 Supabase 客户端（如果已配置）
export const supabase = supabaseClient

// 导出配置状态
export const isSupabaseConfigured = () => supabaseConfigured

// 导出健康检查函数
export { checkSupabaseHealth }

// API 基础 URL（Vercel 部署后会自动处理）
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
