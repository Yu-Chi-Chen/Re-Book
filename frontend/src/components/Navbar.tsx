// src/Navbar.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { User } from '../types/types';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.removeItem('currentUser');
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleBecomeSeller = async () => {
    if (!user) return;
    
    // 讓使用者輸入賣場名稱，預設給一個名字
    const shopName = window.prompt("即將開通個人賣場！請輸入您的賣場名稱：", `${user.username} 的二手書店`);

    // 如果使用者按取消，或是輸入空白，就不往下執行
    if (!shopName || shopName.trim() === "") {
      return; 
    }

    try {
      const response = await fetch('http://localhost:8080/api/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id, // 對應後端建立賣場需要的 userId
          shopName: shopName.trim() // 對應後端需要的 shopName
        })
      });

      if (response.ok) {
        // 更新本地端的 user 狀態，加入 'SELLER' 角色
        const updatedUser = { ...user, roles: [...user.roles, 'SELLER'] };
        
        // 存回 localStorage，確保重新整理後身分不會消失
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // 更新 React state，讓 UI 的「成為賣家」按鈕瞬間變成「我的賣場」
        setUser(updatedUser);
        
        alert("🎉 恭喜！你的個人賣場已成功開通！");
        
        // 自動導向賣場管理頁面
        setIsDropdownOpen(false);
        navigate('/seller');
      } else {
        const errorText = await response.text();
        alert(`開通失敗：${errorText}`);
      }
    } catch (error) {
      console.error("API 連線失敗:", error);
      alert("系統連線錯誤，請確認 Spring Boot 伺服器狀態。");
    }
  };

  // UI 樣式
  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 24px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      position: 'sticky' as const,
      top: 0,
      zIndex: 1000,
    },
    logo: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#4285F4',
      cursor: 'pointer',
      textDecoration: 'none',
    },
    profileSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    },
    dropdownContainer: {
      position: 'relative' as const,
    },
    profileCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      padding: '6px 12px',
      borderRadius: '20px',
      transition: 'background-color 0.2s',
      backgroundColor: isDropdownOpen ? '#f5f5f5' : 'transparent',
    },
    avatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: user ? '#34A853' : '#e0e0e0',
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
    dropdownMenu: {
      position: 'absolute' as const,
      top: '110%',
      right: 0,
      backgroundColor: '#ffffff',
      border: '1px solid #eaeaea',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      minWidth: '150px',
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      zIndex: 1001,
      marginTop: '8px',
    },
    dropdownItem: {
      padding: '12px 16px',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#333',
      border: 'none',
      background: 'none',
      textAlign: 'left' as const,
      borderBottom: '1px solid #eaeaea',
      width: '100%',
    },
    logoutItem: {
      padding: '12px 16px',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#d9534f',
      border: 'none',
      background: 'none',
      textAlign: 'left' as const,
      width: '100%',
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo} onClick={() => navigate('/')}>
        Re:Book
      </div>

      <div style={styles.profileSection}>
        <div style={styles.dropdownContainer} ref={dropdownRef}>
          
          <div 
            style={styles.profileCard} 
            onClick={handleProfileClick} 
            title={!user ? "點擊前往登入" : "展開選單"}
          >
            <div style={styles.avatar}>
              {user ? user.username.charAt(0).toUpperCase() : '?'}
            </div>
            <span style={styles.username}>
              {user ? user.username : '尚未登入'}
            </span>
          </div>

          {user && isDropdownOpen && (
            <div style={styles.dropdownMenu}>
              <button 
                style={styles.dropdownItem} 
                onClick={() => { setIsDropdownOpen(false); navigate('/cart'); }}
              >
                🛒 購物車
              </button>
              
              <button 
                style={styles.dropdownItem} 
                onClick={() => { setIsDropdownOpen(false); navigate('/messages'); }}
              >
                💬 聊天室
              </button>

              <button 
                style={styles.dropdownItem} 
                onClick={() => { setIsDropdownOpen(false); navigate('/orders'); }}
              >
                📝 我的訂單
              </button>
              
              {user.roles.includes('SELLER') ? (
                <button 
                  style={styles.dropdownItem} 
                  onClick={() => { setIsDropdownOpen(false); navigate('/seller'); }}
                >
                  🏪 我的賣場
                </button>
              ) : (
                <button 
                  style={styles.dropdownItem} 
                  onClick={handleBecomeSeller}
                >
                  🚀 成為賣家
                </button>
              )}
              
              <button 
                style={styles.logoutItem} 
                onClick={handleLogout}
              >
                🚪 登出
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}