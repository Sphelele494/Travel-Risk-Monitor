// src/main/java/com/fmtali/genericapp/Model/Incident.java
package com.fmtali.genericapp.Models;

import java.time.LocalDateTime;

import javax.persistence.*;
import lombok.*;

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
    private String time;
    
    @Column(length = 1000)
    private String description;

    private String reporter;
    private String severity;  // e.g., "low", "medium", "high", "critical"
    private String type;      // e.g., "crime", "road hazard", etc.
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
    this.time = LocalDateTime.now().toString(); 
}
}
