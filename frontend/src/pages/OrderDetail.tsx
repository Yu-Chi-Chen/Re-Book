import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderDetail() {
  // 1. 從網址抓取 :id 參數
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // 2. 初始狀態設為 null，因為需要等完成 API 請求
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState("");

  // 3. 新增：當頁面載入時，自動去後端撈取該筆訂單資料
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8080/api/orders/${id}`);
        if (response.ok) {
          const data = await response.json();
          setOrder(data); // 存入最新訂單資料
        } else {
          setMessage("❌ 無法載入訂單，該訂單可能不存在。");
        }
      } catch (error) {
        setMessage("⚠️ 系統連線錯誤，無法獲取訂單詳情。");
      } finally {
        setLoading(false); // 關閉載入狀態
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  // 4. 控制確認交易的 API (保持不變，但注意網址使用網址上的 id 或是 order.orderId)
  const handleConfirmTransaction = async (actingUserId: string, roleName: string) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/${id}/confirm?userId=${actingUserId}`,
        { method: "PUT" }
      );
      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder); // 更新狀態，畫面會即時重繪
        setMessage(`✅ ${roleName} 確認成功！`);
      } else {
        const errorText = await response.text();
        setMessage(`❌ 確認失敗：${errorText}`);
      }
    } catch (error) {
      setMessage("⚠️ 系統連線錯誤");
    }
  };

  const handleCancelOrder = async (actingUserId: string, roleName: string) => {
    if (window.confirm(`確定要以 ${roleName} 的身分取消這筆訂單嗎？`)) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/orders/${id}/cancel?userId=${actingUserId}`,
          { method: "PUT" }
        );
        if (response.ok) {
          const updatedOrder = await response.json();
          setOrder(updatedOrder);
          setMessage(`🚫 訂單已由 ${roleName} 取消作廢！`);
        } else {
          const errorText = await response.text();
          setMessage(`❌ 取消失敗：${errorText}`);
        }
      } catch (error) {
        setMessage("⚠️ 系統連線錯誤");
      }
    }
  };

  // 5. 處理「讀取中」與「查無資料」的防錯保護，絕對不會白畫面！
  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>⏳ 訂單資料載入中，請稍候...</div>;
  }

  if (!order) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>{message || "找不到該筆訂單"}</h2>
        <button onClick={() => navigate("/")}>回首頁</button>
      </div>
    );
  }

  // 6. 資料成功拿到後的渲染邏輯 (對齊我們先前修改過的 order.sellerId)
  const isCompleted = order.orderStatus === "COMPLETED";
  const isCancelled = order.orderStatus === "CANCELLED";
  const isPending = order.orderStatus === "PENDING";

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "650px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>📝 訂單詳細資訊</h2>

      <div style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", marginBottom: "20px", backgroundColor: "#fdfdfd" }}>
        <p><strong>訂單編號：</strong> {order.orderId}</p>
        <p><strong>目前狀態：</strong> 
          <span style={{ color: isCompleted ? "green" : isCancelled ? "red" : "#ff9800", fontWeight: "bold", marginLeft: "8px" }}>
            {order.orderStatus}
          </span>
        </p>
        <p><strong>書籍狀態：</strong> {order.book?.status || order.book?.bookStatus || "未知"}</p>
        <hr style={{ margin: "15px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", color: "#555" }}>
          <span>買家確認狀態：{order.buyerConfirmed ? "✅ 已確認" : "❌ 未確認"}</span>
          <span>賣家確認狀態：{order.sellerConfirmed ? "✅ 已確認" : "❌ 未確認"}</span>
        </div>
      </div>

      {message && <div style={{ padding: "12px", marginBottom: "20px", textAlign: "center", backgroundColor: "#e9ecef", borderRadius: "5px" }}>{message}</div>}

      {isPending && (
        <div style={{ display: "flex", gap: "20px" }}>
          {/* 模擬買家 */}
          <div style={{ flex: 1, border: "2px dashed #007BFF", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
            <h4 style={{ color: "#007BFF", marginTop: 0 }}>🛒 模擬買家登入</h4>
            <p style={{ fontSize: "12px", color: "#666" }}>ID: {order.buyerId}</p>
            <button onClick={() => handleConfirmTransaction(order.buyerId, "買家")} disabled={order.buyerConfirmed} style={{ width: "100%", marginBottom: "10px", padding: "10px", backgroundColor: order.buyerConfirmed ? "#ccc" : "#007BFF", color: "white", border: "none", borderRadius: "5px" }}>買家確認面交</button>
            <button onClick={() => handleCancelOrder(order.buyerId, "買家")} style={{ width: "100%", padding: "10px", backgroundColor: "#fff", color: "#dc3545", border: "1px solid #dc3545", borderRadius: "5px" }}>取消訂單</button>
          </div>

          {/* 模擬賣家：這裡改用 order.sellerId */}
          <div style={{ flex: 1, border: "2px dashed #28a745", padding: "15px", borderRadius: "8px", textAlign: "center" }}>
            <h4 style={{ color: "#28a745", marginTop: 0 }}>📦 模擬賣家登入</h4>
            <p style={{ fontSize: "12px", color: "#666" }}>ID: {order.sellerId}</p>
            <button onClick={() => handleConfirmTransaction(order.sellerId, "賣家")} disabled={order.sellerConfirmed} style={{ width: "100%", marginBottom: "10px", padding: "10px", backgroundColor: order.sellerConfirmed ? "#ccc" : "#28a745", color: "white", border: "none", borderRadius: "5px" }}>賣家確認面交</button>
            <button onClick={() => handleCancelOrder(order.sellerId, "賣家")} style={{ width: "100%", padding: "10px", backgroundColor: "#fff", color: "#dc3545", border: "1px solid #dc3545", borderRadius: "5px" }}>取消訂單</button>
          </div>
        </div>
      )}

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button onClick={() => navigate("/")} style={{ border: "none", background: "none", color: "#007BFF", cursor: "pointer", textDecoration: "underline" }}>返回首頁</button>
      </div>
    </div>
  );
}