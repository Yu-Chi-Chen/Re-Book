import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { BookFormData } from './types';

const CURRENT_SELLER_ID = 'user_001';

function BookForm() {
  const { id } = useParams<{ id: string }>(); // 如果網址有 id，代表是編輯模式
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<BookFormData>({
    isbn: '', bookName: '', author: '', publisher: '',
    bookCond: '', price: '', categoryName: '', location: ''
  });
  
  // 用來儲存後端回傳的欄位錯誤訊息 (例如: { isbn: "ISBN 格式錯誤" })
  const [errors, setErrors] = useState<Record<string, string>>({});

  // [編輯模式] 如果有 id，去後端撈這本書的舊資料填入表單
  useEffect(() => {
    if (isEditMode) {
      const fetchBookData = async () => {
        try {
          // 注意：確保你的後端已經有實作 GET /api/books/{bookId} 的 API
          const response = await fetch(`http://localhost:8080/api/books/${id}`);
          if (response.ok) {
            const bookData = await response.json();
            
            setFormData({
              isbn: bookData.bookInfo?.ISBN || bookData.bookInfo?.isbn || '',
              bookName: bookData.bookInfo?.bookName || '',
              author: bookData.bookInfo?.author || '',
              publisher: bookData.bookInfo?.publisher || '',
              bookCond: bookData.bookCond || '',
              price: bookData.price || '',
              categoryName: bookData.categoryName || '',
              location: bookData.location || '' 
            });
          } else {
             console.error("無法取得書籍資料，伺服器回應錯誤");
          }
        } catch (error) {
          console.error('取得書籍資料失敗:', error);
        }
      };

      fetchBookData();
    }
  }, [id, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
    // 清除該欄位的錯誤提示
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // 重置錯誤

    const url = isEditMode 
      ? `http://localhost:8080/api/books/${id}` 
      : `http://localhost:8080/api/books/seller/${CURRENT_SELLER_ID}`;
    
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(isEditMode ? '更新成功！' : '上架成功！');
        navigate('/seller/dashboard'); // 回到清單頁，滿足「2秒內同步」的需求
      } else if (response.status === 400) {
        // 處理後端 @Valid 傳回的錯誤 (4a, 4b)
        const errorData = await response.json();
        // 假設後端 ControllerAdvice 回傳的格式是 { fieldName: "error message" }
        setErrors(errorData);
        alert('請檢查表單欄位格式！');
      }
    } catch (error) {
      console.error('Submit failed:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>{isEditMode ? '編輯書籍' : '新增書籍'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        <label>ISBN: (必填)</label>
        <input name="isbn" value={formData.isbn} onChange={handleChange} disabled={isEditMode} />
        {errors.isbn && <span style={{ color: 'red', fontSize: '12px' }}>{errors.isbn}</span>}

        <label>書名: (必填)</label>
        <input name="bookName" value={formData.bookName} onChange={handleChange} disabled={isEditMode} />
        {errors.bookName && <span style={{ color: 'red', fontSize: '12px' }}>{errors.bookName}</span>}

        <label>書況: (必填)</label>
        <input name="bookCond" value={formData.bookCond} onChange={handleChange} placeholder="例如：九成新" />
        {errors.bookCond && <span style={{ color: 'red', fontSize: '12px' }}>{errors.bookCond}</span>}

        <label>價格: (必填)</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} />
        {errors.price && <span style={{ color: 'red', fontSize: '12px' }}>{errors.price}</span>}

        <label>所在地: (必填)</label>
        <input name="location" value={formData.location} onChange={handleChange} placeholder="例如：台北市" />
        {errors.location && <span style={{ color: 'red', fontSize: '12px' }}>{errors.location}</span>}

        {/* 作者、出版社、分類等選填欄位可依此類推加入 */}

        <div style={{ marginTop: '20px' }}>
          <button type="button" onClick={() => navigate('/seller/dashboard')} style={{ marginRight: '10px' }}>取消</button>
          <button type="submit">送出</button>
        </div>
      </form>
    </div>
  );
}

export default BookForm;