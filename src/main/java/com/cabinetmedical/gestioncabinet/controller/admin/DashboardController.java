package com.cabinetmedical.gestioncabinet.controller.admin;

import com.cabinetmedical.gestioncabinet.dto.admin.DashboardDTO;
import com.cabinetmedical.gestioncabinet.service.admin.DashboardService;
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

    // Récupérer les statistiques globales et le résumé mensuel du dashboard
    @GetMapping("/stats")
    public DashboardDTO getStats() {
        return dashboardService.getDashboardStatsDTO();
    }
}
