package com.cabinetmedical.gestioncabinet.controller;

import com.cabinetmedical.gestioncabinet.model.Patient;
import com.cabinetmedical.gestioncabinet.model.RendezVous;
import com.cabinetmedical.gestioncabinet.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/secretaire/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final PatientRepository patientRepository;
    private final RendezVousRepository rendezVousRepository;
    private final FactureRepository factureRepository;
    private final MessagerieRepository messagerieRepository;

    /**
     * Statistiques principales du dashboard
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        try {
            Map<String, Object> stats = new HashMap<>();

            // Total patients
            long patientsTotal = patientRepository.count();
            stats.put("patientsTotal", patientsTotal);

            // Rendez-vous aujourd'hui
            LocalDate today = LocalDate.now();
            long rdvAujourdhui = rendezVousRepository.countByDateRdv(today);
            stats.put("rdvAujourdhui", rdvAujourdhui);

            // Factures en attente
            long facturesEnAttente = factureRepository.countByStatut(
                    com.cabinetmedical.gestioncabinet.model.Facture.Statut.EN_ATTENTE
            );
            stats.put("facturesEnAttente", facturesEnAttente);

            // Messages non lus (pour l'instant 0, à adapter selon authentification)
            stats.put("messagesNonLus", 0);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            System.err.println("❌ Erreur getStats: " + e.getMessage());
            e.printStackTrace();
            // Retourner des valeurs par défaut en cas d'erreur
            Map<String, Object> defaultStats = new HashMap<>();
            defaultStats.put("patientsTotal", 0);
            defaultStats.put("rdvAujourdhui", 0);
            defaultStats.put("facturesEnAttente", 0);
            defaultStats.put("messagesNonLus", 0);
            return ResponseEntity.ok(defaultStats);
        }
    }

    /**
     * Rendez-vous par jour de la semaine (7 derniers jours)
     */
    @GetMapping("/rdv-semaine")
    public ResponseEntity<List<Map<String, Object>>> getRdvSemaine() {
        try {
            LocalDate today = LocalDate.now();
            LocalDate startDate = today.minusDays(6); // 7 jours en incluant aujourd'hui

            List<Object[]> results = rendezVousRepository.countRdvParJour(startDate, today);

            // Créer une map avec tous les jours de la semaine (initialiser à 0)
            Map<LocalDate, Long> rdvByDate = new LinkedHashMap<>();
            for (int i = 6; i >= 0; i--) {
                rdvByDate.put(today.minusDays(i), 0L);
            }

            // Remplir avec les vraies données
            for (Object[] result : results) {
                LocalDate date = ((java.sql.Date) result[0]).toLocalDate();
                Long count = ((Number) result[1]).longValue();
                rdvByDate.put(date, count);
            }

            // Formater pour le frontend
            List<Map<String, Object>> data = rdvByDate.entrySet().stream()
                    .map(entry -> {
                        Map<String, Object> dayData = new HashMap<>();
                        String jour = entry.getKey().getDayOfWeek()
                                .getDisplayName(TextStyle.SHORT, Locale.FRENCH);
                        dayData.put("jour", jour);
                        dayData.put("rdv", entry.getValue());
                        return dayData;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(data);
        } catch (Exception e) {
            System.err.println("❌ Erreur getRdvSemaine: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    /**
     * Répartition des rendez-vous par statut
     */
    @GetMapping("/rdv-statuts")
    public ResponseEntity<List<Map<String, Object>>> getRdvStatuts() {
        try {
            List<Object[]> results = rendezVousRepository.countByStatut();

            List<Map<String, Object>> data = results.stream()
                    .map(result -> {
                        Map<String, Object> statutData = new HashMap<>();
                        RendezVous.Statut statut = (RendezVous.Statut) result[0];
                        Long count = (Long) result[1];

                        String name;
                        String color;

                        switch (statut) {
                            case CONFIRME:
                                name = "Confirmés";
                                color = "#10b981";
                                break;
                            case EN_ATTENTE:
                                name = "En attente";
                                color = "#f59e0b";
                                break;
                            case ANNULE:
                                name = "Annulés";
                                color = "#ef4444";
                                break;
                            case TERMINE:
                                name = "Terminés";
                                color = "#3b82f6";
                                break;
                            default:
                                name = statut.toString();
                                color = "#6b7280";
                        }

                        statutData.put("name", name);
                        statutData.put("value", count);
                        statutData.put("color", color);
                        return statutData;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(data);
        } catch (Exception e) {
            System.err.println("❌ Erreur getRdvStatuts: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    /**
     * Évolution des patients (6 derniers mois)
     */
    @GetMapping("/patients-evolution")
    public ResponseEntity<List<Map<String, Object>>> getPatientsEvolution() {
        try {
            LocalDate today = LocalDate.now();
            List<Map<String, Object>> data = new ArrayList<>();

            // Récupérer tous les patients
            List<Patient> allPatients = patientRepository.findAll();

            // Créer un compteur pour chaque mois
            for (int i = 5; i >= 0; i--) {
                LocalDate monthStart = today.minusMonths(i).withDayOfMonth(1);
                LocalDate monthEnd = monthStart.plusMonths(1).minusDays(1);

                String moisNom = monthStart.getMonth()
                        .getDisplayName(TextStyle.SHORT, Locale.FRENCH);

                // Compter les patients créés avant ou pendant ce mois
                long count = allPatients.stream()
                        .filter(p -> !p.getDateCreation().toLocalDate().isAfter(monthEnd))
                        .count();

                Map<String, Object> monthData = new HashMap<>();
                monthData.put("mois", moisNom);
                monthData.put("patients", count);
                data.add(monthData);
            }

            return ResponseEntity.ok(data);
        } catch (Exception e) {
            System.err.println("❌ Erreur getPatientsEvolution: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    /**
     * Revenus mensuels (6 derniers mois)
     */
    @GetMapping("/revenus-mensuels")
    public ResponseEntity<List<Map<String, Object>>> getRevenusMensuels() {
        try {
            LocalDate today = LocalDate.now();
            LocalDate startDate = today.minusMonths(6);

            List<Object[]> results = factureRepository.getRevenusMensuels(startDate);

            // Créer une map avec tous les mois (initialiser à 0)
            Map<String, BigDecimal> revenusByMonth = new LinkedHashMap<>();
            for (int i = 5; i >= 0; i--) {
                LocalDate month = today.minusMonths(i);
                String monthKey = String.format("%04d-%02d", month.getYear(), month.getMonthValue());
                revenusByMonth.put(monthKey, BigDecimal.ZERO);
            }

            // Remplir avec les vraies données
            for (Object[] result : results) {
                String monthKey = (String) result[0];
                BigDecimal total = (BigDecimal) result[1];
                revenusByMonth.put(monthKey, total);
            }

            // Formater pour le frontend
            List<Map<String, Object>> data = revenusByMonth.entrySet().stream()
                    .map(entry -> {
                        Map<String, Object> monthData = new HashMap<>();
                        String[] parts = entry.getKey().split("-");
                        int year = Integer.parseInt(parts[0]);
                        int month = Integer.parseInt(parts[1]);
                        LocalDate date = LocalDate.of(year, month, 1);

                        String moisNom = date.getMonth()
                                .getDisplayName(TextStyle.SHORT, Locale.FRENCH);

                        monthData.put("mois", moisNom);
                        monthData.put("montant", entry.getValue().doubleValue());
                        return monthData;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(data);
        } catch (Exception e) {
            System.err.println("❌ Erreur getRevenusMensuels: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new ArrayList<>());
        }
    }
}