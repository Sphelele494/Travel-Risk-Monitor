package com.fmtali.genericapp.Models;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String location;

    private String time; // Changed from LocalTime to LocalDateTime

    @Column(length = 1000)
    private String description;

    private String reporter;
    private String severity;
    private String type;
    private boolean verified;
    private int likes;

    public Incident(String title, String location, String description,
            String reporter, String severity, String type,
            boolean verified, int likes) {
        this.title = title;
        this.location = location;
        this.description = description;
        this.reporter = reporter;
        this.severity = severity;
        this.type = type;
        this.verified = verified;
        this.likes = likes;
        this.time = LocalDateTime.now().toString(); // Set time to current time
        // creationTime will be auto-set by @PrePersist
    }
}
