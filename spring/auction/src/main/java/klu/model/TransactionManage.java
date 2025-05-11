package klu.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import klu.repo.TransactionRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionManage {

    @Autowired
    TransactionRepository TR;

    public String recordTransaction(Transaction t) {
        t.setTransactionTime(LocalDateTime.now());
        TR.save(t);
        return "Transaction Recorded Successfully";
    }

    public List<Transaction> getUserTransactions(String email) {
        return TR.findByBuyerEmail(email);
    }

    public List<Transaction> getAllTransactions() {
        return TR.findAll();
    }
}
