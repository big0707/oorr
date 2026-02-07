# Supabase 自动保活脚本设置指南

## ✅ 当前状态检查

### 已完成的配置

1. ✅ **Cron Job 配置** (`vercel.json`)
   - 路径：`/api/supabase-keepalive`
   - 执行频率：每 6 天执行一次 (`0 0 */6 * *`)

2. ✅ **API 文件** (`api/supabase-keepalive.py`)
   - Supabase 保活 API 已创建
   - 包含错误处理和暂停检测

3. ✅ **代码已推送**
   - 已推送到 `vercel-setup` 分支

## 🚀 完成设置的步骤

### 步骤 1: 在 Vercel Dashboard 中添加 Supabase 环境变量

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 进入你的项目
3. 进入 **Settings** > **Environment Variables**
4. 添加以下环境变量：

#### 必需的环境变量：

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

或者使用 `VITE_` 前缀（如果前端也需要）：

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**重要提示：**
- ✅ 添加到 **Production**、**Preview** 和 **Development** 三个环境
- ✅ 值不要有多余的空格
- ✅ 确保 URL 和 Key 都是正确的

### 步骤 2: 确认使用 vercel-setup 分支

1. Vercel Dashboard > **Settings** > **Git**
2. 检查 **Production Branch** 是否为 `vercel-setup`
3. 如果不是，改为 `vercel-setup` 并保存

### 步骤 3: 部署项目

#### 方式 1: 自动部署（如果已连接 GitHub）
- 代码已推送，Vercel 会自动部署

#### 方式 2: 手动触发
1. Vercel Dashboard > **Deployments**
2. 点击 **Redeploy** 或创建新部署

### 步骤 4: 验证 Cron Job

部署完成后：

1. **检查 Cron Job 配置**
   - Vercel Dashboard > **Settings** > **Cron Jobs**
   - 应该看到：`/api/supabase-keepalive` - `0 0 */6 * *`

2. **手动测试 API**
   访问：
   ```
   https://your-domain.vercel.app/api/supabase-keepalive
   ```
   
   应该返回：
   ```json
   {
     "success": true,
     "message": "Supabase 保活成功",
     "status_code": 200,
     "timestamp": "2024-02-08T02:30:00.000Z",
     "service": "supabase-keepalive"
   }
   ```

3. **查看执行日志**
   - Vercel Dashboard > **Logs**
   - 筛选类型：**Cron**
   - 查看执行记录

## 📋 获取 Supabase 配置值

### 如果你还没有 Supabase 项目：

1. 访问 [Supabase](https://supabase.com)
2. 创建账户并登录
3. 创建新项目
4. 等待项目初始化完成

### 获取配置值：

1. Supabase Dashboard > **Project Settings** > **API**
2. 复制以下值：
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public key**: `your-anon-key`

### 如果你的 Supabase 项目已暂停：

1. 访问 [Supabase Dashboard](https://app.supabase.com)
2. 找到被暂停的项目
3. 点击 **Unpause** 恢复项目
4. 等待几分钟让项目恢复
5. 然后继续设置环境变量

## 🔍 验证清单

完成以下检查：

- [ ] Supabase 项目已创建或已恢复
- [ ] 已获取 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY`
- [ ] 已在 Vercel Dashboard 中添加环境变量
- [ ] 环境变量已添加到所有环境（Production, Preview, Development）
- [ ] Production Branch 设置为 `vercel-setup`
- [ ] 项目已部署到 Vercel
- [ ] 手动访问 `/api/supabase-keepalive` 返回成功
- [ ] Vercel Dashboard > Settings > Cron Jobs 显示配置

## 🧪 测试步骤

### 1. 手动测试 API

访问：
```
https://your-domain.vercel.app/api/supabase-keepalive
```

**成功响应：**
```json
{
  "success": true,
  "message": "Supabase 保活成功",
  "status_code": 200,
  "timestamp": "2024-02-08T02:30:00.000Z",
  "service": "supabase-keepalive"
}
```

**如果 Supabase 已暂停：**
```json
{
  "success": false,
  "message": "Supabase 项目可能已暂停，请访问 https://app.supabase.com 恢复",
  "status_code": 0,
  "timestamp": "2024-02-08T02:30:00.000Z",
  "service": "supabase-keepalive"
}
```

### 2. 检查 Cron Job 执行

1. Vercel Dashboard > **Logs**
2. 筛选类型：**Cron**
3. 查看是否有执行记录

**注意：** Cron Job 每 6 天执行一次，所以可能不会立即看到执行记录。

## 🆘 故障排除

### 问题 1: API 返回 "Supabase 配置缺失"

**原因：** 环境变量未设置

**解决：**
1. 检查 Vercel Dashboard > Settings > Environment Variables
2. 确认 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY` 已添加
3. 确认值正确且没有多余空格
4. 重新部署项目

### 问题 2: API 返回 "Supabase 项目可能已暂停"

**原因：** Supabase 项目已暂停

**解决：**
1. 访问 https://app.supabase.com
2. 找到被暂停的项目
3. 点击 **Unpause** 恢复
4. 等待几分钟后再次测试

### 问题 3: Cron Job 没有执行

**检查：**
1. Vercel Dashboard > Settings > Cron Jobs
2. 确认显示 `/api/supabase-keepalive`
3. 确认 `vercel.json` 中配置了 `crons`
4. 确认文件 `api/supabase-keepalive.py` 存在

**注意：** Cron Job 每 6 天执行一次，不会立即执行。

### 问题 4: 找不到 Cron Jobs 设置

**可能原因：**
- Vercel 免费计划可能不支持 Cron Jobs（需要确认）
- 或者设置位置不同

**解决：**
- 检查 Vercel Dashboard > Settings
- 或者使用手动访问 API 的方式

## 📝 手动保活方案（备用）

如果 Cron Job 不可用，可以：

1. **定期手动访问**
   - 每周访问一次：`https://your-domain.vercel.app/api/supabase-keepalive`
   - 或者设置浏览器书签

2. **使用本地脚本**
   - 运行：`node scripts/keep-supabase-alive.js`
   - 使用 PM2 保持运行

3. **使用外部 Cron 服务**
   - 使用 [cron-job.org](https://cron-job.org) 等免费服务
   - 设置每周访问一次 API

## ✅ 完成！

设置完成后，Supabase 保活脚本会：
- ✅ 每 6 天自动执行一次
- ✅ 保持 Supabase 项目活跃
- ✅ 避免 7 天不活跃后被暂停
- ✅ 完全自动化，无需手动操作

## 📚 相关文档

- [Supabase 保活脚本使用指南](scripts/README_KEEPALIVE.md)
- [Vercel Cron Job 部署指南](VERCEL_CRON_SETUP.md)
- [Supabase 健康检查文档](SUPABASE_HEALTH_CHECK.md)

---

**提示：** 如果遇到问题，可以随时手动访问 API 来测试和保活。
