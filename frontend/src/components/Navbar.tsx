// src/Navbar.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { User } from '../types/types';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  // 新增：控制下拉選單的顯示狀態
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // 新增：用來參考下拉選單的 DOM 節點，以偵測外部點擊
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // 新增：處理點擊空白處自動關閉下拉選單
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
      navigate('/login'); // 沒登入就去登入頁
    } else {
      // 修改：已登入時不再直接導向，而是切換下拉選單的開關狀態
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.stopPropagation(); // 避免點擊登出時，觸發外層的 handleProfileClick
    localStorage.removeItem('currentUser');
    setUser(null);
    setIsDropdownOpen(false); // 修改：登出時順便關閉選單
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
    // 新增：作為選單定位的父容器
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
      // 新增：滑鼠懸停時加上淺灰色背景提示可點擊
      backgroundColor: isDropdownOpen ? '#f5f5f5' : 'transparent',
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
    // 新增：下拉選單的外框樣式
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
    // 新增：下拉選單內的按鈕選項樣式
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
    // 新增：登出按鈕專用樣式 (無下邊框、紅色字)
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
        
        {/* 修改：將原本的 sellerBtn 和 logoutBtn 移除，全部移入 dropdownContainer 內 */}
        <div style={styles.dropdownContainer} ref={dropdownRef}>
          
          {/* 使用者頭像與名稱按鈕 */}
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

          {/* 新增：如果已登入且 isDropdownOpen 為 true，則顯示下拉選單 */}
          {user && isDropdownOpen && (
            <div style={styles.dropdownMenu}>

              {/* 新增：選單選項 1: 購物車 */}
              <button 
                style={styles.dropdownItem} 
                onClick={() => { setIsDropdownOpen(false); navigate('/cart'); }}
              >
                購物車
              </button>
              
              {/* 選單選項 1: 聊天室 */}
              <button 
                style={styles.dropdownItem} 
                onClick={() => { setIsDropdownOpen(false); navigate('/messages'); }}
              >
                聊天室
              </button>
              
              {/* 選單選項 2: 我的賣場 (僅賣家可見，如果你希望所有人都可見可移除條件判斷) */}
              {user.roles.includes('SELLER') && (
                <button 
                  style={styles.dropdownItem} 
                  onClick={() => { setIsDropdownOpen(false); navigate('/seller'); }}
                >
                  我的賣場
                </button>
              )}
              
              {/* 選單選項 3: 登出 */}
              <button 
                style={styles.logoutItem} 
                onClick={handleLogout}
              >
                登出
              </button>
            </div>
          )}
          
        </div>
      </div>
    </nav>
  );
}