#!/bin/bash

# Vercel 环境变量准备脚本
# 此脚本帮助你将本地 .env 文件中的 Firebase 配置转换为 Vercel 环境变量格式

echo "=========================================="
echo "Vercel 环境变量准备工具"
echo "=========================================="
echo ""

# 检查 .env 文件是否存在
if [ ! -f ".env" ]; then
    echo "❌ 错误: .env 文件不存在"
    echo "请先创建 .env 文件并配置 Firebase"
    exit 1
fi

echo "📋 从 .env 文件读取 Firebase 配置..."
echo ""

# 读取前端环境变量
echo "=== 前端环境变量（复制到 Vercel Dashboard）==="
echo ""
grep "^VITE_FIREBASE" .env | while IFS= read -r line; do
    echo "$line"
done

echo ""
echo "=== 后端环境变量（FIREBASE_CREDENTIALS_JSON）==="
echo ""

# 检查 firebase-service-account.json 是否存在
if [ ! -f "firebase-service-account.json" ]; then
    echo "❌ 警告: firebase-service-account.json 文件不存在"
    echo "请先下载 Firebase 服务账号密钥文件"
    echo ""
else
    echo "正在压缩 JSON 文件..."
    
    # 检查是否安装了 jq
    if command -v jq &> /dev/null; then
        # 使用 jq 压缩 JSON
        COMPRESSED_JSON=$(cat firebase-service-account.json | jq -c .)
        echo "FIREBASE_CREDENTIALS_JSON=$COMPRESSED_JSON"
        echo ""
        echo "💡 提示: 复制上面的整行（包括 FIREBASE_CREDENTIALS_JSON=）到 Vercel Dashboard"
    else
        echo "⚠️  未安装 jq，无法自动压缩 JSON"
        echo "请手动将 firebase-service-account.json 的内容压缩为一行"
        echo "或者安装 jq: brew install jq (macOS) 或 apt-get install jq (Linux)"
        echo ""
        echo "手动步骤："
        echo "1. 打开 firebase-service-account.json"
        echo "2. 复制所有内容"
        echo "3. 移除所有换行和多余空格"
        echo "4. 在 Vercel Dashboard 中设置 FIREBASE_CREDENTIALS_JSON 环境变量"
    fi
fi

echo ""
echo "=========================================="
echo "✅ 配置完成！"
echo ""
echo "下一步："
echo "1. 访问 https://vercel.com/dashboard"
echo "2. 选择你的项目"
echo "3. 进入 Settings > Environment Variables"
echo "4. 添加上面列出的所有环境变量"
echo "5. 重新部署项目"
echo "=========================================="
