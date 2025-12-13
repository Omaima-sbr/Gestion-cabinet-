// UtilisateurRepository.java
package com.cabinetmedical.gestioncabinet.repository;

import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Import nécessaire
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {

    // Méthodes existantes (gardez-les si vous les utilisez ailleurs)
    Optional<Utilisateur> findByLogin(String login);
    boolean existsByLogin(String login);
    boolean existsByEmail(String email);

    // --- NOUVELLES MÉTHODES POUR LE LOGIN HYBRIDE (Login OU Email) ---

    // 1. Pour ADMINISTRATEUR
    @Query("SELECT u FROM Utilisateur u WHERE (u.login = :identifiant OR u.email = :identifiant) AND u.role = :role")
    Optional<Utilisateur> findByIdentifiantAndRole(
            @Param("identifiant") String identifiant,
            @Param("role") Utilisateur.Role role
    );

    // 2. Pour MEDECIN et SECRETAIRE
    @Query("SELECT u FROM Utilisateur u WHERE (u.login = :identifiant OR u.email = :identifiant) AND u.role = :role AND u.cabinet.id = :cabinetId")
    Optional<Utilisateur> findByIdentifiantAndRoleAndCabinet(
            @Param("identifiant") String identifiant,
            @Param("role") Utilisateur.Role role,
            @Param("cabinetId") Integer cabinetId
    );
}