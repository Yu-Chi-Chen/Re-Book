// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import Checkout from './Checkout';
import OrderDetail from './OrderDetail';
// 引入我們新建的元件
import SellerDashboard from './SellerDashboard';
import BookForm from './BookForm';

function App() {
  return (
    // BrowserRouter 讓我們的網址可以自由變化 (例如 /detail)
    <BrowserRouter>
      {/* 加上這個簡單的導覽列 */}
      <nav style={{ padding: '15px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '20px', textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
          🛒 [Use Case 3] 買家結帳測試
        </Link>
        <Link to="/seller/dashboard" style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>
          📚 [Use Case 1] 賣家書籍管理
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Checkout />} />
        <Route path="/detail" element={<OrderDetail />} />

        {/* Use Case 1 相關路由 */}
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/books/new" element={<BookForm />} />
        <Route path="/seller/books/edit/:id" element={<BookForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;