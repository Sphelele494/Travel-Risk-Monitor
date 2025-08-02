package com.fmtali.genericapp.Models;

import lombok.*;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.*;

@Entity
@Table(name = "weather_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class WeatherAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // e.g., "HAIL", "FLOOD", "HEAVY_RAIN", "WIND"
    private String severity; // e.g., "MODERATE", "SEVERE"
    private double latitude;
    private double longitude;

    private LocalDateTime alertTime;

    // @ManyToOne
    // @JoinColumn(name = "route_id")
    // private Route route;
}
