package com.cabinetmedical.gestioncabinet.config;

import com.cabinetmedical.gestioncabinet.model.*;
import com.cabinetmedical.gestioncabinet.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final CabinetRepository cabinetRepository;
    private final PatientRepository patientRepository;
    private final RendezVousRepository rendezVousRepository;
    private final FactureRepository factureRepository;
    private final DemandeCreationCabinetRepository demandeRepository;
    private final ConsultationRepository consultationRepository;
    private final DossierMedicalRepository dossierMedicalRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        // Vérifier si des données existent déjà
        if (utilisateurRepository.count() > 0) {
            log.info("⚠️  Les données existent déjà. Initialisation ignorée.");
            return;
        }

        log.info("🚀 Initialisation des données de test...");

        try {
            // 1. Créer un Cabinet
            Cabinet cabinet = createCabinet();
            log.info("✅ Cabinet créé: {}", cabinet.getNom());

            // 2. Créer un Administrateur
            Utilisateur admin = createAdmin();
            log.info("✅ Administrateur créé: {}", admin.getLogin());

            // 3. Créer un Médecin
            Utilisateur medecin = createMedecin(cabinet);
            log.info("✅ Médecin créé: Dr. {} {}", medecin.getNom(), medecin.getPrenom());

            // 4. Créer une Secrétaire
            Utilisateur secretaire = createSecretaire(cabinet);
            log.info("✅ Secrétaire créée: {} {}", secretaire.getNom(), secretaire.getPrenom());


            // 5. Créer des Patients
            Patient patient1 = createPatient1(cabinet);
            Patient patient2 = createPatient2(cabinet);
            log.info("✅ {} patients créés", 2);

            // 6. Créer des Dossiers Médicaux
            DossierMedical dossier1 = createDossierMedical(patient1);
            DossierMedical dossier2 = createDossierMedical(patient2);
            log.info("✅ Dossiers médicaux créés");

            // 7. Créer des Rendez-vous
            RendezVous rdv1 = createRendezVous1(patient1, medecin);
            RendezVous rdv2 = createRendezVous2(patient2, medecin);
            RendezVous rdv3 = createRendezVous3(patient1, medecin);
            log.info("✅ {} rendez-vous créés", 3);

            // 8. Créer des Consultations
            createConsultation(rdv3, patient1, medecin, dossier1);
            log.info("✅ Consultations créées");

            // 9. Créer des Factures
            createFacture1(patient1, cabinet);
            createFacture2(patient2, cabinet);
            log.info("✅ Factures créées");

            // 10. Créer des Demandes de Cabinet
            createDemandeEnAttente();
            createDemandeApprouvee(admin);
            createDemandeRejetee(admin);
            log.info("✅ Demandes de création de cabinet créées");

            log.info("\n🎉 Initialisation des données terminée avec succès!");
            printCredentials();

        } catch (Exception e) {
            log.error("❌ Erreur lors de l'initialisation des données: {}", e.getMessage(), e);
            throw e;
        }
    }

    private Cabinet createCabinet() {
        Cabinet cabinet = new Cabinet();
        cabinet.setNom("Cabinet Médical Al Amal");
        cabinet.setSpecialite("Médecine Générale");
        cabinet.setAdresse("123 Avenue Mohammed V, Fès");
        cabinet.setTel("0535123456");
        cabinet.setActif(true);
        return cabinetRepository.save(cabinet);
    }

    private Utilisateur createAdmin() {
        Utilisateur admin = new Utilisateur();
        admin.setNom("Admin");
        admin.setPrenom("System");
        admin.setNumTel("0663456789");
        admin.setLogin("admin");
        admin.setPwd(passwordEncoder.encode("admin123"));
        admin.setRole(Utilisateur.Role.ADMINISTRATEUR);
        admin.setActif(true);
        return utilisateurRepository.save(admin);
    }

    private Utilisateur createMedecin(Cabinet cabinet) {
        Utilisateur medecin = new Utilisateur();
        medecin.setNom("Alami");
        medecin.setPrenom("Ahmed");
        medecin.setNumTel("0661234567");
        medecin.setLogin("dr.alami");
        medecin.setPwd(passwordEncoder.encode("medecin123"));
        medecin.setRole(Utilisateur.Role.MEDECIN);
        medecin.setActif(true);
        medecin.setCabinet(cabinet);
        medecin.setSignature("signature_dr_alami.png");
        return utilisateurRepository.save(medecin);
    }

    private Utilisateur createSecretaire(Cabinet cabinet) {
        Utilisateur secretaire = new Utilisateur();
        secretaire.setNom("Bennani");
        secretaire.setPrenom("Fatima");
        secretaire.setNumTel("0662345678");
        secretaire.setLogin("f.bennani");
        secretaire.setPwd(passwordEncoder.encode("secretaire123"));
        secretaire.setRole(Utilisateur.Role.SECRETAIRE);
        secretaire.setActif(true);
        secretaire.setCabinet(cabinet);
        return utilisateurRepository.save(secretaire);
    }

    private Patient createPatient1(Cabinet cabinet) {
        Patient patient = new Patient();
        patient.setNom("Tazi");
        patient.setPrenom("Mohammed");
        patient.setCin("EF345678");
        patient.setDateNaissance(LocalDate.of(1985, 5, 15));
        patient.setSexe(Patient.Sexe.HOMME); // Corrigé: HOMME au lieu de MASCULIN
        patient.setAdresse("45 Rue Atlas, Fès");
        patient.setNumTel("0664567890");
        patient.setTypeMutuelle("CNSS");
        patient.setCabinet(cabinet);
        return patientRepository.save(patient);
    }

    private Patient createPatient2(Cabinet cabinet) {
        Patient patient = new Patient();
        patient.setNom("Idrissi");
        patient.setPrenom("Aisha");
        patient.setCin("GH901234");
        patient.setDateNaissance(LocalDate.of(1990, 8, 22));
        patient.setSexe(Patient.Sexe.FEMME); // Corrigé: FEMME au lieu de FEMININ
        patient.setAdresse("78 Boulevard Hassan II, Fès");
        patient.setNumTel("0665678901");
        patient.setTypeMutuelle("RAMED");
        patient.setCabinet(cabinet);
        return patientRepository.save(patient);
    }

    private DossierMedical createDossierMedical(Patient patient) {
        DossierMedical dossier = new DossierMedical();
        dossier.setPatient(patient);
        dossier.setDateCreation(LocalDate.now());
        // Utiliser les noms corrects des colonnes du modèle
        dossier.setAllergies("Aucune allergie connue");
        dossier.setAntMedicaux("Aucun antécédent médical");
        dossier.setAntChirug("Aucune chirurgie antérieure");
        dossier.setTraitement("Aucun traitement en cours");
        dossier.setHabitudes("Mode de vie sain");
        return dossierMedicalRepository.save(dossier);
    }

    private RendezVous createRendezVous1(Patient patient, Utilisateur medecin) {
        RendezVous rdv = new RendezVous();
        rdv.setDateRdv(LocalDate.now().plusDays(1));
        rdv.setHeureRdv(LocalTime.of(9, 0));
        rdv.setMotif(RendezVous.Motif.CONSULTATION);
        rdv.setStatut(RendezVous.Statut.CONFIRME);
        rdv.setNotes("Consultation de routine");
        rdv.setPatient(patient);
        rdv.setMedecin(medecin);
        return rendezVousRepository.save(rdv);
    }

    private RendezVous createRendezVous2(Patient patient, Utilisateur medecin) {
        RendezVous rdv = new RendezVous();
        rdv.setDateRdv(LocalDate.now().plusDays(2));
        rdv.setHeureRdv(LocalTime.of(14, 30));
        rdv.setMotif(RendezVous.Motif.CONTROLE);
        rdv.setStatut(RendezVous.Statut.EN_ATTENTE);
        rdv.setNotes("Contrôle post-traitement");
        rdv.setPatient(patient);
        rdv.setMedecin(medecin);
        return rendezVousRepository.save(rdv);
    }

    private RendezVous createRendezVous3(Patient patient, Utilisateur medecin) {
        RendezVous rdv = new RendezVous();
        rdv.setDateRdv(LocalDate.now().minusDays(5));
        rdv.setHeureRdv(LocalTime.of(10, 0));
        rdv.setMotif(RendezVous.Motif.CONSULTATION);
        rdv.setStatut(RendezVous.Statut.TERMINE);
        rdv.setNotes("Consultation terminée");
        rdv.setPatient(patient);
        rdv.setMedecin(medecin);
        return rendezVousRepository.save(rdv);
    }

    private void createConsultation(RendezVous rdv, Patient patient, Utilisateur medecin, DossierMedical dossier) {
        Consultation consultation = new Consultation();
        consultation.setRendezVous(rdv);
        consultation.setPatient(patient);
        consultation.setMedecin(medecin);
        consultation.setDossier(dossier); // Ajouter le dossier médical
        consultation.setType(Consultation.Type.CONSULTATION); // Ajouter le type
        consultation.setDateConsultation(LocalDate.now().minusDays(5));
        consultation.setExamenClinique("Température: 38.5°C, Tension: 120/80");
        consultation.setDiagnostic("Grippe saisonnière");
        consultation.setTraitement("Paracétamol 1g x3/jour pendant 5 jours");
        consultation.setObservations("Repos conseillé, boire beaucoup d'eau");
        consultationRepository.save(consultation);
    }

    private void createFacture1(Patient patient, Cabinet cabinet) {
        Facture facture = new Facture();
        facture.setMontant(new BigDecimal("300.00"));
        facture.setModePaiement(Facture.ModePaiement.ESPECES);
        facture.setStatut(Facture.Statut.PAYEE);
        facture.setDateEmission(LocalDate.now().minusDays(5));
        facture.setDatePaiement(LocalDate.now().minusDays(5));
        facture.setPatient(patient);
        facture.setCabinet(cabinet);
        factureRepository.save(facture);
    }

    private void createFacture2(Patient patient, Cabinet cabinet) {
        Facture facture = new Facture();
        facture.setMontant(new BigDecimal("250.00"));
        facture.setModePaiement(Facture.ModePaiement.CARTE);
        facture.setStatut(Facture.Statut.EN_ATTENTE);
        facture.setDateEmission(LocalDate.now());
        facture.setPatient(patient);
        facture.setCabinet(cabinet);
        factureRepository.save(facture);
    }

    private void createDemandeEnAttente() {
        DemandeCreationCabinet demande = new DemandeCreationCabinet();
        demande.setNomCabinet("Cabinet Dentaire Sourire");
        demande.setSpecialite("Dentisterie");
        demande.setAdresseCabinet("15 Rue de la Liberté, Fès");
        demande.setTelCabinet("0535888999");
        demande.setEmailCabinet("contact@dentaire-sourire.ma");

        demande.setNomMedecin("Amrani");
        demande.setPrenomMedecin("Karim");
        demande.setCinMedecin("IJ567890");
        demande.setTelMedecin("0666777888");
        demande.setEmailMedecin("k.amrani@email.ma");
        demande.setLoginMedecin("k.amrani");
        demande.setPwdMedecin(passwordEncoder.encode("password123"));

        demande.setStatut(DemandeCreationCabinet.Statut.EN_ATTENTE);
        demande.setDocumentLicence("licence_amrani.pdf");
        demande.setDocumentDiplome("diplome_amrani.pdf");
        demande.setDocumentCinMedecin("cin_amrani.pdf");

        demandeRepository.save(demande);
    }

    private void createDemandeApprouvee(Utilisateur admin) {
        DemandeCreationCabinet demande = new DemandeCreationCabinet();
        demande.setNomCabinet("Cabinet Pédiatrique Les Enfants");
        demande.setSpecialite("Pédiatrie");
        demande.setAdresseCabinet("88 Avenue Hassan II, Fès");
        demande.setTelCabinet("0535777666");
        demande.setEmailCabinet("contact@pediatrie-enfants.ma");

        demande.setNomMedecin("Fassi");
        demande.setPrenomMedecin("Leila");
        demande.setCinMedecin("KL234567");
        demande.setTelMedecin("0667888999");
        demande.setEmailMedecin("l.fassi@email.ma");
        demande.setLoginMedecin("l.fassi");
        demande.setPwdMedecin(passwordEncoder.encode("password123"));

        demande.setStatut(DemandeCreationCabinet.Statut.APPROUVEE);
        demande.setDateTraitement(LocalDateTime.now().minusDays(10));
        demande.setAdminTraitant(admin);
        demande.setCommentaireAdmin("Dossier complet. Demande approuvée.");
        demande.setDocumentLicence("licence_fassi.pdf");
        demande.setDocumentDiplome("diplome_fassi.pdf");
        demande.setDocumentCinMedecin("cin_fassi.pdf");

        demandeRepository.save(demande);
    }

    private void createDemandeRejetee(Utilisateur admin) {
        DemandeCreationCabinet demande = new DemandeCreationCabinet();
        demande.setNomCabinet("Cabinet Test Incomplet");
        demande.setSpecialite("Médecine Générale");
        demande.setAdresseCabinet("Adresse test");
        demande.setTelCabinet("0535999000");
        demande.setEmailCabinet("test@cabinet.ma");

        demande.setNomMedecin("Test");
        demande.setPrenomMedecin("Medecin");
        demande.setCinMedecin("MN890123");
        demande.setTelMedecin("0668999000");
        demande.setEmailMedecin("test.medecin@email.ma");
        demande.setLoginMedecin("test.medecin");
        demande.setPwdMedecin(passwordEncoder.encode("password123"));

        demande.setStatut(DemandeCreationCabinet.Statut.REJETEE);
        demande.setDateTraitement(LocalDateTime.now().minusDays(15));
        demande.setAdminTraitant(admin);
        demande.setCommentaireAdmin("Documents manquants. Licence médicale non fournie.");

        demandeRepository.save(demande);
    }

    private void printCredentials() {
        log.info("\n╔════════════════════════════════════════════════════════╗");
        log.info("║         COMPTES CRÉÉS - IDENTIFIANTS DE CONNEXION      ║");
        log.info("╠════════════════════════════════════════════════════════╣");
        log.info("║                                                         ║");
        log.info("║  👨‍⚕️  MÉDECIN                                           ║");
        log.info("║     Login    : dr.alami                                ║");
        log.info("║     Password : medecin123                              ║");
        log.info("║                                                         ║");
        log.info("║  👩‍💼 SECRÉTAIRE                                         ║");
        log.info("║     Login    : f.bennani                               ║");
        log.info("║     Password : secretaire123                           ║");
        log.info("║                                                         ║");
        log.info("║  🔐 ADMINISTRATEUR                                      ║");
        log.info("║     Login    : admin                                   ║");
        log.info("║     Password : admin123                                ║");
        log.info("║                                                         ║");
        log.info("╠════════════════════════════════════════════════════════╣");
        log.info("║  📊 DONNÉES CRÉÉES                                      ║");
        log.info("║     • 1 Cabinet médical                                ║");
        log.info("║     • 3 Utilisateurs (Admin, Médecin, Secrétaire)     ║");
        log.info("║     • 2 Patients avec dossiers médicaux               ║");
        log.info("║     • 3 Rendez-vous                                    ║");
        log.info("║     • 1 Consultation                                   ║");
        log.info("║     • 2 Factures                                       ║");
        log.info("║     • 3 Demandes de création de cabinet               ║");
        log.info("║                                                         ║");
        log.info("╠════════════════════════════════════════════════════════╣");
        log.info("║  🌐 APPLICATION                                         ║");
        log.info("║     URL : http://localhost:8080                        ║");
        log.info("║                                                         ║");
        log.info("╚════════════════════════════════════════════════════════╝");
    }
}