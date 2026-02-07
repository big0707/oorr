# Firebase API Key 安全设置指南

## 🔒 为什么需要设置 API Key 限制？

Firebase API Key 是公开的（前端代码中会使用），但我们可以通过设置 HTTP referrer 限制来防止滥用：
- ✅ 只允许你的域名使用
- ✅ 即使 API Key 泄露，也无法在其他域名使用
- ✅ 提高安全性

## 📋 设置步骤

### 步骤 1: 访问 Firebase Console

1. 打开浏览器，访问：https://console.firebase.google.com/
2. 登录你的 Google 账户
3. 选择项目：**oorr-a3cb9**

### 步骤 2: 找到 API Key

1. 点击左侧菜单的 **⚙️ Project Settings**（项目设置）
2. 在页面顶部，点击 **General**（常规）标签
3. 向下滚动到 **Your apps**（你的应用）部分
4. 找到你的 Web App（应该显示为 `</>` 图标）
5. 点击 Web App 卡片

### 步骤 3: 查看 API Key

在 Web App 详情页面，你会看到：
- **App ID**: `1:521800009340:web:7c0e58e6f454663bb1abf9`
- **API Key**: `AIzaSyD6Rv5KGv-yE4XDX7hcPZa8eNJz3FiNg-4`

### 步骤 4: 设置 API Key 限制

**⚠️ 重要说明：**
Firebase API Key 的管理实际上在 Google Cloud Console 中（因为 Firebase 是 Google 的产品），但操作很简单！

**方法 1: 从 Firebase Console 直接跳转（推荐）**

1. 在 Firebase Console 的 Web App 详情页面
2. 找到 **API Key** 字段
3. 点击 API Key 值本身（`AIzaSyD6Rv5KGv-yE4XDX7hcPZa8eNJz3FiNg-4`）
   - 这会**自动跳转**到 Google Cloud Console 的编辑页面
   - 你不需要手动找，点击就会跳转！

**方法 2: 直接访问（如果方法 1 不行）**

直接打开这个链接（会自动跳转到你的 API Key 设置）：
```
https://console.cloud.google.com/apis/credentials?project=oorr-a3cb9
```

然后：
1. 找到 API Key：`AIzaSyD6Rv5KGv-yE4XDX7hcPZa8eNJz3FiNg-4`
2. 点击 API Key 名称进入编辑页面

3. 在 **Application restrictions**（应用限制）部分：
   - 选择 **HTTP referrers (web sites)**（HTTP 引用来源（网站））
   - 点击 **Add an item**（添加项目）

4. 添加以下域名（逐个添加）：

   ```
   https://oorr-pi.vercel.app/*
   https://*.vercel.app/*
   http://localhost:*
   http://127.0.0.1:*
   ```

   **说明：**
   - `https://oorr-pi.vercel.app/*` - 你的主域名
   - `https://*.vercel.app/*` - 所有 Vercel 子域名（预览部署等）
   - `http://localhost:*` - 本地开发
   - `http://127.0.0.1:*` - 本地开发（IP 地址）

5. 在 **API restrictions**（API 限制）部分：
   - 选择 **Restrict key**（限制密钥）
   - 选择以下 API：
     - ✅ Firebase Authentication API
     - ✅ Firebase App Check API
     - ✅ Firebase Installations API
     - ✅ Firebase Remote Config API
     - ✅ Firebase Storage API（如果使用）

6. 点击 **Save**（保存）按钮

### 步骤 5: 验证设置

1. 等待几分钟让设置生效（通常立即生效）
2. 访问你的应用：https://oorr-pi.vercel.app
3. 测试登录功能是否正常
4. 如果出现错误，检查浏览器控制台的错误信息

## 🖼️ 可视化步骤（参考）

### 在 Firebase Console 中：

```
Firebase Console
├── Project Settings (⚙️)
│   ├── General
│   │   └── Your apps
│   │       └── Web App (</>)
│   │           └── API Key: AIzaSyD6Rv5KGv-yE4XDX7hcPZa8eNJz3FiNg-4
│   │               └── [点击进入 Google Cloud Console]
```

### 在 Google Cloud Console 中：

```
Google Cloud Console
├── APIs & Services
│   └── Credentials
│       └── API Key: AIzaSyD6Rv5KGv-yE4XDX7hcPZa8eNJz3FiNg-4
│           ├── Application restrictions
│           │   └── HTTP referrers (web sites)
│           │       ├── https://oorr-pi.vercel.app/*
│           │       ├── https://*.vercel.app/*
│           │       ├── http://localhost:*
│           │       └── http://127.0.0.1:*
│           └── API restrictions
│               └── Restrict key
│                   ├── Firebase Authentication API ✅
│                   ├── Firebase App Check API ✅
│                   └── ...
```

## ⚠️ 注意事项

1. **设置生效时间**
   - 通常立即生效
   - 如果不行，等待 5-10 分钟

2. **本地开发**
   - 确保添加了 `http://localhost:*`
   - 否则本地开发会失败

3. **Vercel 预览部署**
   - 添加 `https://*.vercel.app/*` 可以覆盖所有预览部署
   - 或者为每个预览域名单独添加

4. **如果设置错误**
   - 可以随时编辑 API Key 设置
   - 如果应用无法访问，检查域名是否正确

## 🔍 验证清单

完成设置后，确认：

- [ ] 已选择 "HTTP referrers (web sites)"
- [ ] 已添加 `https://oorr-pi.vercel.app/*`
- [ ] 已添加 `https://*.vercel.app/*`
- [ ] 已添加 `http://localhost:*`
- [ ] 已选择 "Restrict key" 并选择了必要的 API
- [ ] 已点击 "Save" 保存设置
- [ ] 已测试应用是否正常工作

## 🆘 常见问题

### 问题 1: 找不到 API Key 设置

**解决：**
- 确保在 Google Cloud Console 中，而不是 Firebase Console
- 点击 API Key 后会跳转到 Google Cloud Console

### 问题 2: 设置后应用无法访问

**原因：** 域名配置错误

**解决：**
- 检查域名是否正确（包括 `https://` 和 `/*`）
- 确保添加了本地开发域名
- 检查 Vercel 域名是否正确

### 问题 3: 本地开发失败

**原因：** 没有添加 localhost

**解决：**
- 添加 `http://localhost:*`
- 添加 `http://127.0.0.1:*`

### 问题 4: 预览部署失败

**原因：** 没有添加 Vercel 预览域名

**解决：**
- 添加 `https://*.vercel.app/*`（推荐）
- 或者为每个预览域名单独添加

## 📝 快速参考

**你的 API Key**: `AIzaSyD6Rv5KGv-yE4XDX7hcPZa8eNJz3FiNg-4`

**需要添加的域名**:
```
https://oorr-pi.vercel.app/*
https://*.vercel.app/*
http://localhost:*
http://127.0.0.1:*
```

**需要启用的 API**:
- Firebase Authentication API
- Firebase App Check API
- Firebase Installations API
- Firebase Remote Config API

## ✅ 完成！

设置完成后，你的 Firebase API Key 就有了安全保护：
- ✅ 只能在你的域名下使用
- ✅ 即使泄露也无法滥用
- ✅ 提高了应用安全性

---

**提示**：如果遇到问题，可以随时编辑 API Key 设置进行调整。
