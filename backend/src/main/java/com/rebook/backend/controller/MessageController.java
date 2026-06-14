package com.rebook.backend.controller;

import com.rebook.backend.dto.MessageSendRequest;
import com.rebook.backend.model.Message;
import com.rebook.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.rebook.backend.dto.ChatConversationDTO;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // 對應 UML: + sendMessage(buyerID, sellerID, content)
    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(@RequestBody MessageSendRequest request) {
        Message sentMessage = messageService.sendMessage(
                request.getBuyerID(),
                request.getSellerID(),
                request.getContent()
        );
        return ResponseEntity.ok(sentMessage);
    }

    // 對應 UML: + viewChatHistory(buyerID, sellerID): List<Message>
    @GetMapping("/history")
    public ResponseEntity<List<Message>> viewChatHistory(
            @RequestParam String buyerID,
            @RequestParam String sellerID) {

        List<Message> history = messageService.viewChatHistory(buyerID, sellerID);
        return ResponseEntity.ok(history);
    }

    // 新增這支 API 讓前端呼叫
    @GetMapping("/conversations")
    public ResponseEntity<List<ChatConversationDTO>> getConversations(@RequestParam String userID) {
        return ResponseEntity.ok(messageService.getConversations(userID));
    }
}