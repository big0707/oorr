# Chat2Cartoon

基于 AI 的卡通生成工具，使用 Vercel + Supabase + Firebase 架构。

## 📁 项目结构

```
oorr/
├── api/                          # Vercel Serverless Functions (Python)
│   ├── health.py                 # 健康检查
│   ├── chat.py                   # 聊天接口
│   ├── generate.py               # 生成接口
│   ├── supabase-keepalive.py     # Supabase 保活（Cron Job）
│   └── requirements.txt          # Python 依赖
├── frontend/                     # React 前端 (Vite)
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api.js            # API 基础配置
│   │   │   ├── supabase.js       # Supabase 客户端 + 健康检查
│   │   │   └── firebase.js       # Firebase 客户端配置
│   │   ├── components/
│   │   │   ├── Login.jsx         # 登录组件
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx   # 认证上下文
│   │   ├── App.jsx               # 主应用
│   │   └── main.jsx              # 入口
│   └── package.json
├── backend/                      # Flask 后端（本地开发/Docker 可选）
│   ├── app.py
│   ├── auth.py                   # Firebase 认证中间件
│   └── requirements.txt
├── scripts/
│   └── keep-supabase-alive.js    # 本地 Supabase 保活脚本
├── vercel.json                   # Vercel 配置（含 Cron Job）
├── env.example                   # 环境变量模板
└── vercel-env-vars.txt           # Vercel 环境变量参考
```

## 🚀 部署到 Vercel

### 步骤 1: 导入项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project" → 选择你的 GitHub 仓库
3. 配置项目：
   - **Framework Preset**: `Vite`
   - **Root Directory**: 留空（使用项目根目录）⚠️ **不要设为 `frontend`**
   - Build/Install 命令由 `vercel.json` 自动处理

### 步骤 2: 设置环境变量

在 Vercel Dashboard > Settings > Environment Variables 中添加（参考 `vercel-env-vars.txt`）：

**Firebase 前端（必须以 VITE_ 开头）：**
```
VITE_FIREBASE_API_KEY=<从 Firebase Console 获取>
VITE_FIREBASE_AUTH_DOMAIN=<your-project>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<your-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<your-project>.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
VITE_FIREBASE_APP_ID=<your-app-id>
```

**Firebase 后端：**
```
FIREBASE_CREDENTIALS_JSON=<firebase-service-account.json 压缩为一行的 JSON>
```
生成方法：`cat firebase-service-account.json | jq -c .`

**Supabase：**
```
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

> ⚠️ 每个变量都要添加到 **Production**、**Preview**、**Development** 三个环境。

### 步骤 3: 部署

点击 "Deploy"，等待 1-3 分钟。

### 步骤 4: 配置 Firebase 授权域名

1. [Firebase Console](https://console.firebase.google.com/) → 选择项目
2. Authentication → Settings → Authorized domains
3. 添加你的 Vercel 域名（如 `your-project.vercel.app`）
4. 确保 `localhost` 也在列表中

## 🔧 本地开发

```bash
# 克隆项目
git clone <your-repo-url>
cd oorr

# 配置环境变量
cp env.example .env.local
# 编辑 .env.local，填入真实值

# 安装前端依赖并启动
cd frontend
npm install
npm run dev
```

## 🔐 Firebase 认证配置

### 获取前端配置

Firebase Console → Project Settings → General → Your apps → Web App

### 获取后端服务账号

Firebase Console → Project Settings → Service accounts → Generate new private key

> ⚠️ 下载的 `firebase-service-account.json` **不要提交到 Git**！

### 启用登录方式

Firebase Console → Authentication → Sign-in method：
- ✅ Google 登录
- ✅ Email/Password 登录

## 📡 API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/health` | GET | 健康检查 |
| `/api/chat` | POST | 聊天接口 |
| `/api/generate` | POST | 生成接口 |
| `/api/supabase-keepalive` | GET | Supabase 保活 |

## ⏰ Supabase 自动保活

Supabase 免费版在 7 天不活跃后会自动暂停。项目已配置 Vercel Cron Job，每 6 天自动 ping Supabase：

```json
// vercel.json
"crons": [{ "path": "/api/supabase-keepalive", "schedule": "0 0 */6 * *" }]
```

部署后自动运行，无需手动维护。

详见 `scripts/README_KEEPALIVE.md`。

## ⚠️ 重要提示

### Root Directory 说明

`vercel.json` 中的 `buildCommand` 已包含 `cd frontend`，所以 Vercel 的 Root Directory 应设为**项目根目录**（留空），不要设为 `frontend`。

### 安全注意事项

- `firebase-service-account.json` 已在 `.gitignore` 中，不会提交
- `.env.local` 已在 `.gitignore` 中，不会提交
- 真实的密钥只应存在于：本地 `.env.local` 和 Vercel Dashboard 环境变量中
- 仓库中的配置文件只使用占位符

## 🔗 相关链接

- [Vercel 文档](https://vercel.com/docs)
- [Firebase 文档](https://firebase.google.com/docs)
- [Supabase 文档](https://supabase.com/docs)
