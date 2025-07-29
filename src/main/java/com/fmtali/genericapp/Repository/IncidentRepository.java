package com.fmtali.genericapp.Repository;

import com.fmtali.genericapp.Models.Incident;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
    List<Incident> findByLocationContainingIgnoreCase(String location);
}
