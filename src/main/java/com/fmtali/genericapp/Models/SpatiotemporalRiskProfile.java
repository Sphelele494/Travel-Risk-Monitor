package com.fmtali.genericapp.Models;

import javax.persistence.*;
import lombok.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "risk_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpatiotemporalRiskProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean highRiskDetected;

    @ElementCollection
    @CollectionTable(name = "risk_summary", joinColumns = @JoinColumn(name = "profile_id"))
    @Column(name = "summary")
    private List<String> hazardSummary;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL)
    @JsonManagedReference // 👈 Add this
    private List<SpatiotemporalPoint> pathPoints;
}
