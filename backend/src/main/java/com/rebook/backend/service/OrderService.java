package com.rebook.backend.service;

import com.rebook.backend.model.Book;
import com.rebook.backend.model.BookStatus;
import com.rebook.backend.model.Order;
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
}
