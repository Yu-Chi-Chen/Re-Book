package com.rebook.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "books")
public class Book {
    @Id
    private String bookID;  // 用 String 的話 MongoDB 可以自動生成 UUID
    private String bookCond;
    private int price;
    private BookStatus bookStatus;
    private String categoryName;

    public void updateStatus(BookStatus newStatus) {
        this.bookStatus = newStatus;
    }

    /* Getters */
    public String getBookID() { return bookID; }
    public String getBookCond() { return bookCond; }
    public int getPrice() { return price; }
    public BookStatus getStatus() { return this.bookStatus; }
    public String getCategoryName() { return categoryName; }

    /* Setters */
    public void setBookID(String bookID) { this.bookID = bookID; }
    public void setBookCond(String bookCond) { this.bookCond = bookCond; }
    public void setPrice(int price) { this.price = price; }
    public void setStatus(BookStatus bookStatus) { this.bookStatus = bookStatus; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
}