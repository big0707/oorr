# Vercel + Firebase 配置指南

本指南将帮助您将项目部署到 Vercel，并使用 Firebase 进行用户认证。

## 📋 前置要求

- ✅ Node.js 18+ 已安装
- ✅ Firebase 项目已创建（参考 `FIREBASE_SETUP.md`）
- ✅ Firebase 配置已添加到 `.env` 文件
- ✅ Vercel 账户（免费账户即可）

## 🚀 快速开始

### 1. 安装 Vercel CLI（可选但推荐）

```bash
npm install -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```

这会打开浏览器，让你登录 Vercel 账户。

### 3. 配置 Vercel 项目

#### 方式一：通过 Vercel Dashboard（推荐）

1. **访问 Vercel Dashboard**
   - 打开 [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - 点击 "Add New Project" 或 "Import Project"

2. **导入 Git 仓库**
   - 如果项目在 GitHub/GitLab/Bitbucket，选择对应的仓库
   - 或者点击 "Import Git Repository" 并输入仓库 URL

3. **配置项目设置**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`（重要！）
   - **Build Command**: `npm run build`（会自动检测）
   - **Output Directory**: `dist`（会自动检测）
   - **Install Command**: `npm install`（会自动检测）

4. **配置环境变量**
   
   在 "Environment Variables" 部分，添加以下变量：

   **前端环境变量（必须以 `VITE_` 开头）：**
   ```
   VITE_FIREBASE_API_KEY=你的-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=你的项目.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=你的项目-id
   VITE_FIREBASE_STORAGE_BUCKET=你的项目.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=你的-sender-id
   VITE_FIREBASE_APP_ID=你的-app-id
   ```

   **后端环境变量（用于 Serverless Functions）：**
   ```
   FIREBASE_CREDENTIALS_JSON={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
   ```
   
   > 💡 **提示**：`FIREBASE_CREDENTIALS_JSON` 的值应该是完整的 JSON 字符串（一行），从 `firebase-service-account.json` 文件复制。

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待部署完成（通常需要 1-3 分钟）

#### 方式二：通过 Vercel CLI

1. **在项目根目录初始化 Vercel**
   ```bash
   cd /Users/guanjiegan/Desktop/oorr
   vercel
   ```

2. **按照提示配置**
   - 选择项目名称
   - 选择是否链接到现有项目
   - 选择框架（Vite）
   - 设置根目录为 `frontend`

3. **设置环境变量**
   ```bash
   # 设置前端环境变量
   vercel env add VITE_FIREBASE_API_KEY
   vercel env add VITE_FIREBASE_AUTH_DOMAIN
   vercel env add VITE_FIREBASE_PROJECT_ID
   vercel env add VITE_FIREBASE_STORAGE_BUCKET
   vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
   vercel env add VITE_FIREBASE_APP_ID
   
   # 设置后端环境变量
   vercel env add FIREBASE_CREDENTIALS_JSON
   ```

4. **部署到生产环境**
   ```bash
   vercel --prod
   ```

## 🔧 环境变量配置详解

### 获取 Firebase 配置值

从你的 `.env` 文件中复制以下值：

```bash
# 前端配置（从 .env 文件复制）
VITE_FIREBASE_API_KEY=AIzaSyD6Rv5KGv-yE4XDX7hcPZa8eNJz3FiNg-4
VITE_FIREBASE_AUTH_DOMAIN=oorr-a3cb9.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=oorr-a3cb9
VITE_FIREBASE_STORAGE_BUCKET=oorr-a3cb9.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=521800009340
VITE_FIREBASE_APP_ID=1:521800009340:web:7c0e58e6f454663bb1abf9
```

### 获取 Firebase 服务账号 JSON

有两种方式配置后端 Firebase 认证：

**方式1：使用 JSON 字符串（推荐用于 Vercel）**

1. 打开项目根目录的 `firebase-service-account.json` 文件
2. 复制整个 JSON 内容
3. 将其压缩为一行（移除所有换行和多余空格）
4. 在 Vercel Dashboard 中设置 `FIREBASE_CREDENTIALS_JSON` 环境变量

或者使用命令行工具压缩：
```bash
cat firebase-service-account.json | jq -c .
```

**方式2：使用文件路径（不适用于 Vercel）**

Vercel Serverless Functions 不支持文件路径，所以必须使用 JSON 字符串方式。

## 📁 项目结构

```
oorr/
├── api/                          # Vercel Serverless Functions
│   ├── health.py                # 健康检查接口
│   ├── chat.py                  # 聊天接口
│   ├── generate.py              # 生成接口
│   └── requirements.txt         # Python 依赖（包含 firebase-admin）
├── frontend/                    # React 前端应用
│   ├── src/
│   │   ├── lib/
│   │   │   └── firebase.js      # Firebase 客户端配置
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── vercel.json                  # Vercel 配置文件
└── .env                         # 本地环境变量（不提交到 Git）
```

## 🔍 验证部署

部署完成后，访问你的 Vercel 域名（例如：`https://your-project.vercel.app`），你应该能看到：

1. ✅ 前端应用正常加载
2. ✅ 登录页面可以访问
3. ✅ Firebase 认证功能正常

### 测试 API 端点

```bash
# 健康检查
curl https://your-project.vercel.app/api/health

# 应该返回：
# {"status":"healthy","service":"chat2cartoon-backend","version":"1.0.0","platform":"vercel"}
```

## 🛠️ 本地开发

### 使用 Vercel CLI 本地开发

```bash
# 在项目根目录
vercel dev
```

这会启动：
- 前端开发服务器：http://localhost:3000
- API Serverless Functions：http://localhost:3000/api/*

### 使用传统方式本地开发

```bash
# 启动前端
cd frontend
npm run dev

# 启动后端（如果需要）
cd backend
python app.py
```

## 🔐 Firebase 认证配置检查清单

在部署前，确保：

- [ ] Firebase 项目已创建
- [ ] Google 登录已启用（Firebase Console > Authentication > Sign-in method）
- [ ] 邮箱/密码登录已启用
- [ ] 授权域名已配置（Firebase Console > Authentication > Settings > Authorized domains）
  - 添加 `localhost`（用于本地开发）
  - 添加你的 Vercel 域名（例如：`your-project.vercel.app`）
- [ ] 前端环境变量已在 Vercel 中设置
- [ ] 后端 `FIREBASE_CREDENTIALS_JSON` 已在 Vercel 中设置

## 🚨 常见问题

### 问题1：部署后 Firebase 配置缺失警告

**原因**：环境变量未正确设置

**解决**：
1. 检查 Vercel Dashboard 中的环境变量
2. 确保所有 `VITE_FIREBASE_*` 变量都已设置
3. 重新部署项目

### 问题2：API 路由返回 404

**原因**：`vercel.json` 配置不正确或 API 文件路径错误

**解决**：
1. 检查 `vercel.json` 中的 `rewrites` 配置
2. 确保 API 文件位于 `api/` 目录
3. 确保文件名正确（例如：`api/health.py`）

### 问题3：Firebase 认证失败

**原因**：授权域名未配置

**解决**：
1. 在 Firebase Console > Authentication > Settings > Authorized domains
2. 添加你的 Vercel 域名
3. 等待几分钟让配置生效

### 问题4：后端 Firebase Admin SDK 初始化失败

**原因**：`FIREBASE_CREDENTIALS_JSON` 格式错误

**解决**：
1. 检查 JSON 字符串是否正确（必须是完整的一行）
2. 确保所有必需的字段都存在
3. 检查是否有特殊字符需要转义

## 📊 Vercel 计划对比

### 免费计划（Hobby）
- ✅ 无限部署
- ✅ 100GB 带宽/月
- ✅ Serverless Functions（100GB-hours/月）
- ✅ 自动 HTTPS
- ✅ 全球 CDN

### Pro 计划（$20/月）
- ✅ 所有免费功能
- ✅ 无限带宽
- ✅ 更多 Serverless Functions 执行时间
- ✅ 团队协作功能
- ✅ 高级分析

## 🔄 更新部署

每次推送到 Git 仓库的主分支，Vercel 会自动重新部署。

也可以手动触发部署：
```bash
vercel --prod
```

## 📚 相关文档

- [Vercel 官方文档](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Firebase 配置指南](./FIREBASE_SETUP.md)
- [Firebase Admin SDK 文档](https://firebase.google.com/docs/admin/setup)

## ✅ 部署检查清单

- [ ] Vercel 账户已创建
- [ ] 项目已导入到 Vercel
- [ ] 根目录设置为 `frontend`
- [ ] 所有前端环境变量已设置
- [ ] `FIREBASE_CREDENTIALS_JSON` 已设置
- [ ] Firebase 授权域名已配置
- [ ] 部署成功
- [ ] 前端应用可以访问
- [ ] 登录功能测试通过
- [ ] API 端点测试通过

---

配置完成后，你的应用就可以在全球 CDN 上运行了！🎉
