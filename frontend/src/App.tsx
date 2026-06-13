import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"; 
import Home from "./pages/Home"; 
import Checkout from "./pages/Checkout";
import OrderDetail from "./pages/OrderDetail";
import SellerDashboard from "./pages/SellerDashboard";
import BookForm from "./components/BookForm";
import SearchResult from "./pages/SearchResult";
import Login from "./pages/Login"; 
import Register from "./pages/Register";

function App() {
  return (
<BrowserRouter>
      {/* 🌟 全域頂部導覽列：放在 Routes 外面，代表它在每一頁都會顯示 */}
      <Navbar />

      {/* 路由設定區塊：根據網址決定要顯示哪個 Component */}
      <Routes>
        {/* 買家視角 */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<OrderDetail />} />

        {/* 賣家視角 */}
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller/add-book" element={<BookForm />} />
        <Route path="/seller/books/edit/:id" element={<BookForm />} />

        {/* 會員系統 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
