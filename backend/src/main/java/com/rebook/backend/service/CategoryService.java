package com.rebook.backend.service;

import com.rebook.backend.model.Book;
import com.rebook.backend.model.Category;
import com.rebook.backend.repository.BookRepository;
import com.rebook.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private BookRepository bookRepository;

    // 建立分類 (對應 Use Case 主流程 2-3 & 3a)
    public Category createCategory(String categoryName, String shopId) {
        if (categoryRepository.existsByCategoryNameAndShopId(categoryName, shopId)) {
            throw new IllegalArgumentException("分類名稱重複：系統提示該分類已存在。");
        }
        Category category = new Category();
        category.create(categoryName, shopId);
        return categoryRepository.save(category);
    }

    // 編輯分類名稱 (連動更新該分類下的所有書籍)
    @Transactional
    public void editCategoryName(String oldName, String newName, String shopId) {
        if (categoryRepository.existsByCategoryNameAndShopId(newName, shopId)) {
            throw new IllegalArgumentException("分類名稱重複：系統提示該分類已存在。");
        }

        // 1. 更新 Category 表
        Category category = categoryRepository.findByCategoryNameAndShopId(oldName, shopId)
                .orElseThrow(() -> new RuntimeException("找不到該分類"));
        category.updateName(newName);
        categoryRepository.save(category);

        // 2. 找出所有該分類的書籍並更新
        List<Book> books = bookRepository.findByShopIdAndCategoryName(shopId, oldName);
        for (Book book : books) {
            book.updateCategory(newName);
        }
        bookRepository.saveAll(books); // 藉由 @Transactional，若存取失敗會自動 rollback
    }

    // 刪除分類 (對應 Use Case Extensions 2a.4: 書籍狀態更新為「未分類」)
    @Transactional
    public void deleteCategory(String categoryName, String shopId) {
        Category category = categoryRepository.findByCategoryNameAndShopId(categoryName, shopId)
                .orElseThrow(() -> new RuntimeException("找不到該分類"));

        categoryRepository.delete(category);

        // 將被刪除分類中的書籍狀態更新為「未分類」
        List<Book> books = bookRepository.findByShopIdAndCategoryName(shopId, categoryName);
        for (Book book : books) {
            book.updateCategory("未分類");
        }
        bookRepository.saveAll(books);
    }

    // 將書籍指派到特定分類 (對應 Use Case 主流程 4-6 & 4a)
    @Transactional
    public void assignBooksToCategory(String categoryName, List<String> bookIds, String shopId) {
        // 先確認分類存在 (若「未分類」則不需檢查 Category 表)
        if (!categoryName.equals("未分類") && !categoryRepository.existsByCategoryNameAndShopId(categoryName, shopId)) {
            throw new IllegalArgumentException("目標分類不存在");
        }

        List<Book> books = (List<Book>) bookRepository.findAllById(bookIds);
        for (Book book : books) {
            // 確保只能改自己的書
            if (book.getShopId().equals(shopId)) {
                book.updateCategory(categoryName);
            }
        }
        bookRepository.saveAll(books);
        // Use Case 4a: 若此處 saveAll 發生 MongoDB 連線異常或其他 RuntimeException，
        // @Transactional 會攔截並讓資料庫狀態還原。
    }

    public List<Category> getCategoriesBySeller(String shopId) {
        return categoryRepository.findByShopId(shopId);
    }
}