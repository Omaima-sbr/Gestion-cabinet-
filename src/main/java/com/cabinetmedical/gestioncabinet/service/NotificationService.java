package com.cabinetmedical.gestioncabinet.service;

import com.cabinetmedical.gestioncabinet.model.Notification;
import com.cabinetmedical.gestioncabinet.model.RendezVous;
import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import com.cabinetmedical.gestioncabinet.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void creerNotification(Utilisateur utilisateur,
                                  Notification.Type type,
                                  String message,
                                  RendezVous rendezVous) {
        Notification notification = new Notification();
        notification.setUtilisateur(utilisateur);
        notification.setType(type);
        notification.setMessage(message);
        notification.setLu(false);
        notification.setDateNotification(LocalDateTime.now());
        notification.setRendezVous(rendezVous);

        notificationRepository.save(notification);
    }
}