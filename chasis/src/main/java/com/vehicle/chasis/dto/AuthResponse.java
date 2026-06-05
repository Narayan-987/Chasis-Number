package com.vehicle.chasis.dto;

public record AuthResponse(
        String token,
        String type,
        Long id,
        String username,
        String email,
        String role,
        String gstNumber,
        String companyName
) {
    public AuthResponse(String token, Long id, String username, String email, String role, String gstNumber, String companyName) {
        this(token, "Bearer", id, username, email, role, gstNumber, companyName);
    }
}
