package com.cabinetmedical.gestioncabinet.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Consultation", indexes = {
        @Index(name = "idx_patient", columnList = "id_patient"),
        @Index(name = "idx_date", columnList = "date_consultation")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_consultation")
    private Integer idConsultation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Type type;

    @Column(name = "date_consultation", nullable = false)
    private LocalDate dateConsultation;

    @Column(name = "examen_clinique", columnDefinition = "TEXT")
    private String examenClinique;

    @Column(name = "examen_supplementaire", columnDefinition = "TEXT")
    private String examenSupplementaire;

    @Column(columnDefinition = "TEXT")
    private String diagnostic;

    @Column(columnDefinition = "TEXT")
    private String traitement;

    @Column(columnDefinition = "TEXT")
    private String observations;

    @OneToOne
    @JoinColumn(name = "id_rendez_vous", unique = true,
            foreignKey = @ForeignKey(name = "FK_Consultation_RendezVous"))
    private RendezVous rendezVous;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_patient", nullable = false,
            foreignKey = @ForeignKey(name = "FK_Consultation_Patient"))
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_medecin", nullable = false,
            foreignKey = @ForeignKey(name = "FK_Consultation_Medecin"))
    private Utilisateur medecin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_dossier", nullable = false,
            foreignKey = @ForeignKey(name = "FK_Consultation_Dossier"))
    private DossierMedical dossier;

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    @OneToMany(mappedBy = "consultation", cascade = CascadeType.ALL)
    private List<Ordonnance> ordonnances;

    @OneToOne(mappedBy = "consultation", cascade = CascadeType.ALL)
    private Facture facture;

    public enum Type {
        CONSULTATION, CONTROLE
    }

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        if (dateConsultation == null) {
            dateConsultation = LocalDate.now();
        }
    }
}

