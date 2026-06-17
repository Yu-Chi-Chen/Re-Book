package com.rebook.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "categories")
public class Category {
    @Id
    private String id;
    private String categoryName;
    private String shopId;

    public Category() {}

    public void create(String categoryName, String shopId) {
        this.categoryName = categoryName;
        this.shopId = shopId;
    }

    public void updateName(String newName) {
        this.categoryName = newName;
    }

    // Getters and Setters
    public String getId() { return id; }
    public String getCategoryName() { return categoryName; }
    public String getSellerId() { return shopId; }
}
