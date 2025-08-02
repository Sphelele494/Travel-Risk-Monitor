package com.fmtali.genericapp.Service;

import com.fmtali.genericapp.Models.Alerts;
import com.fmtali.genericapp.Models.WeatherAlert;
import com.fmtali.genericapp.Repository.AlertsRepository;
import com.fmtali.genericapp.Repository.WeatherAlertRepository;

import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AlertService {
    private final AlertsRepository alertsRepository;
    private final WeatherService weatherService;
    private final WeatherAlertRepository weatherAlertRepository;

    public Page<Alerts> getAllAlerts(Pageable pageable) {
        return alertsRepository.findAllByOrderByCreatedAtDesc(pageable);
    }

    public Page<Alerts> getAlertsByStatus(Alerts.Status status, Pageable pageable) {
        return alertsRepository.findByStatus(status, pageable);
    }

    public Alerts createAlert(Alerts alert) {
        return alertsRepository.save(alert);
    }

    public Alerts updateAlertStatus(Long id, Alerts.Status newStatus) {
        Alerts alert = alertsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        alert.setStatus(newStatus);
        return alertsRepository.save(alert);
    }

    public void deleteAlert(Long id) {
        alertsRepository.deleteById(id);
    }

    public WeatherAlert checkWeatherAndAlert(double lat, double lon) {
        Object weatherRawData = weatherService.getWeatherData(lat, lon);

        if (weatherRawData == null) {
            System.out.println("Weather data is null — API call failed or no response.");
            return null;
        }

        JSONObject data;
        try {
            data = new JSONObject(weatherRawData.toString());
        } catch (Exception e) {
            System.out.println("Failed to parse weather data: " + e.getMessage());
            return null;
        }

        if (!data.has("weather")) {
            System.out.println("Unexpected weather data format: " + data);
            return null;
        }

        String weatherMain = data.getJSONArray("weather")
                .getJSONObject(0)
                .optString("main", "UNKNOWN");

        String severity = "MODERATE"; // could be improved

        if (weatherMain.equalsIgnoreCase("Rain") ||
                weatherMain.equalsIgnoreCase("Thunderstorm") ||
                weatherMain.equalsIgnoreCase("Snow")) {

            WeatherAlert alert = WeatherAlert.builder()
                    .type(weatherMain.toUpperCase())
                    .severity(severity)
                    .latitude(lat)
                    .longitude(lon)
                    .alertTime(LocalDateTime.now())
                    .build();

            return weatherAlertRepository.save(alert);
        }

        return null;
    }

    // 1. Get raw OpenWeather data
    public JSONObject getRawWeatherData(double lat, double lon) {
        JSONObject response = weatherService.getWeatherData(lat, lon);
        if (response == null || response.isEmpty()) // JSONObject has isEmpty()
            return null;
        return response;
    }

    // 2. Get simplified weather summary
    public Map<String, Object> getSimplifiedWeather(double lat, double lon) {
        JSONObject data = getRawWeatherData(lat, lon);
        if (data == null)
            return null;

        JSONObject main = data.getJSONObject("main");
        JSONObject weather = data.getJSONArray("weather").getJSONObject(0);
        JSONObject wind = data.getJSONObject("wind");

        return Map.of(
                "condition", weather.getString("main"),
                "description", weather.getString("description"),
                "temperature", main.getDouble("temp"),
                "humidity", main.getInt("humidity"),
                "windSpeed", wind.getDouble("speed"),
                "location", Map.of(
                        "lat", lat,
                        "lon", lon),
                "timestamp", LocalDateTime.now().toString());
    }

}
