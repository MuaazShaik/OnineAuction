package klu.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import klu.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
	
    List<Product> findBySellerEmail(String email);
}
