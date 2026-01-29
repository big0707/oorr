# Chat2Cartoon SaaS 项目

基于火山引擎 AI App Lab 的 Chat2Cartoon 项目，支持 Docker 容器化部署。

## ✨ 特性

- 🐳 **Docker 容器化**: 一键启动，快速迁移
- 🔥 **热更新支持**: 前后端都支持代码热重载，提升开发效率
- 🤖 **AI 友好**: 代码结构清晰，便于 AI 辅助开发
- 📦 **前后端分离**: 独立开发、测试和部署
- 🚀 **生产就绪**: 包含开发和生产环境配置

## 📁 项目结构

```
oorr/
├── frontend/              # 前端应用 (React + Vite)
│   ├── src/              # 源代码
│   ├── Dockerfile        # 前端 Docker 配置
│   ├── package.json      # 前端依赖
│   └── vite.config.js    # Vite 配置
├── backend/               # 后端服务 (Flask)
│   ├── app.py            # 主应用文件
│   ├── Dockerfile        # 后端 Docker 配置
│   └── requirements.txt  # Python 依赖
├── scripts/               # 便捷脚本
│   ├── start.sh          # 启动脚本
│   ├── stop.sh           # 停止脚本
│   ├── restart.sh        # 重启脚本
│   └── build-prod.sh     # 生产构建脚本
├── docker-compose.yml     # 开发环境 Docker Compose
├── docker-compose.prod.yml # 生产环境 Docker Compose
├── env.example           # 环境变量示例
├── QUICKSTART.md         # 快速开始指南
├── DEVELOPMENT.md        # 开发指南
└── MIGRATION.md          # 迁移部署指南
```

## 🚀 快速开始

### 前置要求

- Docker 和 Docker Compose
- (可选) Node.js 18+ (本地开发前端)
- (可选) Python 3.9+ (本地开发后端)

### 使用 Docker 启动（推荐）

```bash
# 1. 复制环境变量文件
cp env.example .env

# 2. 启动所有服务（使用启动脚本）
./scripts/start.sh

# 或手动启动
docker-compose up -d

# 3. 查看日志
docker-compose logs -f

# 4. 访问服务
# 前端: http://localhost:3000
# 后端: http://localhost:8000/health
```

详细步骤请查看 [快速开始指南](QUICKSTART.md)

### 本地开发（不使用 Docker）

#### 前端开发

```bash
cd frontend
npm install
npm run dev
```

前端服务运行在 http://localhost:3000

#### 后端开发

```bash
cd backend
pip install -r requirements.txt
python app.py
```

后端服务运行在 http://localhost:8000

## 📚 文档

- [快速开始指南](QUICKSTART.md) - 5分钟快速启动项目
- [开发指南](DEVELOPMENT.md) - 详细的开发说明和最佳实践
- [迁移部署指南](MIGRATION.md) - 如何迁移和部署到生产环境

## 🛠️ 开发说明

### AI 辅助开发优化

- **清晰的代码结构**: 前后端分离，职责明确
- **标准化配置**: ESLint、Prettier、EditorConfig 统一代码风格
- **完善的注释**: 便于 AI 理解代码意图
- **类型提示**: Python 类型提示，JavaScript 类型定义

### 开发特性

- ✅ 前端支持热更新，修改代码自动刷新
- ✅ 后端支持代码热重载，便于快速迭代
- ✅ 所有服务通过 Docker Compose 统一管理
- ✅ 环境变量统一在 `.env` 文件中配置
- ✅ 支持开发和生产环境切换

## 🐳 Docker 迁移

### 快速迁移步骤

1. **构建镜像**: `docker-compose build`
2. **导出镜像**: `docker save` 或推送到镜像仓库
3. **复制配置**: 复制 `docker-compose.yml` 和 `.env` 文件
4. **启动服务**: 在目标环境使用相同的配置启动

详细迁移指南请查看 [迁移部署指南](MIGRATION.md)

## 🔧 常用命令

```bash
# 启动服务
./scripts/start.sh
docker-compose up -d

# 停止服务
./scripts/stop.sh
docker-compose down

# 重启服务
./scripts/restart.sh
docker-compose restart

# 查看日志
docker-compose logs -f

# 重新构建
docker-compose build --no-cache

# 进入容器
docker-compose exec frontend sh
docker-compose exec backend bash
```

## 📝 下一步

1. 查看 [快速开始指南](QUICKSTART.md) 启动项目
2. 查看 [开发指南](DEVELOPMENT.md) 了解开发流程
3. 集成实际的 AI 服务 API
4. 实现卡通生成功能
5. 部署到生产环境

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目基于火山引擎 AI App Lab 的 Chat2Cartoon 项目。
