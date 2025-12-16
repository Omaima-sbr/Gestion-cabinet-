package com.cabinetmedical.gestioncabinet.controller;

import com.cabinetmedical.gestioncabinet.model.Cabinet;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.cabinetmedical.gestioncabinet.service.CabinetsService;

import java.util.List;

@RestController
@RequestMapping("/api/cabinets")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CabinetsController {

    private final CabinetsService cabinetService;

    /**
     * GET /api/cabinets
     * Retourne la liste de tous les cabinets actifs
     */
    @GetMapping
    public List<Cabinet> getAllCabinets() {
        return cabinetService.getAllCabinets();
    }
}