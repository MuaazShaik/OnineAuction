import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CardMedia,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import UserNavbar from '../components/UserNavbar';
import { getAllProducts, placeBid, getHighestBid } from '../api';
import GavelIcon from '@mui/icons-material/Gavel';

const API_BASE = 'http://localhost:8080';
const MIN_BID_INCREMENT = 1.00; // Minimum bid increment in dollars

const UserDashboard = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [currentHighestBid, setCurrentHighestBid] = useState(0);
  const navigate = useNavigate();
  const email = localStorage.getItem('email');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    }
  };

  const fetchHighestBid = async (productId) => {
    try {
      const response = await getHighestBid(productId);
      if (response.data) {
        setCurrentHighestBid(response.data.bidAmount || 0);
      }
    } catch (error) {
      console.error('Error fetching highest bid:', error);
    }
  };

  const handleOpenBidModal = async (product) => {
    setSelectedProduct(product);
    setBidAmount('');
    setBidError('');
    setBidSuccess('');
    setBidModalOpen(true);
    await fetchHighestBid(product.id);
  };

  const handleCloseBidModal = () => {
    setBidModalOpen(false);
    setSelectedProduct(null);
    setBidAmount('');
    setBidError('');
    setBidSuccess('');
    setCurrentHighestBid(0);
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setBidError('');
    setBidSuccess('');

    const bidValue = parseFloat(bidAmount);
    if (!bidAmount || isNaN(bidValue) || bidValue <= 0) {
      setBidError('Please enter a valid bid amount');
      return;
    }

    // Check if bid is higher than current highest bid
    if (bidValue <= currentHighestBid) {
      setBidError(`Bid must be higher than current highest bid of $${currentHighestBid.toFixed(2)}`);
      return;
    }

    // Check if bid increment is sufficient
    if (bidValue < currentHighestBid + MIN_BID_INCREMENT) {
      setBidError(`Bid must be at least $${MIN_BID_INCREMENT.toFixed(2)} higher than current highest bid`);
      return;
    }

    try {
      const bidData = {
        productId: selectedProduct.id,
        buyerEmail: email,
        bidAmount: bidValue,
      };
      const response = await placeBid(bidData);
      if (response.data.startsWith('200::')) {
        setBidSuccess('Bid placed successfully!');
        fetchProducts();
        fetchHighestBid(selectedProduct.id);
      } else {
        setBidError(response.data.split('::')[1] || 'Failed to place bid');
      }
    } catch (err) {
      setBidError('Failed to place bid. Please try again.');
    }
  };

  return (
    <>
      <UserNavbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Products for Bidding
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <Grid container spacing={4}>
          {products.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                No products available.
              </Typography>
            </Grid>
          )}
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-6px)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' } }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.photoUrl ? `${API_BASE}${product.photoUrl}` : 'https://via.placeholder.com/200'}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<GavelIcon />}
                    fullWidth
                    onClick={() => handleOpenBidModal(product)}
                  >
                    Place Bid
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={bidModalOpen} onClose={handleCloseBidModal} maxWidth="xs" fullWidth>
          <DialogTitle>Place Bid</DialogTitle>
          <form onSubmit={handlePlaceBid}>
            <DialogContent>
              <Typography gutterBottom>
                Product: {selectedProduct?.name}
              </Typography>
              <Typography gutterBottom color="primary">
                Current Highest Bid: ${currentHighestBid.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Minimum bid increment: ${MIN_BID_INCREMENT.toFixed(2)}
              </Typography>
              <TextField
                fullWidth
                label="Bid Amount"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                inputProps={{ 
                  step: "0.01", 
                  min: (currentHighestBid + MIN_BID_INCREMENT).toFixed(2)
                }}
                required
                sx={{ mb: 2 }}
              />
              {bidError && <Alert severity="error" sx={{ mb: 2 }}>{bidError}</Alert>}
              {bidSuccess && <Alert severity="success" sx={{ mb: 2 }}>{bidSuccess}</Alert>}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseBidModal}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Place Bid
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </>
  );
};

export default UserDashboard; 