package com.rebook.backend.controller;

import com.rebook.backend.dto.BookCreateRequest;
import com.rebook.backend.model.Book;
import com.rebook.backend.model.Shop;
import com.rebook.backend.repository.ShopRepository;
import com.rebook.backend.service.BookService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {
    @Autowired
    private BookService bookService;

    // 👇 記得注入 ShopRepository 來做轉換
    @Autowired
    private ShopRepository shopRepository;

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Book>> getSellerBooks(@PathVariable String sellerId) {
        // 1. 先用 sellerId (也就是 userId) 找出該賣家的賣場
        Shop shop = shopRepository.findByUserId(sellerId)
                .orElseThrow(() -> new RuntimeException("該使用者尚未建立賣場，無法查詢書籍"));

        // 2. 拿到 shop.getId() 後，再去呼叫 Service
        return ResponseEntity.ok(bookService.getBooksByShop(shop.getShopId()));
    }

    @PostMapping("/seller/{sellerId}")
    public ResponseEntity<Book> createBook(
            @PathVariable String sellerId,
            @Valid @RequestBody BookCreateRequest request) {
        Book savedBook = bookService.createBook(request, sellerId);
        return ResponseEntity.ok(savedBook);
    }

    @PutMapping("/{bookId}")
    public ResponseEntity<Book> updateBook(
            @PathVariable String bookId,
            @Valid @RequestBody BookCreateRequest request) {
        Book updatedBook = bookService.updateBookInfo(bookId, request);
        return ResponseEntity.ok(updatedBook);
    }

    @DeleteMapping("/{bookId}")
    public ResponseEntity<Void> deleteBook(@PathVariable String bookId) {
        bookService.destroyBook(bookId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<Book> getBook(@PathVariable String bookId) {
        Book book = bookService.getBookById(bookId);
        return ResponseEntity.ok(book);
    }
}
