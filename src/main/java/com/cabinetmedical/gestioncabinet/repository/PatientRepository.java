package com.cabinetmedical.gestioncabinet.repository;

import com.cabinetmedical.gestioncabinet.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    // Rechercher par CIN
    Optional<Patient> findByCin(String cin);

    Optional<Patient> findById(Integer Id);


    // Rechercher par nom ou prénom (contient)
    List<Patient> findByNomContainingOrPrenomContaining(String nom, String prenom);
}