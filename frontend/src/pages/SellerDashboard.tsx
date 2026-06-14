import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types/types';

// 假設目前登入的賣家 ID，實務上會從 Context 或 LocalStorage 取得
const CURRENT_SELLER_ID = '6a1407ea062b8ec1236c9e64'; 

function SellerDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const navigate = useNavigate();

  // 取得書籍清單
  const fetchBooks = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/shops/${CURRENT_SELLER_ID}/books`);
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // 刪除書籍 (Extension 3b)
  const handleDelete = async (bookId: string) => {
    if (window.confirm('確定要刪除這本書嗎？')) {
      try {
        const response = await fetch(`http://localhost:8080/api/books/${bookId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('刪除成功！');
          fetchBooks(); // 重新載入清單
        }
      } catch (error) {
        console.error('Failed to delete book:', error);
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>個人賣場管理</h2>
      <button onClick={() => navigate('/seller/add-book')} style={{ marginBottom: '15px' }}>
        + 新增書籍
      </button>

      <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ISBN</th>
            <th>書名</th>
            <th>書況</th>
            <th>價格</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.bookId}>
              <td>{book.bookInfo?.isbn}</td>
              <td>{book.bookInfo?.bookName}</td>
              <td>{book.bookCond}</td>
              <td>${book.price}</td>
              <td>{book.bookStatus}</td>
              <td>
                {/* 修改：新增「查看」按鈕，導向該書籍的詳情頁面 */}
                <button onClick={() => navigate(`/books/${book.bookId}`)}>查看</button>
                <button onClick={() => navigate(`/seller/books/edit/${book.bookId}`)}>編輯</button>
                <button onClick={() => handleDelete(book.bookId)} style={{ marginLeft: '10px', color: 'red' }}>刪除</button>
              </td>
            </tr>
          ))}
          {books.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center' }}>目前沒有待售書籍</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SellerDashboard;