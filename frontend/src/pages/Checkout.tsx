import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Checkout() {
  const location = useLocation();
  const [bookId, setBookId] = useState(location.state?.bookId || "");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [buyerId, setBuyerId] = useState("test-buyer-001");

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const navigate = useNavigate();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("處理中...");

    try {
      const response = await fetch(
        "http://localhost:8080/api/orders/checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
      <h2>ReBook 二手書結帳測試</h2>

      <form
        onSubmit={handleCheckout}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label>書籍 ID：</label>
          <br />
          <input
            type="text"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
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
        <div>
          <label>買家 ID：</label>
          <br />
          <input
            type="text"
            value={buyerId}
            onChange={(e) => setBuyerId(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        {createdOrder ? (
          <button
            type="button"
            // 改為直接跳轉到包含訂單 ID 的標準網址
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
