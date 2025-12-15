package com.cabinetmedical.gestioncabinet.controller.medecin;

import com.cabinetmedical.gestioncabinet.dto.medecin.DashboardDataDTO;
import com.cabinetmedical.gestioncabinet.security.medecin.UserPrincipal;
import com.cabinetmedical.gestioncabinet.service.medecin.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/medecin/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;


    @GetMapping
    @PreAuthorize("hasAuthority('MEDECIN')")
    public ResponseEntity<DashboardDataDTO> getDashboardData() {
        try {
            log.info("=== Début getDashboardData ===");
            UserPrincipal userPrincipal = getCurrentUserPrincipal();

            if (userPrincipal == null) {
                log.error("Impossible de récupérer UserPrincipal");
                throw new SecurityException("Utilisateur non authentifié");
            }

            Integer medecinId = userPrincipal.getId();
            Integer cabinetId = userPrincipal.getCabinetId();

            log.info("Médecin ID: {}, Cabinet ID: {}", medecinId, cabinetId);

            if (medecinId == null) {
                throw new SecurityException("ID médecin non trouvé");
            }

            if (cabinetId == null) {
                log.warn("Cabinet ID est null, utilisation de cabinet par défaut (1)");
                cabinetId = 1; // Valeur par défaut si le cabinet n'est pas défini
            }

            DashboardDataDTO dashboardData = dashboardService.getDashboardData(medecinId, cabinetId);
            log.info("=== Fin getDashboardData ===");
            return ResponseEntity.ok(dashboardData);

        } catch (Exception e) {
            log.error("Erreur dans getDashboardData: ", e);
            throw e;
        }
    }
    @PutMapping("/current-patient/complete")
    public ResponseEntity<?> completeCurrentPatient() {
        try {
            log.info("=== DEBUT completeCurrentPatient ===");

            // Vérifier l'authentification
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            log.info("Authentication: {}", auth);
            log.info("Authenticated: {}", auth != null && auth.isAuthenticated());

            if (auth == null) {
                log.error("Authentication est NULL!");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            UserPrincipal userPrincipal = getCurrentUserPrincipal();
            log.info("UserPrincipal: {}", userPrincipal);

            if (userPrincipal == null) {
                log.error("UserPrincipal est NULL!");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Utilisateur non authentifié");
            }

            Integer medecinId = userPrincipal.getId();
            log.info("Médecin ID: {}", medecinId);

            dashboardService.completeCurrentPatient(medecinId);

            log.info("=== FIN completeCurrentPatient (succès) ===");
            return ResponseEntity.ok().build();

        } catch (Exception e) {
            log.error("❌ Erreur dans completeCurrentPatient: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur: " + e.getMessage());
        }
    }

    // Méthode helper pour extraire l'ID médecin
    private Integer getMedecinIdFromUserDetails(UserDetails userDetails) {
        // Adapte cette méthode selon ton implémentation
        // Par exemple si tu as un CustomUserDetails avec getId()
        return null; // à remplacer par ta logique
    }

    @PutMapping("/notifications/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Integer notificationId) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        if (userPrincipal == null) {
            throw new SecurityException("Utilisateur non authentifié");
        }

        Integer medecinId = userPrincipal.getId();
        dashboardService.markNotificationAsRead(notificationId, medecinId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/notifications/read-all")
    public ResponseEntity<Void> markAllNotificationsAsRead() {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        if (userPrincipal == null) {
            throw new SecurityException("Utilisateur non authentifié");
        }

        Integer medecinId = userPrincipal.getId();
        dashboardService.markAllNotificationsAsRead(medecinId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/appointments/{appointmentId}/status")
    public ResponseEntity<Void> updateAppointmentStatus(
            @PathVariable Integer appointmentId,
            @RequestBody UpdateStatusRequest request) {
        UserPrincipal userPrincipal = getCurrentUserPrincipal();
        if (userPrincipal == null) {
            throw new SecurityException("Utilisateur non authentifié");
        }

        Integer medecinId = userPrincipal.getId();
        dashboardService.updateAppointmentStatus(appointmentId, request.getStatus(), medecinId);
        return ResponseEntity.ok().build();
    }

    private UserPrincipal getCurrentUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            log.warn("Authentication est null");
            return null;
        }

        if (!authentication.isAuthenticated()) {
            log.warn("Utilisateur non authentifié");
            return null;
        }
        if (authentication == null) {
            log.error("❌ Authentication est null");
            return null;
        }

        if (!authentication.isAuthenticated()) {
            log.error("❌ Utilisateur non authentifié");
            return null;
        }

        Object principal = authentication.getPrincipal();
        log.debug("Type du principal: {}", principal.getClass().getName());

        if (principal instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) principal;
            log.debug("UserPrincipal trouvé: id={}, login={}, cabinetId={}",
                    userPrincipal.getId(), userPrincipal.getLogin(), userPrincipal.getCabinetId());
            return userPrincipal;
        }

        // Si le principal est une String (username)
        if (principal instanceof String) {
            String username = (String) principal;
            log.warn("Principal est une String (username): {}", username);
        }
        // Si c'est un UserDetails standard
        else if (principal instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) principal;
            log.warn("Principal est un UserDetails standard: {}", userDetails.getUsername());
        }
        else {
            log.warn("Type de principal inattendu: {}", principal.getClass().getName());
        }

        return null;
    }

    // Classe interne pour la requête
    private static class UpdateStatusRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}