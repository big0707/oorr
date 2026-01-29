#!/bin/bash

# Chat2Cartoon 项目停止脚本

echo "🛑 停止 Chat2Cartoon 服务..."

docker-compose down

echo "✅ 服务已停止"
