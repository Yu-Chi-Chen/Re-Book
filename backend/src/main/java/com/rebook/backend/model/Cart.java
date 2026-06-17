package com.rebook.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "carts")
public class Cart {

    @Id
    private String userId;

    private List<String> bookIds = new ArrayList<>();

    public Cart() {}

    public Cart(String userId) {
        this.userId = userId;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public List<String> getBookIds() { return bookIds; }

    public void addBookId(String bookId) {
        if (!this.bookIds.contains(bookId)) {
            this.bookIds.add(bookId);
        }
    }

    public void removeBookId(String bookId) {
        this.bookIds.remove(bookId);
    }
}
