package com.rebook.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "carts")
public class Cart {

    @Id
    private String userId; // 綁定已登入的買家

    // 資料庫層面只存 ID，確保撈取時能取得最新書籍狀態
    private List<String> bookIds = new ArrayList<>();

    public Cart() {}

    public Cart(String userId) {
        this.userId = userId;
    }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public List<String> getBookIds() { return bookIds; }

    // 對應 UML: addBook (這裡改為接收 ID)
    public void addBookId(String bookId) {
        if (!this.bookIds.contains(bookId)) {
            this.bookIds.add(bookId);
        }
    }

    // 對應 UML: removeBook
    public void removeBookId(String bookId) {
        this.bookIds.remove(bookId);
    }
}
