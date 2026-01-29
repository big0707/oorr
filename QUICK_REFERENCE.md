# Vercel + Supabase 快速参考

## 🎯 核心概念

### Vercel
- **前端托管**：自动部署 React/Vite 应用
- **Serverless Functions**：Python/Node.js 函数，按需执行
- **全球 CDN**：自动边缘部署

### Supabase
- **PostgreSQL 数据库**：托管数据库服务
- **实时订阅**：数据库变更实时推送
- **认证系统**：开箱即用的用户认证
- **文件存储**：对象存储服务

## 📝 环境变量

### 前端（.env.local）
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
VITE_API_BASE_URL=/api  # 生产环境使用相对路径
```

### Vercel（Dashboard 设置）
```bash
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx  # 可选
```

## 🔌 API 端点

所有 API 位于 `/api/*`：

- `GET /api/health` - 健康检查
- `POST /api/chat` - 聊天接口
- `POST /api/generate` - 生成接口

## 💻 代码示例

### 前端使用 Supabase

```javascript
import { supabase } from './lib/supabase'

// 查询
const { data, error } = await supabase
  .from('table_name')
  .select('*')

// 插入
const { data, error } = await supabase
  .from('table_name')
  .insert({ column: 'value' })

// 实时订阅
supabase
  .channel('channel_name')
  .on('postgres_changes', { 
    event: 'INSERT', 
    schema: 'public', 
    table: 'table_name' 
  }, (payload) => {
    console.log(payload.new)
  })
  .subscribe()
```

### 调用 API

```javascript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello' })
})
const data = await response.json()
```

## 🚀 部署命令

```bash
# 本地开发
vercel dev

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod
```

## 📊 项目结构

```
api/              # Serverless Functions
  ├── health.py
  ├── chat.py
  └── generate.py

frontend/         # React 应用
  └── src/
      └── lib/
          └── supabase.js
```

## 🔗 重要链接

- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://app.supabase.com
- 项目文档: [VERCEL_SUPABASE_MIGRATION.md](VERCEL_SUPABASE_MIGRATION.md)
