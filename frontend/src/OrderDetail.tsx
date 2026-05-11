import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OrderDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(location.state?.orderData);
  const [message, setMessage] = useState("");

  if (!order) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>找不到訂單</h2>
        <button onClick={() => navigate("/")}>回首頁</button>
      </div>
    );
  }

  const handleConfirmTransaction = async (
    actingUserID: string,
    roleName: string,
  ) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/${order.orderID}/confirm?userID=${actingUserID}`,
        {
          method: "PUT",
        },
      );
      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
        setMessage(`✅ ${roleName} 確認成功！`);
      } else {
        const errorText = await response.text();
        setMessage(`❌ 確認失敗：${errorText}`);
      }
    } catch (error) {
      setMessage("⚠️ 系統連線錯誤");
    }
  };

  const handleCancelOrder = async (actingUserID: string, roleName: string) => {
    if (
      window.confirm(
        `確定要以 ${roleName} 的身分取消這筆訂單嗎？書籍將恢復為待售狀態。`,
      )
    ) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/orders/${order.orderID}/cancel?userID=${actingUserID}`,
          {
            method: "PUT",
          },
        );

        if (response.ok) {
          const updatedOrder = await response.json();
          setOrder(updatedOrder);
          setMessage(`🚫 訂單已由 ${roleName} 取消作廢！書籍已恢復待售。`);
        } else {
          const errorText = await response.text();
          setMessage(`❌ 取消失敗：${errorText}`);
        }
      } catch (error) {
        setMessage("⚠️ 系統連線錯誤");
      }
    }
  };

  const isCompleted = order.orderStatus === "COMPLETED";
  const isCancelled = order.orderStatus === "CANCELLED";
  const isPending = order.orderStatus === "PENDING";

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        maxWidth: "650px",
        margin: "0 auto",
      }}
    >
      <h2 style={{ textAlign: "center" }}>📝 訂單詳細資訊 (測試控制台)</h2>

      <div
        style={{
          border: "1px solid #ddd",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          backgroundColor: "#fdfdfd",
          boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        }}
      >
        <p>
          <strong>訂單編號：</strong> {order.orderID}
        </p>
        <p>
          <strong>目前狀態：</strong>
          <span
            style={{
              color: isCompleted ? "green" : isCancelled ? "red" : "#ff9800",
              fontWeight: "bold",
              marginLeft: "8px",
            }}
          >
            {order.orderStatus}
          </span>
        </p>
        <p>
          <strong>書籍狀態：</strong>{" "}
          {order.book.status || order.book.bookStatus}
        </p>
        <hr style={{ margin: "15px 0" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#555",
          }}
        >
          <span>
            買家確認狀態：{order.buyerConfirmed ? "✅ 已確認" : "❌ 未確認"}
          </span>
          <span>
            賣家確認狀態：{order.sellerConfirmed ? "✅ 已確認" : "❌ 未確認"}
          </span>
        </div>
      </div>

      {message && (
        <div
          style={{
            padding: "12px",
            marginBottom: "20px",
            textAlign: "center",
            backgroundColor: "#e9ecef",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          {message}
        </div>
      )}

      {isPending && (
        <div style={{ display: "flex", gap: "20px" }}>
          <div
            style={{
              flex: 1,
              border: "2px dashed #007BFF",
              padding: "15px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h4 style={{ color: "#007BFF", marginTop: 0 }}>🛒 模擬買家登入</h4>
            <p style={{ fontSize: "12px", color: "#666" }}>
              ID: {order.buyerID}
            </p>
            <button
              onClick={() => handleConfirmTransaction(order.buyerID, "買家")}
              disabled={order.buyerConfirmed}
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: order.buyerConfirmed ? "#ccc" : "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: order.buyerConfirmed ? "not-allowed" : "pointer",
              }}
            >
              買家確認面交
            </button>
            <button
              onClick={() => handleCancelOrder(order.buyerID, "買家")}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#fff",
                color: "#dc3545",
                border: "1px solid #dc3545",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              取消訂單
            </button>
          </div>

          <div
            style={{
              flex: 1,
              border: "2px dashed #28a745",
              padding: "15px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h4 style={{ color: "#28a745", marginTop: 0 }}>📦 模擬賣家登入</h4>
            <p style={{ fontSize: "12px", color: "#666" }}>
              ID: {order.book.sellerID}
            </p>
            <button
              onClick={() =>
                handleConfirmTransaction(order.book.sellerID, "賣家")
              }
              disabled={order.sellerConfirmed}
              style={{
                width: "100%",
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: order.sellerConfirmed ? "#ccc" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: order.sellerConfirmed ? "not-allowed" : "pointer",
              }}
            >
              賣家確認面交
            </button>
            <button
              onClick={() => handleCancelOrder(order.book.sellerID, "賣家")}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#fff",
                color: "#dc3545",
                border: "1px solid #dc3545",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              取消訂單
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            border: "none",
            background: "none",
            color: "#007BFF",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          返回首頁
        </button>
      </div>
    </div>
  );
}
