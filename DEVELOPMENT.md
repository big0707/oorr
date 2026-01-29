# 开发指南

## 项目架构

本项目采用前后端分离架构，便于AI辅助开发和独立部署。

### 前端 (Frontend)
- **技术栈**: React + Vite
- **端口**: 3000
- **特点**: 
  - 热更新支持
  - 快速构建
  - 便于AI代码生成和修改

### 后端 (Backend)
- **技术栈**: Flask (Python)
- **端口**: 8000
- **特点**:
  - RESTful API
  - 清晰的接口定义
  - 便于AI理解和生成代码

## 开发环境设置

### 方式一：使用 Docker（推荐）

```bash
# 1. 创建环境变量文件
cp .env.example .env
# 编辑 .env 文件，配置必要的环境变量

# 2. 启动开发环境
./scripts/start.sh

# 或者手动启动
docker-compose up -d

# 3. 查看日志
docker-compose logs -f

# 4. 停止服务
./scripts/stop.sh
# 或
docker-compose down
```

### 方式二：本地开发

#### 前端本地开发

```bash
cd frontend
npm install
npm run dev
```

前端将在 http://localhost:3000 运行

#### 后端本地开发

```bash
cd backend
pip install -r requirements.txt
python app.py
```

后端将在 http://localhost:8000 运行

## AI 辅助开发建议

### 前端开发
- 使用清晰的组件结构
- 保持函数和组件的单一职责
- 添加适当的注释和类型定义
- 使用标准的 React Hooks 模式

### 后端开发
- 保持API接口的RESTful风格
- 添加清晰的文档字符串
- 使用类型提示（Type Hints）
- 保持错误处理的统一性

## 代码规范

### 前端
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 React 最佳实践

### 后端
- 遵循 PEP 8 Python 代码规范
- 使用有意义的变量和函数名
- 添加适当的错误处理

## 调试技巧

### Docker 环境调试

```bash
# 进入前端容器
docker-compose exec frontend sh

# 进入后端容器
docker-compose exec backend bash

# 查看实时日志
docker-compose logs -f frontend
docker-compose logs -f backend
```

### 本地环境调试

- 前端：使用浏览器开发者工具
- 后端：使用 Flask 的调试模式（已启用）

## 常见问题

### 端口被占用
修改 `.env` 文件中的端口配置，或修改 `docker-compose.yml` 中的端口映射。

### 依赖安装失败
- 前端：删除 `node_modules` 和 `package-lock.json`，重新安装
- 后端：检查 Python 版本（需要 3.9+），重新安装依赖

### Docker 构建失败
- 检查 Docker 是否正常运行
- 清理旧的镜像和容器：`docker system prune -a`
- 重新构建：`docker-compose build --no-cache`

## 下一步

1. 集成实际的 AI 服务 API
2. 实现卡通生成功能
3. 添加用户认证（如需要）
4. 添加数据库支持（如需要）
5. 实现文件上传和存储功能
