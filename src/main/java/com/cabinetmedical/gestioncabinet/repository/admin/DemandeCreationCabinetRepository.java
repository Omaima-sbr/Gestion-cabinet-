package com.cabinetmedical.gestioncabinet.repository.admin;

import com.cabinetmedical.gestioncabinet.model.DemandeCreationCabinet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface DemandeCreationCabinetRepository extends JpaRepository<DemandeCreationCabinet,Integer> {
    List<DemandeCreationCabinet> findByStatut(DemandeCreationCabinet.Statut statut);
}
