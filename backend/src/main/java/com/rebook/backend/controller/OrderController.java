package com.rebook.backend.controller;

import com.rebook.backend.model.Order;
import com.rebook.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String, String> payload) {
        try {
            String bookId = payload.get("bookId");
            String paymentMethod = payload.get("paymentMethod");
            String buyerId = payload.get("buyerId");

            Order newOrder = orderService.processCheckout(bookId, paymentMethod, buyerId);

            return ResponseEntity.ok(newOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("伺服器發生未知錯誤");
        }
    }

    @PutMapping("/{orderId}/confirm")
    public ResponseEntity<?> confirmOrder(
            @PathVariable String orderId,
            @RequestParam String userId) {
        try {
            Order updatedOrder = orderService.confirmTransaction(orderId, userId);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("伺服器錯誤");
        }
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable String orderId,
            @RequestParam String userId) {
        try {
            Order cancelledOrder = orderService.cancelTransaction(orderId, userId);
            return ResponseEntity.ok(cancelledOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("伺服器錯誤");
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderDetails(@PathVariable String orderId) {
        try {
            Order order = orderService.getOrderById(orderId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 🌟 新增：取得該買家的所有訂單 API
    @GetMapping("/buyer/{userId}")
    public ResponseEntity<?> getOrdersByBuyer(@PathVariable String userId) {
        try {
            List<Order> orders = orderService.getOrdersByBuyerId(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("無法載入買家訂單");
        }
    }

    // 🌟 新增：取得該賣家的所有訂單 API
    @GetMapping("/seller/{userId}")
    public ResponseEntity<?> getOrdersBySeller(@PathVariable String userId) {
        try {
            List<Order> orders = orderService.getOrdersBySellerId(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("無法載入賣家訂單");
        }
    }
}