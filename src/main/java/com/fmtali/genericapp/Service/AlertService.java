package com.fmtali.genericapp.Service;

import com.fmtali.genericapp.Models.Alerts;
import com.fmtali.genericapp.Repository.AlertsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlertService {
    private final AlertsRepository alertsRepository;

    public Page<Alerts> getAllAlerts(Pageable pageable) {
        return alertsRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public Page<Alerts> getAlertsByStatus(Alerts.Status status, Pageable pageable) {
        return alertsRepository.findByStatus(status, pageable);
    }

    public Alerts createAlert(Alerts alert) {
        return alertsRepository.save(alert);
    }

    public Alerts updateAlertStatus(Long id, Alerts.Status newStatus) {
        Alerts alert = alertsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        alert.setStatus(newStatus);
        return alertsRepository.save(alert);
    }

    public void deleteAlert(Long id) {
        alertsRepository.deleteById(id);
    }

}