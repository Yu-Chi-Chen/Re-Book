package com.rebook.backend.service;

import com.rebook.backend.dto.BookCreateRequest;
import com.rebook.backend.model.Book;
import com.rebook.backend.model.BookInfo;
import com.rebook.backend.model.BookStatus;
import com.rebook.backend.model.Shop;
import com.rebook.backend.repository.BookInfoRepository;
import com.rebook.backend.repository.BookRepository;
import com.rebook.backend.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private BookInfoRepository bookInfoRepository;

    @Autowired
    private ShopRepository shopRepository;

    public List<Book> getBooksByShop(String shopId) {
        return bookRepository.findByShopId(shopId);
    }

    @Transactional
    public Book createBook(BookCreateRequest request, String userId) {
        Shop shop = shopRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("您尚未建立賣場，無法上架書籍！"));

        BookInfo info = bookInfoRepository.findById(request.getIsbn()).orElseGet(() -> {
            BookInfo newInfo = new BookInfo();
            newInfo.create(request.getIsbn(), request.getBookName(), request.getAuthor(), request.getPublisher());
            return bookInfoRepository.save(newInfo);
        });

        Book newBook = new Book();
        newBook.create(request.getBookCond(), request.getPrice());
        newBook.updateCategory(request.getCategoryName());
        newBook.updateStatus(BookStatus.AVAILABLE);

        newBook.setShopId(shop.getShopId());
        newBook.setSellerId(userId);
        newBook.setBookInfo(info);

        return bookRepository.save(newBook);
    }

    public Book updateBookInfo(String bookId, BookCreateRequest request) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.updateInfo(request.getBookCond(), request.getPrice());
        book.updateCategory(request.getCategoryName());
        return bookRepository.save(book);
    }

    public void destroyBook(String bookId) {
        bookRepository.deleteById(bookId);
    }

    public Book getBookById(String bookId) {
        return bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("找不到該書籍資料"));
    }

    public List<Book> searchBooks(String keyword, String location, Integer minPrice, Integer maxPrice) {
        List<Book> allAvailable = bookRepository.findByBookStatus(BookStatus.AVAILABLE);

        return allAvailable.stream().filter(b -> {
            boolean matchKeyword = true;
            if (keyword != null && !keyword.isEmpty()) {
                String lowerKey = keyword.toLowerCase();
                boolean matchName = (b.getBookInfo() != null && b.getBookInfo().getBookName() != null && b.getBookInfo().getBookName().toLowerCase().contains(lowerKey));
                boolean matchAuthor = (b.getBookInfo() != null && b.getBookInfo().getAuthor() != null && b.getBookInfo().getAuthor().toLowerCase().contains(lowerKey));
                boolean matchIsbn = (b.getBookInfo() != null && b.getBookInfo().getISBN() != null && b.getBookInfo().getISBN().contains(keyword));
                matchKeyword = matchName || matchAuthor || matchIsbn;
            }

            boolean matchMinPrice = (minPrice == null) || b.getPrice() >= minPrice;
            boolean matchMaxPrice = (maxPrice == null) || b.getPrice() <= maxPrice;

            boolean matchLocation = true;
            // if (location != null && !location.isEmpty()) {}

            return matchKeyword && matchMinPrice && matchMaxPrice && matchLocation;
        }).toList();
    }
}
