package com.rebook.backend.controller;

import com.rebook.backend.dto.ShopCreateRequest;
import com.rebook.backend.model.Shop;
import com.rebook.backend.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.rebook.backend.repository.BookRepository;
import com.rebook.backend.model.Book;
import java.util.List;

@RestController
@RequestMapping("/api/shops")
public class ShopController {
    @Autowired
    private ShopService shopService;

    @Autowired
    private BookRepository bookRepository;

    @PostMapping
    public ResponseEntity<?> createShop(@RequestBody ShopCreateRequest request) {
        try {
            Shop newShop = shopService.createShop(request.getShopName(), request.getUserId());
            return ResponseEntity.ok(newShop);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/{shopId}/books")
    public ResponseEntity<?> getBooksInShop(@PathVariable String shopId) {
        try {
            List<Book> shopBooks = bookRepository.findByShopId(shopId);
            return ResponseEntity.ok(shopBooks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("無法載入賣場書籍：" + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getShopByUserId(@PathVariable String userId) {
        try {
            Shop shop = shopService.getShopByUserId(userId);
            return ResponseEntity.ok(shop);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
