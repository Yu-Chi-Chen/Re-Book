package com.rebook.backend.service;

import com.rebook.backend.dto.CartDTO;
import com.rebook.backend.model.Book;
import com.rebook.backend.model.Cart;
import com.rebook.backend.repository.BookRepository;
import com.rebook.backend.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.ArrayList;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private BookRepository bookRepository; // 用來查詢書籍即時狀態

    // 對應 Use Case: 加入購物車 & Extension 2a: 檢查重複
    public void addItem(String userId, String bookId) {
        Cart cart = cartRepository.findById(userId).orElse(new Cart(userId));

        if (cart.getBookIds().contains(bookId)) {
            // Extension 2a: 重複加入，拋出例外由 Controller 處理為 HTTP 400 或 409
            throw new IllegalStateException("該書籍已在購物車中，請勿重複加入");
        }

        cart.addBookId(bookId);
        cartRepository.save(cart);
    }

    // 對應 Use Case: 移除書籍 (Extension 3b)
    public void removeItem(String userId, String bookId) {
        Cart cart = cartRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("找不到購物車")
        );
        cart.removeBookId(bookId);
        cartRepository.save(cart);
    }

    // 對應 Use Case: 查看所有已加入的書籍資訊 (同步最新狀態)
    public CartDTO viewCart(String userId) {
        Cart cart = cartRepository.findById(userId).orElse(new Cart(userId));

        // 根據 bookIds 去撈取最新的 Book 資訊 (包含下架/售出狀態)
        List<Book> booksInCart = (List<Book>) bookRepository.findAllById(cart.getBookIds());

        return new CartDTO(booksInCart);
    }
}
