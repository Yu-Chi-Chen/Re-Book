package com.rebook.backend.repository;

import com.rebook.backend.model.Book;
import com.rebook.backend.model.BookStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    @Query("{ " +
            "'title': { $regex: ?0, $options: 'i' }, " + // 不區分大小寫
            "'location': ?1, " +
            "'price': { $gte: ?2, $lte: ?3 }, " +
            "'bookStatus': 'AVAILABLE' " +               // 買家只能搜尋到「待售中」的書
            "}")
    List<Book> findBooks(String keyword, String location, int minPrice, int maxPrice);
    List<Book> findBySellerID(String sellerID);
    // 找出所有狀態為 AVAILABLE 的書籍 [cite: 497]
    List<Book> findByBookStatus(BookStatus status);
}
