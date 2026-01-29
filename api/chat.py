"""
聊天接口 - Vercel Serverless Function
处理聊天请求，生成卡通
"""
from http.server import BaseHTTPRequestHandler
import json
import os
from supabase import create_client, Client


def get_supabase_client() -> Client:
    """获取 Supabase 客户端"""
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_ANON_KEY')
    
    if not supabase_url or not supabase_key:
        raise ValueError('Supabase 配置缺失，请设置 SUPABASE_URL 和 SUPABASE_ANON_KEY')
    
    return create_client(supabase_url, supabase_key)


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """处理 CORS 预检请求"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return
    
    def do_POST(self):
        """处理 POST 请求"""
        try:
            # 读取请求体
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            message = data.get('message', '')
            
            if not message:
                self._send_error(400, '消息不能为空')
                return
            
            # TODO: 集成实际的AI服务
            # 这里可以调用火山引擎的AI API或其他AI服务
            
            # 可选：将聊天记录保存到 Supabase
            # try:
            #     supabase = get_supabase_client()
            #     supabase.table('chat_history').insert({
            #         'message': message,
            #         'status': 'processing'
            #     }).execute()
            # except Exception as e:
            #     print(f'保存聊天记录失败: {str(e)}')
            
            response_data = {
                'message': message,
                'status': 'processing',
                'result': None,
                # 'cartoon_url': '生成的卡通图片URL',
                # 'video_url': '生成的视频URL（如果支持）',
            }
            
            self._send_success(response_data)
            
        except json.JSONDecodeError:
            self._send_error(400, '无效的 JSON 格式')
        except Exception as e:
            print(f'Error processing chat request: {str(e)}')
            self._send_error(500, '服务器内部错误', str(e) if os.environ.get('VERCEL_ENV') == 'development' else None)
    
    def _send_success(self, data, status_code=200):
        """发送成功响应"""
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
    
    def _send_error(self, status_code, message, details=None):
        """发送错误响应"""
        error_data = {'error': message}
        if details:
            error_data['details'] = details
        
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(error_data, ensure_ascii=False).encode('utf-8'))
