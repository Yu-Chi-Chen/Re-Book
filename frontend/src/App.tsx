// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home"; // 引入新建的首頁
import Checkout from "./Checkout";
import OrderDetail from "./OrderDetail";
import SellerDashboard from "./SellerDashboard";
import BookForm from "./BookForm";
import SearchResult from "./SearchResult";

function App() {
  return (
    <BrowserRouter>
      {/* 全局導覽列 */}
      <nav
        style={{
          padding: "15px 20px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #ddd",
          display: "flex",
          gap: "20px",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: "1.2rem",
            textDecoration: "none",
            color: "#007BFF",
            fontWeight: "900",
            marginRight: "20px",
          }}
        >
          Re:Book
        </Link>
        <Link
          to="/checkout"
          style={{ textDecoration: "none", color: "#555", fontWeight: "bold" }}
        >
          🛒 買家結帳
        </Link>
        <Link
          to="/seller/dashboard"
          style={{ textDecoration: "none", color: "#555", fontWeight: "bold" }}
        >
          📚 賣場管理
        </Link>
      </nav>

      {/* 路由配置 */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* 將首頁設為根目錄 */}
        <Route path="/checkout" element={<Checkout />} />{" "}
        {/* 結帳移至專屬路由 */}
        <Route path="/detail" element={<OrderDetail />} />
        {/* Use Case 1 相關路由 */}
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/books/new" element={<BookForm />} />
        <Route path="/seller/books/edit/:id" element={<BookForm />} />
        <Route path="/search" element={<SearchResult />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
