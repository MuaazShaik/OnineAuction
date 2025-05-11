import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import UserNavbar from '../components/UserNavbar';
import { getBidsForProduct, getHighestBid, placeOrder, createDelivery } from '../api';

const API_BASE = 'http://localhost:8080';

const UserBids = () => {
  const [userBids, setUserBids] = useState([]);
  const [highestBids, setHighestBids] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const userEmail = localStorage.getItem('email');

  useEffect(() => {
    fetchUserBids();
  }, []);

  const fetchUserBids = async () => {
    try {
      // Get all products first
      const productsResponse = await fetch(`${API_BASE}/products/all`);
      const products = await productsResponse.json();

      // For each product, get bids and check if user has highest bid
      const bidsPromises = products.map(product => getBidsForProduct(product.id));
      const highestBidPromises = products.map(product => getHighestBid(product.id));
      
      const bidsResults = await Promise.all(bidsPromises);
      const highestResults = await Promise.all(highestBidPromises);

      // Filter bids made by the current user
      const userBidsList = [];
      const highestBidsMap = {};

      products.forEach((product, index) => {
        const productBids = bidsResults[index].data;
        const highestBid = highestResults[index].data;
        
        // Store highest bid for each product
        highestBidsMap[product.id] = highestBid;

        // Find all bids by the current user for this product
        const userBidsForProduct = productBids.filter(bid => bid.buyerEmail === userEmail);
        // Find the highest bid by the user for this product
        if (userBidsForProduct.length > 0) {
          const userHighestBid = userBidsForProduct.reduce((max, bid) => bid.bidAmount > max.bidAmount ? bid : max, userBidsForProduct[0]);
          userBidsList.push({
            ...userHighestBid,
            product: product
          });
        }
      });

      setUserBids(userBidsList);
      setHighestBids(highestBidsMap);
    } catch (err) {
      setError('Failed to fetch bids');
    }
  };

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setDeliveryAddress('');
    setOrderModalOpen(true);
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!deliveryAddress.trim()) {
      setError('Please enter a delivery address');
      return;
    }

    try {
      // First place the order
      const orderData = {
        buyerEmail: userEmail,
        productId: selectedProduct.id,
        amount: highestBids[selectedProduct.id].bidAmount
      };

      const orderResponse = await placeOrder(orderData);
      if (!orderResponse.data.startsWith('200::')) {
        setError(orderResponse.data.split('::')[1] || 'Failed to place order');
        return;
      }

      // Extract order ID from response
      const orderId = orderResponse.data.split('::')[1];

      // Create delivery record
      const deliveryData = {
        orderId: parseInt(orderId),
        deliveryStatus: 'Pending',
        deliveryAddress: deliveryAddress
      };

      const deliveryResponse = await createDelivery(deliveryData);
      if (deliveryResponse.data.startsWith('200::')) {
        setSuccess('Order placed and delivery record created successfully!');
        setOrderModalOpen(false);
        fetchUserBids(); // Refresh the list
      } else {
        setError('Order placed but failed to create delivery record');
      }
    } catch (err) {
      setError('Failed to place order. Please try again.');
    }
  };

  return (
    <>
      <UserNavbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Bids
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Grid container spacing={3}>
          {userBids.map((bid) => (
            <Grid item xs={12} sm={6} md={4} key={bid.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {bid.product.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Your Bid: ${bid.bidAmount.toFixed(2)}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Current Highest Bid: ${highestBids[bid.product.id]?.bidAmount.toFixed(2) || '0.00'}
                  </Typography>
                  {highestBids[bid.product.id]?.buyerEmail === userEmail && (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => handleOrderClick(bid.product)}
                    >
                      Order Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={orderModalOpen} onClose={() => setOrderModalOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Place Order</DialogTitle>
          <form onSubmit={handleOrderSubmit}>
            <DialogContent>
              <Typography gutterBottom>
                Product: {selectedProduct?.name}
              </Typography>
              <Typography gutterBottom color="primary">
                Amount: ${selectedProduct && highestBids[selectedProduct.id]?.bidAmount.toFixed(2)}
              </Typography>
              <TextField
                fullWidth
                label="Delivery Address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
                multiline
                rows={3}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOrderModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Place Order
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </>
  );
};

export default UserBids; 