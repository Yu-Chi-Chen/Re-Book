package com.rebook.backend.dto;

public class ShopCreateRequest {
    private String shopName;
    private String userId; // 告訴後端是哪個使用者要開賣場

    // Getters and Setters
    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
