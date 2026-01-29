# Chat2Cartoon - Vercel + Supabase 版本

这是使用 Vercel + Supabase 架构的 Chat2Cartoon 项目。

## 🚀 快速开始

### 前置要求

- Node.js 18+
- Vercel 账户
- Supabase 账户

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd oorr
```

### 2. 安装依赖

```bash
cd frontend
npm install
```

### 3. 配置环境变量

复制环境变量示例文件：

```bash
cp env.example .env.local
```

编辑 `.env.local` 并填入您的 Supabase 配置：

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://localhost:3000/api
```

### 4. 本地开发

```bash
# 启动前端开发服务器
cd frontend
npm run dev

# 在另一个终端启动 Vercel 开发服务器（测试 API）
vercel dev
```

访问 http://localhost:3000

### 5. 部署到 Vercel

```bash
# 登录 Vercel
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

或在 [Vercel Dashboard](https://vercel.com/dashboard) 中导入项目。

## 📁 项目结构

```
oorr/
├── api/                    # Vercel Serverless Functions
│   ├── health.py          # 健康检查
│   ├── chat.py            # 聊天接口
│   ├── generate.py        # 生成接口
│   └── requirements.txt   # Python 依赖
├── frontend/              # React 前端
│   ├── src/
│   │   ├── lib/
│   │   │   └── supabase.js  # Supabase 配置
│   │   └── App.jsx
│   └── package.json
├── vercel.json            # Vercel 配置
└── .env.local             # 环境变量（不提交）
```

## 🔧 配置说明

### Vercel 环境变量

在 Vercel Dashboard 中设置以下环境变量：

- `SUPABASE_URL` - Supabase 项目 URL
- `SUPABASE_ANON_KEY` - Supabase 匿名密钥
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase 服务角色密钥（可选）

### Supabase 设置

1. 创建 Supabase 项目
2. 获取 API 密钥
3. （可选）创建数据库表
4. （可选）配置认证
5. （可选）配置存储桶

详细步骤请查看 [迁移指南](VERCEL_SUPABASE_MIGRATION.md)

## 📚 文档

- [迁移指南](VERCEL_SUPABASE_MIGRATION.md) - 详细的迁移步骤
- [开发指南](DEVELOPMENT.md) - 开发说明
- [快速开始](QUICKSTART.md) - 快速启动（Docker 版本）

## 🆚 架构对比

### Vercel + Supabase（当前）

- ✅ 零运维
- ✅ 全球 CDN
- ✅ Serverless
- ✅ 自动扩展
- ✅ 内置认证和存储

### Docker（传统）

- 需要管理服务器
- 需要配置 Docker
- 需要手动扩展
- 需要自己配置认证

## 🔗 相关链接

- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- [项目主页](https://vercel.com)
