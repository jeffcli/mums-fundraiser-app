package com.mumsale.mum_sale_backend.controller;

import com.mumsale.mum_sale_backend.dto.CreateUserRequest;
import com.mumsale.mum_sale_backend.dto.UserResponse;
import com.mumsale.mum_sale_backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public UserResponse createUser(@Valid @RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userService.getAllUsers();
    }

    @PatchMapping("/{id}/active")
    public UserResponse setUserActiveStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> request) {
        Boolean active = request.get("active");
        if (active == null) {
            throw new RuntimeException("Active status is required");
        }

        return userService.setUserActiveStatus(id, active);
    }
}