package com.cabinetmedical.gestioncabinet.controller.medecin;

import com.cabinetmedical.gestioncabinet.dto.medecin.NotificationDTO;
import com.cabinetmedical.gestioncabinet.model.Cabinet;
import com.cabinetmedical.gestioncabinet.model.Notification;
import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import com.cabinetmedical.gestioncabinet.repository.medecin.CabinetmedRepository;
import com.cabinetmedical.gestioncabinet.service.medecin.NotificationService;
import com.cabinetmedical.gestioncabinet.service.medecin.UtilisateurService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@Slf4j // ✅ Ajout des logs
public class NotificationController {

    private final NotificationService notificationService;
    private final UtilisateurService utilisateurService;
    private final CabinetmedRepository cabinetRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NotificationDTO>> getNotifications() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            log.info("🔍 [Notifications] Récupération pour l'utilisateur: {}", username);

            Utilisateur user = utilisateurService.findByLogin(username);
            if (user == null) {
                log.error("❌ [Notifications] Utilisateur non trouvé: {}", username);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Optional<Cabinet> cabinetOpt = cabinetRepository.findByUserId(user.getId());

            // ✅ CORRECTION: Gérer le cas où l'utilisateur n'a pas de cabinet
            if (cabinetOpt.isEmpty()) {
                log.warn("⚠️ [Notifications] Aucun cabinet trouvé pour userId: {}. Retour notifications sans filtre cabinet", user.getId());

                // Option 1: Retourner les notifications sans filtre de cabinet
                List<Notification> notifications = notificationService.getNotificationsByUserId(user.getId());
                List<NotificationDTO> dtos = notifications.stream()
                        .map(NotificationDTO::fromEntity)
                        .collect(Collectors.toList());
                return ResponseEntity.ok(dtos);

                // Option 2 (alternative): Retourner une liste vide
                // return ResponseEntity.ok(Collections.emptyList());
            }

            List<Notification> notifications = notificationService.getNotificationsByUserIdAndCabinet(
                    user.getId(),
                    cabinetOpt.get().getId()
            );

            List<NotificationDTO> dtos = notifications.stream()
                    .map(NotificationDTO::fromEntity)
                    .collect(Collectors.toList());

            log.info("✅ [Notifications] {} notifications récupérées", dtos.size());
            return ResponseEntity.ok(dtos);

        } catch (Exception e) {
            log.error("❌ [Notifications] Erreur inattendue:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NotificationDTO>> getUnreadNotifications() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            Utilisateur user = utilisateurService.findByLogin(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Optional<Cabinet> cabinetOpt = cabinetRepository.findByUserId(user.getId());

            if (cabinetOpt.isEmpty()) {
                log.warn("⚠️ [Notifications] Aucun cabinet pour unread - userId: {}", user.getId());
                List<Notification> notifications = notificationService.getUnreadNotifications(user.getId());
                List<NotificationDTO> dtos = notifications.stream()
                        .map(NotificationDTO::fromEntity)
                        .collect(Collectors.toList());
                return ResponseEntity.ok(dtos);
            }

            List<Notification> notifications = notificationService.getUnreadNotificationsByUserIdAndCabinet(
                    user.getId(),
                    cabinetOpt.get().getId()
            );

            List<NotificationDTO> dtos = notifications.stream()
                    .map(NotificationDTO::fromEntity)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(dtos);

        } catch (Exception e) {
            log.error("❌ [Notifications/unread] Erreur:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getUnreadCount() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            Utilisateur user = utilisateurService.findByLogin(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Optional<Cabinet> cabinetOpt = cabinetRepository.findByUserId(user.getId());

            long count;
            if (cabinetOpt.isEmpty()) {
                log.warn("⚠️ [Notifications] Aucun cabinet pour count - userId: {}", user.getId());
                count = notificationService.getUnreadCount(user.getId());
            } else {
                count = notificationService.countUnreadNotificationsByUserIdAndCabinet(
                        user.getId(),
                        cabinetOpt.get().getId()
                );
            }

            Map<String, Object> response = new HashMap<>();
            response.put("count", count);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ [Notifications/unread-count] Erreur:", e);
            Map<String, Object> response = new HashMap<>();
            response.put("count", 0);
            return ResponseEntity.ok(response);
        }
    }

    @PutMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> markAllAsRead() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            Utilisateur user = utilisateurService.findByLogin(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Optional<Cabinet> cabinetOpt = cabinetRepository.findByUserId(user.getId());

            if (cabinetOpt.isEmpty()) {
                log.warn("⚠️ [Notifications] Aucun cabinet pour read-all - userId: {}", user.getId());
                notificationService.markAllAsRead(user.getId());
            } else {
                notificationService.markAllAsReadByUserIdAndCabinet(user.getId(), cabinetOpt.get().getId());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Toutes vos notifications ont été marquées comme lues");
            response.put("success", true);
            response.put("timestamp", java.time.LocalDateTime.now());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ [Notifications/read-all] Erreur:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable Integer id) {
        try {
            notificationService.markAsRead(id);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Notification marquée comme lue");
            response.put("success", true);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("❌ [Notifications/{}/read] Erreur:", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/test")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NotificationDTO> createTestNotification(@RequestBody TestNotificationRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String username = auth.getName();

            Utilisateur user = utilisateurService.findByLogin(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            Notification notification = notificationService.createNotification(
                    user.getId(),
                    request.getMessage(),
                    Notification.Type.valueOf(request.getType())
            );

            return ResponseEntity.ok(NotificationDTO.fromEntity(notification));

        } catch (Exception e) {
            log.error("❌ [Notifications/test] Erreur:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/debug/auth")
    public ResponseEntity<Map<String, Object>> debugAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", auth.isAuthenticated());
        response.put("name", auth.getName());
        response.put("principal", auth.getPrincipal().toString());
        response.put("authorities", auth.getAuthorities().toString());
        response.put("details", auth.getDetails());

        return ResponseEntity.ok(response);
    }

    @Data
    static class TestNotificationRequest {
        private String message;
        private String type;
    }
}