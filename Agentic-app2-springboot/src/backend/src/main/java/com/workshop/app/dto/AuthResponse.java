package com.workshop.app.dto;

public record AuthResponse(String token, Long userId, String email) {}
