// src/pages/BookDetail.tsx
import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Book } from '../types/types';

export default function BookDetail() {
  // 取得網址列上的參數，例如 /books/123，這裡的 bookId 就會是 '123'
  const { bookId } = useParams(); 
  const navigate = useNavigate();
  
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 向後端請求單一書籍詳細資料
    const fetchBookDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/books/${bookId}`);
        if (response.ok) {
          const data = await response.json();
          setBook(data);
        } else {
          console.error("找不到該書籍資料");
        }
      } catch (error) {
        console.error("API 連線失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetail();
    }
  }, [bookId]);

  const handleContactSeller = () => {
  if (!book || !book.sellerId) {
    alert("無法取得賣家資訊！");
    return;
  }
  // 直接跳轉，乾淨俐落！
  navigate(`/chat?targetID=${book.sellerId}`);
};

  // 處理點擊立即購買
  const handleBuyNow = () => {
    if (!book) return;
    navigate('/checkout', { state: { bookId: book.bookId } });
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>載入中...</div>;
  if (!book) return <div style={{ textAlign: 'center', padding: '40px' }}>找不到書籍資料。</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', fontSize: '16px' }}
      >
        &larr; 返回上一頁
      </button>

      <div style={{ border: '1px solid #ddd', padding: '24px', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <h1 style={{ color: '#333', marginBottom: '8px' }}>{book.bookInfo?.bookName}</h1>
        <p style={{ color: '#666', fontSize: '18px', marginBottom: '16px' }}>作者：{book.bookInfo?.author || '未知'}</p>
        
        <div style={{ borderTop: '1px solid #eee', paddingTop: '16px', marginBottom: '24px', lineHeight: '1.8' }}>
          <p><strong>ISBN：</strong> {book.bookInfo?.isbn || book.bookInfo?.ISBN || '無資料'} </p>
          <p><strong>書況：</strong> <span style={{ backgroundColor: '#f0f0f0', padding: '2px 8px', borderRadius: '4px' }}>{book.bookCond}</span></p>
          <p style={{ fontSize: '24px', color: '#e44d26', fontWeight: 'bold', marginTop: '12px' }}>
            售價：${book.price}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={handleContactSeller}
            style={{ flex: 1, padding: '12px', backgroundColor: '#f8f9fa', color: '#333', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            💬 聯絡賣家
          </button>
          
          <button 
            onClick={handleBuyNow}
            style={{ flex: 1, padding: '12px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
          >
            🛒 立即購買
          </button>
        </div>
      </div>
    </div>
  );
}