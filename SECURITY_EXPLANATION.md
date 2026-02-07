# 安全说明：敏感信息和分支使用

## 🔒 敏感信息说明

### vercel-setup 分支中的敏感信息

#### ✅ 已安全处理

1. **Firebase API Key** (`vercel-env-vars.txt`)
   - **状态**: ⚠️ 包含真实的 API Key
   - **风险**: 低（API Key 是公开的，但有域名限制）
   - **说明**: Firebase API Key 设计上是公开的，但应该：
     - 在 Firebase Console 中设置 HTTP referrer 限制
     - 只允许你的域名使用
     - 即使泄露，没有域名限制也无法使用

2. **Firebase 服务账号密钥** (`FIREBASE_CREDENTIALS_JSON`)
   - **状态**: ✅ 只是占位符，不是真实密钥
   - **说明**: 文件中只有示例值，真实的密钥需要：
     - 从 `firebase-service-account.json` 文件获取（本地文件，不提交）
     - 在 Vercel Dashboard 中手动设置环境变量

3. **firebase-service-account.json**
   - **状态**: ✅ 已添加到 `.gitignore`，不会被提交
   - **说明**: 这个文件包含真实的私钥，只在本地存在

### ⚠️ 需要注意的问题

**`vercel-env-vars.txt` 文件包含真实的 Firebase API Key**

这个文件在仓库中是**公开的**（如果仓库是公开的）。虽然 Firebase API Key 设计上是公开的，但最好：

1. **设置 API Key 限制**（推荐）
   - Firebase Console > Project Settings > General
   - 找到你的 Web App
   - 点击 API Key
   - 设置 "Application restrictions" > "HTTP referrers"
   - 添加：`https://your-domain.vercel.app/*`

2. **或者移除真实值**（更安全）
   - 将 `vercel-env-vars.txt` 中的真实值改为占位符
   - 只在本地保留真实值

## 🌐 分支是否公开？

### 如果仓库是公开的

- ✅ **代码是公开的**：任何人都可以看到
- ⚠️ **API Key 是公开的**：但通常可以设置限制
- ✅ **私钥是安全的**：`firebase-service-account.json` 不会被提交

### 如果仓库是私有的

- ✅ **代码是私有的**：只有你有权限访问
- ✅ **API Key 是私有的**：但仍然建议设置限制
- ✅ **私钥是安全的**：完全私有

## 📍 分支的使用场景

### vercel-setup 分支的用途

这个分支**不是只在 Vercel 上使用**，而是：

1. **Git 仓库中的分支**
   - 可以推送到 GitHub/GitLab/Bitbucket
   - 可以被任何人克隆（如果仓库公开）
   - 是一个普通的 Git 分支

2. **Vercel 如何使用**
   - Vercel 连接到你的 Git 仓库
   - 你可以选择使用哪个分支部署
   - 选择 `vercel-setup` 分支后，Vercel 会：
     - 拉取这个分支的代码
     - 构建和部署
     - 使用这个分支的配置

3. **本地也可以使用**
   - 可以克隆到本地
   - 可以本地开发
   - 可以运行测试

## 🔐 安全建议

### 方案 1: 移除敏感信息（推荐）

修改 `vercel-env-vars.txt`，使用占位符：

```bash
# 前端环境变量（必须以 VITE_ 开头）
VITE_FIREBASE_API_KEY=your-firebase-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
# ... 其他使用占位符
```

然后在文档中说明如何获取真实值。

### 方案 2: 设置 API Key 限制（必须做）

即使保留真实值，也要设置限制：

1. Firebase Console > Project Settings > General
2. 找到你的 Web App
3. 点击 API Key
4. 设置 "Application restrictions" > "HTTP referrers"
5. 添加你的域名：
   - `https://your-domain.vercel.app/*`
   - `https://*.vercel.app/*`（允许所有 Vercel 子域名）
   - `http://localhost:*`（本地开发）

### 方案 3: 使用私有仓库

如果仓库是私有的，敏感信息相对安全，但仍建议设置 API Key 限制。

## 📋 当前状态检查清单

- [ ] 检查仓库是否公开
- [ ] 如果公开，考虑移除 `vercel-env-vars.txt` 中的真实值
- [ ] 在 Firebase Console 中设置 API Key 限制
- [ ] 确认 `firebase-service-account.json` 在 `.gitignore` 中
- [ ] 确认真实的私钥只在 Vercel Dashboard 环境变量中

## 🛡️ 最佳实践

1. **永远不要提交私钥**
   - ✅ `firebase-service-account.json` 已在 `.gitignore` 中
   - ✅ 真实的 `FIREBASE_CREDENTIALS_JSON` 只在 Vercel 环境变量中

2. **API Key 可以公开，但要设置限制**
   - Firebase API Key 设计上是公开的
   - 但必须设置 HTTP referrer 限制
   - 这样即使泄露也无法滥用

3. **使用环境变量存储敏感信息**
   - ✅ Vercel Dashboard 中的环境变量是加密的
   - ✅ 不会出现在代码中
   - ✅ 只有部署时才会注入

4. **定期轮换密钥**
   - 如果怀疑泄露，可以在 Firebase Console 中重新生成
   - 更新 Vercel 环境变量

## 💡 总结

### vercel-setup 分支：

- ✅ **是公开的**（如果仓库公开）
- ✅ **包含 API Key**（但可以设置限制）
- ✅ **不包含私钥**（私钥只在本地和 Vercel 环境变量中）
- ✅ **可以在任何地方使用**（不只是 Vercel）

### 建议操作：

1. **立即设置 API Key 限制**（最重要）
2. **考虑移除 `vercel-env-vars.txt` 中的真实值**
3. **使用占位符，在文档中说明如何获取**

需要我帮你修改 `vercel-env-vars.txt`，移除真实值并使用占位符吗？
