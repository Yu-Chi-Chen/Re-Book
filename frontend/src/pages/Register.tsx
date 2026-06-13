import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  // 定義表單需要的 state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 處理錯誤與成功的狀態
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 將三個欄位打包成 JSON 送給後端
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        // 捕捉後端丟出的 Exception 錯誤訊息 (例如：Email 重複)
        const errorMsg = await response.text();
        throw new Error(errorMsg);
      }

      setSuccess(true);
      alert('註冊成功！將為您導向登入頁面。');
      
      // 註冊成功後，自動跳轉到登入頁，讓使用者進行第一次登入
      navigate('/login');
      
    } catch (err: any) {
      setError(err.message || '註冊時發生預期外的錯誤，請稍後再試');
    } finally {
      // 無論成功或失敗，最後把 Loading 狀態關掉
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
    registerCard: {
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
    successMsg: { 
      color: '#15803d',
      backgroundColor: '#dcfce7',
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
      <div style={styles.registerCard}>
        <h2 style={styles.title}>ReBook 註冊</h2>
        
        {error && <p style={styles.errorMsg}>{error}</p>}
        {success && <p style={styles.successMsg}>註冊成功！</p>}
        
        <form style={styles.form} onSubmit={handleRegister}>
          <input 
            style={styles.input}
            type="text" 
            placeholder="使用者名稱" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
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
            {isLoading ? '註冊中...' : '註冊帳號'}
          </button>
        </form>

        <div style={styles.footerText}>
          已經有帳號了嗎？ <Link to="/login" style={styles.link}>立即登入</Link>
        </div>
      </div>
    </div>
  );
}