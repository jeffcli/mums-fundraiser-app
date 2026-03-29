package com.mumsale.mum_sale_backend.controller;

import com.mumsale.mum_sale_backend.dto.ChangePasswordRequest;
import com.mumsale.mum_sale_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/account")
@CrossOrigin(origins = "http://localhost:5173")
public class UserAccountController {

    private final UserService userService;

    public UserAccountController(UserService userService) {
        this.userService = userService;
    }

    @PatchMapping("/password")
    public Map<String, String> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        userService.changePassword(
                authentication.getName(),
                request.getCurrentPassword(),
                request.getNewPassword());

        return Map.of("message", "Password updated successfully");
    }
}