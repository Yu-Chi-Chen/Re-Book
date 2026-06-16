import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [bookId, setBookId] = useState(location.state?.bookId || "");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  
  // 改為從 localStorage 讀取，預設為空字串
  const [buyerId, setBuyerId] = useState("");

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const [createdOrder, setCreatedOrder] = useState<any>(null);

  // 頁面載入時檢查是否已登入
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setBuyerId(user.id); // 取得登入者的 ID
    } else {
      alert("請先登入才能進行結帳！");
      navigate('/login'); // 未登入則導向登入頁
    }
  }, [navigate]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 雙重防護：確認真的有抓到 buyerId 才能結帳
    if (!buyerId) {
      setMessage("❌ 無法取得買家資訊，請嘗試重新登入。");
      return;
    }

    setMessage("處理中...");

    try {
      const response = await fetch(
        "http://localhost:8080/api/orders/checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // 這裡送出的 buyerId 已經是真實登入者的 ID
          body: JSON.stringify({ bookId, paymentMethod, buyerId }), 
        },
      );

      if (response.ok) {
        const data = await response.json();
        setIsSuccess(true);
        setCreatedOrder(data); 
        setMessage(`🎉 結帳成功！訂單編號：${data.orderId}`);
      } else {
        const errorText = await response.text();
        setIsSuccess(false);
        setMessage(`❌ 結帳失敗：${errorText}`);
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage("⚠️ 系統連線錯誤，請確認 Spring Boot 後端是否已啟動！");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <h2>ReBook 二手書結帳</h2>

      <form
        onSubmit={handleCheckout}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label>書籍 ID：</label>
          <br />
          {/* 加入 readOnly 與防呆樣式，避免使用者手賤改到 */}
          <input
            type="text"
            value={bookId}
            readOnly 
            style={{ width: "100%", padding: "8px", backgroundColor: "#f5f5f5", color: "#666", cursor: "not-allowed" }}
          />
        </div>
        
        <div>
          <label>付款方式：</label>
          <br />
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="CASH">現金付款 (CASH)</option>
            <option value="CREDIT_CARD">信用卡 (CREDIT_CARD)</option>
          </select>
        </div>

        {/* 移除了原本的 buyerId 手動輸入區塊 */}

        {createdOrder ? (
          <button
            type="button"
            onClick={() => navigate(`/order/${createdOrder.orderId}`)}
            style={{
              padding: "10px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            前往訂單詳情 👉
          </button>
        ) : (
          <button
            type="submit"
            style={{
              padding: "10px",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            確認結帳
          </button>
        )}
      </form>

      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "5px",
            backgroundColor: isSuccess ? "#d4edda" : "#f8d7da",
            color: isSuccess ? "#155724" : "#721c24",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}