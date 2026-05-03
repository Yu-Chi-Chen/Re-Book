package com.rebook.backend.service;

import com.rebook.backend.dto.BookCreateRequest;
import com.rebook.backend.model.Book;
import com.rebook.backend.model.BookInfo;
import com.rebook.backend.model.BookStatus;
import com.rebook.backend.repository.BookInfoRepository;
import com.rebook.backend.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookInfoRepository bookInfoRepository;

    public List<Book> getBooksBySeller(String sellerID) {
        return bookRepository.findBySellerID(sellerID);
    }

    @Transactional
    public Book createBook(BookCreateRequest request, String sellerID) {
        // 1. 處理 BookInfo：如果資料庫沒有這本 ISBN，就新建一筆
        BookInfo info = bookInfoRepository.findById(request.getIsbn()).orElseGet(() -> {
            BookInfo newInfo = new BookInfo();
            newInfo.create(request.getIsbn(), request.getBookName(), request.getAuthor(), request.getPublisher());
            return bookInfoRepository.save(newInfo);
        });

        // 2. 處理 Book 實體
        Book newBook = new Book();
        newBook.create(request.getBookCond(), request.getPrice()); // 使用 UML 定義的 method
        newBook.updateCategory(request.getCategoryName());
        newBook.updateStatus(BookStatus.AVAILABLE); // 假設有 AVAILABLE 這個列舉
        newBook.setSellerID(sellerID);
        newBook.setBookInfo(info); // 綁定 * -> 1 關係

        return bookRepository.save(newBook);
    }

    // 擴充 3a: 更新書籍 (不更動 ISBN，只更動價格、書況等)
    public Book updateBookInfo(String bookID, BookCreateRequest request) {
        Book book = bookRepository.findById(bookID)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.updateInfo(request.getBookCond(), request.getPrice()); // 使用 UML 定義的 method
        book.updateCategory(request.getCategoryName());
        return bookRepository.save(book);
    }

    // 擴充 3b: 刪除書籍 (UML 中的 destroy)
    public void destroyBook(String bookID) {
        bookRepository.deleteById(bookID);
        // 注意：通常不會刪除 BookInfo，因為其他賣家可能也上架了同 ISBN 的書
    }

    // 取得單筆書籍資料 (給前端編輯表單使用)
    public Book getBookById(String bookId) {
        return bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("找不到該書籍資料"));
    }
}
