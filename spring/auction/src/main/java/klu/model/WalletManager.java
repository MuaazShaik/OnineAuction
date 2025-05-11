package klu.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import klu.repo.WalletRepository;

@Service
public class WalletManager {

    @Autowired
    WalletRepository WR;

    public String addBalance(String email, double amount) {
        Wallet wallet = WR.findById(email).orElse(null);

        if (wallet == null) {
            wallet = new Wallet();
            wallet.setEmail(email);
            wallet.setBalance(amount);
        } else {
            wallet.setBalance(wallet.getBalance() + amount);
        }

        WR.save(wallet);
        return "200::Balance Added";
    }

    public double getBalance(String email) {
        return WR.getBalanceByEmail(email);
    }

    public String deductBalance(String email, double amount) {
        Wallet wallet = WR.findById(email).orElse(null);
        if (wallet == null || wallet.getBalance() < amount) {
            return "403::Insufficient Balance";
        }

        wallet.setBalance(wallet.getBalance() - amount);
        WR.save(wallet);
        return "200::Balance Deducted";
    }

    public String creditBalance(String email, double amount) {
        Wallet wallet = WR.findById(email).orElse(null);
        if (wallet == null) {
            wallet = new Wallet();
            wallet.setEmail(email);
            wallet.setBalance(amount);
        } else {
            wallet.setBalance(wallet.getBalance() + amount);
        }

        WR.save(wallet);
        return "200::Balance Credited";
    }
}
