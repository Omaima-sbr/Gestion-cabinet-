/*package com.cabinetmedical.gestioncabinet.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.cabinetmedical.gestioncabinet.repository.UtilisateurRepository;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Routes publiques
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/cabinets/**").permitAll()
                        .requestMatchers("/api/inscription/**").permitAll()
                        .requestMatchers("/api/auth/forgot-password/**").permitAll()
                        .requestMatchers("/api/auth/reset-password/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()

                        // Routes secrétaire - ORDRE IMPORTANT : spécifiques avant génériques
                        .requestMatchers("/api/secretaire/dashboard/**").hasRole("SECRETAIRE")
                        .requestMatchers("/api/secretaire/**").hasRole("SECRETAIRE")

                        // Routes médecin
                        .requestMatchers("/api/medecin/**").hasRole("MEDECIN")

                        // Routes admin
                        .requestMatchers("/api/admin/**").hasRole("ADMINISTRATEUR")

                        // Messagerie accessible à tous les utilisateurs authentifiés
                        .requestMatchers("/api/messagerie/**").authenticated()

                        // Toutes les autres requêtes nécessitent une authentification
                        .anyRequest().authenticated()

                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .headers(headers -> headers.frameOptions(frame -> frame.disable()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization")); // Exposer le header Authorization

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }


    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> utilisateurRepository.findByLogin(username)
                .map(utilisateur -> org.springframework.security.core.userdetails.User.builder()
                        .username(utilisateur.getLogin())
                        .password(utilisateur.getPwd())
                        .authorities("ROLE_" + utilisateur.getRole().name()) // Vérifier le préfixe ROLE_
                        .disabled(!utilisateur.getActif())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé: " + username));
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}*/
package com.cabinetmedical.gestioncabinet.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.cabinetmedical.gestioncabinet.repository.UtilisateurRepository;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtAuthenticationFilter jwtAuthFilter;

    /**
     * 🔥 SOLUTION ULTIME : Ignorer complètement Spring Security pour les routes publiques
     * Cette méthode bypasse TOUS les filtres de sécurité pour les URLs spécifiées
     */
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers(
                        "/api/inscription/**",
                        "/api/auth/login",
                        "/api/auth/register",
                        "/api/cabinets/**",
                        "/h2-console/**",
                        "/uploads/**"
                );
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 🔥 Désactiver CSRF (pour API REST)
                .csrf(AbstractHttpConfigurer::disable)

                // 🔥 Configuration CORS
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 🔥 Configuration des autorisations
                .authorizeHttpRequests(auth -> auth
                        // OPTIONS requests - DOIT ÊTRE EN PREMIER
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ⚠️ Note : Les routes dans webSecurityCustomizer() sont déjà ignorées
                        // Ces lignes sont redondantes mais gardées pour la clarté
                        .requestMatchers("/api/inscription/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/cabinets/**").permitAll()
                        .requestMatchers("/api/auth/forgot-password/**").permitAll()
                        .requestMatchers("/api/auth/reset-password/**").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .requestMatchers("/error").permitAll()

                        // Routes protégées par rôles
                        .requestMatchers("/api/secretaire/dashboard/**").hasRole("SECRETAIRE")
                        .requestMatchers("/api/secretaire/**").hasRole("SECRETAIRE")
                        .requestMatchers("/api/medecin/**").hasRole("MEDECIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMINISTRATEUR")
                        .requestMatchers("/api/messagerie/**").authenticated()

                        // Toutes les autres requêtes nécessitent une authentification
                        .anyRequest().authenticated()
                )

                // 🔥 Session stateless (JWT)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 🔥 Provider d'authentification
                .authenticationProvider(authenticationProvider())

                // 🔥 Ajouter le filtre JWT
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                // 🔥 Autoriser les iframes (pour H2 console)
                .headers(headers -> headers
                        .frameOptions(frame -> frame.disable())
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Origines autorisées
        configuration.setAllowedOriginPatterns(Arrays.asList("*")); // 🔥 Permet tous les origins en dev
        // En production, remplacez par :
        // configuration.setAllowedOrigins(Arrays.asList("https://votre-domaine.com"));

        // Méthodes HTTP autorisées
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"
        ));

        // Headers autorisés
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Headers exposés
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));

        // Autoriser les credentials
        configuration.setAllowCredentials(true);

        // Durée de cache du preflight (1 heure)
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> utilisateurRepository.findByLogin(username)
                .map(utilisateur -> org.springframework.security.core.userdetails.User.builder()
                        .username(utilisateur.getLogin())
                        .password(utilisateur.getPwd())
                        .authorities("ROLE_" + utilisateur.getRole().name())
                        .disabled(!utilisateur.getActif())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé: " + username));
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * 🔥 SOLUTION ULTIME : Ignorer complètement Spring Security pour certaines routes
     * Cette approche bypasse TOUS les filtres de sécurité
     */
    @Bean
    public org.springframework.boot.web.servlet.FilterRegistrationBean<org.springframework.web.filter.CorsFilter> corsFilter() {
        org.springframework.boot.web.servlet.FilterRegistrationBean<org.springframework.web.filter.CorsFilter> bean =
                new org.springframework.boot.web.servlet.FilterRegistrationBean<>(
                        new org.springframework.web.filter.CorsFilter(corsConfigurationSource())
                );
        bean.setOrder(-102); // Avant Spring Security
        return bean;
    }
}