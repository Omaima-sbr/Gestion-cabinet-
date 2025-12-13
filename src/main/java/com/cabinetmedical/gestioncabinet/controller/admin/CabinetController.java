package com.cabinetmedical.gestioncabinet.controller.admin;

import com.cabinetmedical.gestioncabinet.model.Cabinet;
import com.cabinetmedical.gestioncabinet.service.admin.CabinetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/cabinets")
public class CabinetController {

    private final CabinetService cabinetService;

    public CabinetController(CabinetService cabinetService) {
        this.cabinetService = cabinetService;
    }

    @GetMapping
    public ResponseEntity<List<Cabinet>> getAllCabinets() {
        return ResponseEntity.ok(cabinetService.getAllCabinets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cabinet> getCabinetById(@PathVariable Integer id) {
        Cabinet cabinet = cabinetService.getCabinetById(id)
                .orElseThrow(() -> new RuntimeException("Cabinet non trouvé"));
        return ResponseEntity.ok(cabinet);
    }


    @PostMapping
    public ResponseEntity<Cabinet> addCabinet(@RequestBody Cabinet cabinet) {
        return ResponseEntity.ok(cabinetService.addCabinet(cabinet));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cabinet> updateCabinet(@PathVariable Integer id, @RequestBody Cabinet cabinet) {
        return ResponseEntity.ok(cabinetService.updateCabinet(id, cabinet));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Cabinet> toggleCabinetStatus(@PathVariable Integer id, @RequestParam Boolean actif) {
        return ResponseEntity.ok(cabinetService.toggleCabinetStatus(id, actif));
    }

    // Nouvelle route pour rechercher par nom
    @GetMapping("/search")
    public ResponseEntity<List<Cabinet>> searchCabinets(@RequestParam String nom) {
        return ResponseEntity.ok(cabinetService.searchByNom(nom));
    }
}
