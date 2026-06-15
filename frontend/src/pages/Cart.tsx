// src/pages/Cart.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types/types';

export default function Cart() {
  const [cartItems, setCartItems] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 取得購物車資料的函數
  const fetchCart = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/cart/', {
        method: 'GET',
        headers: {
          'userId': '6a14011da1c94bd5d428e232' // FIXME: 這裡暫時用假 ID，之後串接登入狀態時再替换
        }
      });

      if (response.ok) {
        const data = await response.json();
        // 對應後端 CartDTO 中的 getItems() -> 轉為 JSON 後的 "items" 欄位
        setCartItems(data.items || []);
      } else {
        console.error("無法取得購物車資料");
      }
    } catch (error) {
      console.error("API 連線失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  // 頁面載入時觸發
  useEffect(() => {
    fetchCart();
  }, []);

  // 處理移除書籍 (Extension 3b)
  const handleRemoveItem = async (bookId: string) => {
    if (!window.confirm("確定要將此書籍從購物車中移除嗎？")) return;

    try {
      const response = await fetch(`http://localhost:8080/api/cart/remove/${bookId}`, {
        method: 'DELETE',
        headers: {
          'userId': '6a14011da1c94bd5d428e232' // FIXME: 暫時用假 ID
        }
      });

      if (response.ok) {
        // 移除成功後，直接在前端過濾掉該筆資料，不需重新打 API，畫面更新更快！
        setCartItems(prevItems => prevItems.filter(item => item.bookId !== bookId));
      } else {
        alert("移除書籍失敗");
      }
    } catch (error) {
      console.error("API 連線失敗:", error);
      alert("系統發生錯誤，請稍後再試。");
    }
  };

  // 處理點擊「直接下單」的按鈕 (Use Case 步驟 4)
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // 將購物車中所有書籍的 ID 傳送給結帳頁面
    const bookIds = cartItems.map(item => item.bookId);
    navigate('/checkout', { state: { bookIds: bookIds } });
  };

  // 計算購物車內書籍的總金額
  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>購物車載入中...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '24px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🛒 我的購物車 ({cartItems.length})
      </h2>

      {cartItems.length === 0 ? (
        // 購物車為空時的畫面
        <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed #ccc', borderRadius: '12px', backgroundColor: '#fafafa' }}>
          <p style={{ color: '#888', fontSize: '16px', marginBottom: '16px' }}>您的購物車目前空空如也喔！</p>
          <button
            onClick={() => navigate('/')}
            style={{ padding: '10px 20px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            去尋找二手書 ➔
          </button>
        </div>
      ) : (
        // 購物車有品項時的列表
        <div>
          <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
            {cartItems.map((item) => (
              <div
                key={item.bookId}
                style={{
                  border: '1px solid #ddd',
                  padding: '20px',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  {/* 點擊書名同樣能導向詳情頁 */}
                  <h4
                    onClick={() => navigate(`/books/${item.bookId}`)}
                    style={{ margin: '0 0 6px 0', color: '#007BFF', cursor: 'pointer', textDecoration: 'underline', fontSize: '18px' }}
                  >
                    {item.bookInfo?.bookName}
                  </h4>
                  <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>
                    作者：{item.bookInfo?.author || '未知'}
                  </p>
                  <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                    <span style={{ backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '4px', marginRight: '12px' }}>
                      {item.bookCond}
                    </span>
                    <span style={{ color: '#e44d26', fontWeight: 'bold', fontSize: '16px' }}>
                      ${item.price}
                    </span>
                  </p>
                </div>

                {/* 修改重點：右側按鈕區塊加上「購買」按鈕 */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => navigate('/checkout', { state: { bookId: item.bookId } })}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                  >
                    💳 購買
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.bookId)}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: '#fff',
                      color: '#dc3545',
                      border: '1px solid #dc3545',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc3545';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fff';
                      e.currentTarget.style.color = '#dc3545';
                    }}
                  >
                    🗑 移除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}