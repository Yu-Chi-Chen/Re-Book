// src/pages/SellerDashboard.tsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Book, User } from '../types/types';

// Category 目前不在 types.ts 中，保留在地定義
interface Category {
  id: string;
  categoryName: string;
}

function SellerDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [targetCategory, setTargetCategory] = useState('');

  const [shopId, setShopId] = useState<string | null>(null);
  const [shopName, setShopName] = useState<string>('個人賣場'); 
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const initDashboard = async () => {
      const storedUser = localStorage.getItem('currentUser');
      if (!storedUser) {
        navigate('/login');
        return;
      }

      const user: User = JSON.parse(storedUser);

      if (!user.roles.includes('SELLER')) {
        alert('您尚未開通賣場，請先成為賣家！');
        navigate('/');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/api/shops/user/${user.id}`);
        if (response.ok) {
          const shopData = await response.json();
          // 防呆：相容後端回傳 id 或 shopId
          setShopId(shopData.id || shopData.shopId); 
          if (shopData.shopName) {
            setShopName(shopData.shopName);
          }
        } else {
          alert('找不到您的賣場資料，請聯繫客服。');
          navigate('/');
        }
      } catch (error) {
        console.error('獲取賣場資料失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [navigate]);

  const fetchBooks = useCallback(async () => {
    if (!shopId) return;
    try {
      const response = await fetch(`http://localhost:8080/api/shops/${shopId}/books`);
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
    }
  }, [shopId]);

  const fetchCategories = useCallback(async () => {
    if (!shopId) return;
    try {
      const response = await fetch(`http://localhost:8080/api/categories?shopId=${shopId}`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, [shopId]);

  useEffect(() => {
    if (shopId) {
      fetchBooks();
      fetchCategories();
    }
  }, [shopId, fetchBooks, fetchCategories]);

  const handleCreateCategory = async () => {
    if (!shopId) return;
    if (!newCategoryName.trim()) return alert('請輸入分類名稱');
    try {
      const res = await fetch(`http://localhost:8080/api/categories/create?categoryName=${newCategoryName}&shopId=${shopId}`, { method: 'POST' });
      if (res.ok) {
        setNewCategoryName('');
        fetchCategories(); 
      } else {
        const errorData = await res.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error('Create category error:', error);
    }
  };

  const handleEditCategory = async (oldName: string) => {
    if (!shopId) return;
    const newName = window.prompt(`請輸入新的分類名稱 (原名: ${oldName})`, oldName);
    if (!newName || newName === oldName) return;

    try {
      const res = await fetch(`http://localhost:8080/api/categories/edit?oldName=${oldName}&newName=${newName}&shopId=${shopId}`, { method: 'PUT' });
      if (res.ok) {
        fetchCategories();
        fetchBooks(); 
      } else {
        const errorData = await res.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error('Edit category error:', error);
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    if (!shopId) return;
    if (!window.confirm(`確定要刪除分類「${categoryName}」嗎？底下的書籍將變為未分類。`)) return;
    try {
      const res = await fetch(`http://localhost:8080/api/categories/delete?categoryName=${categoryName}&shopId=${shopId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCategories();
        fetchBooks(); 
      }
    } catch (error) {
      console.error('Delete category error:', error);
    }
  };

  const handleAssignCategory = async () => {
    if (!shopId) return;
    if (selectedBookIds.length === 0) return alert('請先勾選要套用的書籍');
    if (!targetCategory) return alert('請選擇目標分類');

    try {
      const res = await fetch(`http://localhost:8080/api/categories/assign?categoryName=${targetCategory}&shopId=${shopId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedBookIds), 
      });
      if (res.ok) {
        alert('套用成功！');
        setSelectedBookIds([]); 
        fetchBooks(); 
      } else {
        alert('套用失敗');
      }
    } catch (error) {
      console.error('Assign category error:', error);
    }
  };

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

  const handleSelectBook = (bookId: string) => {
    setSelectedBookIds(prev => 
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // 確保全選時抓到的是正確的 ID
      setSelectedBookIds(books.map(b => b.bookId || (b as any).id));
    } else {
      setSelectedBookIds([]);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>⏳ 載入賣場資訊中...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ display: 'flex', justifyContent: "center", alignItems: "center", gap: '8px' }}>
        🏪 {shopName}
      </h2>
      
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

      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0' }}>
        <button onClick={() => navigate('/seller/add-book', { state: { shopId } })} style={{ height: 'fit-content' }}>
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
          {books.map((book) => {
            // 🌟 核心防呆處理：對齊 types.ts 並攔截後端 JSON 命名差異
            // 1. 主鍵：優先取 types.ts 定義的 bookId，若後端傳 id 也能接住
            const currentId = book.bookId || (book as any).id;
            
            // 2. 書名與 ISBN：優先取巢狀的 bookInfo，若後端是扁平結構也能接住
            const currentBookName = book.bookInfo?.bookName || (book as any).bookName || '未命名書籍';
            const currentIsbn = book.bookInfo?.isbn || book.bookInfo?.ISBN || (book as any).isbn || '無';
            
            // 3. 書籍狀態
            const currentStatus = book.bookStatus || (book as any).status || '未知狀態';

            return (
              <tr key={currentId}>
                <td style={{ textAlign: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedBookIds.includes(currentId)}
                    onChange={() => handleSelectBook(currentId)}
                  />
                </td>
                <td>{book.categoryName || '未分類'}</td>
                <td>{currentIsbn}</td>
                <td>{currentBookName}</td>
                <td>{book.bookCond}</td>
                <td>${book.price}</td>
                <td>{currentStatus}</td>
                <td>
                  <button onClick={() => navigate(`/books/${currentId}`)}>查看</button>
                  <button onClick={() => navigate(`/seller/books/edit/${currentId}`)}>編輯</button>
                  <button onClick={() => handleDeleteBook(currentId)} style={{ marginLeft: '10px', color: 'red' }}>刪除</button>
                </td>
              </tr>
            );
          })}
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