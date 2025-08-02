package com.fmtali.genericapp.Service;

import com.fmtali.genericapp.Models.WeatherAlert;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class RiskAssessmentService {

    private final WeatherService weatherService;

    public WeatherAlert detectHazard(double lat, double lon) {
        JSONObject weatherData = weatherService.getWeatherData(lat, lon);

        if (weatherData == null || weatherData.isEmpty()) {
            log.warn("No weather data available for coordinates: {}, {}", lat, lon);
            return null;
        }

        // Extract weather conditions
        String main = weatherData.getJSONArray("weather").getJSONObject(0).getString("main");
        String description = weatherData.getJSONArray("weather").getJSONObject(0).getString("description");
        double windSpeed = weatherData.getJSONObject("wind").optDouble("speed", 0.0);
        double rainVolume = weatherData.has("rain") ? weatherData.getJSONObject("rain").optDouble("1h", 0.0) : 0.0;

        // Rule-based hazard detection
        if (description.toLowerCase().contains("hail")) {
            return buildAlert("HAIL", "High", lat, lon, LocalDateTime.now());
        }

        if (main.equalsIgnoreCase("Thunderstorm")) {
            return buildAlert("THUNDERSTORM", "Severe", lat, lon, LocalDateTime.now());
        }

        if (rainVolume > 10) {
            return buildAlert("FLOOD", "Moderate", lat, lon, LocalDateTime.now());
        }

        if (windSpeed > 15) {
            return buildAlert("HIGH_WIND", "Moderate", lat, lon, LocalDateTime.now());
        }

        return null; // No risk found
    }

    private WeatherAlert buildAlert(String type, String severity, double lat, double lon, LocalDateTime alertTime) {
        WeatherAlert alert = new WeatherAlert();
        alert.setType(type);
        alert.setSeverity(severity);
        alert.setLatitude(lat);
        alert.setLongitude(lon);
        alert.setAlertTime(LocalDateTime.now());
        return alert;
    }
}
