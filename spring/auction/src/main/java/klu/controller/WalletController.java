package klu.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import klu.model.WalletManager;

@RestController
@RequestMapping("/wallet")
@CrossOrigin(origins = "http://localhost:5173")
public class WalletController {

    @Autowired
    WalletManager WM;

    @PostMapping("/add")
    public String addMoney(@RequestParam String email, @RequestParam double amount) {
        return WM.addBalance(email, amount);
    }

    @GetMapping("/balance")
    public double getBalance(@RequestParam String email) {
        return WM.getBalance(email);
    }

    @PostMapping("/deduct")
    public String deduct(@RequestParam String email, @RequestParam double amount) {
        return WM.deductBalance(email, amount);
    }

    @PostMapping("/credit")
    public String credit(@RequestParam String email, @RequestParam double amount) {
        return WM.creditBalance(email, amount);
    }
}
