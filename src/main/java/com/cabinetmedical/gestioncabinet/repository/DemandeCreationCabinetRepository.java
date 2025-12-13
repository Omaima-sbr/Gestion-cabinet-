package com.cabinetmedical.gestioncabinet.repository;

import com.cabinetmedical.gestioncabinet.model.DemandeCreationCabinet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DemandeCreationCabinetRepository extends JpaRepository<DemandeCreationCabinet, Integer> {
    List<DemandeCreationCabinet> findByStatutOrderByDateDemandeDesc(DemandeCreationCabinet.Statut statut);
    boolean existsByLoginMedecin(String loginMedecin);
    boolean existsByEmailMedecin(String emailMedecin);
}