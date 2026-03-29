package com.mumsale.mum_sale_backend.dto;

public class LoginResponse {

    private String token;
    private String username;
    private String role;
    private String name;

    public LoginResponse(String token, String username, String role, String name) {
        this.token = token;
        this.username = username;
        this.role = role;
        this.name = name;
    }

    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    public String getName() {
        return name;
    }
}