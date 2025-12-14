package com.cabinetmedical.gestioncabinet.service.admin;

import com.cabinetmedical.gestioncabinet.model.DemandeCreationCabinet;
import com.cabinetmedical.gestioncabinet.repository.admin.DemandeCreationCabinetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DemandeCreationCabinetService {

    private final DemandeCreationCabinetRepository demandeRepo;

    // 1️⃣ Récupérer toutes les demandes
    public List<DemandeCreationCabinet> getAllDemandes() {
        return demandeRepo.findAll();
    }

    // 2️⃣ Récupérer les demandes par statut
    public List<DemandeCreationCabinet> getDemandesByStatut(DemandeCreationCabinet.Statut statut) {
        return demandeRepo.findByStatut(statut);
    }
}
