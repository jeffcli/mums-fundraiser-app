package com.mumsale.mum_sale_backend.controller;

import com.mumsale.mum_sale_backend.dto.SellerLeaderboardResponse;
import com.mumsale.mum_sale_backend.repository.OrderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminDashboardController {

    private final OrderRepository orderRepository;

    public AdminDashboardController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping("/leaderboard")
    public List<SellerLeaderboardResponse> getLeaderboard() {
        return orderRepository.getSellerLeaderboard();
    }
}