package com.ecom.auth.dto;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private Long userId;
    private String username;
    private String email;
    private String token;
    private String role;
}