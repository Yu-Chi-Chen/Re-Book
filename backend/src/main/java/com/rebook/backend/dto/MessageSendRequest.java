package com.rebook.backend.dto;

public class MessageSendRequest {
    private String buyerID;  // 在此情境下為 sender
    private String sellerID; // 在此情境下為 receiver
    private String content;

    // Getters and Setters 省略
    public String getBuyerID() { return buyerID; }
    public void setBuyerID(String buyerID) { this.buyerID = buyerID; }
    public String getSellerID() { return sellerID; }
    public void setSellerID(String sellerID) { this.sellerID = sellerID; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}