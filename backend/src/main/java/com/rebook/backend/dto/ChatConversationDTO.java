package com.rebook.backend.dto;
import java.time.LocalDateTime;

public class ChatConversationDTO {
    private String targetUserID;
    private String targetUsername; // 聊天對象的名字
    private String latestMessage;  // 最後一則訊息內容
    private LocalDateTime timestamp; // 最後一則訊息的時間

    public ChatConversationDTO(String targetUserID, String targetUsername, String latestMessage, LocalDateTime timestamp) {
        this.targetUserID = targetUserID;
        this.targetUsername = targetUsername;
        this.latestMessage = latestMessage;
        this.timestamp = timestamp;
    }

    // Getters
    public String getTargetUserID() { return targetUserID; }
    public String getTargetUsername() { return targetUsername; }
    public String getLatestMessage() { return latestMessage; }
    public LocalDateTime getTimestamp() { return timestamp; }
}