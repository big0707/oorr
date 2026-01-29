# 开发环境
FROM python:3.11-slim AS development

WORKDIR /app

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .

# 安装Python依赖
RUN pip install --no-cache-dir -r requirements.txt

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 8000

# 启动开发服务器（支持热重载）
CMD ["python", "app.py"]

# 生产环境
FROM python:3.11-slim AS production

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# 使用gunicorn运行
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "app:app"]
