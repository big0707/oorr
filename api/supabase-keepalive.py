"""
Supabase 保活 API - Vercel Serverless Function
定期调用此 API 可以保持 Supabase 项目活跃，避免 7 天不活跃后被暂停

配置 Vercel Cron Job：
在 vercel.json 中添加：
{
  "crons": [{
    "path": "/api/supabase-keepalive",
    "schedule": "0 0 */6 * *"  // 每 6 天执行一次
  }]
}

或者手动访问：https://your-domain.vercel.app/api/supabase-keepalive
"""
from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.error
from datetime import datetime


def ping_supabase():
    """
    执行 Supabase 保活请求
    返回: (success: bool, message: str, status_code: int)
    """
    supabase_url = os.environ.get('SUPABASE_URL') or os.environ.get('VITE_SUPABASE_URL')
    supabase_key = os.environ.get('SUPABASE_ANON_KEY') or os.environ.get('VITE_SUPABASE_ANON_KEY')
    
    if not supabase_url or not supabase_key:
        return False, 'Supabase 配置缺失', 0
    
    try:
        # 使用 Supabase REST API 进行简单的请求
        # 这会触发 Supabase 项目活动，避免被暂停
        url = f'{supabase_url}/rest/v1/'
        
        req = urllib.request.Request(
            url,
            headers={
                'apikey': supabase_key,
                'Authorization': f'Bearer {supabase_key}',
                'Content-Type': 'application/json',
            }
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            status_code = response.getcode()
            if status_code >= 200 and status_code < 300:
                return True, 'Supabase 保活成功', status_code
            elif status_code == 404:
                # 404 也是正常的，说明 Supabase 服务是活跃的
                return True, 'Supabase 服务活跃', status_code
            else:
                return True, f'Supabase 响应异常 (状态码: {status_code})', status_code
                
    except urllib.error.HTTPError as e:
        # HTTP 错误（如 404）也算成功，因为说明服务是活跃的
        if e.code == 404:
            return True, 'Supabase 服务活跃 (404)', e.code
        return False, f'Supabase HTTP 错误: {e.code} - {e.reason}', e.code
    except urllib.error.URLError as e:
        error_msg = str(e.reason)
        if 'paused' in error_msg.lower() or '暂停' in error_msg:
            return False, 'Supabase 项目可能已暂停，请访问 https://app.supabase.com 恢复', 0
        return False, f'连接失败: {error_msg}', 0
    except Exception as e:
        return False, f'执行保活请求时出错: {str(e)}', 0


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """处理 GET 请求（用于 Vercel Cron Job 或手动调用）"""
        timestamp = datetime.now().isoformat()
        
        success, message, status_code = ping_supabase()
        
        response_data = {
            'success': success,
            'message': message,
            'status_code': status_code,
            'timestamp': timestamp,
            'service': 'supabase-keepalive'
        }
        
        if success:
            self._send_success(response_data)
        else:
            self._send_error(500, message, response_data)
    
    def do_POST(self):
        """处理 POST 请求（与 GET 相同）"""
        self.do_GET()
    
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
            error_data.update(details)
        
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(error_data, ensure_ascii=False).encode('utf-8'))
