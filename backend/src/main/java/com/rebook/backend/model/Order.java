package com.rebook.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DocumentReference;

@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private OrderStatus orderStatus;
    private String paymentMethod;
    private String buyerId;
    private String shopId;
    private String sellerId;

    @DocumentReference
    private Book book;

    private boolean isBuyerConfirmed = false;
    private boolean isSellerConfirmed = false;

    public Order() {}

    public Order(Book book, String paymentMethod, String buyerId) {
        this.book = book;
        this.paymentMethod = paymentMethod;
        this.buyerId = buyerId;
        this.orderStatus = OrderStatus.PENDING;
    }

    // --- Getter & Setter ---
    public String getOrderId() { return id; }
    public OrderStatus getOrderStatus() { return orderStatus; }
    public Book getBook() { return book; }
    public String getBuyerId() { return buyerId; }
    public String getShopId() { return shopId; }
    public String getSellerId() { return sellerId; }

    public void setOrderStatus(OrderStatus orderStatus) { this.orderStatus = orderStatus; }
    public void setShopId(String shopId) { this.shopId = shopId; }
    public void setSellerId(String sellerId) { this.sellerId = sellerId; }

    public boolean isBuyerConfirmed() { return isBuyerConfirmed; }
    public void setBuyerConfirmed(boolean buyerConfirmed) { this.isBuyerConfirmed = buyerConfirmed; }
    public boolean isSellerConfirmed() { return isSellerConfirmed; }
    public void setSellerConfirmed(boolean sellerConfirmed) { this.isSellerConfirmed = sellerConfirmed; }
}
