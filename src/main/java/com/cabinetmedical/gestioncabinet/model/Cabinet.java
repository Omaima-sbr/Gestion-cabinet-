package com.cabinetmedical.gestioncabinet.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
// le nom du cabinet est unique
@Table(
        name = "Cabinet",
        uniqueConstraints = @UniqueConstraint(columnNames = "nom", name = "uk_cabinet_nom")
)

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cabinet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 255)
    private String logo;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(length = 100)
    private String specialite;

    @Column(length = 255)
    private String adresse;

    @Column(length = 20)
    private String tel;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean actif = true;

    @Column(name = "date_creation", nullable = false, updatable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    @OneToMany(mappedBy = "cabinet", cascade = CascadeType.ALL)
    private List<Utilisateur> utilisateurs;

    @OneToMany(mappedBy = "cabinet", cascade = CascadeType.ALL)
    private List<Patient> patients;

    @OneToMany(mappedBy = "cabinet", cascade = CascadeType.ALL)
    private List<Facture> factures;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
        if (actif == null) {
            actif = true;
        }
    }

    public boolean isActif() {
        return Boolean.TRUE.equals(this.actif);
    }
}