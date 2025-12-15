package com.cabinetmedical.gestioncabinet.controller.medecin;

import com.cabinetmedical.gestioncabinet.dto.medecin.RendezVousDTO;
import com.cabinetmedical.gestioncabinet.dto.medecin.StatistiquesDTO;
import com.cabinetmedical.gestioncabinet.model.RendezVous;
import com.cabinetmedical.gestioncabinet.repository.medecin.RendezVousRepository;
import com.cabinetmedical.gestioncabinet.security.medecin.UserPrincipal;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/medecin/rendez-vous")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})

@PreAuthorize("hasAuthority('MEDECIN')")
public class MedecinRendezVousController {

    private final RendezVousRepository rendezVousRepository;

    @GetMapping("/aujourdhui")
    public ResponseEntity<?> getRendezVousAujourdhui(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        LocalDate aujourdhui = LocalDate.now();
        List<RendezVous> rendezVous = rendezVousRepository.findByMedecinAndDate(userPrincipal.getId(), aujourdhui);

        List<RendezVousDTO> dtos = rendezVous.stream()
                .map(RendezVousDTO::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/par-date")
    public ResponseEntity<?> getRendezVousParDate(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<RendezVous> rendezVous = rendezVousRepository.findByMedecinAndDate(userPrincipal.getId(), date);

        List<RendezVousDTO> dtos = rendezVous.stream()
                .map(RendezVousDTO::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/semaine")
    public ResponseEntity<?> getRendezVousSemaine(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateDebut) {

        LocalDate dateFin = dateDebut.plusDays(6);

        List<RendezVous> rendezVous = rendezVousRepository.findByMedecinAndDateBetween(
                userPrincipal.getId(), dateDebut, dateFin);

        List<RendezVousDTO> dtos = rendezVous.stream()
                .map(RendezVousDTO::fromEntity)
                .collect(Collectors.toList());

        Map<LocalDate, List<RendezVousDTO>> rendezVousParJour = dtos.stream()
                .collect(Collectors.groupingBy(RendezVousDTO::getDateRdv));

        Map<String, Object> response = new HashMap<>();
        response.put("rendezVous", dtos);
        response.put("groupes", rendezVousParJour);
        response.put("dateDebut", dateDebut);
        response.put("dateFin", dateFin);
        response.put("total", dtos.size());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/statistiques/aujourdhui")
    public ResponseEntity<?> getStatistiquesAujourdhui(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        LocalDate aujourdhui = LocalDate.now();

        long total = rendezVousRepository.countByMedecinAndDate(userPrincipal.getId(), aujourdhui);
        long confirmes = rendezVousRepository.countByMedecinAndDateAndStatut(
                userPrincipal.getId(), aujourdhui, RendezVous.Statut.CONFIRME);
        long enAttente = rendezVousRepository.countByMedecinAndDateAndStatut(
                userPrincipal.getId(), aujourdhui, RendezVous.Statut.EN_ATTENTE);
        long annules = rendezVousRepository.findTodayAnnulesByMedecinId(userPrincipal.getId()).size();
        long termines = rendezVousRepository.findTodayTerminesByMedecinId(userPrincipal.getId()).size();

        StatistiquesDTO stats = new StatistiquesDTO(
                total, confirmes, enAttente, annules, termines
        );

        return ResponseEntity.ok(stats);
    }

    @PutMapping("/{id}/statut")
    public ResponseEntity<?> changerStatutRendezVous(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Integer id,
            @RequestBody Map<String, String> request) {

        RendezVous rendezVous = rendezVousRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé avec ID: " + id));

        if (!rendezVous.getMedecin().getId().equals(userPrincipal.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Non autorisé"));
        }

        try {
            RendezVous.Statut nouveauStatut = RendezVous.Statut.valueOf(request.get("statut"));
            rendezVous.setStatut(nouveauStatut);
            rendezVousRepository.save(rendezVous);

            return ResponseEntity.ok(Map.of(
                    "message", "Statut mis à jour avec succès",
                    "rendezVous", RendezVousDTO.fromEntity(rendezVous)
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Statut invalide"));
        }
    }

    @PutMapping("/{id}/patient-arrive")
    public ResponseEntity<?> marquerPatientArrive(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Integer id) {

        RendezVous rendezVous = rendezVousRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rendez-vous non trouvé"));

        if (!rendezVous.getMedecin().getId().equals(userPrincipal.getId())) {
            return ResponseEntity.status(403).body(Map.of("error", "Non autorisé"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Patient marqué comme arrivé");
        response.put("rendezVousId", id);
        response.put("patientArrive", true);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        LocalDate aujourdhui = LocalDate.now();
        LocalDate demain = aujourdhui.plusDays(1);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAujourdhui", rendezVousRepository.countByMedecinAndDate(userPrincipal.getId(), aujourdhui));
        stats.put("confirmesAujourdhui", rendezVousRepository.findTodayConfirmesByMedecinId(userPrincipal.getId()).size());
        stats.put("enAttenteAujourdhui", rendezVousRepository.findTodayEnAttenteByMedecinId(userPrincipal.getId()).size());
        stats.put("annulesAujourdhui", rendezVousRepository.findTodayAnnulesByMedecinId(userPrincipal.getId()).size());
        stats.put("terminesAujourdhui", rendezVousRepository.findTodayTerminesByMedecinId(userPrincipal.getId()).size());

        // Rendez-vous de demain
        List<RendezVous> rdvDemain = rendezVousRepository.findByMedecinAndDate(userPrincipal.getId(), demain);
        stats.put("rendezVousDemain", rdvDemain.size());

        return ResponseEntity.ok(stats);
    }
}