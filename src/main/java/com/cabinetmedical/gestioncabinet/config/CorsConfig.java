package com.cabinetmedical.gestioncabinet.config;

/*
import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

/**
 * Configuration CORS pour autoriser les requêtes depuis le frontend React
 */
/**
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

// CorsConfig.java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ❌ NE PAS UTILISER "*" avec allowCredentials(true)
        // configuration.setAllowedOrigins(Arrays.asList("*"));

        // ✅ UTILISER des origines spécifiques
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://127.0.0.1:5174"
        ));

        // OU utiliser allowedOriginPatterns pour plus de flexibilité
        // configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*"));

        configuration.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));

        configuration.setExposedHeaders(Arrays.asList(
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials",
                "Authorization"
        ));

        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
 */
