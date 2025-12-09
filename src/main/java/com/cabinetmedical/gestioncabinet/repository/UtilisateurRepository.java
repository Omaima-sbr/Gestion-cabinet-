package com.cabinetmedical.gestioncabinet.repository;

import com.cabinetmedical.gestioncabinet.model.Cabinet;
import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {

    /* ========================
       AUTH / LOGIN
       ======================== */

    Optional<Utilisateur> findByLogin(String login);

    boolean existsByLogin(String login);

    Optional<Utilisateur> findByLoginAndActif(String login, Boolean actif);

    /* ========================
       RÔLES
       ======================== */

    Optional<Utilisateur> findByLoginAndRole(String login, Utilisateur.Role role);

    Optional<Utilisateur> findFirstByRoleAndActif(Utilisateur.Role role, Boolean actif);

    List<Utilisateur> findByRoleAndActif(Utilisateur.Role role, Boolean actif);

    /* ========================
       CABINET
       ======================== */

    List<Utilisateur> findByCabinet(Cabinet cabinet);

    List<Utilisateur> findByRoleAndCabinetAndActif(
            Utilisateur.Role role,
            Cabinet cabinet,
            Boolean actif
    );

    Optional<Utilisateur> findByLoginAndRoleAndCabinetId(
            String login,
            Utilisateur.Role role,
            Integer cabinetId
    );
}
