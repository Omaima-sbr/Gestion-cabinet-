package com.cabinetmedical.gestioncabinet.repository.admin;

import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {
    Optional<Utilisateur> findByLogin(String login);
    boolean existsByLogin(String login);
    // Récupérer tous les utilisateurs actifs ou inactifs selon le statut
    List<Utilisateur> findByStatut(String statut);

    // Récupérer uniquement les utilisateurs non supprimés (soft delete)
    List<Utilisateur> findByActifTrue();
    // --- NOUVELLES MÉTHODES POUR AUTHENTIFICATION ---

    // 1️⃣ Pour ADMINISTRATEUR (login ou email)
    @Query("SELECT u FROM Utilisateur u WHERE (u.login = :identifiant OR u.email = :identifiant) AND u.role = :role")
    Optional<Utilisateur> findByIdentifiantAndRole(
            @Param("identifiant") String identifiant,
            @Param("role") Utilisateur.Role role
    );

    // 2️⃣ Pour MEDECIN et SECRETAIRE (login ou email + cabinet)
    @Query("SELECT u FROM Utilisateur u WHERE (u.login = :identifiant OR u.email = :identifiant) AND u.role = :role AND u.cabinet.id = :cabinetId")
    Optional<Utilisateur> findByIdentifiantAndRoleAndCabinet(
            @Param("identifiant") String identifiant,
            @Param("role") Utilisateur.Role role,
            @Param("cabinetId") Integer cabinetId
    );
}
