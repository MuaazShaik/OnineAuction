package klu.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import klu.model.Wallet;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, String> {

    @Query("SELECT w.balance FROM Wallet w WHERE w.email = :email")
    double getBalanceByEmail(String email);
}
