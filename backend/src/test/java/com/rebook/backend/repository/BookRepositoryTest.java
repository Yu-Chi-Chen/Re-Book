package com.rebook.backend.repository;

import com.rebook.backend.model.Book;
import com.rebook.backend.model.BookInfo;
import com.rebook.backend.model.BookStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class BookRepositoryTest {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookInfoRepository bookInfoRepository; // 注入 BookInfo 的 Repository

    @Test
    public void testSaveAndFindBook() {
        System.out.println("開始測試：準備寫入資料到 MongoDB Atlas...");

        // 寫入對應的 BookInfo
        BookInfo infoRef = new BookInfo();
        infoRef.create("9789861070995", "進擊的巨人 1", "諫山創", "東立");
        bookInfoRepository.save(infoRef);

        Book newBook = new Book();
        newBook.create("八成新，書套保護", 50);
        newBook.updateCategory("漫畫");
        newBook.updateStatus(BookStatus.AVAILABLE);
        // 🚨 修改 1：將 setSellerId 改為 setShopId，並給予一個模擬的賣場 ID
        newBook.setShopId("shop_001");
        newBook.setBookInfo(infoRef);

        Book savedBook = bookRepository.save(newBook);
        System.out.println("成功寫入！資料庫自動生成的 ID 為: " + savedBook.getBookId());

        assertNotNull(savedBook.getBookId(), "資料庫應該要自動生成 ID");

        Book foundBook = bookRepository.findById(savedBook.getBookId()).orElse(null);
        assertNotNull(foundBook, "應該要能從資料庫找到剛剛存的書");
        assertEquals(BookStatus.AVAILABLE, foundBook.getStatus(), "狀態應該要是 AVAILABLE");

        assertEquals("八成新，書套保護", foundBook.getBookCond());
        assertEquals(50, foundBook.getPrice());
        // 🚨 修改 2：將 getSellerId 改為 getShopId，並驗證剛剛設定的賣場 ID
        assertEquals("shop_001", foundBook.getShopId());
        assertEquals("9789861070995", foundBook.getBookInfo().getISBN());

        System.out.println("測試通過！");
    }

    @Test
    public void testSaveAndFindBookInfo() {
        System.out.println("開始測試：準備寫入 BookInfo 到 MongoDB...");

        // 1. 建立新的 BookInfo 實體
        BookInfo newBookInfo = new BookInfo();
        newBookInfo.create("9789861070995", "進擊的巨人 1", "諫山創", "東立");

        // 2. 儲存到資料庫
        BookInfo savedBookInfo = bookInfoRepository.save(newBookInfo);
        System.out.println("成功寫入 BookInfo！ISBN 為: " + savedBookInfo.getISBN());

        // 3. 驗證
        assertNotNull(savedBookInfo.getISBN(), "ISBN 不應為空");
        BookInfo foundBookInfo = bookInfoRepository.findById(savedBookInfo.getISBN()).orElse(null);
        assertNotNull(foundBookInfo, "應該要能從資料庫找到剛剛存的 BookInfo");
        assertEquals("進擊的巨人 1", foundBookInfo.getBookName());

        System.out.println("BookInfo 測試通過！\n");
    }
}
