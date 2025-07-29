package com.fmtali.genericapp.Service;

import com.fmtali.genericapp.Models.Incident;
import com.fmtali.genericapp.Repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncidentService {

    @Autowired
    private IncidentRepository incidentRepository;

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Incident createIncident(Incident incident) {
        return incidentRepository.save(incident);
    }


    public List<Incident> getIncidentsByLocation(String location) {
        return incidentRepository.findByLocationContainingIgnoreCase(location);
    }

    public void createMultipleIncidents(List<Incident> incidents) {
        incidentRepository.saveAll(incidents);
    }

    public Incident saveIncident(Incident incident) {
        return incidentRepository.save(incident);
    }
}
