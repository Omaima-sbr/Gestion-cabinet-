package com.cabinetmedical.gestioncabinet.repository;

import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UtilisateursRepository extends JpaRepository<Utilisateur, Integer> {

    // ✅ AJOUTE CETTE LIGNE OBLIGATOIREMENT :
    Optional<Utilisateur> findByEmail(String email);

    // Méthodes existantes
    Optional<Utilisateur> findByLogin(String login);
    boolean existsByLogin(String login);
    boolean existsByEmail(String email);

    // Tes requêtes personnalisées pour le login hybride...
    @Query("SELECT u FROM Utilisateur u WHERE (u.login = :identifiant OR u.email = :identifiant) AND u.role = :role")
    Optional<Utilisateur> findByIdentifiantAndRole(
            @Param("identifiant") String identifiant,
            @Param("role") Utilisateur.Role role
    );

    @Query("SELECT u FROM Utilisateur u WHERE (u.login = :identifiant OR u.email = :identifiant) AND u.role = :role AND u.cabinet.id = :cabinetId")
    Optional<Utilisateur> findByIdentifiantAndRoleAndCabinet(
            @Param("identifiant") String identifiant,
            @Param("role") Utilisateur.Role role,
            @Param("cabinetId") Integer cabinetId
    );
}