
package com.cabinetmedical.gestioncabinet.dto.medecin;

import com.cabinetmedical.gestioncabinet.model.Ordonnance;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdonnanceDTO {
    private Integer id;
    private Ordonnance.Type type;
    private LocalDateTime date;
    private String contenu;
    private Integer idConsultation;

    // Pour affichage patient
    private Integer idPatient;
    private String patientNom;
    private String patientPrenom;
    private String patientCin;

    // Pour affichage médecin
    private Integer idMedecin;
    private String medecinNom;
    private String medecinPrenom;

    // Pour ordonnances examens
    private List<OrdonnanceExamenDTO> examens;
}