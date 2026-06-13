package com.rebook.backend.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 允許所有 API 路徑
                // 允許你的前端來源 (請確認你的 React 是跑在 5173 還是 3000，這裡我都先寫上)
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 允許的 HTTP 方法
                .allowedHeaders("*") // 允許所有標頭
                .allowCredentials(true); // 允許攜帶憑證 (如 Cookie 或驗證資料)
    }
}
