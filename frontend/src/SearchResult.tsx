// src/SearchResult.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Book } from "./types";

export default function SearchResult() {
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 從 URL 取得查詢參數 q (例如 /search?q=clean)
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // 呼叫我們定義好的搜尋 API
        const response = await fetch(
          `http://localhost:8080/api/books/search?q=${encodeURIComponent(query)}`,
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error("搜尋失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>🔍 搜尋結果："{query}"</h2>

      {loading ? (
        <p>搜尋中...</p>
      ) : results.length > 0 ? (
        <div style={{ display: "grid", gap: "15px" }}>
          {results.map((book) => (
            <div
              key={book.bookID}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 5px 0", color: "#007BFF" }}>
                  {book.bookInfo?.bookName}
                </h3>
                <p style={{ margin: "5px 0", color: "#666" }}>
                  作者：{book.bookInfo?.author || "未知"}
                </p>
                <p style={{ margin: "5px 0", fontSize: "14px" }}>
                  <span
                    style={{
                      backgroundColor: "#f0f0f0",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {book.bookCond}
                  </span>
                  <span
                    style={{
                      marginLeft: "10px",
                      color: "#e44d26",
                      fontWeight: "bold",
                    }}
                  >
                    ${book.price}
                  </span>
                </p>
              </div>

              {/* 點擊後，將 bookID 透過 state 傳遞給結帳頁面 */}
              <button
                onClick={() =>
                  navigate("/checkout", { state: { bookID: book.bookID } })
                }
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007BFF",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                立即購買
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
          <p>找不到相符的書籍 。</p>
          <button
            onClick={() => navigate("/")}
            style={{
              color: "#007BFF",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            返回首頁重新搜尋
          </button>
        </div>
      )}
    </div>
  );
}
