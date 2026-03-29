package com.mumsale.mum_sale_backend.dto;

import com.mumsale.mum_sale_backend.model.Role;

public class UserResponse {

    private Long id;
    private String name;
    private String username;
    private Role role;
    private boolean active;

    public UserResponse(Long id, String name, String username, Role role, boolean active) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.role = role;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getUsername() {
        return username;
    }

    public Role getRole() {
        return role;
    }

    public boolean isActive() {
        return active;
    }
}