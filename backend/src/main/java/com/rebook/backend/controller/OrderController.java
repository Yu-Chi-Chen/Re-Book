package com.rebook.backend.controller;

import com.rebook.backend.model.Order;
import com.rebook.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController // 告訴 Spring Boot 這是一位負責處理 API 請求的服務生，並且他回傳的都會是 JSON 格式
@RequestMapping("/api/orders") // 這位服務生的專屬櫃台網址
@CrossOrigin(origins = "*") // 允許前端 (例如 React 開發伺服器) 跨網域來呼叫這個 API
public class OrderController {
    @Autowired
    private OrderService orderService; // 呼叫我們剛剛測試通過的完美大腦！

    // 當前端發送 POST 請求到 /api/orders/checkout 時，會觸發這個方法
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String, String> payload) {
        try {
            // 1. 服務生從客人的點菜單 (JSON Payload) 中拿出需要的資訊
            String bookID = payload.get("bookID");
            String paymentMethod = payload.get("paymentMethod");
            String buyerID = payload.get("buyerID");

            // 2. 服務生把資訊交給主廚 (Service) 去執行核心邏輯
            Order newOrder = orderService.processCheckout(bookID, paymentMethod, buyerID);

            // 3. 結帳成功！端出做好的菜 (回傳 200 OK 與新訂單的 JSON 資料)
            return ResponseEntity.ok(newOrder);

        } catch (RuntimeException e) {
            // 4. 如果主廚大喊「手腳太慢！該書籍已被預訂或售出」
            // 服務生會很有禮貌地跟客人道歉，並回傳 400 Bad Request (請求無效) 與錯誤訊息
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            // 預防其他未知的系統錯誤
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("伺服器發生未知錯誤");
        }
    }
}
