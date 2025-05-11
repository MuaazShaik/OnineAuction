package klu.controller;

import klu.model.Delivery;
import klu.model.DeliveryManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/delivery")
@CrossOrigin(origins = "http://localhost:5173")
public class DeliveryController {

    @Autowired
    DeliveryManager DM;

    @PostMapping("/create")
    public String createDelivery(@RequestBody Delivery d) {
        return DM.createDelivery(d);
    }

    @GetMapping("/all")
    public List<Delivery> getAllDeliveries() {
        return DM.getAllDeliveries();
    }

    @GetMapping("/{id}")
    public Delivery getDeliveryById(@PathVariable int id) {
        return DM.getDeliveryById(id);
    }

    @PostMapping("/updatestatus")
    public String updateStatus(@RequestParam int id, @RequestParam String status) {
        return DM.updateDeliveryStatus(id, status);
    }
}
