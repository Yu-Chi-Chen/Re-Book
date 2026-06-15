import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Book } from "../types/types";

export default function SearchResult() {
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // 從網址 URL 解析參數 (q, minPrice, maxPrice)
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q") || "";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";

  // 控制篩選表單輸入值的 State
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);

  // 當網址列的參數改變時，同步更新輸入框的文字 (例如使用者按上一頁)
  useEffect(() => {
    setMinPrice(minPriceParam);
    setMaxPrice(maxPriceParam);
  }, [minPriceParam, maxPriceParam]);

  // 當 query、minPriceParam 或 maxPriceParam 改變時，向後端發送請求
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // 動態組合 Query String
        let apiUrl = `http://localhost:8080/api/search/books?q=${encodeURIComponent(query)}`;
        if (minPriceParam) apiUrl += `&minPrice=${minPriceParam}`;
        if (maxPriceParam) apiUrl += `&maxPrice=${maxPriceParam}`;

        const response = await fetch(apiUrl);
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
  }, [query, minPriceParam, maxPriceParam]); // 監聽網址參數的變化

  // 處理套用篩選條件的按鈕點擊
  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 建立新的 URL 參數
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (minPrice.trim()) params.set("minPrice", minPrice);
    if (maxPrice.trim()) params.set("maxPrice", maxPrice);

    // 導向新的網址，觸發 useEffect 重新抓取資料
    navigate(`/search?${params.toString()}`);
  };

  // 清除所有篩選條件
  const handleClearFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // 新增：處理加入購物車的邏輯 (需傳入該書的 bookId)
  const handleAddToCart = async (bookId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/cart/add/${bookId}`, {
        method: 'POST',
        headers: {
          'userId': '6a14011da1c94bd5d428e232' // FIXME: 暫時用假 ID，之後替換
        }
      });
      
      if (response.ok) {
        alert("書籍成功加入購物車！");
      } else {
        const errorText = await response.text();
        alert(`加入失敗：${errorText}`);
      }
    } catch (error) {
      console.error("API 連線失敗:", error);
      alert("系統發生錯誤，請稍後再試。");
    }
  };

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

      {/* 🛠 進階篩選工具欄 */}
      <form
        onSubmit={handleApplyFilter}
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          backgroundColor: "#f8f9fa",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
          flexWrap: "wrap",
          border: "1px solid #eee"
        }}
      >
        <span style={{ fontWeight: "bold", color: "#555", fontSize: "14px" }}>價格篩選：</span>
        <input
          type="number"
          placeholder="最低價格"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{
            padding: "6px 12px",
            width: "100px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            outline: "none"
          }}
        />
        <span style={{ color: "#aaa" }}>~</span>
        <input
          type="number"
          placeholder="最高價格"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{
            padding: "6px 12px",
            width: "100px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            outline: "none"
          }}
        />
        <button
          type="submit"
          style={{
            padding: "6px 15px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "14px"
          }}
        >
          套用
        </button>
        {(minPriceParam || maxPriceParam) && (
          <button
            type="button"
            onClick={handleClearFilter}
            style={{
              padding: "6px 15px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            清除條件
          </button>
        )}
      </form>

      {/* 📦 搜尋結果列表 */}
      {loading ? (
        <p>搜尋中...</p>
      ) : results.length > 0 ? (
        <div style={{ display: "grid", gap: "15px" }}>
          {results.map((book) => (
            <div
              key={book.bookId}
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
                {/* 修改：讓書名變成可以點擊的連結，導向書籍詳情頁 */}
                <h3 
                  onClick={() => navigate(`/books/${book.bookId}`)}
                  style={{ margin: "0 0 5px 0", color: "#007BFF", cursor: "pointer", textDecoration: "underline" }}
                >
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

              {/* 修改：新增按鈕區塊，將查看詳情與購買放在一起 */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => navigate(`/books/${book.bookId}`)}
                  style={{ padding: "10px 15px", backgroundColor: "#f8f9fa", color: "#333", border: "1px solid #ccc", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                >
                  查看詳情
                </button>
                {/* 新增：加入購物車按鈕，透過 onClick 傳遞當前 book.bookId */}
                <button
                  onClick={() => handleAddToCart(book.bookId)}
                  style={{ padding: "10px 15px", backgroundColor: "#ffc107", color: "#333", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}
                >
                  加購物車
                </button>
                <button
                  onClick={() => navigate("/checkout", { state: { bookId: book.bookId } })}
                  style={{ padding: "10px 15px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}
                >
                  立即購買
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
          <p>找不到相符的書籍。</p>
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