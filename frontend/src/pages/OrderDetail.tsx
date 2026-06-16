import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// 假設你有定義 User 型別，沒有的話可以暫時忽略或定義 any
// import type { User } from '../types/types'; 

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 1. 頁面載入時，抓取當前登入者 ID
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setCurrentUserId(user.id); // 注意確認你們的型別是 id 還是 _id
    } else {
      // 沒登入的話，可以視需求決定要不要直接踢回首頁或登入頁
      // navigate('/login'); 
    }
  }, []);

  // 2. 撈取訂單資料
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/orders/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data); 
        } else {
          setMessage("❌ 無法載入訂單，該訂單可能不存在。");
        }
      } catch (error) {
        setMessage("⚠️ 系統連線錯誤，無法獲取訂單詳情。");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  // 3. 確認交易 API (不再需要傳入 userId 和 roleName，直接用 currentUserId 判斷)
  const handleConfirmTransaction = async () => {
    if (!currentUserId) return;
    
    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/${id}/confirm?userId=${currentUserId}`,
        { method: "PUT" }
      );
      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder); 
        setMessage(`✅ 確認面交成功！`);
      } else {
        const errorText = await response.text();
        setMessage(`❌ 確認失敗：${errorText}`);
      }
    } catch (error) {
      setMessage("⚠️ 系統連線錯誤");
    }
  };

  // 4. 取消訂單 API
  const handleCancelOrder = async () => {
    if (!currentUserId) return;

    if (window.confirm(`確定要取消這筆訂單嗎？此動作無法復原！`)) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/orders/${id}/cancel?userId=${currentUserId}`,
          { method: "PUT" }
        );
        if (response.ok) {
          const updatedOrder = await response.json();
          setOrder(updatedOrder);
          setMessage(`🚫 訂單已取消作廢！`);
        } else {
          const errorText = await response.text();
          setMessage(`❌ 取消失敗：${errorText}`);
        }
      } catch (error) {
        setMessage("⚠️ 系統連線錯誤");
      }
    }
  };

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>⏳ 訂單資料載入中，請稍候...</div>;
  }

  if (!order) {
    return (
      <div style={{ padding: "20px", textAlign: "center", fontFamily: "sans-serif" }}>
        <h2>{message || "找不到該筆訂單"}</h2>
        <button onClick={() => navigate("/")} style={{ padding: "8px 16px", cursor: "pointer" }}>回首頁</button>
      </div>
    );
  }

  const isCompleted = order.orderStatus === "COMPLETED";
  const isCancelled = order.orderStatus === "CANCELLED";
  const isPending = order.orderStatus === "PENDING";

  // 核心邏輯：判斷當前使用者是誰
  const isBuyer = currentUserId === order.buyerId;
  const isSeller = currentUserId === order.sellerId;
  const isRelatedUser = isBuyer || isSeller;

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>📝 訂單詳細資訊</h2>

      {/* 訂單基本資訊卡片 */}
      <div style={{ border: "1px solid #e0e0e0", padding: "20px", borderRadius: "10px", marginBottom: "20px", backgroundColor: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <p style={{ margin: "8px 0" }}><strong>訂單編號：</strong> {order.orderId}</p>
        <p style={{ margin: "8px 0" }}><strong>目前狀態：</strong> 
          <span style={{ color: isCompleted ? "#28a745" : isCancelled ? "#dc3545" : "#ff9800", fontWeight: "bold", marginLeft: "8px" }}>
            {order.orderStatus}
          </span>
        </p>
        <p style={{ margin: "8px 0" }}><strong>書籍狀態：</strong> {order.book?.status || order.book?.bookStatus || "未知"}</p>
        
        <hr style={{ margin: "20px 0", borderTop: "1px solid #eee" }} />
        
        <div style={{ display: "flex", justifyContent: "space-between", color: "#555", fontSize: "14px", backgroundColor: "#f8f9fa", padding: "10px", borderRadius: "6px" }}>
          <span>買家確認狀態：{order.buyerConfirmed ? "✅ 已確認" : "⏳ 等待中"}</span>
          <span>賣家確認狀態：{order.sellerConfirmed ? "✅ 已確認" : "⏳ 等待中"}</span>
        </div>
      </div>

      {message && (
        <div style={{ padding: "12px", marginBottom: "20px", textAlign: "center", backgroundColor: message.includes('❌') || message.includes('⚠️') ? "#f8d7da" : "#d4edda", color: message.includes('❌') || message.includes('⚠️') ? "#721c24" : "#155724", borderRadius: "8px" }}>
          {message}
        </div>
      )}

      {/* 操作區塊：只有訂單狀態為 PENDING 且 是該訂單的相關人員才看得到 */}
      {isPending && isRelatedUser && (
        <div style={{ border: "2px solid #f0f0f0", padding: "20px", borderRadius: "10px", textAlign: "center", backgroundColor: "#fafafa" }}>
          <h4 style={{ color: isBuyer ? "#007BFF" : "#28a745", marginTop: 0, marginBottom: "20px" }}>
            {isBuyer ? "🛒 買家操作區" : "📦 賣家操作區"}
          </h4>
          
          <button 
            onClick={handleConfirmTransaction} 
            disabled={isBuyer ? order.buyerConfirmed : order.sellerConfirmed} 
            style={{ 
              width: "100%", 
              marginBottom: "12px", 
              padding: "12px", 
              backgroundColor: (isBuyer ? order.buyerConfirmed : order.sellerConfirmed) ? "#ccc" : (isBuyer ? "#007BFF" : "#28a745"), 
              color: "white", 
              border: "none", 
              borderRadius: "6px",
              cursor: (isBuyer ? order.buyerConfirmed : order.sellerConfirmed) ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "16px"
            }}
          >
            {(isBuyer ? order.buyerConfirmed : order.sellerConfirmed) ? "已確認面交" : "確認完成面交"}
          </button>
          
          <button 
            onClick={handleCancelOrder} 
            style={{ 
              width: "100%", 
              padding: "12px", 
              backgroundColor: "#fff", 
              color: "#dc3545", 
              border: "1px solid #dc3545", 
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px"
            }}
          >
            取消訂單
          </button>
        </div>
      )}

      {/* 防偷看機制：無關人員看到的提示 */}
      {!isRelatedUser && currentUserId && (
        <div style={{ padding: "15px", textAlign: "center", color: "#856404", backgroundColor: "#fff3cd", borderRadius: "8px", border: "1px solid #ffeeba" }}>
          ⚠️ 您不是此筆訂單的買家或賣家，無法執行操作。
        </div>
      )}

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button onClick={() => navigate("/")} style={{ border: "none", background: "none", color: "#6c757d", cursor: "pointer", textDecoration: "underline", fontSize: "14px" }}>
          ← 返回首頁
        </button>
      </div>
    </div>
  );
}