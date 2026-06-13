package com.rebook.backend.repository;

import com.rebook.backend.model.Shop;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShopRepository extends MongoRepository<Shop, String> {
    // 關鍵功能：透過使用者的 ID 找到他專屬的賣場
    // 當賣家要上架書本時，你需要先透過這個方法查出他的 shopId，再塞進 Book 裡面
    Optional<Shop> findByUserId(String userId);

    // 防呆機制：檢查該使用者是否已經開過賣場了 (確保 1對1 關係)
    boolean existsByUserId(String userId);
}
