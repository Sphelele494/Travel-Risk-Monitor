package com.fmtali.genericapp.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fmtali.genericapp.Models.WeatherAlert;

public interface WeatherAlertRepository extends JpaRepository<WeatherAlert, Long> {
}
