#!/bin/bash

# 构建生产环境镜像

set -e

echo "🏗️  构建生产环境镜像..."

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "❌ 未找到 .env 文件，请先创建并配置"
    exit 1
fi

# 构建生产镜像
docker-compose -f docker-compose.prod.yml build

echo "✅ 生产镜像构建完成"
echo ""
echo "启动生产环境: docker-compose -f docker-compose.prod.yml up -d"
echo "导出镜像: docker save <image_name> | gzip > image.tar.gz"
