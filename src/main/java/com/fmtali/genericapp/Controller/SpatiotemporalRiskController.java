package com.fmtali.genericapp.Controller;

import com.fmtali.genericapp.Models.SpatiotemporalRiskProfile;
import com.fmtali.genericapp.Service.SpatiotemporalAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/risk")
@RequiredArgsConstructor
public class SpatiotemporalRiskController {

    private final SpatiotemporalAnalysisService analysisService;

    @PostMapping("/analyze")
    public ResponseEntity<SpatiotemporalRiskProfile> analyze(@RequestBody List<double[]> coordinates) {
        // each double[] = [lat, lon]
        SpatiotemporalRiskProfile profile = analysisService.analyzeStaticRoute(coordinates);
        return ResponseEntity.ok(profile);
    }
}
