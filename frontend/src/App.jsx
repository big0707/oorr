import { useState } from 'react';
import './App.css';
import { API_BASE_URL } from './lib/api';
import { useAuth } from './contexts/AuthContext';
import { signOut, getIdToken } from './lib/firebase';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const { user } = useAuth();
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
      // 获取 Firebase ID Token 用于后端验证
      const idToken = await getIdToken();
      if (!idToken) {
        throw new Error('未登录，请先登录');
      }

      // 调用后端 API，携带认证 token
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
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

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1>Chat2Cartoon</h1>
            <p>AI 驱动的卡通生成工具</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user && (
              <>
                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                  {user.email || user.displayName || '用户'}
                </span>
                <button
                  onClick={handleSignOut}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '6px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  登出
                </button>
              </>
            )}
          </div>
        </div>
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

function App() {
  return (
    <ProtectedRoute>
      <AppContent />
    </ProtectedRoute>
  );
}

export default App;
