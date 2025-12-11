package com.cabinetmedical.gestioncabinet.config;

import com.cabinetmedical.gestioncabinet.repository.UtilisateurRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String jwtSecret;

    private final UtilisateurRepository utilisateurRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Récupérer le token depuis l'en-tête Authorization
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Extraire le token
            final String jwt = authHeader.substring(7);

            // Décoder la clé Base64
            byte[] keyBytes = java.util.Base64.getDecoder().decode(jwtSecret);

            // Valider et extraire les informations du token
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(keyBytes)
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();

            String username = claims.getSubject();
            String role = claims.get("role", String.class);

            System.out.println("🔍 Username du token: " + username);
            System.out.println("🔍 Role du token: " + role);
            System.out.println("🔍 Claims complets: " + claims);

            // Si l'utilisateur n'est pas déjà authentifié
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                System.out.println("🔍 Recherche de l'utilisateur: " + username);

                // Vérifier que l'utilisateur existe et est actif
                utilisateurRepository.findByLogin(username).ifPresentOrElse(utilisateur -> {
                    System.out.println("🔍 Utilisateur trouvé: " + utilisateur.getLogin() + ", Actif: " + utilisateur.getActif());

                    if (utilisateur.getActif()) {
                        // Déterminer le role à utiliser
                        String authorityString;

                        if (role != null && !role.isEmpty()) {
                            // Utiliser le role du token
                            authorityString = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                        } else {
                            // Fallback: utiliser le role de la base de données
                            authorityString = "ROLE_" + utilisateur.getRole().name();
                        }

                        System.out.println("🔍 Authority définie: " + authorityString);

                        // Créer les authorities avec le role
                        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(authorityString);

                        // Créer l'utilisateur Spring Security
                        UserDetails userDetails = User.builder()
                                .username(utilisateur.getLogin())
                                .password(utilisateur.getPwd())
                                .authorities(Collections.singletonList(authority))
                                .build();

                        // Créer le token d'authentification
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );

                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                        // Définir l'authentification dans le contexte de sécurité
                        SecurityContextHolder.getContext().setAuthentication(authToken);

                        System.out.println("✅ Authentification réussie pour: " + username + " avec role: " + authorityString);
                    } else {
                        System.out.println("❌ Utilisateur inactif: " + username);
                    }
                }, () -> {
                    System.out.println("❌ Utilisateur non trouvé: " + username);
                });
            } else if (username == null) {
                System.out.println("❌ Username est null dans le token");
            } else {
                System.out.println("🔍 Utilisateur déjà authentifié");
            }
        } catch (Exception e) {
            System.err.println("❌ Erreur lors de la validation du JWT: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}