package com.cabinetmedical.gestioncabinet.controller.admin;

import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import com.cabinetmedical.gestioncabinet.service.admin.UtilisateurService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    // ✅ Créer un nouvel utilisateur
    @PostMapping
    public ResponseEntity<Utilisateur> creerUtilisateur(@RequestBody Utilisateur utilisateur) {
        Utilisateur saved = utilisateurService.creerUtilisateur(utilisateur);
        return ResponseEntity.ok(saved);
    }


    // ✅ Récupérer tous les utilisateurs
    @GetMapping
    public ResponseEntity<List<Utilisateur>> getAllUtilisateurs() {
        List<Utilisateur> utilisateurs = utilisateurService.getAllUtilisateursActifs();
        return ResponseEntity.ok(utilisateurs);
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
