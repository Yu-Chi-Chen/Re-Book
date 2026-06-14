package com.rebook.backend.dto;

import com.rebook.backend.model.Book;
import java.util.List;

public class CartDTO {
    private List<Book> booksInCart;

    public CartDTO(List<Book> booksInCart) {
        this.booksInCart = booksInCart;
    }

    public List<Book> getItems() {
        return booksInCart;
    }
}
