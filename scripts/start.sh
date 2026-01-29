#!/bin/bash

# Chat2Cartoon 项目启动脚本

set -e

echo "🚀 启动 Chat2Cartoon 开发环境..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行，请先启动 Docker"
    exit 1
fi

# 检查是否存在 .env 文件
if [ ! -f .env ]; then
    echo "⚠️  未找到 .env 文件，正在创建..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ 已从 .env.example 创建 .env 文件，请根据需要修改配置"
    else
        echo "❌ 未找到 .env.example 文件"
        exit 1
    fi
fi

# 构建并启动服务
echo "📦 构建 Docker 镜像..."
docker-compose build

echo "🔧 启动服务..."
docker-compose up -d

echo "⏳ 等待服务启动..."
sleep 5

# 检查服务状态
echo "📊 服务状态："
docker-compose ps

echo ""
echo "✅ 服务已启动！"
echo "🌐 前端地址: http://localhost:3000"
echo "🔌 后端地址: http://localhost:8000"
echo ""
echo "查看日志: docker-compose logs -f"
echo "停止服务: docker-compose down"
