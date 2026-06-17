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

    public Shop() {
    }

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