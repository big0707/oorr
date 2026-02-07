"""
生成接口 - Vercel Serverless Function
生成卡通图像/视频
"""
from http.server import BaseHTTPRequestHandler
import json
import os
from supabase import create_client, Client


def get_supabase_client() -> Client:
    """
    获取 Supabase 客户端
    
    注意：Supabase 免费版在 7 天不活跃后会自动暂停
    如果 Supabase 被暂停，此函数会抛出异常
    """
    supabase_url = os.environ.get('SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_ANON_KEY')
    
    if not supabase_url or not supabase_key:
        raise ValueError('Supabase 配置缺失，请设置 SUPABASE_URL 和 SUPABASE_ANON_KEY')
    
    return create_client(supabase_url, supabase_key)


def check_supabase_health():
    """
    检查 Supabase 健康状态
    
    返回: (healthy: bool, error: str or None)
    """
    try:
        supabase = get_supabase_client()
        # 尝试一个简单的查询
        # 如果项目被暂停，会返回连接错误
        result = supabase.table('_health_check').select('*').limit(0).execute()
        return True, None
    except Exception as e:
        error_msg = str(e)
        # 检查是否是暂停相关的错误
        if 'paused' in error_msg.lower() or '暂停' in error_msg or 'connection' in error_msg.lower():
            return False, f'Supabase 项目可能已暂停（7天不活跃会自动暂停）。请访问 https://app.supabase.com 恢复项目。错误: {error_msg}'
        return False, f'Supabase 连接失败: {error_msg}'


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
            
            prompt = data.get('prompt', '')
            style = data.get('style', 'cartoon')
            format_type = data.get('format', 'image')  # image 或 video
            
            if not prompt:
                self._send_error(400, '提示词不能为空')
                return
            
            # TODO: 实现实际的生成逻辑
            # 这里可以调用AI图像/视频生成API
            
            # 可选：将生成任务保存到 Supabase
            # 注意：如果 Supabase 被暂停，此操作会失败但不会影响主流程
            # try:
            #     healthy, error = check_supabase_health()
            #     if not healthy:
            #         print(f'⚠️ Supabase 健康检查失败: {error}')
            #         # 可以选择记录到日志或发送通知
            #     else:
            #         supabase = get_supabase_client()
            #         supabase.table('generation_tasks').insert({
            #             'prompt': prompt,
            #             'style': style,
            #             'format': format_type,
            #             'status': 'generating'
            #         }).execute()
            # except Exception as e:
            #     error_msg = str(e)
            #     if 'paused' in error_msg.lower() or '暂停' in error_msg:
            #         print(f'⚠️ Supabase 项目已暂停: {error_msg}')
            #         print('提示：请访问 https://app.supabase.com 恢复项目')
            #     else:
            #         print(f'保存生成任务失败: {error_msg}')
            
            response_data = {
                'prompt': prompt,
                'style': style,
                'format': format_type,
                'status': 'generating',
                'result_url': None,
            }
            
            self._send_success(response_data)
            
        except json.JSONDecodeError:
            self._send_error(400, '无效的 JSON 格式')
        except Exception as e:
            print(f'Error generating content: {str(e)}')
            self._send_error(500, '生成失败', str(e) if os.environ.get('VERCEL_ENV') == 'development' else None)
    
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
