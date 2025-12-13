package com.cabinetmedical.gestioncabinet.service.admin;

import com.cabinetmedical.gestioncabinet.model.Utilisateur;
import com.cabinetmedical.gestioncabinet.repository.admin.UtilisateurRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.security.SecureRandom;
import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService; // Service pour envoyer les emails

    public UtilisateurService(UtilisateurRepository utilisateurRepository,
                              PasswordEncoder passwordEncoder,
                              EmailService emailService) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // Méthode pour générer un mot de passe temporaire aléatoire
    private String generateTempPassword(int length) {
        final String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int idx = random.nextInt(chars.length());
            sb.append(chars.charAt(idx));
        }
        return sb.toString();
    }

    // Crée un utilisateur, génère mot de passe temporaire, l'encode, sauvegarde et envoie par email
    public Utilisateur creerUtilisateur(Utilisateur utilisateur) {
        // Vérifier si le login/email existe déjà
        if (utilisateurRepository.existsByLogin(utilisateur.getLogin())) {
            throw new RuntimeException("Un utilisateur avec ce login existe déjà.");
        }

        // Générer un mot de passe temporaire (ici 8 caractères)
        String tempPwd = generateTempPassword(8);

        // Encoder le mot de passe avant de le stocker
        utilisateur.setPwd(passwordEncoder.encode(tempPwd));

        // Soft delete actif par défaut
        utilisateur.setActif(true);
        // Statut par défaut
        utilisateur.setStatut("ACTIF");

        // Sauvegarder l'utilisateur
        Utilisateur saved = utilisateurRepository.save(utilisateur);

        // Envoyer le mot de passe temporaire par email
        try {
            emailService.sendTemporaryPassword(saved.getLogin(), tempPwd);
        } catch (Exception e) {
            throw new RuntimeException("Utilisateur créé mais envoi email échoué : " + e.getMessage(), e);
        }

        return saved;
    }

    // Récupérer tous les utilisateurs
    public List<Utilisateur> getAllUtilisateursActifs() {
        return utilisateurRepository.findByActifTrue();
    }

    // Récupérer un utilisateur par ID
    public Optional<Utilisateur> getUtilisateurById(Integer id) {
        return utilisateurRepository.findById(id);
    }

    // Mettre à jour un utilisateur
    public Utilisateur updateUtilisateur(Integer id, Utilisateur update) {
        Utilisateur exist = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        exist.setNom(update.getNom());
        exist.setPrenom(update.getPrenom());
        exist.setNumTel(update.getNumTel());
        exist.setRole(update.getRole());
        exist.setStatut(update.getStatut()); // Mettre à jour le statut (ACTIF / INACTIF)
        exist.setSignature(update.getSignature());
        return utilisateurRepository.save(exist);
    }
// delete user
    public void supprimerUtilisateur(Integer id) {
        utilisateurRepository.findById(id).ifPresent(u -> {
            u.setActif(false); // soft delete
            utilisateurRepository.save(u);
        });
    }


    // Désactiver un utilisateur
    public void desactiverUtilisateur(Integer id) {
        utilisateurRepository.findById(id).ifPresent(u -> {
            u.setStatut("INACTIF");
            utilisateurRepository.save(u);
        });
    }

    // Activer un utilisateur
    public void activerUtilisateur(Integer id) {
        utilisateurRepository.findById(id).ifPresent(u -> {
            u.setStatut("ACTIF");
            utilisateurRepository.save(u);
        });
    }
}
