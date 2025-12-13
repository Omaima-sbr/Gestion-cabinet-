package com.cabinetmedical.gestioncabinet.controller;

import com.cabinetmedical.gestioncabinet.model.Cabinet;
import com.cabinetmedical.gestioncabinet.repository.CabinetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.cabinetmedical.gestioncabinet.service.CabinetService;

import java.util.List;

@RestController
@RequestMapping("/api/cabinets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CabinetController {

    private final CabinetService cabinetService;

    /**
     * GET /api/cabinets
     * Retourne la liste de tous les cabinets actifs
     */
    @GetMapping
    public List<Cabinet> getAllCabinets() {
        return cabinetService.getAllCabinets();
    }
}