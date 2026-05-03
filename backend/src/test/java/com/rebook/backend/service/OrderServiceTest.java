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

@ExtendWith(MockitoExtension.class) // 啟動 Mockito 魔法
public class OrderServiceTest {
    @Mock // 假裝這是一個資料庫管理員 (不會真的連線 DB)
    private BookRepository bookRepository;

    @Mock // 假裝這是一個訂單資料庫管理員
    private OrderRepository orderRepository;

    @InjectMocks // 把上面兩個假的 Repository 塞進我們要測試的 OrderService 裡面
    private OrderService orderService;

    @Test
    public void testProcessCheckout_Success() {
        System.out.println("測試情境 1：成功建立訂單");

        // 1. 準備假資料：一本狀態為「待售中」的書
        String testBookID = "book-123";
        Book fakeBook = new Book();
        // 假設你的 Book.java 裡有 setId 或 setBookID 方法，如果沒有可以直接用建構子或略過
        fakeBook.updateStatus(BookStatus.AVAILABLE);

        // 準備一個預期會建立出來的假訂單
        Order fakeOrder = new Order(fakeBook, "CASH", "buyer-999");

        // 2. 設定 Mock 行為 (重點！)
        // 當 Service 呼叫 bookRepository.findById 時，我們強制它回傳剛剛準備好的 fakeBook
        when(bookRepository.findById(testBookID)).thenReturn(Optional.of(fakeBook));
        // 當 Service 呼叫 orderRepository.save 時，強制回傳 fakeOrder
        when(orderRepository.save(any(Order.class))).thenReturn(fakeOrder);

        // 3. 實際執行你要測試的方法
        Order resultOrder = orderService.processCheckout(testBookID, "CASH", "buyer-999");

        // 4. 驗證結果 (Assertions)
        assertNotNull(resultOrder, "回傳的訂單不應該是空的");
        assertEquals(BookStatus.RESERVED, fakeBook.getStatus(), "書籍狀態應該要被改成保留中 (RESERVED)");

        // 5. 驗證動作是否有確實執行 (Verify)
        // 確保 bookRepository.save 有被呼叫過 1 次 (代表有去更新書籍狀態)
        verify(bookRepository, times(1)).save(fakeBook);
        // 確保 orderRepository.save 有被呼叫過 1 次 (代表有去存訂單)
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    public void testProcessCheckout_Fail_BookAlreadySold() {
        System.out.println("測試情境 2：書已經被別人買走了 (防範併發)");

        // 準備一本狀態已經是「已售出」的書（假資料）
        String testBookID = "book-456";
        Book soldBook = new Book();
        soldBook.updateStatus(BookStatus.SOLD);

        // 只要有人（Service）來找 book-456 這本書，你就把剛剛那本已經賣掉的假書交給他。[Mock]
        when(bookRepository.findById(testBookID)).thenReturn(Optional.of(soldBook));

        // 執行並驗證是否會拋出 Exception
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            orderService.processCheckout(testBookID, "CASH", "buyer-999");
        });

        // 檢查系統噴出來的錯誤訊息是不是和預期一致
        assertEquals("手腳太慢！該書籍已被預訂或售出", exception.getMessage());

        // 在出錯的結帳過程中， save 的動作絕對不可以被呼叫到半次！
        verify(bookRepository, never()).save(any(Book.class));
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    public void testConfirmTransaction_BuyerOnly_Success() {
        System.out.println("測試情境 3：買家單方面確認面交 (訂單狀態應保持 PENDING)");

        // 1. 準備假資料
        String testOrderID = "order-111";
        String buyerID = "buyer-999";
        String sellerID = "seller-777";

        Book mockBook = new Book();
        mockBook.setSellerID(sellerID);
        mockBook.updateStatus(BookStatus.RESERVED);

        Order mockOrder = new Order(mockBook, "CASH", buyerID);
        // 模擬這是一筆剛建立好的處理中訂單
        // (假設你的 Order 類別有 setOrderStatus，如果沒有請透過反射或其他方式，或直接確保建構子是 PENDING)

        // 2. 設定 Mock 行為
        when(orderRepository.findById(testOrderID)).thenReturn(Optional.of(mockOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(mockOrder);

        // 3. 執行測試：買家按下確認
        Order resultOrder = orderService.confirmTransaction(testOrderID, buyerID);

        // 4. 驗證結果
        assertTrue(resultOrder.isBuyerConfirmed(), "買家確認狀態應該要是 true");
        assertFalse(resultOrder.isSellerConfirmed(), "賣家還沒確認，應該要是 false");
        assertEquals(OrderStatus.PENDING, resultOrder.getOrderStatus(), "雙方尚未全數確認，訂單應維持 PENDING");

        // 5. 驗證動作：此時還不能更新書籍狀態！
        verify(bookRepository, never()).save(any(Book.class));
    }

    @Test
    public void testConfirmTransaction_BothConfirmed_OrderCompleted() {
        System.out.println("測試情境 4：雙方皆確認，訂單完成並扣除庫存");

        // 1. 準備假資料
        String testOrderID = "order-222";
        String buyerID = "buyer-999";
        String sellerID = "seller-777";

        Book mockBook = new Book();
        mockBook.setSellerID(sellerID);
        mockBook.updateStatus(BookStatus.RESERVED);

        Order mockOrder = new Order(mockBook, "CASH", buyerID);
        // 故意把買家設為「已確認」，模擬買家已經先按過按鈕了
        mockOrder.setBuyerConfirmed(true);

        // 2. 設定 Mock 行為
        when(orderRepository.findById(testOrderID)).thenReturn(Optional.of(mockOrder));
        when(orderRepository.save(any(Order.class))).thenReturn(mockOrder);

        // 3. 執行測試：換賣家按下確認
        Order resultOrder = orderService.confirmTransaction(testOrderID, sellerID);

        // 4. 驗證結果
        assertTrue(resultOrder.isBuyerConfirmed(), "買家已確認");
        assertTrue(resultOrder.isSellerConfirmed(), "賣家已確認");

        // ✨ 最關鍵的驗證：狀態是否正確連動！
        assertEquals(OrderStatus.COMPLETED, resultOrder.getOrderStatus(), "訂單狀態必須變成 COMPLETED");
        assertEquals(BookStatus.SOLD, mockBook.getStatus(), "書籍狀態必須變成 SOLD");

        // 5. 驗證動作：必須確實呼叫存檔
        verify(bookRepository, times(1)).save(mockBook);
        verify(orderRepository, times(1)).save(any(Order.class));
    }
}
