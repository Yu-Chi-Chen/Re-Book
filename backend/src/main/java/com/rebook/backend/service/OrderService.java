package com.rebook.backend.service;

import com.rebook.backend.model.Book;
import com.rebook.backend.model.BookStatus;
import com.rebook.backend.model.Order;
import com.rebook.backend.model.OrderStatus;
import com.rebook.backend.repository.BookRepository;
import com.rebook.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private OrderRepository orderRepository;


    @Transactional // 只要其中任何一個 step 失敗或噴出 Exception，Spring Boot 就會把前面已經做過的動作全部撤銷。
    public Order processCheckout(String bookID, String paymentMethod, String buyerID) {
        // 找書
        Book book = bookRepository.findById(bookID)
                .orElseThrow(() -> new RuntimeException("找不到書籍 (ID: " + bookID + ")"));

        // 檢查這本書是不是「待售中」
        if (book.getStatus() != BookStatus.AVAILABLE) {
            throw new RuntimeException("手腳太慢！該書籍已被預訂或售出");
        }

        // 更新書況
        book.updateStatus(BookStatus.RESERVED);
        bookRepository.save(book);

        // 建立訂單並存檔
        Order newOrder = new Order(book, paymentMethod, buyerID);
        return orderRepository.save(newOrder);
    }

    @Transactional
    public Order confirmTransaction(String orderID, String userID) {
        // 1. 找訂單
        Order order = orderRepository.findById(orderID)
                .orElseThrow(() -> new RuntimeException("找不到該訂單"));

        if (order.getOrderStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("此訂單狀態無法進行確認");
        }

        // 2. 確認身分並打勾
        String sellerID = order.getBook().getSellerID();

        if (userID.equals(order.getBuyerID())) {
            order.setBuyerConfirmed(true);
        } else if (userID.equals(sellerID)) {
            order.setSellerConfirmed(true);
        } else {
            throw new RuntimeException("操作失敗：您不是此訂單的買家或賣家！");
        }

        // 3. 檢查：是不是雙方都確認了？
        if (order.isBuyerConfirmed() && order.isSellerConfirmed()) {
            order.setOrderStatus(OrderStatus.COMPLETED); // 訂單完成

            Book book = order.getBook();
            book.updateStatus(BookStatus.SOLD); // 書籍正式售出
            bookRepository.save(book);
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelTransaction(String orderID, String userID) {
        // 1. 找訂單
        Order order = orderRepository.findById(orderID)
                .orElseThrow(() -> new RuntimeException("找不到該訂單"));

        // 檢查：只有 PENDING (未完成) 的訂單才可以取消
        if (order.getOrderStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("此訂單狀態無法取消");
        }

        // 2. 確認身分：只有這筆訂單的「買家」或「賣家」有權限取消
        String sellerID = order.getBook().getSellerID();
        if (!userID.equals(order.getBuyerID()) && !userID.equals(sellerID)) {
            throw new RuntimeException("操作失敗：您無權取消此訂單！");
        }

        // 3. 系統將訂單作廢 (標記為 CANCELLED)
        order.setOrderStatus(OrderStatus.CANCELLED);

        // 4. 自動將書籍狀態恢復為「待售中 (AVAILABLE)」
        Book book = order.getBook();
        book.updateStatus(BookStatus.AVAILABLE);
        bookRepository.save(book);

        // 儲存並回傳更新後的訂單
        return orderRepository.save(order);
    }
}
