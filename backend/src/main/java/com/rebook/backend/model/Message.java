package com.rebook.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "messages")
public class Message {

    @Id
    private String messageID;
    private String senderID;
    private String receiverID;
    private String content;
    private LocalDateTime timestamp;

    public Message() {}

    // 對應 UML 中的 create(senderID, receiverID, content) 方法
    public Message(String senderID, String receiverID, String content) {
        this.senderID = senderID;
        this.receiverID = receiverID;
        this.content = content;
        this.timestamp = LocalDateTime.now(); // 建立時自動產生時間戳記
    }

    // Getters and Setters 省略
    public String getMessageID() { return messageID; }
    public void setMessageID(String messageID) { this.messageID = messageID; }
    public String getSenderID() { return senderID; }
    public void setSenderID(String senderID) { this.senderID = senderID; }
    public String getReceiverID() { return receiverID; }
    public void setReceiverID(String receiverID) { this.receiverID = receiverID; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}