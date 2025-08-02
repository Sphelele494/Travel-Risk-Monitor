package com.fmtali.genericapp.Repository;

import com.fmtali.genericapp.Models.SpatiotemporalRiskProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RiskProfileRepository extends JpaRepository<SpatiotemporalRiskProfile, Long> {
}
