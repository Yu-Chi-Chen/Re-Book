import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function OrderDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 為了讓畫面上的狀態可以即時更新，我們把它放進 useState
  const [order, setOrder] = useState(location.state?.orderData); 
  const [message, setMessage] = useState('');

  if (!order) {
    return <div style={{ padding: '20px' }}><h2>找不到訂單</h2><button onClick={() => navigate('/')}>回首頁</button></div>;
  }

  // 接收 userID (扮演買家或賣家)
  const handleConfirmTransaction = async (actingUserID: string, roleName: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/orders/${order.orderID}/confirm?userID=${actingUserID}`, {
        method: 'PUT'
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder); // 即時更新畫面上的訂單資料
        setMessage(`✅ ${roleName} 確認成功！`);
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
      
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
        <p><strong>訂單編號：</strong> {order.orderID}</p>
        <p><strong>目前狀態：</strong> <span style={{ color: order.orderStatus === 'COMPLETED' ? 'green' : 'orange', fontWeight: 'bold' }}>{order.orderStatus}</span></p>
        <p><strong>書籍狀態：</strong> {order.book.status}</p>
        <hr />
        {/* 顯示雙方確認進度，方便教授看懂邏輯 */}
        <p>買家 ({order.buyerID}) 確認：{order.buyerConfirmed ? '✅ 已確認' : '❌ 未確認'}</p>
        <p>賣家 ({order.book.sellerID}) 確認：{order.sellerConfirmed ? '✅ 已確認' : '❌ 未確認'}</p>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        
        <button 
          onClick={() => handleConfirmTransaction(order.buyerID, '買家')}
          disabled={order.buyerConfirmed || order.orderStatus === 'COMPLETED'}
          style={{ flex: 1, padding: '10px', backgroundColor: order.buyerConfirmed ? '#ccc' : '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: order.buyerConfirmed ? 'not-allowed' : 'pointer' }}
        >
          買家確認面交
        </button>

        
        <button 
          onClick={() => handleConfirmTransaction(order.book.sellerID, '賣家')}
          disabled={order.sellerConfirmed || order.orderStatus === 'COMPLETED'}
          style={{ flex: 1, padding: '10px', backgroundColor: order.sellerConfirmed ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: order.sellerConfirmed ? 'not-allowed' : 'pointer' }}
        >
          賣家確認面交
        </button>
      </div>

      {message && <div style={{ marginTop: '15px', fontWeight: 'bold', textAlign: 'center' }}>{message}</div>}

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={() => navigate('/')} style={{ border: 'none', background: 'none', color: '#007BFF', cursor: 'pointer', textDecoration: 'underline' }}>
          返回結帳測試頁
        </button>
      </div>
    </div>
  );
}