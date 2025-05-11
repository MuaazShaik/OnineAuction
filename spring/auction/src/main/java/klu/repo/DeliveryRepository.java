package klu.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import klu.model.Delivery;

public interface DeliveryRepository extends JpaRepository<Delivery, Integer> {
}
