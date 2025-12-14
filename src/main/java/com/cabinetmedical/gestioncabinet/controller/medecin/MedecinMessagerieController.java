package com.cabinetmedical.gestioncabinet.controller.medecin;

import com.cabinetmedical.gestioncabinet.dto.medecin.MedecinMessagerieDTO;
import com.cabinetmedical.gestioncabinet.dto.medecin.SecretaireDisponibleDTO;
import com.cabinetmedical.gestioncabinet.service.medecin.MedecinMessagerieService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/medecin/messagerie")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@PreAuthorize("hasAuthority('MEDECIN')")
public class MedecinMessagerieController {

    private final MedecinMessagerieService messagerieService;

    /**
     * Envoyer un message texte
     */
    @PostMapping
    public ResponseEntity<MedecinMessagerieDTO> envoyerMessage(@RequestBody MedecinMessagerieDTO dto) {
        log.info("📤 [Controller] Envoi message");
        MedecinMessagerieDTO saved = messagerieService.envoyerMessage(dto, null);
        return ResponseEntity.ok(saved);
    }

    /**
     * Envoyer un message avec pièce jointe
     */
    @PostMapping("/avec-fichier")
    public ResponseEntity<MedecinMessagerieDTO> envoyerMessageAvecFichier(
            @RequestPart("message") MedecinMessagerieDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        log.info("📎 [Controller] Envoi message avec fichier");
        MedecinMessagerieDTO saved = messagerieService.envoyerMessage(dto, file);
        return ResponseEntity.ok(saved);
    }

    /**
     * Messages reçus (paginés)
     */
    @GetMapping("/recus")
    public ResponseEntity<Page<MedecinMessagerieDTO>> getMessagesRecus(Pageable pageable) {
        log.info("📥 [Controller] Récupération messages reçus");
        Page<MedecinMessagerieDTO> messages = messagerieService.getMessagesRecus(pageable);
        return ResponseEntity.ok(messages);
    }

    /**
     * Messages envoyés (paginés)
     */
    @GetMapping("/envoyes")
    public ResponseEntity<Page<MedecinMessagerieDTO>> getMessagesEnvoyes(Pageable pageable) {
        log.info("📤 [Controller] Récupération messages envoyés");
        Page<MedecinMessagerieDTO> messages = messagerieService.getMessagesEnvoyes(pageable);
        return ResponseEntity.ok(messages);
    }

    /**
     * Message par ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<MedecinMessagerieDTO> getMessageById(@PathVariable Integer id) {
        log.info("🔍 [Controller] Récupération message ID: {}", id);
        MedecinMessagerieDTO message = messagerieService.getMessageById(id);
        return ResponseEntity.ok(message);
    }

    /**
     * Marquer comme lu
     */
    @PatchMapping("/{id}/marquer-lu")
    public ResponseEntity<MedecinMessagerieDTO> marquerCommeLu(@PathVariable Integer id) {
        log.info("✅ [Controller] Marquage lu message ID: {}", id);
        MedecinMessagerieDTO message = messagerieService.marquerCommeLu(id);
        return ResponseEntity.ok(message);
    }

    /**
     * Compter messages non lus
     */
    @GetMapping("/non-lus/count")
    public ResponseEntity<Long> countMessagesNonLus() {
        Long count = messagerieService.countMessagesNonLus();
        return ResponseEntity.ok(count);
    }

    /**
     * Supprimer message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerMessage(@PathVariable Integer id) {
        log.info("🗑️ [Controller] Suppression message ID: {}", id);
        messagerieService.supprimerMessage(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Conversation avec un utilisateur
     */
    @GetMapping("/conversation/{utilisateurId}")
    public ResponseEntity<List<MedecinMessagerieDTO>> getConversation(@PathVariable Integer utilisateurId) {
        log.info("💬 [Controller] Récupération conversation avec: {}", utilisateurId);
        List<MedecinMessagerieDTO> messages = messagerieService.getConversation(utilisateurId);
        return ResponseEntity.ok(messages);
    }

    /**
     * Liste des secrétaires disponibles
     */
    @GetMapping("/secretaires")
    public ResponseEntity<List<SecretaireDisponibleDTO>> getSecretairesDisponibles() {
        log.info("👥 [Controller] Récupération secrétaires disponibles");
        List<SecretaireDisponibleDTO> secretaires = messagerieService.getSecretairesDisponibles();
        return ResponseEntity.ok(secretaires);
    }
}