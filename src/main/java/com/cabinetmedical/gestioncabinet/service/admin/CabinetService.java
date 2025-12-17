package com.cabinetmedical.gestioncabinet.service.admin;

import com.cabinetmedical.gestioncabinet.model.Cabinet;
import com.cabinetmedical.gestioncabinet.model.DemandeCreationCabinet;
import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import com.cabinetmedical.gestioncabinet.repository.admin.CabinetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CabinetService {

    private final CabinetRepository cabinetRepository;
    private final AdminFactureService adminFactureService;
    private final UtilisateurService utilisateurService;

    public CabinetService(CabinetRepository cabinetRepository,
                          AdminFactureService adminFactureService,
                          UtilisateurService utilisateurService) {
        this.cabinetRepository = cabinetRepository;
        this.adminFactureService = adminFactureService;
        this.utilisateurService = utilisateurService;
    }

    // Lister tous les cabinets
    public List<Cabinet> getAllCabinets() {
        return cabinetRepository.findAll();
    }

    // Rechercher par ID
    public Optional<Cabinet> getCabinetById(Integer id) {
        return cabinetRepository.findById(id);
    }

    // Ajouter un cabinet “nu”
    public Cabinet addCabinet(Cabinet cabinet) {
        cabinet.setActif(false);
        return cabinetRepository.save(cabinet);
    }

    // Créer cabinet + utilisateurs à partir d’une demande
    public Cabinet creerCabinetEtUtilisateurs(DemandeCreationCabinet demande) {
        // 1️⃣ Créer le cabinet
        Cabinet cabinet = new Cabinet();
        cabinet.setNom(demande.getNomCabinet());
        cabinet.setAdresse(demande.getAdresseCabinet());
        cabinet.setTel(demande.getTelCabinet());
        cabinet.setEmail(demande.getEmailCabinet());
        cabinet.setLogo(demande.getLogoCabinet());
        cabinet.setSpecialite(demande.getSpecialite());
        cabinet.setActif(true); // cabinet actif dès approbation

        Cabinet savedCabinet = cabinetRepository.save(cabinet);

        // 2️⃣ Créer l’utilisateur médecin
        Utilisateur medecin = new Utilisateur();
        medecin.setNom(demande.getNomMedecin());
        medecin.setPrenom(demande.getPrenomMedecin());
        medecin.setLogin(demande.getLoginMedecin());
        medecin.setEmail(demande.getEmailMedecin());
        medecin.setNumTel(demande.getTelMedecin());
        medecin.setRole(Utilisateur.Role.MEDECIN);
        medecin.setSignature(demande.getSignatureMedecin());
        utilisateurService.creerUtilisateur(
                medecin,
                savedCabinet.getNom() // ou demande.getNomCabinet()
        );


        // 3️⃣ Créer l’utilisateur secrétaire si infos présentes
        if (demande.getNomSecretaire() != null && !demande.getNomSecretaire().isEmpty()) {
            Utilisateur secretaire = new Utilisateur();
            secretaire.setNom(demande.getNomSecretaire());
            secretaire.setPrenom(demande.getPrenomSecretaire());
            secretaire.setLogin(demande.getLoginSecretaire());
            secretaire.setEmail(demande.getEmailSecretaire());
            secretaire.setNumTel(demande.getTelSecretaire());
            secretaire.setRole(Utilisateur.Role.SECRETAIRE);
            utilisateurService.creerUtilisateur(
                    secretaire,
                    savedCabinet.getNom()
            );

        }

        // 4️⃣ Créer la facture initiale pour le cabinet
        adminFactureService.createFactureForCabinet(savedCabinet);

        return savedCabinet;
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

        if (!etatPrecedent && actif) {
            adminFactureService.createFactureForCabinet(savedCabinet);
        }

        return savedCabinet;
    }

    // Recherche par nom
    public List<Cabinet> searchByNom(String nom) {
        return cabinetRepository.findByNomContainingIgnoreCase(nom);
    }
}
