package klu.controller;

import klu.model.AnalyticsManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/analytics")
@CrossOrigin(origins = "http://localhost:5173")
public class AnalyticsController {

    @Autowired
    private AnalyticsManager analyticsManager;

    @GetMapping("/summary")
    public Map<String, Object> getDashboardSummary() {
        return analyticsManager.getDashboardSummary();
    }
}
