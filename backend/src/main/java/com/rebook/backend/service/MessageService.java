package com.rebook.backend.service;

import com.rebook.backend.model.Message;
import com.rebook.backend.repository.MessageRepository;
import com.rebook.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.*;
import com.rebook.backend.dto.ChatConversationDTO;
import com.rebook.backend.model.User;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ChatConversationDTO> getConversations(String userID) {
        // 1. 抓出跟這個使用者有關的所有訊息 (最新到最舊)
        List<Message> allMessages = messageRepository.findAllUserMessages(
                userID, Sort.by(Sort.Direction.DESC, "timestamp"));

        // 2. 利用 LinkedHashMap 保留最新的順序，並過濾出每個對象的「最後一筆訊息」
        Map<String, Message> latestMessageMap = new LinkedHashMap<>();
        for (Message msg : allMessages) {
            // 判斷對方是誰
            String targetID = msg.getSenderID().equals(userID) ? msg.getReceiverID() : msg.getSenderID();

            // 因為訊息已經由新到舊排序，所以第一個放進去的就會是最新的
            if (!latestMessageMap.containsKey(targetID)) {
                latestMessageMap.put(targetID, msg);
            }
        }

        // 3. 轉換成前端需要的 DTO (並去 User 表查對方的名字)
        List<ChatConversationDTO> conversations = new ArrayList<>();
        for (Map.Entry<String, Message> entry : latestMessageMap.entrySet()) {
            String targetID = entry.getKey();
            Message lastMsg = entry.getValue();

            // 查名字 (找不到就給預設值)
            String targetUsername = userRepository.findById(targetID)
                    .map(User::getUsername)
                    .orElse("未知使用者");

            conversations.add(new ChatConversationDTO(
                    targetID,
                    targetUsername,
                    lastMsg.getContent(),
                    lastMsg.getTimestamp()
            ));
        }
        return conversations;
    }

    public Message sendMessage(String senderID, String receiverID, String content) {

        Message message = new Message(senderID, receiverID, content);

        // 儲存至資料庫
        Message savedMessage = messageRepository.save(message);

        // TODO: 觸發即時推播 (WebSocket / SSE) 給接收方

        return savedMessage;
    }

    public List<Message> viewChatHistory(String buyerID, String sellerID) {
        // 依照時間戳記遞增排序（舊的訊息在上面，新的在下面）
        return messageRepository.findChatHistory(
                buyerID,
                sellerID,
                Sort.by(Sort.Direction.ASC, "timestamp")
        );
    }
}