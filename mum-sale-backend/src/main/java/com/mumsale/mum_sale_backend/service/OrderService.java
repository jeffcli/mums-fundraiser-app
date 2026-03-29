package com.mumsale.mum_sale_backend.service;

import com.mumsale.mum_sale_backend.dto.CreateOrderRequest;
import com.mumsale.mum_sale_backend.model.Order;
import com.mumsale.mum_sale_backend.model.Role;
import com.mumsale.mum_sale_backend.model.User;
import com.mumsale.mum_sale_backend.repository.OrderRepository;
import com.mumsale.mum_sale_backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    public Order createOrder(CreateOrderRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        if (user.getRole() != Role.SELLER) {
            throw new RuntimeException("Only sellers can create orders");
        }

        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setPhone(request.getPhone());
        order.setAddressLine1(request.getAddressLine1());
        order.setCity(request.getCity());
        order.setState(request.getState());
        order.setZip(request.getZip());
        order.setMumColor(request.getMumColor());
        order.setQuantity(request.getQuantity());
        order.setUser(user);
        order.setTotalPrice(calculatePrice(request.getQuantity()));
        order.setStatus("NEW");

        return orderRepository.save(order);
    }

    public List<Order> getOrdersForUser(String username, String status) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        boolean hasStatus = status != null && !status.isBlank();

        if (user.getRole() == Role.ADMIN) {
            if (hasStatus) {
                return orderRepository.findByStatus(status);
            }
            return orderRepository.findAll();
        }

        if (hasStatus) {
            return orderRepository.findByUserAndStatus(user, status);
        }

        return orderRepository.findByUser(user);
    }

    public Order updateOrderStatus(Long id, String status, String username) {
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        boolean isAdmin = currentUser.getRole() == Role.ADMIN;
        boolean ownsOrder = order.getUser() != null &&
                order.getUser().getUsername().equals(currentUser.getUsername());

        if (!isAdmin && !ownsOrder) {
            throw new RuntimeException("Not authorized to update this order");
        }

        order.setStatus(status);
        return orderRepository.save(order);
    }

    private BigDecimal calculatePrice(int quantity) {
        int bundles = quantity / 3;
        int remainder = quantity % 3;
        return BigDecimal.valueOf(bundles * 25L + remainder * 10L);
    }
}