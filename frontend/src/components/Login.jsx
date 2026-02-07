/**
 * 登录组件
 * 支持 Google 登录和邮箱登录/注册
 */
import { useState } from 'react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../lib/firebase';
import './Login.css';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || 'Google 登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('请填写邮箱和密码');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      // 处理 Firebase 错误消息
      let errorMessage = '操作失败，请重试';
      if (err.code === 'auth/user-not-found') {
        errorMessage = '用户不存在，请先注册';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = '密码错误';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = '该邮箱已被注册';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = '密码强度不够，至少需要6个字符';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = '邮箱格式不正确';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Chat2Cartoon</h1>
          <p>AI 驱动的卡通生成工具</p>
        </div>

        <div className="login-content">
          {/* Google 登录按钮 */}
          <button
            className="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="google-icon" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? '登录中...' : '使用 Google 登录'}
          </button>

          <div className="divider">
            <span>或</span>
          </div>

          {/* 邮箱登录/注册表单 */}
          <form onSubmit={handleEmailAuth} className="email-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="error-message">{error}</div>
            )}

            <button
              type="submit"
              className="email-auth-btn"
              disabled={loading}
            >
              {loading
                ? '处理中...'
                : isSignUp
                ? '注册'
                : '登录'}
            </button>
          </form>

          <div className="toggle-mode">
            <span>
              {isSignUp ? '已有账号？' : '还没有账号？'}
            </span>
            <button
              type="button"
              className="toggle-btn"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              disabled={loading}
            >
              {isSignUp ? '立即登录' : '立即注册'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
