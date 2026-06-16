// src/pages/OrderList.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/types';

export default function OrderList() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // 狀態管理：目前選中的頁籤 ('buyer' | 'seller')
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');
  
  // 訂單資料狀態
  const [buyerOrders, setBuyerOrders] = useState<any[]>([]);
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. 檢查登入狀態
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);
      fetchOrders(user.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // 2. 撈取訂單資料 (這裡假設後端有提供這兩支 API，你可以根據實際後端路徑修改)
  const fetchOrders = async (userId: string) => {
    setLoading(true);
    try {
      // 獲取作為「買家」的訂單
      const buyerRes = await fetch(`http://localhost:8080/api/orders/buyer/${userId}`);
      if (buyerRes.ok) {
        const data = await buyerRes.json();
        setBuyerOrders(data || []);
      }

      // 獲取作為「賣家」的訂單
      const sellerRes = await fetch(`http://localhost:8080/api/orders/seller/${userId}`);
      if (sellerRes.ok) {
        const data = await sellerRes.json();
        setSellerOrders(data || []);
      }
    } catch (error) {
      console.error("API 連線失敗:", error);
    } finally {
      setLoading(false);
    }
  };

  // 輔助函數：渲染訂單狀態的標籤樣式
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <span style={{ backgroundColor: '#d4edda', color: '#155724', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>✅ 已完成</span>;
      case "CANCELLED":
        return <span style={{ backgroundColor: '#f8d7da', color: '#721c24', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>🚫 已取消</span>;
      case "PENDING":
      default:
        return <span style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>⏳ 進行中</span>;
    }
  };

  // 輔助函數：渲染訂單列表
  const renderOrderCards = (orders: any[]) => {
    if (orders.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888', backgroundColor: '#fafafa', borderRadius: '8px' }}>
          目前沒有任何訂單紀錄喔！
        </div>
      );
    }

    return (
      <div style={{ display: 'grid', gap: '16px' }}>
        {orders.map(order => (
          <div key={order.orderId} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div>
              <div style={{ marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                訂單編號：{order.orderId}
              </div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#333' }}>
                {/* 假設訂單物件中有包含書籍資訊，若無則改為顯示 bookId */}
                📚 {order.book?.bookInfo?.bookName || `書籍 ID: ${order.bookId}`}
              </h4>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {renderStatusBadge(order.orderStatus)}
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#e44d26' }}>${order.book?.price || '未知價格'}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate(`/order/${order.orderId}`)}
              style={{ padding: '8px 16px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
            >
              查看詳情 ➔
            </button>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>⏳ 載入訂單資料中...</div>;

  // 判斷該使用者是否具備賣家身分
  const isSeller = currentUser?.roles.includes('SELLER');

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '24px', color: '#333' }}>📝 我的訂單總覽</h2>

      {/* 頁籤切換區塊 */}
      <div style={{ display: 'flex', borderBottom: '2px solid #eee', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('buyer')}
          style={{
            flex: 1, padding: '12px', border: 'none', background: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
            borderBottom: activeTab === 'buyer' ? '3px solid #007BFF' : '3px solid transparent',
            color: activeTab === 'buyer' ? '#007BFF' : '#666'
          }}
        >
          🛒 我購買的訂單 ({buyerOrders.length})
        </button>
        
        {/* 如果有賣家權限才顯示售出頁籤 */}
        {isSeller && (
          <button
            onClick={() => setActiveTab('seller')}
            style={{
              flex: 1, padding: '12px', border: 'none', background: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
              borderBottom: activeTab === 'seller' ? '3px solid #28a745' : '3px solid transparent',
              color: activeTab === 'seller' ? '#28a745' : '#666'
            }}
          >
            📦 我售出的訂單 ({sellerOrders.length})
          </button>
        )}
      </div>

      {/* 內容顯示區塊 */}
      <div>
        {activeTab === 'buyer' ? renderOrderCards(buyerOrders) : renderOrderCards(sellerOrders)}
      </div>
    </div>
  );
}