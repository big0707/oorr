import { useState } from 'react';
import './App.css';
import { API_BASE_URL } from './lib/api';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // 使用 Vercel API 路由
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '请求失败');
      }
      
      const data = await response.json();
      console.log('Response:', data);
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || '发生错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Chat2Cartoon</h1>
        <p>AI 驱动的卡通生成工具</p>
      </header>
      
      <main className="app-main">
        <form onSubmit={handleSubmit} className="chat-form">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入你的想法，生成卡通形象..."
            rows={4}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !message.trim()}>
            {loading ? '生成中...' : '生成卡通'}
          </button>
        </form>
        
        {error && (
          <div className="error-message" style={{ 
            marginTop: '20px', 
            padding: '10px', 
            backgroundColor: '#fee', 
            color: '#c33',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}
        
        {result && (
          <div className="result" style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: '#f0f0f0',
            borderRadius: '4px'
          }}>
            <h3>生成结果</h3>
            <p>状态: {result.status}</p>
            {result.message && <p>消息: {result.message}</p>}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
