import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { User } from '../types/types'; 

interface Message {
  messageID: string;
  senderID: string;
  receiverID: string;
  content: string;
  timestamp: string;
}

export default function ChatRoom() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 🌟 新增：用來儲存聊天對象的名字
  const [targetUsername, setTargetUsername] = useState<string>('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // 假設從網址取得聊天對象的 ID (例如: /chat?targetID=user_456)
  const targetUserID = searchParams.get('targetID'); 

  // 用來讓對話框自動捲動到最底部
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. 檢查登入狀態與設定 currentUser
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      alert('請先登入！');
      navigate('/login');
      return;
    }
    setCurrentUser(JSON.parse(storedUser));
  }, [navigate]);

  // ==========================================
  // 🌟 新增：根據 targetUserID 去後端取得使用者名稱
  // ==========================================
  useEffect(() => {
    const fetchTargetUser = async () => {
      if (!targetUserID) return;
      
      try {
        // 呼叫你的 UserController API 取得使用者資料
        const response = await fetch(`http://localhost:8080/api/users/${targetUserID}`);
        if (response.ok) {
          const userData = await response.json();
          // 將抓到的名字存入 state (假設後端回傳的欄位名稱是 username)
          setTargetUsername(userData.username);
        } else {
          console.error('找不到該使用者資料');
        }
      } catch (error) {
        console.error('API 連線失敗:', error);
      }
    };

    fetchTargetUser();
  }, [targetUserID]);

  // 2. 載入歷史訊息 (GET API)
  useEffect(() => {
    // 必須要有當前使用者、且網址有帶目標對象的 ID 才能抓資料
    if (currentUser && targetUserID) {
      fetchChatHistory();
    }
  }, [currentUser, targetUserID]);

  // 自動捲動到最新訊息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      // 請將 id 替換為你實際 user 物件中的 ID 屬性名稱 (如 .id, .userID 等)
      const buyerID = currentUser?.id; 
      const response = await fetch(`http://localhost:8080/api/messages/history?buyerID=${buyerID}&sellerID=${targetUserID}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('無法取得歷史訊息');
      }
    } catch (error) {
      console.error('API 連線失敗:', error);
    }
  };

  // 3. 發送訊息 (POST API)
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser || !targetUserID) return;

    const currentUserID = currentUser.id; 

    const requestBody = {
      buyerID: currentUserID,
      sellerID: targetUserID,
      content: inputText
    };

    try {
      const response = await fetch('http://localhost:8080/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const sentMessage = await response.json();
        // 將後端回傳的最新訊息直接加入前端畫面，不用重新 call 歷史紀錄
        setMessages((prev) => [...prev, sentMessage]);
        setInputText(''); // 清空輸入框
      }
    } catch (error) {
      console.error('發送失敗:', error);
    }
  };

  // 簡單的 Inline Styles (可依需求移至 CSS 檔)
  const styles = {
    container: { maxWidth: '600px', margin: '40px auto', border: '1px solid #ccc', borderRadius: '8px', display: 'flex', flexDirection: 'column' as const, height: '70vh' },
    header: { padding: '16px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ccc', fontWeight: 'bold' as const, borderTopLeftRadius: '8px', borderTopRightRadius: '8px' },
    messageArea: { flex: 1, padding: '16px', overflowY: 'auto' as const, display: 'flex', flexDirection: 'column' as const, gap: '12px', backgroundColor: '#fafafa' },
    messageBubble: (isMine: boolean) => ({
      maxWidth: '70%',
      padding: '10px 14px',
      borderRadius: '16px',
      alignSelf: isMine ? 'flex-end' : 'flex-start',
      backgroundColor: isMine ? '#4285F4' : '#e0e0e0',
      color: isMine ? 'white' : 'black',
    }),
    inputArea: { display: 'flex', padding: '16px', borderTop: '1px solid #ccc', backgroundColor: 'white', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' },
    input: { flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc', marginRight: '10px', outline: 'none' },
    sendBtn: { padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#4285F4', color: 'white', cursor: 'pointer', fontWeight: 'bold' as const }
  };

  if (!targetUserID) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>請從書籍頁面選擇要聯絡的賣家。</div>;
  }

  return (
    <div style={styles.container}>
      {/* 🌟 修改：將原本顯示 ID 的地方，替換成 targetUsername。如果還沒抓到名字，就先顯示 ID 作為備案防呆 */}
      <div style={styles.header}>
        與 {targetUsername ? targetUsername : targetUserID} 的對話
      </div>
      
      <div style={styles.messageArea}>
        {messages.map((msg) => {
          // 判斷這則訊息是不是自己發的
          const isMine = msg.senderID === currentUser?.id; 
          return (
            <div key={msg.messageID} style={styles.messageBubble(isMine)}>
              {msg.content}
            </div>
          );
        })}
        {/* 這個 div 用來當作捲動的錨點 */}
        <div ref={messagesEndRef} />
      </div>

      <form style={styles.inputArea} onSubmit={handleSendMessage}>
        <input 
          type="text" 
          style={styles.input}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="輸入訊息..."
        />
        <button type="submit" style={styles.sendBtn}>發送</button>
      </form>
    </div>
  );
}