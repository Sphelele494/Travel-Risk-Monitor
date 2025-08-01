package com.fmtali.genericapp.Controller;

import com.fmtali.genericapp.Models.Incident;
import com.fmtali.genericapp.Service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalTime;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "http://localhost:5173")
public class IncidentController {

    @Autowired
    private IncidentService incidentService;

    @GetMapping
    public List<Incident> getAllIncidents() {
        return incidentService.getAllIncidents();
    }

    @PostMapping
    public Incident createIncident(@RequestBody Incident incident) {
        return incidentService.createIncident(incident);
    }

    @GetMapping("/by-location")
    public List<Incident> getIncidentsByLocation(@RequestParam String location) {
        return incidentService.getIncidentsByLocation(location);
    }

    @PostMapping("/seed")
    public String seedIncidents() {
        List<Incident> dummyData = List.of(
                Incident.builder()
                        .title("Large pothole on N1 Highway")
                        .location("N1 Highway, Johannesburg")
                        .time("30m ago")
                        .description("Deep pothole causing tire damage near Johannesburg exit")
                        .reporter("user123")
                        .severity("high")
                        .type("road hazard")
                        .verified(true)
                        .likes(15)
                        .build(),
                Incident.builder()
                        .title("Hijacking hotspot reported")
                        .location("Sandton, Johannesburg")
                        .time("2h ago")
                        .description("Multiple reports of vehicle hijackings in this area")
                        .reporter("community_watch")
                        .severity("critical")
                        .type("crime")
                        .verified(true)
                        .likes(32)
                        .build(),
                Incident.builder()
                        .title("Traffic lights not working")
                        .location("Commissioner St, Johannesburg")
                        .time("6h ago")
                        .description("Intersection lights have been out for 3 days")
                        .reporter("daily_commuter")
                        .severity("medium")
                        .type("infrastructure")
                        .verified(false)
                        .likes(8)
                        .build(),
                Incident.builder()
                        .title("Road closure due to construction")
                        .location("M1 Highway, Johannesburg")
                        .time("1d ago")
                        .description("M1 southbound closed for emergency repairs")
                        .reporter("roadwatcher")
                        .severity("high")
                        .type("construction")
                        .verified(true)
                        .likes(6)
                        .build());

        incidentService.createMultipleIncidents(dummyData);
        return "Seed data inserted";
    }

    @PostMapping("/seed/randburg")
    public ResponseEntity<String> seedRandburgIncidents() {
        List<Incident> incidents = List.of(
                new Incident("Pothole near Randburg Square",
                        "Randburg, Johannesburg",
                        "Deep pothole in the left lane",
                        "user101", "high", "road hazard", true, 12),
                new Incident("Traffic light malfunction",
                        "Jan Smuts Ave, Randburg",
                        "Traffic lights not working for 2 days",
                        "localdriver", "medium", "infrastructure", false, 7),
                new Incident("Suspected hijacking hotspot",
                        "Malibongwe Dr, Randburg",
                        "Frequent car theft reports in this area",
                        "crimewatch", "critical", "crime", true, 18),
                new Incident("Construction blockage",
                        "Bram Fischer Dr, Randburg",
                        "Road partially closed due to pipe repairs",
                        "ward42", "low", "construction", true, 4));

        for (Incident incident : incidents) {
            incidentService.saveIncident(incident);
        }

        return ResponseEntity.ok("Randburg incidents seeded successfully");
    }

}
