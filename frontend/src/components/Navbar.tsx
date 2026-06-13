// src/Navbar.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { User } from '../types/types';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation(); // 用來偵測目前網址，決定要不要重新讀取資料

  // 每次網址切換時，都去 LocalStorage 檢查一下有沒有人登入
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]); // 依賴項加上 location.pathname，換頁就會觸發檢查

  const handleProfileClick = () => {
    if (!user) {
      navigate('/login'); // 沒登入就去登入頁
    } else {
      // 如果已經登入，可以決定要導向哪裡（例如賣家去後台，買家去個人中心）
      if (user.roles.includes('SELLER')) {
        navigate('/seller');
      } else {
        alert('未來這裡可以連到買家的會員中心！');
      }
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation(); // 避免點擊登出時，觸發外層的 handleProfileClick
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/'); // 登出後回首頁
  };

  // UI 樣式
  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between', // 讓 Logo 靠左，使用者靠右
      alignItems: 'center',
      padding: '12px 24px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      position: 'sticky' as const, // 讓它固定在畫面最上方
      top: 0,
      zIndex: 1000,
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#4285F4', // ReBook 藍色
      cursor: 'pointer',
      textDecoration: 'none',
    },
    // 賣家專屬的按鈕樣式 (淺藍色底，凸顯功能性)
    sellerBtn: {
      padding: '8px 16px',
      backgroundColor: '#e8f0fe',
      color: '#1a73e8',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      border: 'none',
      transition: 'background-color 0.2s',
    },
    profileSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    profileCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      padding: '6px 12px',
      borderRadius: '20px',
      transition: 'background-color 0.2s',
    },
    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: user ? '#34A853' : '#e0e0e0', // 有登入給綠色，沒登入給灰色
      color: user ? '#ffffff' : '#666',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      fontSize: '16px',
    },
    username: {
      fontSize: '15px',
      color: '#333',
      fontWeight: '500',
    },
    logoutBtn: {
      border: '1px solid #dcdcdc',
      background: 'transparent',
      padding: '6px 12px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      color: '#666',
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo} onClick={() => navigate('/')}>
        Re:Book
      </div>

      {/* 右側使用者區塊 */}
      <div style={styles.profileSection}>
        
        {/* 賣家專屬按鈕排在頭像的最左邊 */}
        {user && user.roles.includes('SELLER') && (
          <button 
            style={styles.sellerBtn} 
            onClick={() => navigate('/seller')}
          >
            我的賣場
          </button>
        )}

        <div style={styles.profileCard} onClick={handleProfileClick} title={!user ? "點擊前往登入" : "前往會員中心"}>
          {/* 預設頭像：如果沒登入顯示問號，有登入顯示名字的第一個字 */}
          <div style={styles.avatar}>
            {user ? user.username.charAt(0).toUpperCase() : '?'}
          </div>
          <span style={styles.username}>
            {user ? user.username : '尚未登入'}
          </span>
        </div>

        {/* 只有在已登入狀態才顯示登出按鈕 */}
        {user && (
          <button style={styles.logoutBtn} onClick={handleLogout}>
            登出
          </button>
        )}
      </div>
    </nav>
  );
}