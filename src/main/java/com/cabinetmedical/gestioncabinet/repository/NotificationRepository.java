package com.cabinetmedical.gestioncabinet.repository;

import com.cabinetmedical.gestioncabinet.model.Notification;
import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    List<Notification> findByUtilisateurAndLuOrderByDateNotificationDesc(
            Utilisateur utilisateur, Boolean lu);

    Long countByUtilisateurAndLu(Utilisateur utilisateur, Boolean lu);
}