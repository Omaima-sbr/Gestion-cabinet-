package com.cabinetmedical.gestioncabinet.dto.admin;

import com.cabinetmedical.gestioncabinet.model.DemandeCreationCabinet;
import java.time.LocalDateTime;

public record DemandeDTO(
        Integer id,

        // Cabinet
        String nomCabinet,
        String specialite,
        String adresseCabinet,
        String telCabinet,
        String emailCabinet,
        String logoCabinet,

        // Médecin
        String nomMedecin,
        String prenomMedecin,
        String cinMedecin,
        String telMedecin,
        String emailMedecin,
        String loginMedecin,
        String signatureMedecin,

        // Secrétaire
        String nomSecretaire,
        String prenomSecretaire,
        String cinSecretaire,
        String telSecretaire,
        String emailSecretaire,
        String loginSecretaire,

        // Documents
        String documentLicence,
        String documentDiplome,
        String documentCinMedecin,

        // Statut et dates
        DemandeCreationCabinet.Statut statut,
        String commentaireAdmin,
        LocalDateTime dateDemande,
        LocalDateTime dateTraitement
) {}
