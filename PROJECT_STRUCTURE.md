# 项目结构说明

## 目录树

```
oorr/
│
├── frontend/                    # 前端应用目录
│   ├── src/                    # 源代码目录
│   │   ├── App.jsx            # 主应用组件
│   │   ├── App.css            # 应用样式
│   │   ├── main.jsx           # 入口文件
│   │   └── index.css          # 全局样式
│   ├── index.html             # HTML 模板
│   ├── package.json           # 前端依赖配置
│   ├── vite.config.js         # Vite 构建配置
│   ├── Dockerfile             # 前端 Docker 配置（多阶段构建）
│   ├── nginx.conf             # Nginx 配置（生产环境）
│   ├── .dockerignore          # Docker 忽略文件
│   ├── .eslintrc.json         # ESLint 配置
│   └── .prettierrc            # Prettier 配置
│
├── backend/                    # 后端服务目录
│   ├── app.py                 # Flask 主应用
│   ├── requirements.txt       # Python 依赖
│   ├── Dockerfile             # 后端 Docker 配置（多阶段构建）
│   ├── .dockerignore          # Docker 忽略文件
│   └── .env.example           # 后端环境变量示例
│
├── scripts/                    # 便捷脚本目录
│   ├── start.sh               # 启动脚本
│   ├── stop.sh                # 停止脚本
│   ├── restart.sh             # 重启脚本
│   └── build-prod.sh          # 生产构建脚本
│
├── docker-compose.yml          # 开发环境 Docker Compose 配置
├── docker-compose.prod.yml     # 生产环境 Docker Compose 配置
├── .dockerignore              # 根目录 Docker 忽略文件
├── .editorconfig              # 编辑器配置（便于 AI 代码生成）
├── .gitignore                 # Git 忽略文件
│
├── env.example                # 环境变量示例文件
├── README.md                  # 项目主文档
├── QUICKSTART.md              # 快速开始指南
├── DEVELOPMENT.md             # 开发指南
├── MIGRATION.md               # 迁移部署指南
└── PROJECT_STRUCTURE.md        # 本文件
```

## 技术栈

### 前端
- **框架**: React 18
- **构建工具**: Vite 5
- **语言**: JavaScript (ES6+)
- **样式**: CSS3
- **代码质量**: ESLint + Prettier

### 后端
- **框架**: Flask 3.0
- **语言**: Python 3.11
- **服务器**: Gunicorn (生产环境)
- **API**: RESTful API

### 容器化
- **容器**: Docker
- **编排**: Docker Compose
- **前端生产**: Nginx
- **后端生产**: Gunicorn

## 环境配置

### 开发环境
- 前端: Vite 开发服务器 (端口 3000)
- 后端: Flask 开发服务器 (端口 8000)
- 热更新: 支持
- 调试: 启用

### 生产环境
- 前端: Nginx (端口 80)
- 后端: Gunicorn (端口 8000)
- 优化: 已启用
- 调试: 禁用

## 端口说明

| 服务 | 开发端口 | 生产端口 | 说明 |
|------|---------|---------|------|
| 前端 | 3000 | 80 | Web 应用 |
| 后端 | 8000 | 8000 | API 服务 |
| 数据库 | - | 5432 | PostgreSQL (可选) |
| Redis | - | 6379 | Redis (可选) |

## 环境变量

主要环境变量配置在 `.env` 文件中：

- `FRONTEND_PORT`: 前端端口
- `BACKEND_PORT`: 后端端口
- `VITE_API_BASE_URL`: 前端 API 基础 URL
- `AI_API_KEY`: AI 服务 API 密钥
- `AI_API_BASE_URL`: AI 服务基础 URL

完整列表请参考 `env.example` 文件。

## 开发工作流

### 1. 启动开发环境
```bash
./scripts/start.sh
```

### 2. 开发
- 前端代码修改 → 自动热更新
- 后端代码修改 → 自动重载

### 3. 测试
- 前端: http://localhost:3000
- 后端: http://localhost:8000/health

### 4. 构建生产版本
```bash
./scripts/build-prod.sh
```

### 5. 部署
参考 [MIGRATION.md](MIGRATION.md)

## AI 辅助开发优化

### 代码组织
- 清晰的目录结构
- 单一职责原则
- 模块化设计

### 配置优化
- `.editorconfig`: 统一代码格式
- ESLint: 代码质量检查
- Prettier: 代码格式化
- 类型提示: Python 类型注解

### 文档完善
- 清晰的注释
- API 文档字符串
- 开发指南

## 扩展建议

### 添加功能模块
1. 在 `frontend/src/` 创建新组件
2. 在 `backend/` 添加新的路由和业务逻辑
3. 更新 API 文档

### 添加数据库
1. 在 `docker-compose.yml` 取消注释数据库服务
2. 在 `backend/` 添加数据库模型
3. 更新环境变量

### 添加缓存
1. 在 `docker-compose.yml` 取消注释 Redis 服务
2. 在 `backend/` 集成 Redis 客户端
3. 更新环境变量
