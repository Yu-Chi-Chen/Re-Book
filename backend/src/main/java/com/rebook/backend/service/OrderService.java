package com.rebook.backend.service;

import com.rebook.backend.model.*;
import com.rebook.backend.repository.BookRepository;
import com.rebook.backend.repository.OrderRepository;
import com.rebook.backend.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Transactional
    public Order processCheckout(String bookId, String paymentMethod, String buyerId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("找不到書籍 (ID: " + bookId + ")"));

        if (book.getStatus() != BookStatus.AVAILABLE) {
            throw new RuntimeException("手腳太慢！該書籍已被預訂或售出");
        }

        book.updateStatus(BookStatus.RESERVED);
        bookRepository.save(book);

        String shopId = book.getShopId();
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("找不到該書本所屬的賣場"));
        String sellerId = shop.getUserId();

        Order newOrder = new Order(book, paymentMethod, buyerId);
        newOrder.setSellerId(sellerId);
        return orderRepository.save(newOrder);
    }

    @Transactional
    public Order confirmTransaction(String orderId, String userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("找不到該訂單"));

        if (order.getOrderStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("此訂單狀態無法進行確認");
        }

        String shopId = order.getBook().getShopId();
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("找不到該書本所屬的賣場"));
        String sellerId = shop.getUserId();

        if (userId.equals(order.getBuyerId())) {
            order.setBuyerConfirmed(true);
        } else if (userId.equals(sellerId)) {
            order.setSellerConfirmed(true);
        } else {
            throw new RuntimeException("操作失敗：您不是此訂單的買家或賣家！");
        }

        if (order.isBuyerConfirmed() && order.isSellerConfirmed()) {
            order.setOrderStatus(OrderStatus.COMPLETED);

            Book book = order.getBook();
            book.updateStatus(BookStatus.SOLD);
            bookRepository.save(book);
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelTransaction(String orderId, String userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("找不到該訂單"));

        if (order.getOrderStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("此訂單狀態無法取消");
        }

        String shopId = order.getBook().getShopId();
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("找不到該書本所屬的賣場"));
        String sellerId = shop.getUserId();

        if (!userId.equals(order.getBuyerId()) && !userId.equals(sellerId)) {
            throw new RuntimeException("操作失敗：您無權取消此訂單！");
        }

        order.setOrderStatus(OrderStatus.CANCELLED);

        Book book = order.getBook();
        book.updateStatus(BookStatus.AVAILABLE);
        bookRepository.save(book);

        return orderRepository.save(order);
    }

    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("找不到該筆訂單 (ID: " + orderId + ")"));
    }

    // 🌟 新增：根據買家 ID 獲取所有相關訂單
    public List<Order> getOrdersByBuyerId(String buyerId) {
        return orderRepository.findByBuyerId(buyerId);
    }

    // 🌟 新增：根據賣家 ID 獲取所有相關訂單
    public List<Order> getOrdersBySellerId(String sellerId) {
        return orderRepository.findBySellerId(sellerId);
    }
}