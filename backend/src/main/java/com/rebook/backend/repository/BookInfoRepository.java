package com.rebook.backend.repository;

import com.rebook.backend.model.BookInfo;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookInfoRepository extends MongoRepository<BookInfo, String> {
}