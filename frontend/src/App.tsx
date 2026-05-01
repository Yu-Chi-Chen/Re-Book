import React, { useState } from 'react';

function App() {
  const [bookID, setBookID] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [buyerID, setBuyerID] = useState('test-buyer-001'); 
  
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  // 這裡多加了 React.FormEvent，這是 TypeScript 專屬的型別保護
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setMessage('處理中...');
    
    try {
      const response = await fetch('http://localhost:8080/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookID: bookID,
          paymentMethod: paymentMethod,
          buyerID: buyerID
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsSuccess(true);
        setMessage(`🎉 結帳成功！訂單編號：${data.orderID}，書籍狀態已更改為：${data.book.status}`);
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
          <label>書籍 ID (請去 MongoDB 複製一段真實的 ID)：</label><br />
          <input 
            type="text" 
            value={bookID} 
            onChange={(e) => setBookID(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div>
          <label>付款方式：</label><br />
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="CASH">現金付款 (CASH)</option>
            <option value="CREDIT_CARD">信用卡 (CREDIT_CARD)</option>
            <option value="TRANSFER">銀行轉帳 (TRANSFER)</option>
          </select>
        </div>

        <div>
          <label>買家 ID：</label><br />
          <input 
            type="text" 
            value={buyerID} 
            onChange={(e) => setBuyerID(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          確認結帳
        </button>
      </form>

      {message && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          borderRadius: '5px',
          backgroundColor: isSuccess ? '#d4edda' : '#f8d7da',
          color: isSuccess ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default App;