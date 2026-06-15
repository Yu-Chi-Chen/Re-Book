package com.rebook.backend.controller;

import com.rebook.backend.model.Category;
import com.rebook.backend.service.CategoryService;
import com.rebook.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private CategoryRepository categoryRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createCategory(@RequestParam String categoryName,
                                            @RequestParam String shopId) { // 實務上 shopId 應從 JWT Token 取得
        try {
            categoryService.createCategory(categoryName, shopId);
            return ResponseEntity.ok(Map.of("message", "分類建立成功"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/edit")
    public ResponseEntity<?> editCategoryName(@RequestParam String oldName,
                                              @RequestParam String newName,
                                              @RequestParam String shopId) {
        try {
            categoryService.editCategoryName(oldName, newName, shopId);
            return ResponseEntity.ok(Map.of("message", "分類名稱與相關書籍更新成功"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteCategory(@RequestParam String categoryName,
                                            @RequestParam String shopId) {
        try {
            categoryService.deleteCategory(categoryName, shopId);
            return ResponseEntity.ok(Map.of("message", "分類已刪除，相關書籍已更新為「未分類」"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/assign")
    public ResponseEntity<?> assignBooksToCategory(@RequestParam String categoryName,
                                                   @RequestBody List<String> bookIDs, // 注意：配合 Book.java，這裡改為 String
                                                   @RequestParam String shopId) {
        try {
            categoryService.assignBooksToCategory(categoryName, bookIDs, shopId);
            return ResponseEntity.ok(Map.of("message", "書籍分類套用成功"));
        } catch (Exception e) {
            // 觸發 4a：批次移動失敗，系統提示重新操作
            return ResponseEntity.internalServerError().body(Map.of("error", "批次移動失敗，請重新操作：" + e.getMessage()));
        }
    }

    // 加上這支 API 才能讓前端抓到分類清單
    @GetMapping("")
    public ResponseEntity<?> getCategoriesBySeller(@RequestParam String shopId) {
        try {
            // 請確保 CategoryRepository 有 findByShopId 的方法
            List<Category> categories = categoryRepository.findByShopId(shopId);
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}