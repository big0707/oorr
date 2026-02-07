"""
Chat2Cartoon Backend API
支持AI视频编码和卡通生成功能
"""
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from auth import require_auth

# 加载环境变量
load_dotenv()

app = Flask(__name__)
CORS(app)  # 允许跨域请求，便于前端开发

# 配置
app.config['DEBUG'] = os.getenv('PYTHON_ENV', 'development') == 'development'
app.config['HOST'] = os.getenv('BACKEND_HOST', '0.0.0.0')
app.config['PORT'] = int(os.getenv('BACKEND_PORT', 8000))


@app.route('/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({
        'status': 'healthy',
        'service': 'chat2cartoon-backend',
        'version': '1.0.0'
    })


@app.route('/api/chat', methods=['POST'])
@require_auth
def chat():
    """
    处理聊天请求，生成卡通
    需要用户登录认证
    便于AI video coding：清晰的接口定义和错误处理
    """
    try:
        # 获取当前登录用户信息
        user_id = request.user.get('uid')
        user_email = request.user.get('email', '未知用户')
        
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({
                'error': '消息不能为空'
            }), 400
        
        # TODO: 集成实际的AI服务
        # 这里可以调用火山引擎的AI API或其他AI服务
        response_data = {
            'message': message,
            'status': 'processing',
            'result': None,
            'user_id': user_id,
            'user_email': user_email,
            # 'cartoon_url': '生成的卡通图片URL',
            # 'video_url': '生成的视频URL（如果支持）',
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        app.logger.error(f'Error processing chat request: {str(e)}')
        return jsonify({
            'error': '服务器内部错误',
            'details': str(e) if app.config['DEBUG'] else None
        }), 500


@app.route('/api/generate', methods=['POST'])
@require_auth
def generate():
    """
    生成卡通图像/视频
    需要用户登录认证
    便于AI video coding：支持多种生成模式
    """
    try:
        # 获取当前登录用户信息
        user_id = request.user.get('uid')
        user_email = request.user.get('email', '未知用户')
        
        data = request.get_json()
        prompt = data.get('prompt', '')
        style = data.get('style', 'cartoon')
        format_type = data.get('format', 'image')  # image 或 video
        
        if not prompt:
            return jsonify({
                'error': '提示词不能为空'
            }), 400
        
        # TODO: 实现实际的生成逻辑
        response_data = {
            'prompt': prompt,
            'style': style,
            'format': format_type,
            'status': 'generating',
            'result_url': None,
            'user_id': user_id,
            'user_email': user_email,
        }
        
        return jsonify(response_data), 200
        
    except Exception as e:
        app.logger.error(f'Error generating content: {str(e)}')
        return jsonify({
            'error': '生成失败',
            'details': str(e) if app.config['DEBUG'] else None
        }), 500


if __name__ == '__main__':
    app.run(
        host=app.config['HOST'],
        port=app.config['PORT'],
        debug=app.config['DEBUG']
    )
