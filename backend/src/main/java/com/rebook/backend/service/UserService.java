package com.rebook.backend.service;

import com.rebook.backend.model.Role;
import com.rebook.backend.model.User;
import com.rebook.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import com.rebook.backend.model.User;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerUser(String username, String email, String password) {
        // 檢查 Email 是否已存在
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("此 Email 已經被註冊過囉！");
        }

        // 建立新使用者，我們在 User 類別的建構子中已經預設給予 Role.BUYER
        User newUser = new User(username, email, password);

        return userRepository.save(newUser);
    }

    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("找不到該 Email 的使用者"));

        // 簡單的比對密碼 (未來建議導入 BCrypt 加密)
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("密碼錯誤！");
        }

        return user; // 登入成功，回傳使用者資訊（包含他的 ID 與 Roles）
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }
}
