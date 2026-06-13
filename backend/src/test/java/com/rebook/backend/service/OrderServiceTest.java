package com.rebook.backend.service;

import com.rebook.backend.model.Book;
import com.rebook.backend.model.BookStatus;
import com.rebook.backend.model.Order;
import com.rebook.backend.model.OrderStatus;
import com.rebook.backend.repository.BookRepository;
import com.rebook.backend.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {
    @Mock
    private BookRepository bookRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    public void testProcessCheckout_Success() {
        System.out.println("測試情境 1：成功建立訂單");

        String testBookID = "book-123";
        Book fakeBook = new Book();
        fakeBook.updateStatus(BookStatus.AVAILABLE);

        Order fakeOrder = new Order(fakeBook, "CASH", "buyer-999");

        when(bookRepository.findById(testBookID)).thenReturn(Optional.of(fakeBook));
        when(orderRepository.save(any(Order.class))).thenReturn(fakeOrder);

        Order resultOrder = orderService.processCheckout(testBookID, "CASH", "buyer-999");

        assertNotNull(resultOrder, "回傳的訂單不應該是空的");
        assertEquals(BookStatus.RESERVED, fakeBook.getStatus(), "書籍狀態應該要被改成保留中 (RESERVED)");

        verify(bookRepository, times(1)).save(fakeBook);
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    public void testProcessCheckout_Fail_BookAlreadySold() {
        System.out.println("測試情境 2：書已經被別人買走了");

        String testBookID = "book-456";
        Book soldBook = new Book();
        soldBook.updateStatus(BookStatus.SOLD);

        when(bookRepository.findById(testBookID)).thenReturn(Optional.of(soldBook));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            orderService.processCheckout(testBookID, "CASH", "buyer-999");
        });

        assertEquals("手腳太慢！該書籍已被預訂或售出", exception.getMessage());

        verify(bookRepository, never()).save(any(Book.class));
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    public void testConfirmTransaction_BuyerOnly_Success() {
        System.out.println("測試情境 3：買家單方面確認面交 (訂單狀態應保持 PENDING)");

        String testOrderID = "order-111";
        String buyerID = "buyer-999";
        String sellerID = "seller-777";

        Book mockBook = new Book();
        // 🚨 修改 1：將 setSellerId 改為 setShopId，並給予一個模擬的賣場 ID
        mockBook.setShopId("shop_001");
        mockBook.updateStatus(BookStatus.RESERVED);

        Order mockOrder = new Order(mockBook, "CASH", buyerID);

        when(orderRepository.findById(testOrderID)).thenReturn(Optional.of(mockOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(mockOrder);

        Order resultOrder = orderService.confirmTransaction(testOrderID, buyerID);

        assertTrue(resultOrder.isBuyerConfirmed(), "買家確認狀態應該要是 true");
        assertFalse(resultOrder.isSellerConfirmed(), "賣家還沒確認，應該要是 false");
        assertEquals(OrderStatus.PENDING, resultOrder.getOrderStatus(), "雙方尚未全數確認，訂單應維持 PENDING");

        verify(bookRepository, never()).save(any(Book.class));
    }

    @Test
    public void testConfirmTransaction_BothConfirmed_OrderCompleted() {
        System.out.println("測試情境 4：雙方皆確認，訂單完成並扣除庫存");

        String testOrderID = "order-222";
        String buyerID = "buyer-999";
        String sellerID = "seller-777";

        Book mockBook = new Book();
        // 🚨 修改 1：將 setSellerId 改為 setShopId，並給予一個模擬的賣場 ID
        mockBook.setShopId("shop_001");
        mockBook.updateStatus(BookStatus.RESERVED);

        Order mockOrder = new Order(mockBook, "CASH", buyerID);
        mockOrder.setBuyerConfirmed(true);

        when(orderRepository.findById(testOrderID)).thenReturn(Optional.of(mockOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(mockOrder);

        Order resultOrder = orderService.confirmTransaction(testOrderID, sellerID);

        assertTrue(resultOrder.isBuyerConfirmed(), "買家已確認");
        assertTrue(resultOrder.isSellerConfirmed(), "賣家已確認");

        assertEquals(OrderStatus.COMPLETED, resultOrder.getOrderStatus(), "訂單狀態必須變成 COMPLETED");
        assertEquals(BookStatus.SOLD, mockBook.getStatus(), "書籍狀態必須變成 SOLD");

        verify(bookRepository, times(1)).save(mockBook);
        verify(orderRepository, times(1)).save(any(Order.class));
    }
}
