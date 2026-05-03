package com.rebook.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Document(collection = "books")
public class Book {
    @Id
    private String bookID;  // 用 String 的話 MongoDB 可以自動生成 UUID
    private String bookCond;
    private int price;
    private BookStatus bookStatus;
    private String categoryName;
    private String sellerID;

    // 建立與 BookInfo 的關聯 (* -> 1)
    // 加上 lazy = true 避免每次查詢 Book 都把 BookInfo 整個撈出來，提升效能
    @DocumentReference(lazy = true)
    private BookInfo bookInfo;

    // --- UML 定義的 Methods ---

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
    public String getBookID() { return bookID; }
    public String getBookCond() { return bookCond; }
    public int getPrice() { return price; }
    public BookStatus getStatus() { return this.bookStatus; }
    public String getCategoryName() { return categoryName; }
    public String getSellerID() { return sellerID; }
    public BookInfo getBookInfo() { return bookInfo; }

    /* Setters */
    public void setBookID(String bookID) { this.bookID = bookID; }
    public void setBookCond(String bookCond) { this.bookCond = bookCond; }
    public void setPrice(int price) { this.price = price; }
    public void setStatus(BookStatus bookStatus) { this.bookStatus = bookStatus; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public void setSellerID(String sellerID) { this.sellerID = sellerID; }
    public void setBookInfo(BookInfo bookInfo) { this.bookInfo = bookInfo; }
}