package com.cabinetmedical.gestioncabinet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ✅ Active CORS avec la configuration ci-dessous
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Désactive CSRF
                .csrf(csrf -> csrf.disable())

                // Autorise toutes les requêtes
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    /**
     * Configuration CORS pour autoriser les requêtes depuis React
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ✅ Origines autorisées (React dev servers)
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",  // Create React App
                "http://localhost:5173"   // Vite
        ));

        // ✅ Méthodes HTTP autorisées
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // ✅ Headers autorisés
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // ✅ Autorise les credentials
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}