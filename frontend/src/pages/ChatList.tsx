// src/pages/ChatList.tsx
import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types/types';

interface Conversation {
  targetUserID: string;
  targetUsername: string;
  latestMessage: string;
  timestamp: string;
}

export default function ChatList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      const storedUser = localStorage.getItem('currentUser');
      if (!storedUser) {
        navigate('/login');
        return;
      }

      const currentUser: User = JSON.parse(storedUser);

      try {
        const response = await fetch(`http://localhost:8080/api/messages/conversations?userID=${currentUser.id}`);
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        }
      } catch (error) {
        console.error('無法取得聊天列表:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [navigate]);

  // 格式化時間顯示 (例如: 下午 1:30 或 2026/06/15)
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' });
  };

  const styles = {
    container: { maxWidth: '600px', margin: '40px auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' },
    header: { padding: '20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #eaeaea', fontSize: '20px', fontWeight: 'bold' as const },
    listItem: { display: 'flex', padding: '16px 20px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer', transition: 'background-color 0.2s' },
    avatar: { width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#4285F4', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' as const, flexShrink: 0 },
    content: { marginLeft: '16px', flex: 1, overflow: 'hidden' },
    nameRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
    name: { fontSize: '16px', fontWeight: 'bold' as const, color: '#333' },
    time: { fontSize: '12px', color: '#999' },
    message: { fontSize: '14px', color: '#666', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>載入中...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>聊天</div>
      
      {conversations.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>目前還沒有任何對話紀錄。</div>
      ) : (
        <div>
          {conversations.map((conv) => (
            <div 
              key={conv.targetUserID} 
              style={styles.listItem}
              // 滑鼠懸停效果 (Inline style 簡單實作)
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              // 點擊後跳轉到 1對1 聊天室，並帶上對方的 ID
              onClick={() => navigate(`/chat?targetID=${conv.targetUserID}`)}
            >
              {/* 頭像 (取名字第一個字) */}
              <div style={styles.avatar}>
                {conv.targetUsername.charAt(0).toUpperCase()}
              </div>
              
              <div style={styles.content}>
                <div style={styles.nameRow}>
                  <div style={styles.name}>{conv.targetUsername}</div>
                  <div style={styles.time}>{formatTime(conv.timestamp)}</div>
                </div>
                <div style={styles.message}>{conv.latestMessage}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}