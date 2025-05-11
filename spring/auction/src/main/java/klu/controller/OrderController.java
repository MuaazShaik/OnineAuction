package klu.controller;


import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import klu.model.Order;
import klu.model.OrderManager;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    OrderManager OM;

    @PostMapping("/place")
    public String placeOrder(@RequestBody Order O) {
        return OM.placeOrder(O);
    }

    @PostMapping("/getbyuser")
    public List<Order> getOrdersByUser(@RequestBody Map<String, String> data) {
        return OM.getOrdersByUser(data.get("email"));
    }

    @GetMapping("/all")
    public List<Order> getAllOrders() {
        return OM.getAllOrders();
    }
}

