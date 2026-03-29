package com.mumsale.mum_sale_backend.dto;

import java.math.BigDecimal;

public class SellerLeaderboardResponse {

    private Long userId;
    private String name;
    private String username;
    private Long totalOrders;
    private Long totalQuantity;
    private BigDecimal totalRevenue;

    public SellerLeaderboardResponse(Long userId, String name, String username, Long totalOrders, Long totalQuantity,
            BigDecimal totalRevenue) {
        this.userId = userId;
        this.name = name;
        this.username = username;
        this.totalOrders = totalOrders;
        this.totalQuantity = totalQuantity;
        this.totalRevenue = totalRevenue;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getUsername() {
        return username;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public Long getTotalQuantity() {
        return totalQuantity;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }
}