package com.mumsale.mum_sale_backend.config;

import com.mumsale.mum_sale_backend.model.Role;
import com.mumsale.mum_sale_backend.model.User;
import com.mumsale.mum_sale_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner loadUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                userRepository.save(new User(
                        "Admin User",
                        "admin",
                        passwordEncoder.encode("admin123"),
                        Role.ADMIN));
            }
        };
    }
}