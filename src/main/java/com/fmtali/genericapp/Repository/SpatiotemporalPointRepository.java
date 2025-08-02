package com.fmtali.genericapp.Repository;

import com.fmtali.genericapp.Models.SpatiotemporalPoint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpatiotemporalPointRepository extends JpaRepository<SpatiotemporalPoint, Long> {
}
