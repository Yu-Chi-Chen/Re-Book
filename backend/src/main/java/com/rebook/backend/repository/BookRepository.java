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
            "'title': { $regex: ?0, $options: 'i' }, " +
            "'location': ?1, " +
            "'price': { $gte: ?2, $lte: ?3 }, " +
            "'bookStatus': 'AVAILABLE' " +
            "}")
    List<Book> findBooks(String keyword, String location, int minPrice, int maxPrice);
    List<Book> findByShopId(String shopId);
    List<Book> findByBookStatus(BookStatus status);
}
