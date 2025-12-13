package com.cabinetmedical.gestioncabinet.service.admin;

import com.cabinetmedical.gestioncabinet.model.Cabinet;
import com.cabinetmedical.gestioncabinet.repository.admin.CabinetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CabinetService {

    private final CabinetRepository cabinetRepository;
    private final AdminFactureService adminFactureService; // <-- AJOUT

    public CabinetService(CabinetRepository cabinetRepository ,  AdminFactureService adminFactureService) {
        this.cabinetRepository = cabinetRepository;
        this.adminFactureService = adminFactureService; // <-- AJOUT
    }

    // Lister tous les cabinets
    public List<Cabinet> getAllCabinets() {
        return cabinetRepository.findAll();
    }

    // Rechercher par ID
    public Optional<Cabinet> getCabinetById(Integer id) {
        return cabinetRepository.findById(id); // findById renvoie déjà Optional
    }

    // Ajouter un cabinet
    public Cabinet addCabinet(Cabinet cabinet) {
        cabinet.setActif(false);

        return cabinetRepository.save(cabinet);
    }

    // Modifier un cabinet
    public Cabinet updateCabinet(Integer id, Cabinet cabinetDetails) {
        Cabinet cabinet = getCabinetById(id)
                .orElseThrow(() -> new RuntimeException("Cabinet non trouvé"));

        cabinet.setNom(cabinetDetails.getNom());
        cabinet.setAdresse(cabinetDetails.getAdresse());
        cabinet.setEmail(cabinetDetails.getEmail());
        cabinet.setTel(cabinetDetails.getTel());
        cabinet.setLogo(cabinetDetails.getLogo());
        cabinet.setSpecialite(cabinetDetails.getSpecialite());

        return cabinetRepository.save(cabinet);
    }

    // Désactiver / Activer un cabinet
    public Cabinet toggleCabinetStatus(Integer id, Boolean actif) {
        Cabinet cabinet = getCabinetById(id)
                .orElseThrow(() -> new RuntimeException("Cabinet non trouvé"));

        boolean etatPrecedent = cabinet.getActif();
        cabinet.setActif(actif);
        Cabinet savedCabinet = cabinetRepository.save(cabinet);

        // Création automatique de la facture si passage de inactif à actif
        if (!etatPrecedent && actif) {
            adminFactureService.createFactureForCabinet(savedCabinet);
        }

        return savedCabinet;
    }


    // Recherche par nom exact
    public List<Cabinet> searchByNom(String nom) {
        return cabinetRepository.findByNomContainingIgnoreCase(nom);
    }
}
