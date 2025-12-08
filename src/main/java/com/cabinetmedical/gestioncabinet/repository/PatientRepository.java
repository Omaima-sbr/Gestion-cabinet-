package com.cabinetmedical.gestioncabinet.repository;

/*
import com.cabinetmedical.gestioncabinet.model.Cabinet;
import com.cabinetmedical.gestioncabinet.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {

    Optional<Patient> findByCin(String cin);

    boolean existsByCin(String cin);

    Page<Patient> findByCabinet(Cabinet cabinet, Pageable pageable);

    // ✅ Méthodes pour la recherche sans cabinet (mode dev)

    List<Patient> findByNomContainingIgnoreCase(String nom);

    List<Patient> findByNomContainingIgnoreCaseAndCabinet(String nom, Cabinet cabinet);

    List<Patient> findByNomContainingIgnoreCaseAndPrenomContainingIgnoreCase(String nom, String prenom);

    List<Patient> findByNomContainingIgnoreCaseAndPrenomContainingIgnoreCaseAndCabinet(
            String nom, String prenom, Cabinet cabinet);

    @Query("SELECT p FROM Patient p WHERE p.cabinet = :cabinet " +
            "AND (LOWER(p.nom) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR LOWER(p.prenom) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
            "OR p.cin LIKE CONCAT('%', :searchTerm, '%'))")
    List<Patient> searchPatients(@Param("searchTerm") String searchTerm,
                                 @Param("cabinet") Cabinet cabinet);

    @Query("SELECT COUNT(p) FROM Patient p WHERE p.cabinet = :cabinet")
    Long countByCabinet(@Param("cabinet") Cabinet cabinet);
}
*/

import com.cabinetmedical.gestioncabinet.model.Patient;
import com.cabinetmedical.gestioncabinet.model.Cabinet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {

    // Filtrer par cabinet - ESSENTIEL pour votre cas
    List<Patient> findByCabinet(Cabinet cabinet);
    Page<Patient> findByCabinet(Cabinet cabinet, Pageable pageable);

    // Recherche par CIN dans un cabinet spécifique
    Optional<Patient> findByCinAndCabinet(String cin, Cabinet cabinet);

    // Recherche par nom dans un cabinet spécifique
    List<Patient> findByNomContainingIgnoreCaseAndCabinet(String nom, Cabinet cabinet);
    List<Patient> findByNomContainingIgnoreCaseAndPrenomContainingIgnoreCaseAndCabinet(
            String nom, String prenom, Cabinet cabinet);

    // Vérifier si CIN existe déjà (global ou par cabinet selon votre besoin)
    boolean existsByCin(String cin);
    Optional<Patient> findByCin(String cin);
}