package com.cabinetmedical.gestioncabinet.controller.admin;

import com.cabinetmedical.gestioncabinet.dto.admin.DashboardDTO;
import com.cabinetmedical.gestioncabinet.service.admin.DashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * ✅ SÉCURISÉ: Seuls les ADMIN peuvent accéder
     * ⚠️ CORRECTION IMPORTANTE :
     * Comme ton UserDetailsService ajoute "ROLE_", il faut vérifier "ROLE_ADMINISTRATEUR"
     */
    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('ROLE_ADMINISTRATEUR')")
    public DashboardDTO getStats() {
        return dashboardService.getDashboardStatsDTO();
    }
}