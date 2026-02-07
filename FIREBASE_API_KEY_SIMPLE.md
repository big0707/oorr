# Firebase API Key 安全设置 - 简化版

## 🤔 为什么需要 Google Cloud Console？

Firebase 是 Google 的产品，所以 API Key 的管理在 Google Cloud Console 中。但操作很简单，**点击就会自动跳转**！

## 🚀 超简单步骤（3步搞定）

### 步骤 1: 打开 Firebase Console

1. 访问：https://console.firebase.google.com/
2. 选择项目：**oorr-a3cb9**
3. 点击左侧 ⚙️ **Project Settings**（项目设置）

### 步骤 2: 找到 API Key 并点击

1. 在 **General** 标签页
2. 向下滚动到 **Your apps** 部分
3. 找到你的 Web App（`</>` 图标）
4. 点击 Web App 卡片
5. 找到 **API Key** 字段
6. **直接点击 API Key 值**（`AIzaSyD6Rv5KGv-yE4XDX7hcPZa8eNJz3FiNg-4`）
   - ✅ 会自动跳转到 Google Cloud Console！
   - ✅ 不需要手动找！

### 步骤 3: 设置限制（在跳转后的页面）

跳转后会自动打开编辑页面，然后：

1. **Application restrictions** 部分：
   - 选择 **HTTP referrers (web sites)**
   - 点击 **Add an item**
   - 添加：
     ```
     https://oorr-pi.vercel.app/*
     https://*.vercel.app/*
     http://localhost:*
     ```

2. **API restrictions** 部分：
   - 选择 **Restrict key**
   - 勾选：
     - ✅ Firebase Authentication API
     - ✅ Firebase App Check API
     - ✅ Firebase Installations API

3. 点击 **Save**（保存）

## ✅ 完成！

就这么简单！虽然需要跳转到 Google Cloud Console，但**点击 API Key 就会自动跳转**，不需要手动找。

## 🎯 如果不想设置限制（可选）

**实际上，不设置限制也可以！**

Firebase API Key 设计上就是公开的（前端代码中会使用），设置限制只是**额外的安全措施**。

如果你觉得太复杂，可以：
- ✅ 暂时不设置限制
- ✅ 应用仍然可以正常工作
- ✅ 以后有时间再设置

## 📝 总结

- **需要 Google Cloud Console？** 是的，但点击 API Key 会自动跳转
- **必须设置限制？** 不是必须的，只是推荐
- **不设置会怎样？** 应用仍然可以正常工作，只是安全性稍低

**建议：** 如果觉得复杂，可以先不设置，应用部署后测试一下，如果一切正常，限制可以以后再设置。
