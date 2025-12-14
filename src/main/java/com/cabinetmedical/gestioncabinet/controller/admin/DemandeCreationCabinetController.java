package com.cabinetmedical.gestioncabinet.controller.admin;

import com.cabinetmedical.gestioncabinet.model.DemandeCreationCabinet;
import com.cabinetmedical.gestioncabinet.service.admin.DemandeCreationCabinetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/demandes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RequiredArgsConstructor
public class DemandeCreationCabinetController {

    private final DemandeCreationCabinetService demandeService;

    /**
     * 1️⃣ Récupérer toutes les demandes ou filtrer par statut
     * GET /api/demandes?statut=EN_ATTENTE
     */
    @GetMapping
    public List<DemandeCreationCabinet> getAllDemandes(
            @RequestParam(required = false) DemandeCreationCabinet.Statut statut
    ) {
        if (statut == null) {
            return demandeService.getAllDemandes();
        }
        return demandeService.getDemandesByStatut(statut);
    }

}
