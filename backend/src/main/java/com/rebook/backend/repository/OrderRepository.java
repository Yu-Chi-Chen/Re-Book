package com.rebook.backend.repository;

import com.rebook.backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository; // 或 JpaRepository
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    // 新增：尋找該買家的所有訂單
    List<Order> findByBuyerId(String buyerId);

    // 新增：尋找該賣家的所有訂單
    List<Order> findBySellerId(String sellerId);
}