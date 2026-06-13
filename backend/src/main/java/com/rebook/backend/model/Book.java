package com.rebook.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Document(collection = "books")
public class Book {
    @Id
    private String id;
    private String bookCond;
    private int price;
    private BookStatus bookStatus;
    private String categoryName;
    private String shopId;

    @DocumentReference
    private BookInfo bookInfo;

    public void create(String bookCond, int price) {
        this.bookCond = bookCond;
        this.price = price;
    }

    public void updateInfo(String bookCond, int price) {
        this.bookCond = bookCond;
        this.price = price;
    }

    public void updateCategory(String categoryName) {
        this.categoryName = categoryName;
    }

    public void updateStatus(BookStatus newStatus) {
        this.bookStatus = newStatus;
    }

    /* Getters */
    public String getBookId() { return id; }
    public String getBookCond() { return bookCond; }
    public int getPrice() { return price; }
    public BookStatus getStatus() { return this.bookStatus; }
    public String getCategoryName() { return categoryName; }
    public String getShopId() { return shopId; }
    public BookInfo getBookInfo() { return bookInfo; }

    /* Setters */
    public void setBookId(String id) { this.id = id; }
    public void setBookCond(String bookCond) { this.bookCond = bookCond; }
    public void setPrice(int price) { this.price = price; }
    public void setStatus(BookStatus bookStatus) { this.bookStatus = bookStatus; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public void setShopId(String shopId) { this.shopId = shopId; }
    public void setBookInfo(BookInfo bookInfo) { this.bookInfo = bookInfo; }
}