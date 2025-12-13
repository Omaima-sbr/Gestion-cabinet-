package com.cabinetmedical.gestioncabinet.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    // La clé secrète utilisée pour signer les JWT (récupérée depuis application.properties)
    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);


    // Durée de validité du token en millisecondes (ex : 3600000 = 1h)
    @Value("${jwt.expiration}")
    private long jwtExpiration;


    /**
     * Extrait le username (subject) d’un token JWT.
     * Le "subject" correspond au champ principal du token.
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Méthode générique permettant d’extraire n’importe quel "claim" du token.
     * claimsResolver : fonction indiquant quel champ on veut extraire.
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token); // Récupère tous les claims
        return claimsResolver.apply(claims);           // Applique l’extracteur demandé
    }

    /**
     * Génère un token JWT sans claims supplémentaires.
     * Utilisée lors du login.
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Génère un token JWT avec possibilité d’ajouter des claims personnalisés.
     * (ex : rôle, id utilisateur, etc.)
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    /**
     * Construit réellement le JWT.
     * - Ajoute les claims
     * - Définit le sujet (username)
     * - Ajoute la date d’émission
     * - Ajoute la date d’expiration
     * - Signe le token avec la clé secrète en HS256
     */
    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims) // Claims personnalisés
                .setSubject(userDetails.getUsername()) // username du user
                .setIssuedAt(new Date(System.currentTimeMillis())) // date de création
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // date d’expiration
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // signature du token
                .compact(); // Génère la chaîne finale du JWT
    }

    /**
     * Vérifie si le token est valide :
     * - Même username que dans UserDetails
     * - Pas expiré
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);   // Récupère le subject
        return (username.equals(userDetails.getUsername())) // Même user ?
                && !isTokenExpired(token);                // Token pas expiré ?
    }

    /**
     * Vérifie si le token est expiré en comparant la date d’expiration avec la date actuelle.
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extrait la date d’expiration du token.
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Récupère tous les claims du token après avoir :
     * - vérifié la signature
     * - parsé le contenu du JWT
     */
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey()) // Clé utilisée pour vérifier la signature
                .build()
                .parseClaimsJws(token) // Analyse le token et vérifie qu’il n’a pas été modifié
                .getBody(); // Récupère les données (payload)
    }

    /**
     * Utilise la clé secrète Base64 pour générer une clé cryptographique compatible HS256.
     */
    private Key getSignInKey() {
        return secretKey;
    }
}
