import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword)}`);
    }
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "800px",
        margin: "0 auto",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h1
        style={{ color: "#007BFF", fontSize: "2.5rem", marginBottom: "10px" }}
      >
        Re:Book 📚
      </h1>

      <p
        style={{
          fontSize: "18px",
          color: "#555",
          lineHeight: "1.6",
          marginBottom: "30px",
        }}
      >
        Re:Book 是一款專為大學生、研究生與自學者打造的應用程式。
        <br />
        旨在解決資源浪費與學術教材成本過高的問題 ，
        <br />
        為每一本書建立延續價值的機會！
      </p>

      <div style={{ marginBottom: "50px" }}>
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <input
            type="text"
            placeholder="搜尋書名、作者或 ISBN..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{
              padding: "12px 20px",
              width: "350px",
              borderRadius: "25px 0 0 25px",
              border: "2px solid #007BFF",
              borderRight: "none",
              outline: "none",
              fontSize: "16px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 25px",
              borderRadius: "0 25px 25px 0",
              backgroundColor: "#007BFF",
              color: "white",
              border: "2px solid #007BFF",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            搜尋
          </button>
        </form>
        <p style={{ fontSize: "13px", color: "#888", marginTop: "10px" }}>
          試試看搜尋：Clean Architecture 或 ISBN
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            padding: "30px 20px",
            borderRadius: "12px",
            width: "280px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>🛒</div>
          <h3 style={{ marginTop: 0 }}>我是買家</h3>
          <p style={{ color: "#666", fontSize: "14px", minHeight: "40px" }}>
            尋找二手的課程教材，透過結帳系統鎖定書籍並完成面交。
          </p>
          <Link
            to="/checkout"
            style={{
              display: "inline-block",
              marginTop: "15px",
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            前往結帳測試
          </Link>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            padding: "30px 20px",
            borderRadius: "12px",
            width: "280px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "40px", marginBottom: "10px" }}>📦</div>
          <h3 style={{ marginTop: 0 }}>我是賣家</h3>
          <p style={{ color: "#666", fontSize: "14px", minHeight: "40px" }}>
            輸入 ISBN 快速上架書籍，管理你的個人賣場與書籍清單。
          </p>
          <Link
            to="/seller/dashboard"
            style={{
              display: "inline-block",
              marginTop: "15px",
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            進入賣場管理
          </Link>
        </div>
      </div>

      <footer style={{ marginTop: "60px", color: "#bbb", fontSize: "12px" }}>
        © 2026 Re:Book - 大學校園二手書媒合平台
      </footer>
    </div>
  );
}
