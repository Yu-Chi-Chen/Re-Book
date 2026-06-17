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

    public Category createCategory(String categoryName, String shopId) {
        if (categoryRepository.existsByCategoryNameAndShopId(categoryName, shopId)) {
            throw new IllegalArgumentException("分類名稱重複：系統提示該分類已存在。");
        }
        Category category = new Category();
        category.create(categoryName, shopId);
        return categoryRepository.save(category);
    }

    @Transactional
    public void editCategoryName(String oldName, String newName, String shopId) {
        if (categoryRepository.existsByCategoryNameAndShopId(newName, shopId)) {
            throw new IllegalArgumentException("分類名稱重複：系統提示該分類已存在。");
        }

        Category category = categoryRepository.findByCategoryNameAndShopId(oldName, shopId)
                .orElseThrow(() -> new RuntimeException("找不到該分類"));
        category.updateName(newName);
        categoryRepository.save(category);

        List<Book> books = bookRepository.findByShopIdAndCategoryName(shopId, oldName);
        for (Book book : books) {
            book.updateCategory(newName);
        }
        bookRepository.saveAll(books);
    }

    @Transactional
    public void deleteCategory(String categoryName, String shopId) {
        Category category = categoryRepository.findByCategoryNameAndShopId(categoryName, shopId)
                .orElseThrow(() -> new RuntimeException("找不到該分類"));

        categoryRepository.delete(category);

        List<Book> books = bookRepository.findByShopIdAndCategoryName(shopId, categoryName);
        for (Book book : books) {
            book.updateCategory("未分類");
        }
        bookRepository.saveAll(books);
    }

    @Transactional
    public void assignBooksToCategory(String categoryName, List<String> bookIds, String shopId) {
        if (!categoryName.equals("未分類") && !categoryRepository.existsByCategoryNameAndShopId(categoryName, shopId)) {
            throw new IllegalArgumentException("目標分類不存在");
        }

        List<Book> books = (List<Book>) bookRepository.findAllById(bookIds);
        for (Book book : books) {
            if (book.getShopId().equals(shopId)) {
                book.updateCategory(categoryName);
            }
        }
        bookRepository.saveAll(books);
    }

    public List<Category> getCategoriesBySeller(String shopId) {
        return categoryRepository.findByShopId(shopId);
    }
}