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
    private BookRepository bookRepository;

    public void addItem(String userId, String bookId) {
        Cart cart = cartRepository.findById(userId).orElse(new Cart(userId));

        if (cart.getBookIds().contains(bookId)) {
            throw new IllegalStateException("該書籍已在購物車中，請勿重複加入");
        }

        cart.addBookId(bookId);
        cartRepository.save(cart);
    }

    public void removeItem(String userId, String bookId) {
        Cart cart = cartRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("找不到購物車")
        );
        cart.removeBookId(bookId);
        cartRepository.save(cart);
    }

    public CartDTO viewCart(String userId) {
        Cart cart = cartRepository.findById(userId).orElse(new Cart(userId));

        List<Book> booksInCart = (List<Book>) bookRepository.findAllById(cart.getBookIds());

        return new CartDTO(booksInCart);
    }
}
