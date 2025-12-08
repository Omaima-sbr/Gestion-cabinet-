package com.cabinetmedical.gestioncabinet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Configuration Spring Security - MODE DÉVELOPPEMENT
 * ⚠️ TOUT EST OUVERT - À SÉCURISER EN PRODUCTION
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ✅ Active CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // ✅ Désactive CSRF (obligatoire pour les APIs REST)
                .csrf(csrf -> csrf.disable())

                // ✅ Sessions stateless (pas de session côté serveur)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // ✅ TOUT est accessible sans authentification (MODE DEV)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ✅ Autoriser les origines de votre frontend Vite
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174"
        ));

        // ✅ Autoriser toutes les méthodes HTTP
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        // ✅ Autoriser tous les headers
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // ✅ Autoriser les credentials
        configuration.setAllowCredentials(true);

        // ✅ Exposer tous les headers
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Access-Control-Allow-Origin"
        ));

        // ✅ Cache la configuration CORS pendant 1 heure
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}