package com.cabinetmedical.gestioncabinet.controller.admin;

import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import com.cabinetmedical.gestioncabinet.dto.admin.UtilisateurDTO;
import com.cabinetmedical.gestioncabinet.service.admin.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@PreAuthorize("hasAuthority('ROLE_ADMINISTRATEUR')")public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    // ✅ Créer un nouvel utilisateur
    @PostMapping
    public ResponseEntity<Utilisateur> creerUtilisateur(@RequestBody UtilisateurDTO dto) {

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setLogin(dto.getLogin());
        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setNumTel(dto.getNumTel());
        utilisateur.setRole(dto.getRole());

        Utilisateur saved = utilisateurService.creerUtilisateur(
                utilisateur,
                dto.getNomCabinet() // 👈 nom du cabinet (unique)
        );

        return ResponseEntity.ok(saved);
    }


    // ✅ Récupérer tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<UtilisateurDTO>> getAllUtilisateurs() {
        return ResponseEntity.ok(
                utilisateurService.getAllUtilisateursActifsDTO()
        );
    }


    // ✅ Récupérer un utilisateur par ID
    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable Integer id) {
        return utilisateurService.getUtilisateurById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Mettre à jour un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> updateUtilisateur(
            @PathVariable Integer id,
            @RequestBody Utilisateur utilisateur
    ) {
        Utilisateur updated = utilisateurService.updateUtilisateur(id, utilisateur);
        return ResponseEntity.ok(updated);
    }
    // supprimer un user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerUtilisateur(@PathVariable Integer id) {
        utilisateurService.supprimerUtilisateur(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Désactiver un utilisateur
    @PutMapping("/{id}/desactiver")
    public ResponseEntity<Void> desactiverUtilisateur(@PathVariable Integer id) {
        utilisateurService.desactiverUtilisateur(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Activer un utilisateur
    @PutMapping("/{id}/activer")
    public ResponseEntity<Void> activerUtilisateur(@PathVariable Integer id) {
        utilisateurService.activerUtilisateur(id);
        return ResponseEntity.noContent().build();
    }
}
