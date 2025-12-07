
// AuthServiceImpl.java
package com.cabinetmedical.gestioncabinet.service.impl;

import com.cabinetmedical.gestioncabinet.config.JwtService;
import com.cabinetmedical.gestioncabinet.dto.LoginRequest;
import com.cabinetmedical.gestioncabinet.dto.LoginResponse;
import com.cabinetmedical.gestioncabinet.dto.RegisterRequest;
import com.cabinetmedical.gestioncabinet.model.Cabinet;
import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import com.cabinetmedical.gestioncabinet.repository.CabinetRepository;
import com.cabinetmedical.gestioncabinet.repository.UtilisateurRepository;
import com.cabinetmedical.gestioncabinet.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final CabinetRepository cabinetRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        Utilisateur utilisateur;

        // Convertir le rôle string en enum
        Utilisateur.Role roleEnum;
        try {
            roleEnum = Utilisateur.Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Rôle invalide: " + request.getRole());
        }

        // Pour ADMINISTRATEUR, pas besoin de cabinet
        if (roleEnum == Utilisateur.Role.ADMINISTRATEUR) {
            utilisateur = utilisateurRepository.findByLoginAndRole(request.getLogin(), roleEnum)
                    .orElseThrow(() -> new RuntimeException("Identifiants invalides"));
        } else {
            // Pour MEDECIN et SECRETAIRE, le cabinet est obligatoire
            if (request.getCabinetId() == null) {
                throw new RuntimeException("Le cabinet est obligatoire pour ce rôle");
            }

            utilisateur = utilisateurRepository.findByLoginAndRoleAndCabinetId(
                            request.getLogin(), roleEnum, request.getCabinetId())
                    .orElseThrow(() -> new RuntimeException("Identifiants invalides ou cabinet incorrect"));
        }

        // Vérifier si l'utilisateur est actif
        if (!utilisateur.getActif()) {
            throw new RuntimeException("Ce compte est désactivé");
        }

        // Authentifier
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getLogin(), request.getPassword())
        );

        // Générer le token
        UserDetails userDetails = User.builder()
                .username(utilisateur.getLogin())
                .password(utilisateur.getPwd())
                .authorities(utilisateur.getRole().name())
                .build();

        String token = jwtService.generateToken(userDetails);

        // Construire la réponse
        return LoginResponse.builder()
                .token(token)
                .userId(utilisateur.getId())
                .login(utilisateur.getLogin())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .role(utilisateur.getRole().name())
                .cabinetId(utilisateur.getCabinet() != null ? utilisateur.getCabinet().getId() : null)
                .cabinetName(utilisateur.getCabinet() != null ? utilisateur.getCabinet().getNom() : null)
                .build();
    }

    @Override
    @Transactional
    public LoginResponse register(RegisterRequest request) {
        // Vérifier si le login existe déjà
        if (utilisateurRepository.existsByLogin(request.getLogin())) {
            throw new RuntimeException("Ce login est déjà utilisé");
        }

        // Convertir le rôle string en enum
        Utilisateur.Role roleEnum;
        try {
            roleEnum = Utilisateur.Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Rôle invalide: " + request.getRole());
        }

        // Créer l'utilisateur
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setLogin(request.getLogin());
        utilisateur.setPwd(passwordEncoder.encode(request.getPassword()));
        utilisateur.setRole(roleEnum);
        utilisateur.setNumTel(request.getNumTel());
        utilisateur.setSignature(request.getSignature());
        utilisateur.setActif(true);

        // Associer le cabinet si nécessaire
        if (request.getCabinetId() != null) {
            Cabinet cabinet = cabinetRepository.findById(request.getCabinetId())
                    .orElseThrow(() -> new RuntimeException("Cabinet non trouvé"));
            utilisateur.setCabinet(cabinet);
        } else if (roleEnum != Utilisateur.Role.ADMINISTRATEUR) {
            throw new RuntimeException("Le cabinet est obligatoire pour ce rôle");
        }

        utilisateur = utilisateurRepository.save(utilisateur);

        // Générer le token
        UserDetails userDetails = User.builder()
                .username(utilisateur.getLogin())
                .password(utilisateur.getPwd())
                .authorities(utilisateur.getRole().name())
                .build();

        String token = jwtService.generateToken(userDetails);

        // Construire la réponse
        return LoginResponse.builder()
                .token(token)
                .userId(utilisateur.getId())
                .login(utilisateur.getLogin())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .role(utilisateur.getRole().name())
                .cabinetId(utilisateur.getCabinet() != null ? utilisateur.getCabinet().getId() : null)
                .cabinetName(utilisateur.getCabinet() != null ? utilisateur.getCabinet().getNom() : null)
                .build();
    }
}