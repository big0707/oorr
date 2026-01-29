"""
健康检查接口 - Vercel Serverless Function
"""
from http.server import BaseHTTPRequestHandler
import json


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """处理 GET 请求"""
        response_data = {
            'status': 'healthy',
            'service': 'chat2cartoon-backend',
            'version': '1.0.0',
            'platform': 'vercel'
        }
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response_data).encode('utf-8'))
        return
