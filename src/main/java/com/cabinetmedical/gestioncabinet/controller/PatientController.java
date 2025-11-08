package com.cabinetmedical.gestioncabinet.controller;

import com.cabinetmedical.gestioncabinet.model.Patient;
import com.cabinetmedical.gestioncabinet.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    // GET : Récupérer tous les patients
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // GET : Récupérer un patient par ID
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET : Rechercher par CIN
    @GetMapping("/cin/{cin}")
    public ResponseEntity<Patient> getPatientByCin(@PathVariable String cin) {
        return patientRepository.findByCin(cin)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET : Rechercher par nom ou prénom
    @GetMapping("/search")
    public List<Patient> searchPatients(@RequestParam String query) {
        return patientRepository.findByNomContainingOrPrenomContaining(query, query);
    }

    // POST : Créer un nouveau patient
    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        return patientRepository.save(patient);
    }

    // PUT : Modifier un patient
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patientDetails) {
        return patientRepository.findById(id)
                .map(patient -> {
                    patient.setCin(patientDetails.getCin());
                    patient.setNom(patientDetails.getNom());
                    patient.setPrenom(patientDetails.getPrenom());
                    patient.setDateNaissance(patientDetails.getDateNaissance());
                    patient.setSexe(patientDetails.getSexe());
                    patient.setNumTel(patientDetails.getNumTel());
                    patient.setTypeMutuelle(patientDetails.getTypeMutuelle());
                    return ResponseEntity.ok(patientRepository.save(patient));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE : Supprimer un patient
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}