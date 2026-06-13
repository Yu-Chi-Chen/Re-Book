package com.rebook.backend.model;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

@Document(collection = "shops")
public class Shop {
    @Id
    private String id;

    private String shopName;

    @Indexed(unique = true)
    private String userId;

    // 無參數建構子（MongoDB 反序列化、對應資料時必須存在）
    public Shop() {
    }

    // 方便業務邏輯建立物件的建構子
    public Shop(String shopName, String userId) {
        this.shopName = shopName;
        this.userId = userId;
    }

    // Getter & Setter
    public String getShopId() { return id; }
    public String getShopName() { return shopName; }
    public String getUserId() { return userId; }

    public void setShopId(String id) { this.id = id; }
    public void setShopName(String shopName) { this.shopName = shopName; }
    public void setUserId(String userId) { this.userId = userId; }
}