/**
 * Firebase 配置和初始化
 * 用于用户认证（Google 登录和邮箱登录）
 */
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';

// Firebase 配置（从环境变量读取）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 检查配置是否完整
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.warn('Firebase 配置缺失，请设置环境变量：VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID');
}

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化 Auth
export const auth = getAuth(app);

// Google 认证提供者
export const googleProvider = new GoogleAuthProvider();

// 认证方法
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google 登录失败:', error);
    throw error;
  }
};

// 邮箱登录
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('邮箱登录失败:', error);
    throw error;
  }
};

// 邮箱注册
export const signUpWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('邮箱注册失败:', error);
    throw error;
  }
};

// 登出
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('登出失败:', error);
    throw error;
  }
};

// 监听认证状态变化
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// 获取当前用户 ID Token（用于后端验证）
export const getIdToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

export default app;
