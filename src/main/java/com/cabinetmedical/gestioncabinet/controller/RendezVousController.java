package com.cabinetmedical.gestioncabinet.controller;

import com.cabinetmedical.gestioncabinet.model.RendezVous;
import com.cabinetmedical.gestioncabinet.repository.RendezVousRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/secretaire/rendez-vous")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RendezVousController {

    private final RendezVousRepository rendezVousRepository;

    @GetMapping("/jour")
    public List<Map<String, Object>> getRendezVousDuJour(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        // ✅ Si aucune date n'est fournie, utiliser la date du jour
        LocalDate targetDate = (date != null) ? date : LocalDate.now();

        List<RendezVous> rendezVous = rendezVousRepository.findByDateRdv(targetDate);

        return rendezVous.stream().map(rdv -> {
            Map<String, Object> rdvMap = new HashMap<>();
            rdvMap.put("idRendezVous", rdv.getIdRendezVous());
            rdvMap.put("heureRdv", rdv.getHeureRdv().toString());
            rdvMap.put("nomPatient", rdv.getPatient().getNom());
            rdvMap.put("prenomPatient", rdv.getPatient().getPrenom());
            rdvMap.put("nomMedecin", rdv.getMedecin().getNom());
            rdvMap.put("statut", rdv.getStatut().toString());
            rdvMap.put("motif", rdv.getMotif() != null ? rdv.getMotif().toString() : "");
            return rdvMap;
        }).collect(Collectors.toList());
    }

    @GetMapping
    public List<Map<String, Object>> getAllRendezVous() {
        List<RendezVous> rendezVous = rendezVousRepository.findAll();

        return rendezVous.stream().map(rdv -> {
            Map<String, Object> rdvMap = new HashMap<>();
            rdvMap.put("idRendezVous", rdv.getIdRendezVous());
            rdvMap.put("dateRdv", rdv.getDateRdv().toString());
            rdvMap.put("heureRdv", rdv.getHeureRdv().toString());
            rdvMap.put("nomPatient", rdv.getPatient().getNom());
            rdvMap.put("prenomPatient", rdv.getPatient().getPrenom());
            rdvMap.put("nomMedecin", rdv.getMedecin().getNom());
            rdvMap.put("prenomMedecin", rdv.getMedecin().getPrenom());
            rdvMap.put("statut", rdv.getStatut().toString());
            rdvMap.put("motif", rdv.getMotif() != null ? rdv.getMotif().toString() : "");
            return rdvMap;
        }).collect(Collectors.toList());
    }
}