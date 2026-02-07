"""
Firebase 身份验证中间件
用于验证前端传来的 Firebase ID Token
"""
import os
import firebase_admin
from firebase_admin import credentials, auth
from functools import wraps
from flask import request, jsonify
from dotenv import load_dotenv

load_dotenv()

# 初始化 Firebase Admin SDK
def init_firebase():
    """初始化 Firebase Admin SDK"""
    # 检查是否已经初始化
    if not firebase_admin._apps:
        # 方式1: 使用服务账号密钥文件路径
        cred_path = os.getenv('FIREBASE_CREDENTIALS_PATH')
        if cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            # 方式2: 使用环境变量中的服务账号 JSON
            cred_json = os.getenv('FIREBASE_CREDENTIALS_JSON')
            if cred_json:
                import json
                cred_dict = json.loads(cred_json)
                cred = credentials.Certificate(cred_dict)
                firebase_admin.initialize_app(cred)
            else:
                # 方式3: 使用默认应用（如果已设置 GOOGLE_APPLICATION_CREDENTIALS）
                try:
                    firebase_admin.initialize_app()
                except Exception as e:
                    print(f'警告: Firebase Admin SDK 初始化失败: {e}')
                    print('请设置 FIREBASE_CREDENTIALS_PATH 或 FIREBASE_CREDENTIALS_JSON 环境变量')

# 初始化 Firebase
init_firebase()


def verify_firebase_token(id_token):
    """
    验证 Firebase ID Token
    
    Args:
        id_token: Firebase ID Token 字符串
        
    Returns:
        解码后的 token 信息，如果验证失败返回 None
    """
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        print(f'Token 验证失败: {e}')
        return None


def require_auth(f):
    """
    装饰器：要求用户认证才能访问的 API
    
    使用方法:
        @app.route('/api/protected')
        @require_auth
        def protected_route():
            # request.user 包含用户信息
            user_id = request.user['uid']
            ...
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # 从请求头获取 Authorization token
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({
                'error': '未提供认证令牌',
                'message': '请先登录'
            }), 401
        
        # 提取 token（格式: "Bearer <token>"）
        try:
            token = auth_header.split('Bearer ')[1]
        except IndexError:
            return jsonify({
                'error': '认证令牌格式错误',
                'message': 'Authorization 头格式应为: Bearer <token>'
            }), 401
        
        # 验证 token
        decoded_token = verify_firebase_token(token)
        if not decoded_token:
            return jsonify({
                'error': '认证令牌无效或已过期',
                'message': '请重新登录'
            }), 401
        
        # 将用户信息附加到 request 对象
        request.user = decoded_token
        
        return f(*args, **kwargs)
    
    return decorated_function
