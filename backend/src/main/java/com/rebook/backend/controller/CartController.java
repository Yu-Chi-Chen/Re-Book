package com.rebook.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import com.rebook.backend.service.CartService;
import com.rebook.backend.dto.CartDTO;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add/{bookID}")
    public ResponseEntity<String> addItem(
            @PathVariable String bookID,
            @RequestHeader("userId") String userId) { // 改成直接從 Header 拿

        try {
            cartService.addItem(userId, bookID);
            return ResponseEntity.ok("書籍成功加入購物車");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/remove/{bookID}")
    public ResponseEntity<String> removeItem(
            @PathVariable String bookID,
            @RequestHeader("userId") String userId) {

        cartService.removeItem(userId, bookID);
        return ResponseEntity.ok("已從購物車移除該書籍");
    }

    @GetMapping("/")
    public ResponseEntity<CartDTO> viewCart(@RequestHeader("userId") String userId) {
        CartDTO cartDTO = cartService.viewCart(userId);
        return ResponseEntity.ok(cartDTO);
    }
}
