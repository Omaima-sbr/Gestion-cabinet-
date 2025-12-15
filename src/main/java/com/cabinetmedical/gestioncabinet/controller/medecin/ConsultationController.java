package com.cabinetmedical.gestioncabinet.controller.medecin;

import com.cabinetmedical.gestioncabinet.dto.medecin.ConsultationDTO;
import com.cabinetmedical.gestioncabinet.dto.medecin.ConsultationRequestDTO;
import com.cabinetmedical.gestioncabinet.security.medecin.UserPrincipal;
import com.cabinetmedical.gestioncabinet.service.medecin.ConsultationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.cabinetmedical.gestioncabinet.exception.medecin.*;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/medecin/consultations")
@RequiredArgsConstructor
@Slf4j
public class ConsultationController {

    private final ConsultationService consultationService;

    /**
     * Récupérer l'historique des consultations d'un patient spécifique
     * Route: GET /api/medecin/consultations/{patientId}
     */
    @GetMapping("/{patientId}")
    @PreAuthorize("hasAuthority('MEDECIN')")
    public ResponseEntity<?> getPatientConsultationHistory(@PathVariable Integer patientId) {
        try {
            log.info("🔵 GET /api/medecin/consultations/{}", patientId);

            UserPrincipal userPrincipal = getCurrentUserPrincipal();
            if (userPrincipal == null) {
                log.error("❌ UserPrincipal null");
                return ResponseEntity.status(401).body("Non authentifié");
            }

            Integer medecinId = userPrincipal.getId();
            log.info("🔵 Médecin ID: {}, Patient ID: {}", medecinId, patientId);

            List<ConsultationDTO> history = consultationService.getPatientConsultationHistoryById(
                    patientId,
                    medecinId
            );

            log.info("✅ {} consultations trouvées", history.size());
            return ResponseEntity.ok(history);

        } catch (Exception e) {
            log.error("❌ Erreur récupération historique patient {}: ", patientId, e);
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    /**
     * Créer une nouvelle consultation pour le patient EN_COURS
     * Route: POST /api/medecin/consultations
     */
    @PostMapping
    @PreAuthorize("hasAuthority('MEDECIN')")
    public ResponseEntity<?> createConsultation(@Valid @RequestBody ConsultationRequestDTO requestDTO) {
        try {
            log.info("🔵 === POST /api/medecin/consultations ===");
            log.info("🔵 Request DTO: {}", requestDTO);

            UserPrincipal userPrincipal = getCurrentUserPrincipal();
            if (userPrincipal == null) {
                log.error("❌ UserPrincipal null");
                return ResponseEntity.status(401).body("Non authentifié");
            }

            Integer medecinId = userPrincipal.getId();
            Integer cabinetId = userPrincipal.getCabinetId() != null ? userPrincipal.getCabinetId() : 1;

            log.info("🔵 Médecin ID: {}, Cabinet ID: {}", medecinId, cabinetId);

            ConsultationDTO consultation = consultationService.createConsultation(requestDTO, medecinId, cabinetId);

            log.info("✅ Consultation créée: {}", consultation.getIdConsultation());
            return ResponseEntity.ok(consultation);

        } catch (ConsultationAlreadyExistsException e) {
            log.warn("⚠️ Consultation déjà existante: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT) // 409 Conflict
                    .body(e.getMessage());
        } catch (Exception e) {
            log.error("❌ Erreur création consultation: ", e);
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    /**
     * Mettre à jour une consultation existante
     * Route: PUT /api/medecin/consultations/{consultationId}
     */
    @PutMapping("/{consultationId}")
    @PreAuthorize("hasAuthority('MEDECIN')")
    public ResponseEntity<?> updateConsultation(
            @PathVariable Integer consultationId,
            @Valid @RequestBody ConsultationRequestDTO requestDTO) {
        try {
            log.info("🔵 PUT /api/medecin/consultations/{}", consultationId);

            UserPrincipal userPrincipal = getCurrentUserPrincipal();
            if (userPrincipal == null) {
                return ResponseEntity.status(401).body("Non authentifié");
            }

            Integer medecinId = userPrincipal.getId();
            ConsultationDTO consultation = consultationService.updateConsultation(consultationId, requestDTO, medecinId);

            log.info("✅ Consultation mise à jour: {}", consultationId);
            return ResponseEntity.ok(consultation);

        } catch (Exception e) {
            log.error("❌ Erreur mise à jour consultation: ", e);
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    /**
     * Récupérer une consultation spécifique par son ID
     * Route: GET /api/medecin/consultations/consultation/{consultationId}
     */
    @GetMapping("/consultation/{consultationId}")
    @PreAuthorize("hasAuthority('MEDECIN')")
    public ResponseEntity<?> getConsultation(@PathVariable Integer consultationId) {
        try {
            log.info("🔵 GET /api/medecin/consultations/consultation/{}", consultationId);

            UserPrincipal userPrincipal = getCurrentUserPrincipal();
            if (userPrincipal == null) {
                return ResponseEntity.status(401).body("Non authentifié");
            }

            Integer medecinId = userPrincipal.getId();
            ConsultationDTO consultation = consultationService.getConsultationById(consultationId, medecinId);

            return ResponseEntity.ok(consultation);

        } catch (Exception e) {
            log.error("❌ Erreur récupération consultation: ", e);
            return ResponseEntity.status(404).body("Consultation non trouvée");
        }
    }

    private UserPrincipal getCurrentUserPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            log.error("❌ Pas d'authentification");
            return null;
        }

        Object principal = authentication.getPrincipal();
        log.debug("🔍 Principal type: {}", principal.getClass().getName());

        if (principal instanceof UserPrincipal) {
            UserPrincipal up = (UserPrincipal) principal;
            log.debug("✅ UserPrincipal - ID: {}, Login: {}, Cabinet: {}",
                    up.getId(), up.getLogin(), up.getCabinetId());
            return up;
        }

        log.error("❌ Principal n'est pas UserPrincipal: {}", principal.getClass().getName());
        return null;
    }
}