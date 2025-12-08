package com.cabinetmedical.gestioncabinet.repository;

import com.cabinetmedical.gestioncabinet.model.Cabinet;
import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Integer> {

    Optional<Utilisateur> findByLogin(String login);

    boolean existsByLogin(String login);

    List<Utilisateur> findByRoleAndCabinetAndActif(
            Utilisateur.Role role, Cabinet cabinet, Boolean actif);

    List<Utilisateur> findByCabinet(Cabinet cabinet);
    // Trouver par login et statut actif
    Optional<Utilisateur> findByLoginAndActif(String login, Boolean actif);

    // Trouver le premier utilisateur par rôle et statut actif
    Optional<Utilisateur> findFirstByRoleAndActif(Utilisateur.Role role, Boolean actif);


    // Trouver par rôle et statut actif (sans filtre cabinet)
    List<Utilisateur> findByRoleAndActif(Utilisateur.Role role, Boolean actif);

}
