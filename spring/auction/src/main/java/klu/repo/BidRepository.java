package klu.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import klu.model.Bid;

public interface BidRepository extends JpaRepository<Bid, Integer> {

    List<Bid> findByProductId(int productId);

    @Query("SELECT b FROM Bid b WHERE b.productId = :productId ORDER BY b.bidAmount DESC")
    List<Bid> findHighestBidByProductId(int productId);
}
