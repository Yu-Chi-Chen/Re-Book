package com.rebook.backend.controller;

import com.rebook.backend.model.Book;
import com.rebook.backend.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
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

    @GetMapping("/books/{bookId}")
    public ResponseEntity<Book> viewBookDetails(@PathVariable String bookId) {
        Book book = bookService.getBookById(bookId);
        return ResponseEntity.ok(book);
    }
}
