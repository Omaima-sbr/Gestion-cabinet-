package com.cabinetmedical.gestioncabinet.service.admin;

import com.cabinetmedical.gestioncabinet.model.Cabinet;
import com.cabinetmedical.gestioncabinet.model.DemandeCreationCabinet;
import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import com.cabinetmedical.gestioncabinet.repository.admin.CabinetRepository;
import com.cabinetmedical.gestioncabinet.repository.admin.DemandeCreationCabinetRepository;
import com.cabinetmedical.gestioncabinet.repository.admin.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DemandeCreationCabinetService {

    @Autowired
    private DemandeCreationCabinetRepository demandeRepo;

    @Autowired
    private CabinetRepository cabinetRepo;

    @Autowired
    private UtilisateurRepository utilisateurRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 1️⃣ Récupérer toutes les demandes
    public List<DemandeCreationCabinet> getAllDemandes() {
        return demandeRepo.findAll();
    }

    // 2️⃣ Récupérer les demandes par statut
    public List<DemandeCreationCabinet> getDemandesByStatut(DemandeCreationCabinet.Statut statut) {
        return demandeRepo.findByStatut(statut);
    }

    // 3️⃣ Approuver une demande
    @Transactional
    public void approuverDemande(Integer demandeId, Utilisateur admin) throws Exception {
        Optional<DemandeCreationCabinet> optDemande = demandeRepo.findById(demandeId);

        if (optDemande.isEmpty()) {
            throw new Exception("Demande non trouvée");
        }

        DemandeCreationCabinet demande = optDemande.get();

        // 3.1 Créer le cabinet
        Cabinet cabinet = new Cabinet();
        cabinet.setNom(demande.getNomCabinet());
        cabinet.setSpecialite(demande.getSpecialite());
        cabinet.setAdresse(demande.getAdresseCabinet());
        cabinet.setTel(demande.getTelCabinet());
        cabinet.setLogo(demande.getLogoCabinet());
        cabinetRepo.save(cabinet);

        // 3.2 Créer le médecin associé
        Utilisateur medecin = new Utilisateur();
        medecin.setNom(demande.getNomMedecin());
        medecin.setPrenom(demande.getPrenomMedecin());
        medecin.setLogin(demande.getLoginMedecin());
        medecin.setPwd(passwordEncoder.encode(demande.getPwdMedecin()));
        medecin.setRole(Utilisateur.Role.MEDECIN);
        medecin.setNumTel(demande.getTelMedecin());
        medecin.setSignature(demande.getSignatureMedecin());
        medecin.setCabinet(cabinet);
        utilisateurRepo.save(medecin);

        // 3.3 Créer la secrétaire si renseignée
        if (demande.getNomSecretaire() != null) {
            Utilisateur secretaire = new Utilisateur();
            secretaire.setNom(demande.getNomSecretaire());
            secretaire.setPrenom(demande.getPrenomSecretaire());
            secretaire.setLogin(demande.getLoginSecretaire());
            secretaire.setPwd(passwordEncoder.encode(demande.getPwdSecretaire()));
            secretaire.setRole(Utilisateur.Role.SECRETAIRE);
            secretaire.setNumTel(demande.getTelSecretaire());
            secretaire.setCabinet(cabinet);
            utilisateurRepo.save(secretaire);
        }

        // 3.4 Mettre à jour la demande
        demande.setStatut(DemandeCreationCabinet.Statut.APPROUVEE);
        demande.setAdminTraitant(admin);
        demande.setDateTraitement(LocalDateTime.now());
        demandeRepo.save(demande);
    }

    // 4️⃣ Rejeter une demande
    @Transactional
    public void rejeterDemande(Integer demandeId, String commentaire, Utilisateur admin) throws Exception {
        Optional<DemandeCreationCabinet> optDemande = demandeRepo.findById(demandeId);

        if (optDemande.isEmpty()) {
            throw new Exception("Demande non trouvée");
        }

        DemandeCreationCabinet demande = optDemande.get();
        demande.setStatut(DemandeCreationCabinet.Statut.REJETEE);
        demande.setCommentaireAdmin(commentaire);
        demande.setAdminTraitant(admin);
        demande.setDateTraitement(LocalDateTime.now());
        demandeRepo.save(demande);
    }
}
