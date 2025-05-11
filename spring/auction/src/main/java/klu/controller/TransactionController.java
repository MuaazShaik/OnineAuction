package klu.controller;

import klu.model.Transaction;
import klu.model.TransactionManage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transaction")
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    @Autowired
    TransactionManage TM;

    @PostMapping("/record")
    public String recordTransaction(@RequestBody Transaction t) {
        return TM.recordTransaction(t);
    }

    @GetMapping("/user")
    public List<Transaction> getUserTransactions(@RequestParam String email) {
        return TM.getUserTransactions(email);
    }

    @GetMapping("/all")
    public List<Transaction> getAllTransactions() {
        return TM.getAllTransactions();
    }
}
