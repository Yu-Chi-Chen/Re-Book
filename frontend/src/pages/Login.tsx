// src/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 假設你有用 react-router-dom
import type { User } from '../types/types';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg);
      }

      const userData: User = await response.json();
      
      // 將使用者資訊存入 LocalStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));

      // 根據角色決定導向哪裡
      if (userData.roles.includes('SELLER')) {
        navigate('/seller');
      } else {
        navigate('/'); // 買家回首頁
      }
    } catch (err: any) {
      setError(err.message || '登入失敗，請稍後再試');
    } finally {
      // 無論登入成功或失敗，最後一定要把 Loading 狀態關掉
      setIsLoading(false); 
    }
  };

  // 定義畫面樣式
  const styles = {
    pageWrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f4f7f6',
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    },
    loginCard: {
      backgroundColor: '#ffffff',
      padding: '40px 30px',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
      width: '100%',
      maxWidth: '380px',
      textAlign: 'center' as const,
    },
    title: {
      margin: '0 0 24px 0',
      color: '#333333',
      fontSize: '24px',
      fontWeight: '600',
    },
    form: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
    },
    input: {
      padding: '12px 16px',
      fontSize: '15px',
      border: '1px solid #dcdcdc',
      borderRadius: '8px',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    button: {
      marginTop: '8px',
      padding: '12px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#ffffff',
      backgroundColor: '#2563eb',
      border: 'none',
      borderRadius: '8px',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      opacity: isLoading ? 0.7 : 1,
      transition: 'background-color 0.2s',
    },
    errorMsg: {
      color: '#dc2626',
      backgroundColor: '#fee2e2',
      padding: '10px',
      borderRadius: '6px',
      fontSize: '14px',
      marginBottom: '16px',
    },
    footerText: {
      marginTop: '24px',
      fontSize: '14px',
      color: '#666666',
    },
    link: {
      color: '#2563eb',
      textDecoration: 'none',
      fontWeight: '500',
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.loginCard}>
        <h2 style={styles.title}>ReBook 登入</h2>
        
        {error && <p style={styles.errorMsg}>{error}</p>}
        
        <form style={styles.form} onSubmit={handleLogin}>
          <input 
            style={styles.input}
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            style={styles.input}
            type="password" 
            placeholder="密碼" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button style={styles.button} type="submit" disabled={isLoading}>
            {isLoading ? '登入中...' : '登入'}
          </button>
        </form>
        
        <div style={styles.footerText}>
          還沒有帳號嗎？ <Link to="/register" style={styles.link}>立即註冊</Link>
        </div>
      </div>
    </div>
  );
}