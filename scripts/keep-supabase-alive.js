#!/usr/bin/env node

/**
 * Supabase 保活脚本
 * 定期访问 Supabase 以保持项目活跃，避免 7 天不活跃后被暂停
 * 
 * 使用方法：
 * 1. 本地运行：node scripts/keep-supabase-alive.js
 * 2. 后台运行：nohup node scripts/keep-supabase-alive.js > supabase-keepalive.log 2>&1 &
 * 3. 使用 PM2：pm2 start scripts/keep-supabase-alive.js --name supabase-keepalive
 */

const https = require('https');
const http = require('http');

// 从环境变量读取 Supabase 配置
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// 检查间隔（默认每 6 天执行一次，确保在 7 天限制之前）
const CHECK_INTERVAL_DAYS = process.env.SUPABASE_KEEPALIVE_INTERVAL_DAYS || 6;
const CHECK_INTERVAL_MS = CHECK_INTERVAL_DAYS * 24 * 60 * 60 * 1000;

// 立即执行一次，然后按间隔执行
const RUN_IMMEDIATELY = process.env.SUPABASE_KEEPALIVE_IMMEDIATE !== 'false';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Supabase 配置缺失！');
  console.error('请设置环境变量：');
  console.error('  - VITE_SUPABASE_URL 或 SUPABASE_URL');
  console.error('  - VITE_SUPABASE_ANON_KEY 或 SUPABASE_ANON_KEY');
  console.error('');
  console.error('或者创建 .env 文件并添加：');
  console.error('  VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('  VITE_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

/**
 * 执行 Supabase 保活请求
 */
async function keepSupabaseAlive() {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] 🔄 开始 Supabase 保活检查...`);

  try {
    // 方法1: 使用 Supabase REST API 进行简单的查询
    // 这会触发 Supabase 项目活动，避免被暂停
    const url = new URL(`${SUPABASE_URL}/rest/v1/`);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: '/rest/v1/',
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`[${timestamp}] ✅ Supabase 保活成功 (状态码: ${res.statusCode})`);
            resolve({ success: true, statusCode: res.statusCode });
          } else if (res.statusCode === 404) {
            // 404 也是正常的，说明 Supabase 服务是活跃的
            console.log(`[${timestamp}] ✅ Supabase 服务活跃 (状态码: ${res.statusCode})`);
            resolve({ success: true, statusCode: res.statusCode });
          } else {
            console.warn(`[${timestamp}] ⚠️  Supabase 响应异常 (状态码: ${res.statusCode})`);
            console.warn(`响应内容: ${data.substring(0, 200)}`);
            resolve({ success: true, statusCode: res.statusCode }); // 仍然算成功，因为服务是活跃的
          }
        });
      });

      req.on('error', (error) => {
        console.error(`[${timestamp}] ❌ Supabase 保活失败:`, error.message);
        
        // 检查是否是暂停相关的错误
        if (error.message.includes('ECONNREFUSED') || 
            error.message.includes('ENOTFOUND') ||
            error.message.includes('timeout')) {
          console.error('⚠️  可能的原因：');
          console.error('  1. Supabase 项目已暂停（7天不活跃会自动暂停）');
          console.error('  2. 网络连接问题');
          console.error('  3. Supabase URL 配置错误');
          console.error('');
          console.error('请访问 https://app.supabase.com 检查项目状态');
        }
        
        reject(error);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('请求超时'));
      });

      req.end();
    });
  } catch (error) {
    console.error(`[${timestamp}] ❌ 执行保活请求时出错:`, error.message);
    throw error;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 Supabase 保活脚本启动');
  console.log(`📅 检查间隔: ${CHECK_INTERVAL_DAYS} 天`);
  console.log(`🔗 Supabase URL: ${SUPABASE_URL}`);
  console.log('');

  // 立即执行一次（如果启用）
  if (RUN_IMMEDIATELY) {
    try {
      await keepSupabaseAlive();
    } catch (error) {
      console.error('首次执行失败，但会继续运行定时任务');
    }
  }

  // 设置定时任务
  setInterval(async () => {
    try {
      await keepSupabaseAlive();
    } catch (error) {
      console.error('定时任务执行失败:', error.message);
      // 即使失败也继续运行，下次再试
    }
  }, CHECK_INTERVAL_MS);

  console.log(`⏰ 定时任务已设置，每 ${CHECK_INTERVAL_DAYS} 天执行一次`);
  console.log('💡 提示：按 Ctrl+C 停止脚本');
  console.log('');
}

// 处理进程退出
process.on('SIGINT', () => {
  console.log('\n👋 正在停止 Supabase 保活脚本...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 正在停止 Supabase 保活脚本...');
  process.exit(0);
});

// 启动脚本
main().catch((error) => {
  console.error('脚本启动失败:', error);
  process.exit(1);
});
