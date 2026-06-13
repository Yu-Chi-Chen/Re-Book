package com.rebook.backend.repository;

import com.rebook.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // 用於登入：透過 Email 尋找使用者
    // 使用 Optional 可以優雅地處理「找不到該名使用者」的情況，避免 NullPointerException
    Optional<User> findByEmail(String email);

    // 用於註冊：檢查該 Email 是否已經被註冊過
    boolean existsByEmail(String email);

    // 如果未來你的平台允許用 username 登入，也可以加上這行：
    // Optional<User> findByUsername(String username);
}
