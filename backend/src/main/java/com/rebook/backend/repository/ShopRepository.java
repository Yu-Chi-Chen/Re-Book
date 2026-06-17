package com.rebook.backend.repository;

import com.rebook.backend.model.Shop;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShopRepository extends MongoRepository<Shop, String> {

    Optional<Shop> findByUserId(String userId);
    boolean existsByUserId(String userId);
}
