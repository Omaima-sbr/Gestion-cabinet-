package com.cabinetmedical.gestioncabinet.controller.admin;

import com.cabinetmedical.gestioncabinet.model.DemandeCreationCabinet;
import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import com.cabinetmedical.gestioncabinet.service.admin.DemandeCreationCabinetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/demandes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DemandeCreationCabinetController {

    @Autowired
    private DemandeCreationCabinetService demandeService;

    /**
     * 1️⃣ Récupérer toutes les demandes
     * GET /api/demandes
     */
    @GetMapping
    public List<DemandeCreationCabinet> getAllDemandes(
            @RequestParam(required = false) DemandeCreationCabinet.Statut statut
    ) {
        // Si aucun statut n'est donné → retourner toutes les demandes
        if (statut == null) {
            return demandeService.getAllDemandes();
        }

        // Sinon filtrer par statut
        return demandeService.getDemandesByStatut(statut);
    }

    /**
     * 2️⃣ Approuver une demande
     * POST /api/demandes/{id}/approuver
     */
    @PostMapping("/{id}/approuver")
    public String approuverDemande(
            @PathVariable Integer id,
            @RequestBody Utilisateur admin
    ) throws Exception {

        demandeService.approuverDemande(id, admin);
        return "Demande approuvée avec succès.";
    }

    /**
     * 3️⃣ Rejeter une demande
     * POST /api/demandes/{id}/rejeter
     */
    @PostMapping("/{id}/rejeter")
    public String rejeterDemande(
            @PathVariable Integer id,
            @RequestBody RejetDemandeDTO dto
    ) throws Exception {

        demandeService.rejeterDemande(id, dto.commentaire(), dto.admin());
        return "Demande rejetée avec succès.";
    }

    /**
     * Petit DTO pour recevoir le commentaire + l'admin depuis le frontend
     */
    public record RejetDemandeDTO(String commentaire, Utilisateur admin) {}
}
