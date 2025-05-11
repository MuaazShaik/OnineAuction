package klu.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import klu.model.Order;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByBuyerEmail(String email);
}
