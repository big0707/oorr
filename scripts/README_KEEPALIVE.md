# Supabase 保活脚本

Supabase 免费版在 7 天不活跃后会自动暂停项目。本脚本用于定期 ping Supabase 以保持活跃。

## 方案 1: Vercel Cron Job（推荐）

已在 `vercel.json` 中配置，部署到 Vercel 后自动运行：
- 路径: `/api/supabase-keepalive`
- 频率: 每 6 天执行一次

**验证方式**: 部署后访问 `https://your-domain.vercel.app/api/supabase-keepalive`

## 方案 2: 本地脚本

```bash
# 先设置环境变量
export VITE_SUPABASE_URL=https://your-project.supabase.co
export VITE_SUPABASE_ANON_KEY=your-anon-key

# 运行脚本
node scripts/keep-supabase-alive.js
```

## 环境变量

需要在 Vercel Dashboard 中设置：
- `SUPABASE_URL` 或 `VITE_SUPABASE_URL`
- `SUPABASE_ANON_KEY` 或 `VITE_SUPABASE_ANON_KEY`

从 Supabase Dashboard > Project Settings > API 获取。
