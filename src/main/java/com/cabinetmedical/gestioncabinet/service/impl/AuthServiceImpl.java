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
import com.cabinetmedical.gestioncabinet.service.LoginAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final CabinetRepository cabinetRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    //  1. INJECTION DU SERVICE DE RATE LIMITING
    private final LoginAttemptService loginAttemptService;
    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        // 🔥 2. VÉRIFICATION AVANT TOUT : EST-CE QUE L'UTILISATEUR EST BLOQUÉ ?
        if (loginAttemptService.isBlocked(request.getLogin())) {
            throw new RuntimeException("Trop de tentatives échouées. Veuillez patienter 1 minute.");
        }
        Utilisateur utilisateur;

        // 1. Conversion du rôle
        Utilisateur.Role roleEnum;
        try {
            roleEnum = Utilisateur.Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Rôle invalide: " + request.getRole());
        }

        // 2. Récupération de l'utilisateur (Support Login OU Email)
        if (roleEnum == Utilisateur.Role.ADMINISTRATEUR) {
            // Pour l'admin, on utilise la nouvelle méthode sans cabinet
            utilisateur = utilisateurRepository.findByIdentifiantAndRole(request.getLogin(), roleEnum)
                    .orElseThrow(() -> new RuntimeException("Identifiants invalides"));
        } else {
            // Pour Médecin/Secrétaire, le cabinet est obligatoire
            if (request.getCabinetId() == null) {
                throw new RuntimeException("Le cabinet est obligatoire pour ce rôle");
            }
            // Nouvelle méthode qui cherche par Login OU Email dans le cabinet spécifié
            utilisateur = utilisateurRepository.findByIdentifiantAndRoleAndCabinet(
                            request.getLogin(), roleEnum, request.getCabinetId())
                    .orElseThrow(() -> new RuntimeException("Identifiants invalides ou cabinet incorrect"));
        }

        // 3. Vérification : Compte Utilisateur Actif ?
        // (Gère le cas "En cours de traitement" après inscription)
        if (!utilisateur.getActif()) {
            throw new RuntimeException("Votre demande est en cours de traitement par l'administrateur.");
        }

        // 4. Vérification : Cabinet Actif ? (Pour médecins et secrétaires)
        if (utilisateur.getCabinet() != null) {
            // On suppose que le modèle Cabinet a un champ 'actif' (boolean)
            if (!utilisateur.getCabinet().isActif()) { // ou .getActif() selon votre getter
                throw new RuntimeException("Accès restreint. Veuillez régulariser votre abonnement pour accéder à la plateforme.");
            }
        }

        // 5. Authentification Spring Security
        // Note: On utilise le vrai login récupéré de la BDD (utilisateur.getLogin()) car request.getLogin() pourrait être un email
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(utilisateur.getLogin(), request.getPassword())
            );
        } catch (Exception e) {
            loginAttemptService.loginFailed(request.getLogin());
            throw new RuntimeException("Mot de passe incorrect");
        }

        // 6. Génération Token et Réponse
        UserDetails userDetails = User.builder()
                .username(utilisateur.getLogin())
                .password(utilisateur.getPwd())
                .authorities(utilisateur.getRole().name())
                .build();

        String token = jwtService.generateToken(userDetails);

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
        // ... (Le reste de votre méthode register reste identique, assurez-vous juste de setActif(false))

        if (utilisateurRepository.existsByLogin(request.getLogin())) {
            throw new RuntimeException("Ce login est déjà utilisé");
        }

        Utilisateur.Role roleEnum;
        try {
            roleEnum = Utilisateur.Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Rôle invalide: " + request.getRole());
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setLogin(request.getLogin());
        // utilisateur.setEmail(request.getEmail()); // Pensez à ajouter l'email s'il est dans la request !
        utilisateur.setPwd(passwordEncoder.encode(request.getPassword()));
        utilisateur.setRole(roleEnum);
        utilisateur.setNumTel(request.getNumTel());
        utilisateur.setSignature(request.getSignature());

        // IMPORTANT : Inscription = Compte inactif par défaut (en attente validation)
        utilisateur.setActif(false);

        if (request.getCabinetId() != null) {
            Cabinet cabinet = cabinetRepository.findById(request.getCabinetId())
                    .orElseThrow(() -> new RuntimeException("Cabinet non trouvé"));
            utilisateur.setCabinet(cabinet);
        } else if (roleEnum != Utilisateur.Role.ADMINISTRATEUR) {
            throw new RuntimeException("Le cabinet est obligatoire pour ce rôle");
        }

        utilisateur = utilisateurRepository.save(utilisateur);

        // On retourne une réponse mais SANS token valide car le compte n'est pas actif
        return LoginResponse.builder()
                .userId(utilisateur.getId())
                .login(utilisateur.getLogin())
                .nom(utilisateur.getNom())
                .role(utilisateur.getRole().name())
                .build();
    }
}