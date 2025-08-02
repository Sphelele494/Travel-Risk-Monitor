
package com.fmtali.genericapp.Controller;

import com.fmtali.genericapp.Models.Alerts;
import com.fmtali.genericapp.Models.WeatherAlert;
import com.fmtali.genericapp.Service.AlertService;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import java.util.Map;

import org.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

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

    // Dealing with weather alerts
    @GetMapping("/check")
    public ResponseEntity<?> checkWeatherAndAlert(
            @RequestParam double lat,
            @RequestParam double lon) {

        WeatherAlert alert = alertService.checkWeatherAndAlert(lat, lon);

        if (alert == null) {
            return ResponseEntity.ok().body(Map.of("message", "No severe weather at this location."));
        }

        return ResponseEntity.ok(alert);
    }

    @GetMapping("/weather/raw")
    public ResponseEntity<?> getRawWeather(@RequestParam double lat, @RequestParam double lon) {
        JSONObject data = alertService.getRawWeatherData(lat, lon);
        if (data == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Unable to fetch weather data."));
        }
        return ResponseEntity.ok(data.toMap());
    }

    @GetMapping("/weather/summary")
    public ResponseEntity<?> getSimplifiedWeather(@RequestParam double lat, @RequestParam double lon) {
        Map<String, Object> summary = alertService.getSimplifiedWeather(lat, lon);
        if (summary == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Unable to fetch weather summary."));
        }
        return ResponseEntity.ok(summary);
    }
}
