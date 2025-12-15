package com.cabinetmedical.gestioncabinet.controller.medecin;

import com.cabinetmedical.gestioncabinet.dto.medecin.*;
import com.cabinetmedical.gestioncabinet.security.medecin.UserPrincipal;
import com.cabinetmedical.gestioncabinet.service.medecin.OrdonnanceService;
import com.cabinetmedical.gestioncabinet.service.medecin.MedicamentService;
import com.cabinetmedical.gestioncabinet.dto.medecin.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medecin/ordonnances")
@RequiredArgsConstructor
@Slf4j
public class OrdonnanceController {

    private final OrdonnanceService ordonnanceService;
    private final MedicamentService medicamentService;

    /**
     * Récupérer la consultation EN_COURS
     * Route: GET /api/medecin/ordonnances/consultation-en-cours
     */
    @GetMapping("/consultation-en-cours")
    @PreAuthorize("hasAuthority('MEDECIN')")
    public ResponseEntity<?> getConsultationEnCours() {
        try {
            log.info("🔵 GET /api/medecin/ordonnances/consultation-en-cours");

            UserPrincipal userPrincipal = getCurrentUserPrincipal();
            if (userPrincipal == null) {
                return ResponseEntity.status(401).body("Non authentifié");
            }

            Integer medecinId = userPrincipal.getId();
            ConsultationDTO consultation = ordonnanceService.getConsultationEnCours(medecinId);

            if (consultation == null) {
                return ResponseEntity.status(404).body("Aucune consultation en cours");
            }

            log.info("✅ Consultation EN_COURS trouvée: {}", consultation.getIdConsultation());
            return ResponseEntity.ok(consultation);

        } catch (Exception e) {
            log.error("❌ Erreur récupération consultation EN_COURS: ", e);
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    /**
     * Récupérer les ordonnances d'une consultation
     * Route: GET /api/medecin/ordonnances/consultation/{consultationId}
     */
    @GetMapping("/consultation/{consultationId}")
    @PreAuthorize("hasAuthority('MEDECIN')")
    public ResponseEntity<?> getOrdonnancesByConsultation(@PathVariable Integer consultationId) {
        try {
            log.info("🔵 GET /api/medecin/ordonnances/consultation/{}", consultationId);

            UserPrincipal userPrincipal = getCurrentUserPrincipal();
            if (userPrincipal == null) {
                return ResponseEntity.status(401).body("Non authentifié");
            }

            Integer medecinId = userPrincipal.getId();
            List<OrdonnanceDTO> ordonnances = ordonnanceService.getOrdonnancesByConsultation(consultationId, medecinId);

            log.info("✅ {} ordonnances trouvées", ordonnances.size());
            return ResponseEntity.ok(ordonnances);

        } catch (Exception e) {
            log.error("❌ Erreur récupération ordonnances: ", e);
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    /**
     * Créer une ordonnance MEDICAMENTS
     * Route: POST /api/medecin/ordonnances/medicaments
     */
    @PostMapping("/medicaments")
    @PreAuthorize("hasAuthority('MEDECIN')")
    public ResponseEntity<?> createOrdonnanceMedicaments(@Valid @RequestBody OrdonnanceRequestDTO requestDTO) {
        try {
            log.info("🔵 POST /api/medecin/ordonnances/medicaments");
            log.info("🔵 Request DTO: {}", requestDTO);

            UserPrincipal userPrincipal = getCurrentUserPrincipal();
            if (userPrincipal == null) {
                return ResponseEntity.status(401).body("Non authentifié");
            }

            Integer medecinId = userPrincipal.getId();
            OrdonnanceDTO ordonnance = ordonnanceService.createOrdonnanceMedicaments(requestDTO, medecinId);

            log.info("✅ Ordonnance MEDICAMENTS créée: {}", ordonnance.getId());
            return ResponseEntity.ok(ordonnance);

        } catch (Exception e) {
            log.error("❌ Erreur création ordonnance MEDICAMENTS: ", e);
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    /**
     * Créer une ordonnance EXAMENS
     * Route: POST /api/medecin/ordonnances/examens
     */
    @PostMapping("/examens")
    @PreAuthorize("hasAuthority('MEDECIN')")
    public ResponseEntity<?> createOrdonnanceExamens(@Valid @RequestBody OrdonnanceRequestDTO requestDTO) {
        try {
            log.info("🔵 POST /api/medecin/ordonnances/examens");
            log.info("🔵 Request DTO: {}", requestDTO);

            UserPrincipal userPrincipal = getCurrentUserPrincipal();
            if (userPrincipal == null) {
                return ResponseEntity.status(401).body("Non authentifié");
            }

            Integer medecinId = userPrincipal.getId();
            OrdonnanceDTO ordonnance = ordonnanceService.createOrdonnanceExamens(requestDTO, medecinId);

            log.info("✅ Ordonnance EXAMENS créée: {}", ordonnance.getId());
            return ResponseEntity.ok(ordonnance);

        } catch (Exception e) {
            log.error("❌ Erreur création ordonnance EXAMENS: ", e);
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    /**
     * Mettre à jour une ordonnance
     * Route: PUT /api/medecin/ordonnances/{ordonnanceId}
     */
    @PutMapping("/{ordonnanceId}")
    @PreAuthorize("hasAuthority('MEDECIN')")
    public ResponseEntity<?> updateOrdonnance(
            @PathVariable Integer ordonnanceId,
            @Valid @RequestBody OrdonnanceRequestDTO requestDTO) {
        try {
            log.info("🔵 PUT /api/medecin/ordonnances/{}", ordonnanceId);

            UserPrincipal userPrincipal = getCurrentUserPrincipal();
            if (userPrincipal == null) {
                return ResponseEntity.status(401).body("Non authentifié");
            }

            Integer medecinId = userPrincipal.getId();
            OrdonnanceDTO ordonnance = ordonnanceService.updateOrdonnance(ordonnanceId, requestDTO, medecinId);

            log.info("✅ Ordonnance mise à jour: {}", ordonnanceId);
            return ResponseEntity.ok(ordonnance);

        } catch (Exception e) {
            log.error("❌ Erreur mise à jour ordonnance: ", e);
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    /**
     * Supprimer une ordonnance
     * Route: DELETE /api/medecin/ordonnances/{ordonnanceId}
     */
    @DeleteMapping("/{ordonnanceId}")
    @PreAuthorize("hasAuthority('MEDECIN')")
    public ResponseEntity<?> deleteOrdonnance(@PathVariable Integer ordonnanceId) {
        try {
            log.info("🔵 DELETE /api/medecin/ordonnances/{}", ordonnanceId);

            UserPrincipal userPrincipal = getCurrentUserPrincipal();
            if (userPrincipal == null) {
                return ResponseEntity.status(401).body("Non authentifié");
            }

            Integer medecinId = userPrincipal.getId();
            ordonnanceService.deleteOrdonnance(ordonnanceId, medecinId);

            log.info("✅ Ordonnance supprimée: {}", ordonnanceId);
            return ResponseEntity.ok("Ordonnance supprimée avec succès");

        } catch (Exception e) {
            log.error("❌ Erreur suppression ordonnance: ", e);
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }

    /**
     * Rechercher des médicaments
     * Route: GET /api/medecin/ordonnances/medicaments/search?q={query}
     */
    @GetMapping("/medicaments/search")
    @PreAuthorize("hasAuthority('MEDECIN')")
    public ResponseEntity<?> searchMedicaments(@RequestParam String q) {
        try {
            log.info("🔵 GET /api/medecin/ordonnances/medicaments/search?q={}", q);

            List<MedicamentDTO> medicaments = medicamentService.searchMedicaments(q);

            log.info("✅ {} médicaments trouvés", medicaments.size());
            return ResponseEntity.ok(medicaments);

        } catch (Exception e) {
            log.error("❌ Erreur recherche médicaments: ", e);
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
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