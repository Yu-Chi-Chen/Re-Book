// src/Checkout.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const [bookID, setBookID] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [buyerID, setBuyerID] = useState('test-buyer-001'); 
  
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  
  // 用來儲存後端回傳的完整訂單資料
  const [createdOrder, setCreatedOrder] = useState<any>(null); 
  
  const navigate = useNavigate();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setMessage('處理中...');
    
    try {
      const response = await fetch('http://localhost:8080/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookID, paymentMethod, buyerID }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsSuccess(true);
        setCreatedOrder(data); // 把訂單存起來，按鈕就會變身！
        setMessage(`🎉 結帳成功！訂單編號：${data.orderID}`);
      } else {
        const errorText = await response.text();
        setIsSuccess(false);
        setMessage(`❌ 結帳失敗：${errorText}`);
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('⚠️ 系統連線錯誤，請確認 Spring Boot 後端是否已啟動！');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <h2>ReBook 二手書結帳測試</h2>
      
      <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>書籍 ID：</label><br />
          <input type="text" value={bookID} onChange={(e) => setBookID(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div>
          <label>付款方式：</label><br />
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="CASH">現金付款 (CASH)</option>
            <option value="CREDIT_CARD">信用卡 (CREDIT_CARD)</option>
          </select>
        </div>
        <div>
          <label>買家 ID：</label><br />
          <input type="text" value={buyerID} onChange={(e) => setBuyerID(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>

        {/* 魔法在這裡：如果有成功建立訂單，就顯示「訂單詳情」按鈕，否則顯示「確認結帳」表單送出按鈕 */}
        {createdOrder ? (
          <button 
            type="button" 
            onClick={() => navigate('/detail', { state: { orderData: createdOrder } })}
            style={{ padding: '10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            前往訂單詳情 👉
          </button>
        ) : (
          <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            確認結帳
          </button>
        )}
      </form>

      {message && (
        <div style={{ marginTop: '20px', padding: '15px', borderRadius: '5px', backgroundColor: isSuccess ? '#d4edda' : '#f8d7da', color: isSuccess ? '#155724' : '#721c24' }}>
          {message}
        </div>
      )}
    </div>
  );
}