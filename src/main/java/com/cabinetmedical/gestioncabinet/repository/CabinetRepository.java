package com.cabinetmedical.gestioncabinet.repository;

import com.cabinetmedical.gestioncabinet.model.Cabinet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CabinetRepository extends JpaRepository<Cabinet, Integer> {

    Optional<Cabinet> findByNom(String nom);

    boolean existsByNom(String nom);
}