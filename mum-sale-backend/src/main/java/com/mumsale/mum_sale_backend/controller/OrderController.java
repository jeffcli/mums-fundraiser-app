package com.mumsale.mum_sale_backend.controller;

import com.mumsale.mum_sale_backend.dto.CreateOrderRequest;
import com.mumsale.mum_sale_backend.dto.UpdateOrderStatusRequest;
import com.mumsale.mum_sale_backend.model.Order;
import com.mumsale.mum_sale_backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Order createOrder(@Valid @RequestBody CreateOrderRequest request, Authentication authentication) {
        return orderService.createOrder(request, authentication.getName());
    }

    @GetMapping
    public List<Order> getOrders(
            Authentication authentication,
            @RequestParam(required = false) String status) {
        return orderService.getOrdersForUser(authentication.getName(), status);
    }

    @PatchMapping("/{id}/status")
    public Order updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request,
            Authentication authentication) {
        return orderService.updateOrderStatus(id, request.getStatus(), authentication.getName());
    }
}