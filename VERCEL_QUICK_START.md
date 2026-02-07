# Vercel 快速配置指南

## 🚀 5 分钟快速部署

### 步骤 1: 访问 Vercel Dashboard

1. 打开浏览器，访问：https://vercel.com/dashboard
2. 如果没有账户，点击 "Sign Up" 注册（可以使用 GitHub 账户登录）

### 步骤 2: 导入项目

1. 点击 **"Add New Project"** 或 **"Import Project"**
2. 选择你的 Git 仓库（GitHub/GitLab/Bitbucket）
   - 如果项目还没有推送到 Git，先推送到 GitHub：
     ```bash
     git add .
     git commit -m "Prepare for Vercel deployment"
     git push origin main
     ```
3. 点击 **"Import"**

### 步骤 3: 配置项目设置

在项目配置页面，设置以下内容：

- **Framework Preset**: `Vite`（会自动检测）
- **Root Directory**: `frontend` ⚠️ **重要！必须设置为 `frontend`**
- **Build Command**: `npm run build`（会自动检测）
- **Output Directory**: `dist`（会自动检测）
- **Install Command**: `npm install`（会自动检测）

### 步骤 4: 添加环境变量

1. 在配置页面，找到 **"Environment Variables"** 部分
2. 打开项目根目录的 `vercel-env-vars.txt` 文件
3. 逐个添加以下环境变量：

#### 前端环境变量（6个）

```
VITE_FIREBASE_API_KEY=AIzaSyD6Rv5KGv-yE4XDX7hcPZa8eNJz3FiNg-4
VITE_FIREBASE_AUTH_DOMAIN=oorr-a3cb9.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=oorr-a3cb9
VITE_FIREBASE_STORAGE_BUCKET=oorr-a3cb9.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=521800009340
VITE_FIREBASE_APP_ID=1:521800009340:web:7c0e58e6f454663bb1abf9
```

#### 后端环境变量（1个）

**获取 FIREBASE_CREDENTIALS_JSON：**

运行以下命令生成压缩后的 JSON（推荐）：
```bash
cd /Users/guanjiegan/Desktop/oorr
cat firebase-service-account.json | jq -c .
```

或者手动操作：
1. 打开项目根目录的 `firebase-service-account.json` 文件
2. 复制所有内容
3. 压缩为一行（移除所有换行和多余空格）
4. 设置为环境变量 `FIREBASE_CREDENTIALS_JSON` 的值

**注意**：这个值是一整行 JSON 字符串，不要换行。

**重要提示：**
- 每个变量都要添加到 **Production**、**Preview** 和 **Development** 三个环境
- `FIREBASE_CREDENTIALS_JSON` 的值是一整行，不要换行

### 步骤 5: 部署

1. 点击 **"Deploy"** 按钮
2. 等待部署完成（通常 1-3 分钟）
3. 部署完成后，你会得到一个 URL（例如：`https://your-project.vercel.app`）

### 步骤 6: 配置 Firebase 授权域名

部署完成后，需要在 Firebase 中添加你的 Vercel 域名：

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 选择项目：`oorr-a3cb9`
3. 进入 **Authentication** > **Settings** > **Authorized domains**
4. 点击 **"Add domain"**
5. 输入你的 Vercel 域名（例如：`your-project.vercel.app`）
6. 点击 **"Add"**

### 步骤 7: 测试

1. 访问你的 Vercel 部署 URL
2. 测试登录功能（Google 登录或邮箱登录）
3. 测试 API 端点：`https://your-project.vercel.app/api/health`

## ✅ 完成！

现在你的应用已经部署到 Vercel 了！

## 🔄 后续更新

每次你推送代码到 Git 仓库的主分支，Vercel 会自动重新部署。

## 🆘 遇到问题？

查看详细文档：`VERCEL_FIREBASE_SETUP.md`

常见问题：
- **构建失败**：检查 Root Directory 是否设置为 `frontend`
- **Firebase 配置缺失**：检查环境变量是否正确设置
- **登录失败**：检查 Firebase 授权域名是否已添加
