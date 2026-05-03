// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Checkout from './Checkout';
import OrderDetail from './OrderDetail';

function App() {
  return (
    // BrowserRouter 讓我們的網址可以自由變化 (例如 /detail)
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Checkout />} />
        <Route path="/detail" element={<OrderDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;