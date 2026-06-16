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
        // 1. 檢查使用者是否存在
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("找不到該使用者！"));

        // 2. 檢查是否已經開過賣場了 (1對1限制)
        if (shopRepository.existsByUserId(userId)) {
            throw new RuntimeException("您已經擁有賣場，無法重複建立！");
        }

        // 3. 建立新賣場
        Shop newShop = new Shop(shopName, userId);
        Shop savedShop = shopRepository.save(newShop);

        // 4. 幫使用者升級！加入 SELLER 角色
        user.addRole(Role.SELLER);
        userRepository.save(user);

        return savedShop;
    }

    public Shop getShopByUserId(String userId) {
        return shopRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("找不到該使用者的賣場！"));
    }
}
