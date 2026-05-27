import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./Home"; 
import Checkout from "./Checkout";
import OrderDetail from "./OrderDetail";
import SellerDashboard from "./SellerDashboard";
import BookForm from "./BookForm";
import SearchResult from "./SearchResult";
// 新增這兩個我們即將/已經建立的頁面
import Login from "./Login"; 
import Register from "./Register";

function App() {
  return (
<BrowserRouter>
      {/* 簡單的導覽列，方便開發時切換頁面測試 */}
      <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '15px' }}>買家首頁 (Home)</Link>
        <Link to="/seller" style={{ marginRight: '15px' }}>賣家中心 (Seller)</Link>
        <Link to="/login" style={{ marginRight: '15px' }}>登入 (Login)</Link>
        <Link to="/register">註冊 (Register)</Link>
      </nav>

      {/* 路由設定區塊：根據網址決定要顯示哪個 Component */}
      <Routes>
        {/* 買家視角 */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<OrderDetail />} /> {/* 使用 :id 作為動態參數 */}

        {/* 賣家視角 */}
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller/add-book" element={<BookForm />} />

        {/* 會員系統 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
