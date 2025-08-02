package com.fmtali.genericapp.Models;

import javax.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Table(name = "spatial_points")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpatiotemporalPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double lat;
    private double lon;
    private LocalDateTime time;

    private String riskLevel;

    @Column(columnDefinition = "TEXT")
    private String rawWeatherData;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    @JsonBackReference // 👈 Add this
    private SpatiotemporalRiskProfile profile;
}
