package com.rebook.backend.service;

import com.rebook.backend.model.Role;
import com.rebook.backend.model.Shop;
import com.rebook.backend.model.User;
import com.rebook.backend.repository.ShopRepository;
import com.rebook.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ShopService {
    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Shop createShop(String shopName, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("找不到該使用者！"));

        if (shopRepository.existsByUserId(userId)) {
            throw new RuntimeException("您已經擁有賣場，無法重複建立！");
        }

        Shop newShop = new Shop(shopName, userId);
        Shop savedShop = shopRepository.save(newShop);

        user.addRole(Role.SELLER);
        userRepository.save(user);

        return savedShop;
    }

    public Shop getShopByUserId(String userId) {
        return shopRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("找不到該使用者的賣場！"));
    }
}
