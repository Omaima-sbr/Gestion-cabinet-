package com.cabinetmedical.gestioncabinet.service.admin;

import com.cabinetmedical.gestioncabinet.dto.admin.DemandeDTO;
import com.cabinetmedical.gestioncabinet.model.DemandeCreationCabinet;
import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import com.cabinetmedical.gestioncabinet.repository.admin.DemandeCreationCabinetRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DemandeCreationCabinetService {

    private final DemandeCreationCabinetRepository demandeRepository;
    private final UtilisateurService utilisateurService;
    private final EmailService emailService;
    private final CabinetService cabinetService;

    public DemandeCreationCabinetService(DemandeCreationCabinetRepository demandeRepository,
                                         UtilisateurService utilisateurService,
                                         EmailService emailService,
                                         CabinetService cabinetService) {
        this.demandeRepository = demandeRepository;
        this.utilisateurService = utilisateurService;
        this.emailService = emailService;
        this.cabinetService = cabinetService;
    }

    // Récupérer toutes les demandes
    public List<DemandeDTO> getAllDemandes() {
        return demandeRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Récupérer les demandes par statut
    public List<DemandeDTO> getDemandesByStatut(DemandeCreationCabinet.Statut statut) {
        return demandeRepository.findByStatut(statut).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Approuver une demande
    public void approuverDemande(Integer id, Utilisateur admin) {
        DemandeCreationCabinet demande = demandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));

        if (demande.getStatut() != DemandeCreationCabinet.Statut.EN_ATTENTE) {
            throw new RuntimeException("Demande déjà traitée");
        }

        // Créer le cabinet et les utilisateurs
        cabinetService.creerCabinetEtUtilisateurs(demande);

        // Mettre à jour la demande
        demande.setStatut(DemandeCreationCabinet.Statut.APPROUVEE);
        demande.setAdminTraitant(admin);
        demande.setDateTraitement(LocalDateTime.now());
        demandeRepository.save(demande);
    }

    // Rejeter une demande
    public void rejeterDemande(Integer id, String commentaire, Utilisateur admin) {
        DemandeCreationCabinet demande = demandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Demande non trouvée"));

        if (demande.getStatut() != DemandeCreationCabinet.Statut.EN_ATTENTE) {
            throw new RuntimeException("Demande déjà traitée");
        }

        demande.setStatut(DemandeCreationCabinet.Statut.REJETEE);
        demande.setCommentaireAdmin(commentaire);
        demande.setAdminTraitant(admin);
        demande.setDateTraitement(LocalDateTime.now());
        demandeRepository.save(demande);

        // Envoyer email de refus
        emailService.sendDemandeRefuseNotification(demande.getEmailMedecin(), commentaire);
    }

    // Convertir entity en DTO
    private DemandeDTO toDTO(DemandeCreationCabinet demande) {
        return new DemandeDTO(
                demande.getId(),
                demande.getNomCabinet(),
                demande.getSpecialite(),
                demande.getAdresseCabinet(),
                demande.getTelCabinet(),
                demande.getEmailCabinet(),
                demande.getLogoCabinet(),
                demande.getNomMedecin(),
                demande.getPrenomMedecin(),
                demande.getCinMedecin(),
                demande.getTelMedecin(),
                demande.getEmailMedecin(),
                demande.getLoginMedecin(),
                demande.getSignatureMedecin(),
                demande.getNomSecretaire(),
                demande.getPrenomSecretaire(),
                demande.getCinSecretaire(),
                demande.getTelSecretaire(),
                demande.getEmailSecretaire(),
                demande.getLoginSecretaire(),
                demande.getDocumentLicence(),
                demande.getDocumentDiplome(),
                demande.getDocumentCinMedecin(),
                demande.getStatut(),
                demande.getCommentaireAdmin(),
                demande.getDateDemande(),
                demande.getDateTraitement()
        );
    }
}
