package com.rebook.backend.service;

import com.rebook.backend.model.Role;
import com.rebook.backend.model.User;
import com.rebook.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // 告訴 JUnit 我們要使用 Mockito
public class UserServiceTest {
    @Mock
    private UserRepository userRepository; // 模擬一個假的 Repository，不連真實資料庫

    @InjectMocks
    private UserService userService; // 把假的 Repository 注入到 UserService 裡

    @Test
    public void testRegisterUser_Success() {
        // Arrange (準備階段)
        String username = "testUser";
        String email = "test@example.com";
        String password = "password123";

        // 告訴假的 Repository：當有人呼叫 existsByEmail 且參數是 test@example.com 時，回傳 false
        when(userRepository.existsByEmail(email)).thenReturn(false);

        // 告訴假的 Repository：當有人呼叫 save 時，直接把傳進去的 User 原封不動回傳
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act (執行階段)
        User result = userService.registerUser(username, email, password);

        // Assert (驗證階段)
        assertNotNull(result);
        assertEquals(username, result.getUsername());
        assertEquals(email, result.getEmail());
        assertTrue(result.getRoles().contains(Role.BUYER)); // 驗證是否有預設賦予 BUYER 角色

        // 驗證 userRepository.save 確實有被呼叫過一次
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testRegisterUser_EmailAlreadyExists() {
        // Arrange
        String username = "testUser";
        String email = "duplicate@example.com";
        String password = "password123";

        // 模擬資料庫裡已經有這個 Email 了
        when(userRepository.existsByEmail(email)).thenReturn(true);

        // Act & Assert (預期會拋出 RuntimeException)
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.registerUser(username, email, password);
        });

        // 驗證錯誤訊息是否如我們預期
        assertEquals("此 Email 已經被註冊過囉！", exception.getMessage());

        // 驗證這種情況下，系統絕對不能呼叫 save 方法
        verify(userRepository, never()).save(any(User.class));
    }
}
