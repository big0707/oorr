#!/bin/bash

# Firebase API Key 限制检查脚本
# 用于验证 API Key 是否设置了正确的限制

echo "=========================================="
echo "Firebase API Key 安全检查"
echo "=========================================="
echo ""

API_KEY="AIzaSyD6Rv5KGv-yE4XDX7hcPZa8eNJz3FiNg-4"
PROJECT_ID="oorr-a3cb9"

echo "📋 你的配置信息："
echo "  API Key: $API_KEY"
echo "  Project ID: $PROJECT_ID"
echo ""

echo "🔍 检查步骤："
echo ""
echo "1. 访问 Google Cloud Console："
echo "   https://console.cloud.google.com/apis/credentials?project=$PROJECT_ID"
echo ""
echo "2. 找到 API Key: $API_KEY"
echo ""
echo "3. 点击 API Key 进入编辑页面"
echo ""
echo "4. 检查以下设置："
echo ""
echo "   ✅ Application restrictions:"
echo "      - 选择 'HTTP referrers (web sites)'"
echo "      - 添加以下域名："
echo "        • https://oorr-pi.vercel.app/*"
echo "        • https://*.vercel.app/*"
echo "        • http://localhost:*"
echo "        • http://127.0.0.1:*"
echo ""
echo "   ✅ API restrictions:"
echo "      - 选择 'Restrict key'"
echo "      - 启用以下 API："
echo "        • Firebase Authentication API"
echo "        • Firebase App Check API"
echo "        • Firebase Installations API"
echo "        • Firebase Remote Config API"
echo ""
echo "5. 点击 'Save' 保存"
echo ""
echo "=========================================="
echo ""

# 尝试测试 API Key（需要网络）
echo "🧪 测试 API Key（可选）..."
echo ""

# 检查是否可以访问 Firebase（这不会验证限制，但可以检查 API Key 是否有效）
if command -v curl &> /dev/null; then
    echo "正在测试 API Key 有效性..."
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=$API_KEY" \
        -X POST \
        -H "Content-Type: application/json" \
        -d '{"email":"test@example.com","password":"test123456"}' 2>/dev/null)
    
    if [ "$response" = "400" ] || [ "$response" = "200" ]; then
        echo "✅ API Key 有效（HTTP $response）"
        echo "   注意：这只能验证 API Key 是否有效，不能验证限制设置"
    else
        echo "⚠️  API Key 测试返回: HTTP $response"
        echo "   如果返回 403，可能是限制设置过于严格"
    fi
else
    echo "⚠️  未安装 curl，跳过测试"
fi

echo ""
echo "=========================================="
echo "✅ 检查完成！"
echo ""
echo "📚 详细步骤请查看：FIREBASE_API_KEY_SECURITY.md"
echo "=========================================="
