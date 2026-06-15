import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book } from '../types/types';

const CURRENT_SHOP_ID = '6a1407ea062b8ec1236c9e64';

// 定義分類的型別
interface Category {
  id: string;
  categoryName: string;
}

function SellerDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // 新增分類用的輸入框狀態
  const [newCategoryName, setNewCategoryName] = useState('');
  // 批次操作：被選取的書籍 ID
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  // 批次操作：目標套用分類
  const [targetCategory, setTargetCategory] = useState('');

  const navigate = useNavigate();

  // ====== 資料獲取 ======
  const fetchBooks = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/shops/${CURRENT_SHOP_ID}/books`);
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/categories?shopId=${CURRENT_SHOP_ID}`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  // ====== 分類管理 (CRUD) ======
  // 1. 新增分類
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return alert('請輸入分類名稱');
    try {
      const res = await fetch(`http://localhost:8080/api/categories/create?categoryName=${newCategoryName}&shopId=${CURRENT_SHOP_ID}`, { method: 'POST' });
      if (res.ok) {
        setNewCategoryName('');
        fetchCategories(); // 重新整理分類清單
      } else {
        const errorData = await res.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error('Create category error:', error);
    }
  };

  // 2. 編輯分類
  const handleEditCategory = async (oldName: string) => {
    const newName = window.prompt(`請輸入新的分類名稱 (原名: ${oldName})`, oldName);
    if (!newName || newName === oldName) return;

    try {
      const res = await fetch(`http://localhost:8080/api/categories/edit?oldName=${oldName}&newName=${newName}&shopId=${CURRENT_SHOP_ID}`, { method: 'PUT' });
      if (res.ok) {
        fetchCategories();
        fetchBooks(); // 書籍清單內的分類名稱可能被改了，需重撈
      } else {
        const errorData = await res.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error('Edit category error:', error);
    }
  };

  // 3. 刪除分類
  const handleDeleteCategory = async (categoryName: string) => {
    if (!window.confirm(`確定要刪除分類「${categoryName}」嗎？底下的書籍將變為未分類。`)) return;
    try {
      const res = await fetch(`http://localhost:8080/api/categories/delete?categoryName=${categoryName}&shopId=${CURRENT_SHOP_ID}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCategories();
        fetchBooks(); // 書籍會被重置為未分類，需重撈
      }
    } catch (error) {
      console.error('Delete category error:', error);
    }
  };

  // 4. 批次套用分類至書籍
  const handleAssignCategory = async () => {
    // 👇 加入這行印出勾選的 ID
    console.log("準備送出的書籍 IDs:", selectedBookIds);

    if (selectedBookIds.length === 0) return alert('請先勾選要套用的書籍');
    if (!targetCategory) return alert('請選擇目標分類');

    try {
      const res = await fetch(`http://localhost:8080/api/categories/assign?categoryName=${targetCategory}&shopId=${CURRENT_SHOP_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedBookIds), // List<String> 作為 RequestBody
      });
      if (res.ok) {
        alert('套用成功！');
        setSelectedBookIds([]); // 清空勾選
        fetchBooks(); // 重撈書籍資料更新畫面
      } else {
        alert('套用失敗');
      }
    } catch (error) {
      console.error('Assign category error:', error);
    }
  };

  // ====== 書籍操作 ======
  const handleDeleteBook = async (bookId: string) => {
    if (window.confirm('確定要刪除這本書嗎？')) {
      try {
        const response = await fetch(`http://localhost:8080/api/books/${bookId}`, { method: 'DELETE' });
        if (response.ok) {
          alert('刪除成功！');
          fetchBooks();
        }
      } catch (error) {
        console.error('Failed to delete book:', error);
      }
    }
  };

  // 處理 Checkbox 單選與全選
  const handleSelectBook = (bookId: string) => {
    setSelectedBookIds(prev => 
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedBookIds(books.map(b => b.bookId));
    else setSelectedBookIds([]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>個人賣場管理</h2>
      
      {/* 區塊 1：分類管理 */}
      <div style={{ background: '#f5f5f5', padding: '15px', marginBottom: '20px', borderRadius: '8px' }}>
        <h3>分類管理</h3>
        <div style={{ marginBottom: '10px' }}>
          <input 
            type="text" 
            placeholder="新分類名稱..." 
            value={newCategoryName} 
            onChange={(e) => setNewCategoryName(e.target.value)} 
            style={{ marginRight: '10px' }}
          />
          <button onClick={handleCreateCategory}>新增分類</button>
        </div>
        
        {/* 現有分類列表 */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <div key={cat.id} style={{ border: '1px solid #ccc', padding: '5px 10px', borderRadius: '4px', background: 'white' }}>
              <span>{cat.categoryName}</span>
              <button onClick={() => handleEditCategory(cat.categoryName)} style={{ marginLeft: '10px', fontSize: '12px' }}>✏️</button>
              <button onClick={() => handleDeleteCategory(cat.categoryName)} style={{ marginLeft: '5px', fontSize: '12px', color: 'red' }}>🗑️</button>
            </div>
          ))}
        </div>
      </div>

      <hr />

      {/* 區塊 2：書籍管理與批次操作 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
        <button onClick={() => navigate('/seller/add-book')} style={{ height: 'fit-content' }}>
          + 新增書籍
        </button>

        <div style={{ background: '#eef5ff', padding: '10px', borderRadius: '8px' }}>
          <span>已選取 {selectedBookIds.length} 本書籍，套用到分類：</span>
          <select 
            value={targetCategory} 
            onChange={(e) => setTargetCategory(e.target.value)}
            style={{ margin: '0 10px' }}
          >
            <option value="">-- 請選擇 --</option>
            <option value="未分類">未分類</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.categoryName}>{cat.categoryName}</option>
            ))}
          </select>
          <button onClick={handleAssignCategory}>套用</button>
        </div>
      </div>

      <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ width: '50px' }}>
              <input type="checkbox" onChange={handleSelectAll} checked={books.length > 0 && selectedBookIds.length === books.length} />
            </th>
            <th>分類</th>
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
              <td style={{ textAlign: 'center' }}>
                <input 
                  type="checkbox" 
                  checked={selectedBookIds.includes(book.bookId)}
                  onChange={() => handleSelectBook(book.bookId)}
                />
              </td>
              <td>{book.categoryName || '未分類'}</td>
              <td>{book.bookInfo?.isbn}</td>
              <td>{book.bookInfo?.bookName}</td>
              <td>{book.bookCond}</td>
              <td>${book.price}</td>
              <td>{book.bookStatus}</td>
              <td>
                <button onClick={() => navigate(`/books/${book.bookId}`)}>查看</button>
                <button onClick={() => navigate(`/seller/books/edit/${book.bookId}`)}>編輯</button>
                <button onClick={() => handleDeleteBook(book.bookId)} style={{ marginLeft: '10px', color: 'red' }}>刪除</button>
              </td>
            </tr>
          ))}
          {books.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center' }}>目前沒有待售書籍</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SellerDashboard;