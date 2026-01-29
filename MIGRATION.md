# 迁移部署指南

## Docker 镜像迁移

### 方法一：使用 Docker Hub（推荐）

```bash
# 1. 登录 Docker Hub
docker login

# 2. 构建并标记镜像
docker-compose build
docker tag chat2cartoon-frontend:latest your-username/chat2cartoon-frontend:latest
docker tag chat2cartoon-backend:latest your-username/chat2cartoon-backend:latest

# 3. 推送镜像
docker push your-username/chat2cartoon-frontend:latest
docker push your-username/chat2cartoon-backend:latest

# 4. 在目标服务器拉取镜像
docker pull your-username/chat2cartoon-frontend:latest
docker pull your-username/chat2cartoon-backend:latest
```

### 方法二：导出/导入镜像文件

```bash
# 1. 构建镜像
docker-compose build

# 2. 导出镜像
docker save chat2cartoon-frontend:latest | gzip > frontend-image.tar.gz
docker save chat2cartoon-backend:latest | gzip > backend-image.tar.gz

# 3. 传输到目标服务器（使用 scp 或其他方式）
scp frontend-image.tar.gz backend-image.tar.gz user@target-server:/path/

# 4. 在目标服务器导入镜像
docker load < frontend-image.tar.gz
docker load < backend-image.tar.gz
```

### 方法三：使用 Docker Compose Bundle

```bash
# 1. 构建镜像
docker-compose build

# 2. 创建 bundle
docker-compose bundle

# 3. 在目标服务器使用 bundle
docker stack deploy -c docker-compose.dab chat2cartoon
```

## 环境配置迁移

### 1. 复制配置文件

```bash
# 复制以下文件到目标服务器：
- docker-compose.yml (或 docker-compose.prod.yml)
- .env 文件（包含所有必要的环境变量）
- 任何自定义的配置文件
```

### 2. 修改环境变量

在目标服务器上编辑 `.env` 文件，更新：
- API 密钥和端点
- 数据库连接信息
- 域名和端口配置
- 其他环境特定配置

### 3. 启动服务

```bash
# 使用生产配置
docker-compose -f docker-compose.prod.yml up -d

# 或使用开发配置
docker-compose up -d
```

## 数据迁移（如适用）

### 数据库迁移

```bash
# 1. 导出数据
docker-compose exec db pg_dump -U user chat2cartoon > backup.sql

# 2. 在目标服务器导入数据
docker-compose exec -T db psql -U user chat2cartoon < backup.sql
```

### 文件存储迁移

```bash
# 1. 打包上传的文件（如果有）
tar -czf uploads.tar.gz ./uploads/

# 2. 传输到目标服务器
scp uploads.tar.gz user@target-server:/path/

# 3. 解压
tar -xzf uploads.tar.gz
```

## 快速迁移检查清单

- [ ] Docker 和 Docker Compose 已安装
- [ ] 镜像已构建或已导入
- [ ] `.env` 文件已配置
- [ ] `docker-compose.yml` 已复制
- [ ] 端口未被占用
- [ ] 必要的目录权限已设置
- [ ] 数据库已迁移（如适用）
- [ ] 静态文件已迁移（如适用）
- [ ] 服务已启动并运行正常
- [ ] 健康检查通过

## 验证部署

```bash
# 检查服务状态
docker-compose ps

# 检查日志
docker-compose logs

# 测试前端
curl http://localhost:3000

# 测试后端
curl http://localhost:8000/health
```

## 回滚方案

如果新版本有问题，可以快速回滚：

```bash
# 1. 停止当前服务
docker-compose down

# 2. 使用之前的镜像版本
docker-compose up -d --no-deps --build

# 或使用之前的配置文件
docker-compose -f docker-compose.backup.yml up -d
```

## 生产环境建议

1. **使用反向代理**: 配置 Nginx 或 Traefik
2. **SSL 证书**: 使用 Let's Encrypt 或商业证书
3. **监控**: 集成监控工具（如 Prometheus + Grafana）
4. **日志**: 配置日志收集（如 ELK Stack）
5. **备份**: 定期备份数据库和重要文件
6. **安全**: 定期更新依赖，使用安全扫描工具
