package com.rebook.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Document(collection = "orders")    // Order 的資料要存到 "orders" 這個 collection 裡面
public class Order {
    @Id // 把 orderID 標示為 primary key
    private String orderID;
    private OrderStatus orderStatus;
    private String paymentMethod;
    private String buyerID; // 記錄是哪個買家買的

    @DocumentReference // MongoDB 只存 BookID，但在 Java 裡可以直接拿到整本書。
    private Book book;

    private boolean isBuyerConfirmed = false;
    private boolean isSellerConfirmed = false;

    /*
     * 必須有空的 constructor！！！
     * Spring Boot 把 MongoDB 的 JSON 變成 Java 的 Order 時必須要有
    */
    public Order() {}

    // 給我們自己建立訂單用的建構子
    public Order(Book book, String paymentMethod, String buyerID) {
        this.book = book;
        this.paymentMethod = paymentMethod;
        this.buyerID = buyerID;
        this.orderStatus = OrderStatus.PENDING; // 預設狀態為處理中
    }

    // --- Getter & Setter ---
    public String getOrderID() { return orderID; }
    public OrderStatus getOrderStatus() { return orderStatus; }
    public void setOrderStatus(OrderStatus orderStatus) { this.orderStatus = orderStatus; }
    public Book getBook() { return book; }

    public boolean isBuyerConfirmed() { return isBuyerConfirmed; }
    public void setBuyerConfirmed(boolean buyerConfirmed) { this.isBuyerConfirmed = buyerConfirmed; }
    public boolean isSellerConfirmed() { return isSellerConfirmed; }
    public void setSellerConfirmed(boolean sellerConfirmed) { this.isSellerConfirmed = sellerConfirmed; }

    public String getBuyerID() { return buyerID; }
}
