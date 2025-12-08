package com.cabinetmedical.gestioncabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private UserInfo user;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserInfo {
        private Integer id;
        private String login;
        private String nom;
        private String prenom;
        private String role;
        private Integer idCabinet;
    }
}