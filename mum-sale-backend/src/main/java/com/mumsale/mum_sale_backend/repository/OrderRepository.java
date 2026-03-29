package com.mumsale.mum_sale_backend.repository;

import com.mumsale.mum_sale_backend.dto.SellerLeaderboardResponse;
import com.mumsale.mum_sale_backend.model.Order;
import com.mumsale.mum_sale_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);

    List<Order> findByStatus(String status);

    List<Order> findByUserAndStatus(User user, String status);

    @Query("""
                SELECT new com.mumsale.mum_sale_backend.dto.SellerLeaderboardResponse(
                    u.id,
                    u.name,
                    u.username,
                    COUNT(o),
                    COALESCE(SUM(o.quantity), 0),
                    COALESCE(SUM(o.totalPrice), 0)
                )
                FROM Order o
                JOIN o.user u
                WHERE u.role = com.mumsale.mum_sale_backend.model.Role.SELLER
                GROUP BY u.id, u.name, u.username
                ORDER BY COALESCE(SUM(o.quantity), 0) DESC, COALESCE(SUM(o.totalPrice), 0) DESC
            """)
    List<SellerLeaderboardResponse> getSellerLeaderboard();
}