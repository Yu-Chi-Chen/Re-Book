package com.rebook.backend.repository;

import com.rebook.backend.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends MongoRepository<Category, String> {
    // 用於 Use case 3a: 檢查該賣家是否已經有同名的分類
    boolean existsByCategoryNameAndShopId(String categoryName, String shopId);

    Optional<Category> findByCategoryNameAndShopId(String categoryName, String shopId);
    List<Category> findByShopId(String shopId);
}