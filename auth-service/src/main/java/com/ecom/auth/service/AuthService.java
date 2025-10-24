package com.ecom.auth.service;

import com.ecom.auth.dto.AuthResponse;
import com.ecom.auth.dto.LoginRequest;
import com.ecom.auth.dto.RegisterRequest;

public interface AuthService {
    void register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    boolean validateToken(String token);
}