# 快速开始指南

## 5分钟快速启动

### 1. 前置要求检查

```bash
# 检查 Docker
docker --version
docker-compose --version

# 如果没有安装，请先安装 Docker Desktop
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp env.example .env

# 编辑 .env 文件（可选，默认配置通常可以直接使用）
# nano .env 或 vim .env
```

### 3. 启动服务

```bash
# 方式一：使用启动脚本（推荐）
./scripts/start.sh

# 方式二：手动启动
docker-compose up -d
```

### 4. 验证服务

打开浏览器访问：
- 前端: http://localhost:3000
- 后端健康检查: http://localhost:8000/health

### 5. 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f frontend
docker-compose logs -f backend
```

## 常见操作

### 停止服务
```bash
./scripts/stop.sh
# 或
docker-compose down
```

### 重启服务
```bash
./scripts/restart.sh
# 或
docker-compose restart
```

### 重新构建
```bash
docker-compose build --no-cache
docker-compose up -d
```

### 进入容器调试
```bash
# 进入前端容器
docker-compose exec frontend sh

# 进入后端容器
docker-compose exec backend bash
```

## 开发模式

### 前端开发
代码修改会自动热更新，无需重启容器。

### 后端开发
Flask 开发模式已启用，代码修改会自动重载。

## 下一步

1. 查看 [开发指南](DEVELOPMENT.md) 了解详细开发流程
2. 查看 [迁移指南](MIGRATION.md) 了解如何部署到生产环境
3. 开始集成实际的 AI 服务 API

## 遇到问题？

1. 检查 Docker 是否正常运行
2. 检查端口是否被占用
3. 查看服务日志：`docker-compose logs`
4. 查看 [开发指南](DEVELOPMENT.md) 中的常见问题部分
