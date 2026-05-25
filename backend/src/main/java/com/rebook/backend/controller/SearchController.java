package com.rebook.backend.controller;

import com.rebook.backend.model.Book;
import com.rebook.backend.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/search") // 獨立為 search 路由，對應 SearchController 的設計
public class SearchController {
    @Autowired
    private BookService bookService;

    @GetMapping("/books")
    public ResponseEntity<List<Book>> searchBook(
            @RequestParam(required = false, name = "q") String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice) {

        List<Book> results = bookService.searchBooks(keyword, location, minPrice, maxPrice);
        return ResponseEntity.ok(results);
    }

    // 根據設計圖，這裡也可以放入 viewBookDetails
    @GetMapping("/books/{bookID}")
    public ResponseEntity<Book> viewBookDetails(@PathVariable String bookID) {
        Book book = bookService.getBookById(bookID);
        return ResponseEntity.ok(book);
    }
}
