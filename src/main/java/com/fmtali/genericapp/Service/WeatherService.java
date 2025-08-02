package com.fmtali.genericapp.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.json.JSONObject;

// Removed unused import

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Service
@RequiredArgsConstructor
@Slf4j
public class WeatherService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${weather.api.key}")
    private String apiKey;

    public JSONObject getWeatherData(double lat, double lon) {
        String url = String.format(
                "https://api.openweathermap.org/data/2.5/weather?lat=%f&lon=%f&appid=%s",
                lat, lon, apiKey);

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            return new JSONObject(response.getBody());
        } catch (Exception e) {
            log.error("Error fetching weather data: {}", e.getMessage());
            return null;
        }
    }
}
