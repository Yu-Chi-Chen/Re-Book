package com.rebook.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Document(collection = "book_infos")
public class BookInfo {
    @Id
    @NotBlank(message = "ISBN不能為空")
    @Pattern(
            regexp = "^(?:ISBN(?:-1[03])?:? )?" +
                    "(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|" +
                    "97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)" +
                    "(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$",
            message = "ISBN 格式錯誤"
    )
    private String ISBN;

    @NotBlank(message = "書名不能為空")
    private String bookName;

    private String author;

    private String publisher;

    public void create(String ISBN, String bookName, String author, String publisher) {
        this.ISBN = ISBN;
        this.bookName = bookName;
        this.author = author;
        this.publisher = publisher;
    }

    // Getters and Setters
    public String getISBN() { return ISBN; }
    public void setISBN(String ISBN) { this.ISBN = ISBN; }
    public String getBookName() { return bookName; }
    public void setBookName(String bookName) { this.bookName = bookName; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }
}
