package com.cabinetmedical.gestioncabinet.service.admin;

import com.cabinetmedical.gestioncabinet.dto.admin.LoginRequest;
import com.cabinetmedical.gestioncabinet.dto.admin.LoginResponse;
import com.cabinetmedical.gestioncabinet.dto.admin.RegisterRequest;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    LoginResponse register(RegisterRequest request);
}