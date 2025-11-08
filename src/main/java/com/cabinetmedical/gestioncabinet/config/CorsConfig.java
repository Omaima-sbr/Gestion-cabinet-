package com.cabinetmedical.gestioncabinet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

/**
 * Configuration CORS pour autoriser les requêtes depuis le frontend React
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Autorise les credentials (cookies, headers d'authentification)
        config.setAllowCredentials(true);

        // ✅ Autorise le frontend React
        config.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));

        // ✅ Autorise tous les headers
        config.addAllowedHeader("*");

        // ✅ Autorise toutes les méthodes HTTP (GET, POST, PUT, DELETE, etc.)
        config.addAllowedMethod("*");

        // Applique cette configuration à toutes les routes
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}