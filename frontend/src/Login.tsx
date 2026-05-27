// src/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 假設你有用 react-router-dom
import type { User } from './types';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>ReBook 登入</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="密碼" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">登入</button>
      </form>
    </div>
  );
}