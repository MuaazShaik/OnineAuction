package klu.controller;

import klu.model.Bid;
import klu.model.BidManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bid")
@CrossOrigin(origins = "http://localhost:5173")
public class BidController {

    @Autowired
    private BidManager bidManager;

    @PostMapping("/place")
    public String placeBid(@RequestBody Bid bid) {
        return bidManager.placeBid(bid);
    }

    @GetMapping("/getbids")
    public List<Bid> getBids(@RequestParam int productId) {
        return bidManager.getBidsForProduct(productId);
    }

    @GetMapping("/highest")
    public Bid getHighestBid(@RequestParam int productId) {
        return bidManager.getHighestBid(productId);
    }
}
