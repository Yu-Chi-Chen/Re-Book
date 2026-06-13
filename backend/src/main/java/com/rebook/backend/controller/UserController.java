package com.rebook.backend.controller;

import com.rebook.backend.dto.UserLoginRequest;
import com.rebook.backend.dto.UserRegisterRequest;
import com.rebook.backend.model.User;
import com.rebook.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users") // 定義這個 Controller 的基礎路由
public class UserController {
    @Autowired
    private UserService userService;

    // 處理註冊 API: POST /api/users/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegisterRequest request) {
        try {
            User newUser = userService.registerUser(
                    request.getUsername(),
                    request.getEmail(),
                    request.getPassword()
            );
            // 註冊成功，回傳 200 OK 以及使用者資料
            return ResponseEntity.ok(newUser);

        } catch (RuntimeException e) {
            // 如果 Email 重複會捕捉到 Exception，回傳 400 Bad Request 與錯誤訊息
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // 處理登入 API: POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginRequest request) {
        try {
            User user = userService.loginUser(request.getEmail(), request.getPassword());
            // 登入成功，回傳 200 OK 以及使用者資料 (包含 ID 與身分 Roles)
            return ResponseEntity.ok(user);

        } catch (RuntimeException e) {
            // 密碼錯誤或找不到帳號，回傳 401 Unauthorized 與錯誤訊息
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
