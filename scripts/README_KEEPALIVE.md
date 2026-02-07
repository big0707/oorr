# Supabase 保活脚本使用指南

## 📋 概述

Supabase 免费版在 **7 天不活跃后会自动暂停**。这些脚本可以帮助你定期访问 Supabase，保持项目活跃。

## 🚀 使用方法

### 方法 1: 本地运行（开发环境）

#### 步骤 1: 安装依赖

不需要额外依赖，使用 Node.js 内置模块。

#### 步骤 2: 配置环境变量

在项目根目录创建或编辑 `.env` 文件：

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

或者直接设置环境变量：

```bash
export VITE_SUPABASE_URL=https://your-project.supabase.co
export VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### 步骤 3: 运行脚本

**一次性运行：**
```bash
node scripts/keep-supabase-alive.js
```

**后台运行：**
```bash
# 使用 nohup
nohup node scripts/keep-supabase-alive.js > supabase-keepalive.log 2>&1 &

# 查看日志
tail -f supabase-keepalive.log
```

**使用 PM2（推荐）：**
```bash
# 安装 PM2
npm install -g pm2

# 启动脚本
pm2 start scripts/keep-supabase-alive.js --name supabase-keepalive

# 查看状态
pm2 status

# 查看日志
pm2 logs supabase-keepalive

# 停止
pm2 stop supabase-keepalive

# 开机自启
pm2 startup
pm2 save
```

#### 步骤 4: 自定义间隔（可选）

默认每 6 天执行一次，可以自定义：

```bash
# 每 3 天执行一次
SUPABASE_KEEPALIVE_INTERVAL_DAYS=3 node scripts/keep-supabase-alive.js

# 不立即执行，只设置定时任务
SUPABASE_KEEPALIVE_IMMEDIATE=false node scripts/keep-supabase-alive.js
```

### 方法 2: Vercel Cron Job（生产环境，推荐）

#### 步骤 1: 配置已自动完成

`vercel.json` 中已配置了 Cron Job：
```json
{
  "crons": [{
    "path": "/api/supabase-keepalive",
    "schedule": "0 0 */6 * *"  // 每 6 天执行一次
  }]
}
```

#### 步骤 2: 设置环境变量

在 Vercel Dashboard > Settings > Environment Variables 中添加：
- `SUPABASE_URL` 或 `VITE_SUPABASE_URL`
- `SUPABASE_ANON_KEY` 或 `VITE_SUPABASE_ANON_KEY`

#### 步骤 3: 部署

推送到 GitHub，Vercel 会自动部署并启用 Cron Job。

#### 步骤 4: 验证

部署后，可以手动访问测试：
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

### 方法 3: 手动访问（临时方案）

如果不想设置定时任务，可以：
1. 每周访问一次：`https://your-domain.vercel.app/api/supabase-keepalive`
2. 或者使用浏览器书签，定期访问

## ⚙️ 配置说明

### Cron 表达式

Vercel Cron 使用标准 cron 表达式：

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── 星期几 (0-7, 0 和 7 都表示周日)
│ │ │ └───── 月份 (1-12)
│ │ └─────── 日期 (1-31)
│ └───────── 小时 (0-23)
└─────────── 分钟 (0-59)
```

**常用示例：**
- `0 0 */6 * *` - 每 6 天的 00:00 执行
- `0 0 * * 0` - 每周日的 00:00 执行
- `0 0 1 * *` - 每月 1 号的 00:00 执行

### 环境变量

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `VITE_SUPABASE_URL` 或 `SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` 或 `SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✅ |
| `SUPABASE_KEEPALIVE_INTERVAL_DAYS` | 检查间隔（天），默认 6 | ❌ |
| `SUPABASE_KEEPALIVE_IMMEDIATE` | 是否立即执行，默认 true | ❌ |

## 📊 监控和日志

### 本地脚本日志

脚本会输出详细的日志：
```
🚀 Supabase 保活脚本启动
📅 检查间隔: 6 天
🔗 Supabase URL: https://your-project.supabase.co

[2024-02-08T02:30:00.000Z] 🔄 开始 Supabase 保活检查...
[2024-02-08T02:30:01.000Z] ✅ Supabase 保活成功 (状态码: 200)
⏰ 定时任务已设置，每 6 天执行一次
```

### Vercel Cron Job 日志

在 Vercel Dashboard > Logs 中查看：
1. 进入项目
2. 点击 "Logs" 标签
3. 筛选 "Cron" 类型
4. 查看执行记录

## 🔍 故障排除

### 问题 1: 脚本报错 "Supabase 配置缺失"

**解决：**
- 检查 `.env` 文件是否存在
- 确认环境变量名称正确
- 确认值不为空

### 问题 2: 连接失败

**可能原因：**
- Supabase 项目已暂停
- 网络连接问题
- URL 配置错误

**解决：**
1. 访问 https://app.supabase.com 检查项目状态
2. 如果已暂停，点击 "Unpause" 恢复
3. 检查网络连接
4. 验证 URL 和 Key 是否正确

### 问题 3: Vercel Cron Job 不执行

**检查：**
1. Vercel Dashboard > Settings > Cron Jobs
2. 确认 Cron Job 已启用
3. 检查 `vercel.json` 配置是否正确
4. 查看 Vercel 日志中的错误信息

### 问题 4: PM2 脚本停止

**解决：**
```bash
# 查看状态
pm2 status

# 重启
pm2 restart supabase-keepalive

# 查看错误日志
pm2 logs supabase-keepalive --err
```

## ✅ 最佳实践

1. **使用 Vercel Cron Job（推荐）**
   - 自动化，无需维护
   - 免费计划支持
   - 可靠稳定

2. **设置合理的间隔**
   - 建议每 6 天执行一次
   - 确保在 7 天限制之前

3. **监控执行结果**
   - 定期检查 Vercel 日志
   - 设置告警（如果支持）

4. **备用方案**
   - 如果 Cron Job 失败，可以手动访问
   - 或者使用本地脚本作为备份

## 📝 注意事项

- ⚠️ 免费版 Supabase 在 7 天不活跃后会暂停
- ⚠️ 暂停后数据不会丢失，恢复后可以继续使用
- ⚠️ 90 天内可以恢复，超过 90 天需要联系支持
- ✅ 保活脚本只是保持活跃，不会产生额外费用
- ✅ 脚本执行很快，不会影响性能

## 🎯 总结

- **开发环境**：使用本地脚本 `scripts/keep-supabase-alive.js`
- **生产环境**：使用 Vercel Cron Job（已自动配置）
- **临时方案**：手动访问 `/api/supabase-keepalive` 端点

选择最适合你的方案即可！
