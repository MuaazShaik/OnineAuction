package klu.model;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import klu.repo.DeliveryRepository;

@Service
public class DeliveryManager {

    @Autowired
    DeliveryRepository DR;

    public String createDelivery(Delivery d) {
        DR.save(d);
        return "200::Delivery Record Created";
    }

    public List<Delivery> getAllDeliveries() {
        return DR.findAll();
    }

    public Delivery getDeliveryById(int id) {
        return DR.findById(id).orElse(null);
    }

    public String updateDeliveryStatus(int id, String status) {
        Delivery d = DR.findById(id).orElse(null);
        if (d == null) return "404::Delivery Not Found";
        d.setDeliveryStatus(status);
        DR.save(d);
        return "200::Delivery Status Updated";
    }
}
