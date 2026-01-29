/**
 * Supabase 客户端配置
 * 用于连接 Supabase 后端服务
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase 配置缺失，请设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY')
}

// 创建 Supabase 客户端
export const supabase = createClient(
  supabaseUrl || 'https://your-project.supabase.co',
  supabaseAnonKey || 'your-anon-key'
)

// API 基础 URL（Vercel 部署后会自动处理）
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
