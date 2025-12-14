package com.cabinetmedical.gestioncabinet.controller.medecin;

import com.cabinetmedical.gestioncabinet.dto.medecin.DossierMedicalDTO;
import com.cabinetmedical.gestioncabinet.dto.medecin.DossierMedicalRequestDTO;
import com.cabinetmedical.gestioncabinet.security.medecin.UserPrincipal;
import com.cabinetmedical.gestioncabinet.service.medecin.DossierMedicalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/medecin/dossiers-medicaux")
@RequiredArgsConstructor
@Slf4j
public class DossierMedicalController {

    private final DossierMedicalService dossierMedicalService;

    /**
     * Récupérer le dossier médical du patient EN_COURS
     * Route: GET /api/medecin/dossiers-medicaux/current
     */
    @GetMapping("/current")
    @PreAuthorize("hasAuthority('MEDECIN')")
    public ResponseEntity<?> getCurrentPatientDossierMedical() {
        try {
            log.info("🔵 GET /api/medecin/dossiers-medicaux/current");

            UserPrincipal userPrincipal = getCurrentUserPrincipal();
            if (userPrincipal == null) {
                log.error("❌ UserPrincipal null");
                return ResponseEntity.status(401).body("Non authentifié");
            }

            Integer medecinId = userPrincipal.getId();
            log.info("🔵 Médecin ID: {}", medecinId);

            DossierMedicalDTO dossier = dossierMedicalService.getDossierMedicalForCurrentPatient(medecinId);

            if (dossier == null) {
                log.warn("⚠️ Aucun patient en cours");
                return ResponseEntity.status(404).body("Aucun patient en cours");
            }

            log.info("✅ Dossier médical trouvé");
            return ResponseEntity.ok(dossier);

        } catch (Exception e) {
            log.error("❌ Erreur récupération dossier médical: ", e);
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    /**
     * Créer un dossier médical pour le patient EN_COURS
     * Route: POST /api/medecin/dossiers-medicaux
     */
    @PostMapping
    @PreAuthorize("hasAuthority('MEDECIN')")
    public ResponseEntity<?> createDossierMedical(@Valid @RequestBody DossierMedicalRequestDTO requestDTO) {
        try {
            log.info("🔵 === POST /api/medecin/dossiers-medicaux ===");
            log.info("🔵 Request DTO: {}", requestDTO);

            UserPrincipal userPrincipal = getCurrentUserPrincipal();
            if (userPrincipal == null) {
                log.error("❌ UserPrincipal null");
                return ResponseEntity.status(401).body("Non authentifié");
            }

            Integer medecinId = userPrincipal.getId();
            log.info("🔵 Médecin ID: {}", medecinId);

            DossierMedicalDTO dossier = dossierMedicalService.createDossierMedical(requestDTO, medecinId);

            log.info("✅ Dossier médical créé: {}", dossier.getIdDossier());
            return ResponseEntity.status(HttpStatus.CREATED).body(dossier);

        } catch (Exception e) {
            log.error("❌ Erreur création dossier médical: ", e);
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    /**
     * Mettre à jour le dossier médical du patient EN_COURS
     * Route: PUT /api/medecin/dossiers-medicaux
     */
    @PutMapping
    @PreAuthorize("hasAuthority('MEDECIN')")
    public ResponseEntity<?> updateDossierMedical(@Valid @RequestBody DossierMedicalRequestDTO requestDTO) {
        try {
            log.info("🔵 PUT /api/medecin/dossiers-medicaux");

            UserPrincipal userPrincipal = getCurrentUserPrincipal();
            if (userPrincipal == null) {
                return ResponseEntity.status(401).body("Non authentifié");
            }

            Integer medecinId = userPrincipal.getId();
            DossierMedicalDTO dossier = dossierMedicalService.updateDossierMedical(requestDTO, medecinId);

            log.info("✅ Dossier médical mis à jour");
            return ResponseEntity.ok(dossier);

        } catch (Exception e) {
            log.error("❌ Erreur mise à jour dossier médical: ", e);
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    /**
     * Récupérer un dossier médical par patient ID
     * Route: GET /api/medecin/dossiers-medicaux/patient/{patientId}
     */
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAuthority('MEDECIN')")
    public ResponseEntity<?> getDossierMedicalByPatientId(@PathVariable Integer patientId) {
        try {
            log.info("🔵 GET /api/medecin/dossiers-medicaux/patient/{}", patientId);

            UserPrincipal userPrincipal = getCurrentUserPrincipal();
            if (userPrincipal == null) {
                return ResponseEntity.status(401).body("Non authentifié");
            }

            Integer cabinetId = userPrincipal.getCabinetId();
            DossierMedicalDTO dossier = dossierMedicalService.getDossierMedicalByPatientId(patientId, cabinetId);

            return ResponseEntity.ok(dossier);

        } catch (Exception e) {
            log.error("❌ Erreur récupération dossier: ", e);
            return ResponseEntity.status(404).body("Dossier non trouvé");
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