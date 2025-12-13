package com.cabinetmedical.gestioncabinet.service;

import com.cabinetmedical.gestioncabinet.model.Cabinet;
import com.cabinetmedical.gestioncabinet.repository.CabinetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CabinetService {

    private final CabinetRepository cabinetRepository;

    // Une seule méthode suffit. Elle renvoie TOUT (actifs et inactifs)
    public List<Cabinet> getAllCabinets() {
        return cabinetRepository.findAll();
    }
}