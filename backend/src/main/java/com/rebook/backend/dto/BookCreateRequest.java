package com.rebook.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class BookCreateRequest {
    @NotBlank(message = "ISBN不能為空")
    @Pattern(regexp = "^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$", message = "ISBN 格式錯誤")
    private String isbn;

    @NotBlank(message = "書名不能為空")
    private String bookName;

    private String author;
    private String publisher;

    @NotBlank(message = "書況不能為空")
    private String bookCond;

    @NotNull(message = "價格不能為空")
    @Min(value = 0, message = "價格不能為負數")
    private Integer price;

    private String categoryName;

    @NotBlank(message = "書籍所在地不能為空") // 對應 Use Case 要求
    private String location;

    // Getter & Setter
    public String getIsbn() { return isbn; }
    public String getBookName() { return bookName; }
    public String getAuthor() { return author; }
    public String getPublisher() { return publisher; }
    public String getBookCond() { return bookCond; }
    public Integer getPrice() { return price; }
    public String getCategoryName() { return categoryName; }
    public String getLocation() { return location; }

    public void setIsbn(String isbn) { this.isbn = isbn; }
    public void setBookName(String bookName) { this.bookName = bookName; }
    public void setAuthor(String author) { this.author = author; }
    public void setPublisher(String publisher) { this.publisher = publisher; }
    public void setBookCond(String bookCond) { this.bookCond = bookCond; }
    public void setPrice(Integer price) { this.price = price; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public void setLocation(String location) { this.location = location; }
}
