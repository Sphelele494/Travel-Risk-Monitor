package com.fmtali.genericapp.Service;

import com.fmtali.genericapp.Models.SpatiotemporalPoint;
import com.fmtali.genericapp.Models.SpatiotemporalRiskProfile;
import com.fmtali.genericapp.Repository.RiskProfileRepository;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SpatiotemporalAnalysisService {

    private final WeatherService weatherService;
    private final RiskProfileRepository riskProfileRepository;

    public SpatiotemporalRiskProfile analyzeStaticRoute(List<double[]> coordinates) {
        List<SpatiotemporalPoint> points = new ArrayList<>();
        List<String> hazardSummary = new ArrayList<>();
        boolean highRisk = false;

        for (int i = 0; i < coordinates.size(); i++) {
            double[] coord = coordinates.get(i);
            double lat = coord[0];
            double lon = coord[1];
            LocalDateTime timestamp = LocalDateTime.now().plusMinutes(i * 10);

            JSONObject weather = weatherService.getWeatherData(lat, lon);
            String risk = assessRisk(weather);

            if (!risk.equals("None")) {
                highRisk = true;
                hazardSummary.add(String.format("[%s] @ (%.3f, %.3f): %s", timestamp, lat, lon, risk));
            }

            SpatiotemporalPoint point = SpatiotemporalPoint.builder()
                    .lat(lat)
                    .lon(lon)
                    .time(timestamp)
                    .riskLevel(risk)
                    .rawWeatherData(weather.toString())
                    .build();

            points.add(point);
        }

        SpatiotemporalRiskProfile profile = SpatiotemporalRiskProfile.builder()
                .highRiskDetected(highRisk)
                .hazardSummary(hazardSummary)
                .pathPoints(points)
                .build();

        points.forEach(p -> p.setProfile(profile));

        return riskProfileRepository.save(profile);
    }

    private String assessRisk(JSONObject weather) {
        if (weather == null)
            return "None";
        try {
            if (weather.has("rain") && weather.getJSONObject("rain").optDouble("1h", 0.0) > 10.0) {
                return "Flood Risk";
            }
            String main = weather.getJSONArray("weather").getJSONObject(0).getString("main");
            if (main.equalsIgnoreCase("Thunderstorm")) {
                return "Thunderstorm Risk";
            }
        } catch (Exception ignored) {
        }
        return "None";
    }
}
