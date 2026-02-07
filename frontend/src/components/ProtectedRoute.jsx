/**
 * 受保护的路由组件
 * 只有登录用户才能访问
 */
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '1.2rem' }}>加载中...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return children;
};

export default ProtectedRoute;
