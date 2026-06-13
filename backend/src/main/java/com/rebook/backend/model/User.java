package com.rebook.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.util.List;
import java.util.ArrayList;

@Document(collection = "users") // 指定在 MongoDB 中的 Collection 名稱
public class User {
    @Id
    private String id; // MongoDB 會自動生成 ObjectId 並轉為 String

    private String username;

    @Indexed(unique = true) // 確保 Email 在資料庫中不會重複
    private String email;

    private String password; // 密碼（之後導入安全機制時建議儲存加密後的 hash，如 BCrypt）

    private List<Role> roles = new ArrayList<>(); // 初始化角色清單

    // 預留給 MongoDB 反序列化用的無參數建構子
    public User() {
    }

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        // 新註冊的使用者，預設給予買家（BUYER）角色
        this.roles.add(Role.BUYER);
    }

    // 方便後續動態新增角色的輔助方法
    public void addRole(Role role) {
        if (!this.roles.contains(role)) {
            this.roles.add(role);
        }
    }

    // Getter & Setter
    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public List<Role> getRoles() { return roles; }

    public void setId(String id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setRoles(List<Role> roles) { this.roles = roles; }
}
