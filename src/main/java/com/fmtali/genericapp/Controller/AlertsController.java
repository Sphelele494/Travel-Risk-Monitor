package com.fmtali.genericapp.Controller;

import com.fmtali.genericapp.Models.Alerts;
import com.fmtali.genericapp.Service.AlertService;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertsController {
    private final AlertService alertService;

    @GetMapping
    public Page<Alerts> getAlerts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        if (status != null) {
            try {
                Alerts.Status alertStatus = Alerts.Status.valueOf(status.toUpperCase());
                return alertService.getAlertsByStatus(alertStatus, pageable);
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Invalid status value: " + status);
            }
        }

        return alertService.getAllAlerts(pageable);
    }

    @PostMapping
    public Alerts createAlert(@RequestBody Alerts alert) {
        return alertService.createAlert(alert);
    }

    @PatchMapping("/{id}/status")
    public Alerts updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Alerts.Status newStatus = Alerts.Status.valueOf(status.toUpperCase());
            return alertService.updateAlertStatus(id, newStatus);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value: " + status);
        }
    }

    @DeleteMapping("/{id}")
    public void deleteAlert(@PathVariable Long id) {
        alertService.deleteAlert(id);
    }
}
