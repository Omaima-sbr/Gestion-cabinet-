package com.cabinetmedical.gestioncabinet.service.medecin;

import com.cabinetmedical.gestioncabinet.dto.medecin.MedecinMessagerieDTO;
import com.cabinetmedical.gestioncabinet.dto.medecin.SecretaireDisponibleDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MedecinMessagerieService {
    MedecinMessagerieDTO envoyerMessage(MedecinMessagerieDTO dto, MultipartFile file);
    Page<MedecinMessagerieDTO> getMessagesRecus(Pageable pageable);
    Page<MedecinMessagerieDTO> getMessagesEnvoyes(Pageable pageable);
    MedecinMessagerieDTO getMessageById(Integer id);
    MedecinMessagerieDTO marquerCommeLu(Integer id);
    Long countMessagesNonLus();
    void supprimerMessage(Integer id);
    List<MedecinMessagerieDTO> getConversation(Integer utilisateurId);
    List<SecretaireDisponibleDTO> getSecretairesDisponibles();
}