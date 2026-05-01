package com.rebook.backend.repository;

import com.rebook.backend.model.Book;
import com.rebook.backend.model.BookStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class BookRepositoryTest {
    @Autowired
    private BookRepository bookRepository;

    @Test
    public void testSaveAndFindBook() {
        System.out.println("開始測試：準備寫入資料到 MongoDB Atlas...");

        // 準備一本書的假資料
        Book newBook = new Book();
        newBook.setPrice(500);
        newBook.updateStatus(BookStatus.AVAILABLE);

        // 存入 MongoDB
        Book savedBook = bookRepository.save(newBook);
        System.out.println("成功寫入！資料庫自動生成的 ID 為: " + savedBook.getBookID());

        // 檢查是否成功寫入
        assertNotNull(savedBook.getBookID(), "資料庫應該要自動生成 ID");

        // 用 ID 把它找出來看看
        Book foundBook = bookRepository.findById(savedBook.getBookID()).orElse(null);
        assertNotNull(foundBook, "應該要能從資料庫找到剛剛存的書");
        assertEquals(BookStatus.AVAILABLE, foundBook.getStatus(), "狀態應該要是 AVAILABLE");

        System.out.println("測試完美通過！你的資料庫連線完全沒問題！");
    }
}
