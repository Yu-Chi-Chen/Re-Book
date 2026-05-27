import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  // 定義表單需要的 state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 處理錯誤與成功的狀態
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

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
    }
  };

  return (
    <div>
      <h2>ReBook 註冊</h2>
      
      {/* 錯誤與成功訊息提示區塊 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>註冊成功！</p>}
      
      <form onSubmit={handleRegister}>
        <div>
          <input 
            type="text" 
            placeholder="使用者名稱" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>
        <div>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <input 
            type="password" 
            placeholder="密碼" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">註冊</button>
      </form>
    </div>
  );
}