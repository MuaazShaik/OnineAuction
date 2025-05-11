package klu.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import klu.repo.OrderRepository;

@Service
public class OrderManager {

    @Autowired
    OrderRepository OR;
    @Autowired
    WalletManager WM;

    public String placeOrder(Order O) {
        O.setOrderDate(LocalDateTime.now());
        OR.save(O);
        WM.deductBalance(O.getBuyerEmail(), O.getAmount());
        return "200::Order placed successfully";
    }

    public List<Order> getOrdersByUser(String email) {
        return OR.findByBuyerEmail(email);
    }

    public List<Order> getAllOrders() {
        return OR.findAll();
    }
}
