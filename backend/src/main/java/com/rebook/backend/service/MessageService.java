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
        List<Message> allMessages = messageRepository.findAllUserMessages(
                userID, Sort.by(Sort.Direction.DESC, "timestamp"));

        Map<String, Message> latestMessageMap = new LinkedHashMap<>();
        for (Message msg : allMessages) {
            String targetID = msg.getSenderID().equals(userID) ? msg.getReceiverID() : msg.getSenderID();

            if (!latestMessageMap.containsKey(targetID)) {
                latestMessageMap.put(targetID, msg);
            }
        }

        List<ChatConversationDTO> conversations = new ArrayList<>();
        for (Map.Entry<String, Message> entry : latestMessageMap.entrySet()) {
            String targetID = entry.getKey();
            Message lastMsg = entry.getValue();

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

        Message savedMessage = messageRepository.save(message);

        return savedMessage;
    }

    public List<Message> viewChatHistory(String buyerID, String sellerID) {
        return messageRepository.findChatHistory(
                buyerID,
                sellerID,
                Sort.by(Sort.Direction.ASC, "timestamp")
        );
    }
}