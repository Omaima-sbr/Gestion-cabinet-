package com.cabinetmedical.gestioncabinet.repository;

import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {

    // 1 - Trouver par login
    Optional<Utilisateur> findByLogin(String login);

    // 2 - Vérifier si login existe
    boolean existsByLogin(String login);

    // 3 - Trouver par login + role ( admin  )
    Optional<Utilisateur> findByLoginAndRole(String login, Utilisateur.Role role);

    // 4 - Trouver par login + role + cabinetId (med + sec )
    Optional<Utilisateur> findByLoginAndRoleAndCabinetId(
            String login,
            Utilisateur.Role role,
            Integer cabinetId
    );
}
