package klu.model;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import klu.repo.BidRepository;
import klu.repo.WalletRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BidManager {

    @Autowired
    private BidRepository bidRepo;

    @Autowired
    private WalletRepository walletRepo;

    public String placeBid(Bid bid) {
        double balance = walletRepo.getBalanceByEmail(bid.getBuyerEmail());

        if (balance < bid.getBidAmount()) {
            return "403::Insufficient Wallet Balance";
        }

        bid.setBidTime(LocalDateTime.now());
        bidRepo.save(bid);

        return "200::Bid Placed Successfully";
    }

    public List<Bid> getBidsForProduct(int productId) {
        return bidRepo.findByProductId(productId);
    }

    public Bid getHighestBid(int productId) {
        List<Bid> bids = bidRepo.findHighestBidByProductId(productId);
        if (bids.isEmpty()) return null;
        return bids.get(0);
    }
}
