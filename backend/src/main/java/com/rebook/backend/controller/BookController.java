package com.rebook.backend.controller;

import com.rebook.backend.dto.BookCreateRequest;
import com.rebook.backend.model.Book;
import com.rebook.backend.service.BookService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*") // 開發階段先允許所有來源，上線時再改回前端的正式網址
@RestController
@RequestMapping("/api/books")
public class BookController {
    @Autowired
    private BookService bookService;

    // 賣家取得清單 (Main Scenario 步驟 2)
    @GetMapping("/seller/{sellerID}")
    public ResponseEntity<List<Book>> getSellerBooks(@PathVariable String sellerID) {
        return ResponseEntity.ok(bookService.getBooksBySeller(sellerID));
    }

    // 賣家上架書籍 (Main Scenario 步驟 3, 4, 5)
    // 加上 @Valid 會自動觸發 BookCreateRequest 內的驗證規則
    @PostMapping("/seller/{sellerID}")
    public ResponseEntity<Book> createBook(
            @PathVariable String sellerID,
            @Valid @RequestBody BookCreateRequest request) {
        Book savedBook = bookService.createBook(request, sellerID);
        return ResponseEntity.ok(savedBook);
    }

    // 賣家編輯書籍 (Extension 3a)
    @PutMapping("/{bookID}")
    public ResponseEntity<Book> updateBook(
            @PathVariable String bookID,
            @Valid @RequestBody BookCreateRequest request) {
        Book updatedBook = bookService.updateBookInfo(bookID, request);
        return ResponseEntity.ok(updatedBook);
    }

    // 賣家刪除書籍 (Extension 3b)
    @DeleteMapping("/{bookID}")
    public ResponseEntity<Void> deleteBook(@PathVariable String bookID) {
        bookService.destroyBook(bookID);
        return ResponseEntity.noContent().build();
    }

    // 5. 取得單筆書籍 (GET /api/books/{bookId})
    @GetMapping("/{bookId}")
    public ResponseEntity<Book> getBook(@PathVariable String bookId) {
        Book book = bookService.getBookById(bookId);
        return ResponseEntity.ok(book);
    }
}
