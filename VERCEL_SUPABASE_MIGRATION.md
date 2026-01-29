# Vercel + Supabase 迁移指南

本指南将帮助您将项目从 Docker + Flask 架构迁移到 Vercel + Supabase 架构。

## 📋 迁移概述

### 架构变化

**原架构：**
- 前端：React + Vite (Docker)
- 后端：Flask (Python, Docker)
- 数据库：PostgreSQL (Docker)

**新架构：**
- 前端：React + Vite (Vercel)
- 后端：Vercel Serverless Functions (Python)
- 数据库：Supabase (PostgreSQL)
- 认证：Supabase Auth
- 存储：Supabase Storage

### 优势

✅ **零运维成本** - Vercel 自动处理部署和扩展  
✅ **全球 CDN** - 自动边缘部署，低延迟  
✅ **Serverless** - 按需计费，无需管理服务器  
✅ **实时功能** - Supabase 提供实时数据库和订阅  
✅ **内置认证** - Supabase Auth 开箱即用  
✅ **文件存储** - Supabase Storage 集成简单  

## 🚀 快速开始

### 1. 设置 Supabase 项目

1. 访问 [Supabase](https://supabase.com) 并创建账户
2. 创建新项目
3. 获取项目 URL 和 API Key：
   - 进入项目设置 → API
   - 复制 `Project URL` 和 `anon public` key

### 2. 设置 Vercel 项目

1. 访问 [Vercel](https://vercel.com) 并创建账户
2. 安装 Vercel CLI（可选）：
   ```bash
   npm i -g vercel
   ```

3. 在项目根目录登录：
   ```bash
   vercel login
   ```

### 3. 配置环境变量

创建 `.env.local` 文件（用于本地开发）：

```bash
# Supabase 配置
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Vercel API 配置（本地开发时使用）
VITE_API_BASE_URL=http://localhost:3000/api

# Supabase 服务端配置（用于 Serverless Functions）
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # 可选，用于服务端操作
```

在 Vercel 项目中设置环境变量：

1. 进入 Vercel 项目设置
2. 进入 Environment Variables
3. 添加以下变量：
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (可选)

### 4. 部署到 Vercel

#### 方式一：通过 Vercel Dashboard

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 导入您的 Git 仓库
4. 配置项目：
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 添加环境变量
6. 点击 Deploy

#### 方式二：通过 Vercel CLI

```bash
# 在项目根目录执行
vercel

# 生产环境部署
vercel --prod
```

### 5. 配置 Supabase 数据库（可选）

如果需要存储数据，可以在 Supabase Dashboard 中创建表：

```sql
-- 聊天历史表
CREATE TABLE chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);

-- 生成任务表
CREATE TABLE generation_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  style TEXT DEFAULT 'cartoon',
  format TEXT DEFAULT 'image',
  status TEXT DEFAULT 'generating',
  result_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id)
);
```

## 📁 项目结构变化

```
oorr/
├── api/                    # Vercel Serverless Functions
│   ├── health.py          # 健康检查接口
│   ├── chat.py            # 聊天接口
│   ├── generate.py        # 生成接口
│   └── requirements.txt   # Python 依赖
├── frontend/              # 前端应用
│   ├── src/
│   │   ├── lib/
│   │   │   └── supabase.js  # Supabase 客户端配置
│   │   └── App.jsx         # 更新后的主应用
│   └── vercel.json        # Vercel 前端配置
├── vercel.json            # Vercel 根配置
└── .env.local             # 本地环境变量（不提交到 Git）
```

## 🔧 开发流程

### 本地开发

1. **安装依赖**：
   ```bash
   cd frontend
   npm install
   ```

2. **启动前端开发服务器**：
   ```bash
   npm run dev
   ```

3. **测试 Vercel Functions（本地）**：
   ```bash
   # 在项目根目录
   vercel dev
   ```

   这将启动：
   - 前端：http://localhost:3000
   - API：http://localhost:3000/api/*

### API 端点

所有 API 端点现在位于 `/api/*` 路径：

- `GET /api/health` - 健康检查
- `POST /api/chat` - 聊天接口
- `POST /api/generate` - 生成接口

### 使用 Supabase

在前端代码中使用 Supabase：

```javascript
import { supabase } from './lib/supabase'

// 查询数据
const { data, error } = await supabase
  .from('chat_history')
  .select('*')

// 插入数据
const { data, error } = await supabase
  .from('chat_history')
  .insert({ message: 'Hello' })

// 实时订阅
const subscription = supabase
  .channel('chat')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_history' }, payload => {
    console.log('New message:', payload.new)
  })
  .subscribe()
```

## 🔐 认证集成（可选）

Supabase 提供开箱即用的认证功能：

```javascript
import { supabase } from './lib/supabase'

// 注册
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})

// 登录
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// 获取当前用户
const { data: { user } } = await supabase.auth.getUser()
```

## 📤 文件上传（可选）

使用 Supabase Storage 存储生成的文件：

```javascript
// 上传文件
const { data, error } = await supabase.storage
  .from('cartoons')
  .upload('filename.jpg', file)

// 获取公共 URL
const { data } = supabase.storage
  .from('cartoons')
  .getPublicUrl('filename.jpg')
```

## 🚨 注意事项

1. **环境变量**：
   - 前端环境变量必须以 `VITE_` 开头
   - 服务端环境变量在 Vercel Dashboard 中设置

2. **CORS**：
   - Vercel Functions 已配置 CORS
   - Supabase 客户端自动处理跨域

3. **API 路由**：
   - 本地开发：`http://localhost:3000/api/*`
   - 生产环境：`https://your-domain.vercel.app/api/*`

4. **数据库连接**：
   - 使用 Supabase 的连接池，不要直接连接数据库
   - 使用 Supabase 客户端库进行所有数据库操作

## 📊 成本估算

### Vercel
- **免费层**：适合个人项目和小型应用
- **Pro 计划**：$20/月，适合商业项目

### Supabase
- **免费层**：500MB 数据库，1GB 存储，50,000 月活用户
- **Pro 计划**：$25/月，适合生产环境

## 🔄 回滚方案

如果需要回滚到 Docker 架构：

1. 保留原有的 `backend/` 和 `docker-compose.yml` 文件
2. 使用 Git 分支管理不同架构
3. 可以同时维护两套部署方案

## 📚 参考资源

- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Supabase JavaScript 客户端](https://supabase.com/docs/reference/javascript/introduction)

## 🆘 常见问题

### Q: 如何调试 Serverless Functions？
A: 使用 `vercel dev` 本地运行，或查看 Vercel Dashboard 中的函数日志。

### Q: Supabase 连接失败？
A: 检查环境变量是否正确设置，确保网络可以访问 Supabase。

### Q: API 路由 404？
A: 确保 `vercel.json` 配置正确，API 文件位于 `api/` 目录。

### Q: 如何迁移现有数据？
A: 使用 Supabase 的导入功能，或编写迁移脚本。

## ✅ 迁移检查清单

- [ ] 创建 Supabase 项目
- [ ] 配置环境变量
- [ ] 部署到 Vercel
- [ ] 测试所有 API 端点
- [ ] 配置数据库表（如需要）
- [ ] 设置认证（如需要）
- [ ] 配置文件存储（如需要）
- [ ] 更新文档
- [ ] 通知团队成员

---

迁移完成后，您的项目将享受 Vercel 和 Supabase 提供的所有优势！
