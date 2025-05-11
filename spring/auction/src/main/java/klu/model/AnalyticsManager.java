package klu.model;

import klu.repo.UserRepository;
import klu.repo.ProductRepository;
import klu.repo.BidRepository;
import klu.repo.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsManager {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private BidRepository bidRepo;

    @Autowired
    private OrderRepository orderRepo;

    public Map<String, Object> getDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalUsers", userRepo.count());
        summary.put("totalProducts", productRepo.count());
        summary.put("totalBids", bidRepo.count());
        summary.put("totalOrders", orderRepo.count());

        return summary;
    }
}
