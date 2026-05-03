// src/OrderDetail.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OrderDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 接收從結帳頁面傳過來的訂單資料
  const order = location.state?.orderData; 
  
  const [message, setMessage] = useState('');

  // 如果沒有資料(例如使用者直接亂打網址進來)，就請他回首頁
  if (!order) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>找不到訂單資料</h2>
        <button onClick={() => navigate('/')}>回結帳頁</button>
      </div>
    );
  }

  // 處理確認交易的動作
  const handleConfirmTransaction = async () => {
    try {
      // 呼叫你後端的 PUT API (記得換成你設定的買家或賣家ID)
      const response = await fetch(`http://localhost:8080/api/orders/${order.orderID}/confirm?userID=${order.buyerID}`, {
        method: 'PUT'
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setMessage(`✅ 交易已確認！目前訂單狀態：${updatedOrder.orderStatus}`);
      } else {
        const errorText = await response.text();
        setMessage(`❌ 確認失敗：${errorText}`);
      }
    } catch (error) {
      setMessage('⚠️ 系統連線錯誤');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <h2>📝 訂單詳細資訊</h2>
      
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <p><strong>訂單編號：</strong> {order.orderID}</p>
        <p><strong>目前狀態：</strong> {order.orderStatus}</p>
        <p><strong>付款方式：</strong> {order.paymentMethod}</p>
        <p><strong>書籍狀態：</strong> {order.book.status}</p>
      </div>

      <button 
        onClick={handleConfirmTransaction}
        style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
      >
        確認交易 (買家收貨確認)
      </button>

      {message && (
        <div style={{ marginTop: '15px', color: message.includes('✅') ? 'green' : 'red', fontWeight: 'bold' }}>
          {message}
        </div>
      )}

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={() => navigate('/')} style={{ border: 'none', background: 'none', color: '#007BFF', cursor: 'pointer', textDecoration: 'underline' }}>
          返回結帳測試頁
        </button>
      </div>
    </div>
  );
}