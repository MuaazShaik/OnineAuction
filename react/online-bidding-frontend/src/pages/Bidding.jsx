import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import Navbar from '../components/Navbar';
import { getHighestBid, getBidsForProduct, placeBid, getProductById } from '../api';

const Bidding = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [highestBid, setHighestBid] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProductAndBidData();
    const interval = setInterval(fetchProductAndBidData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [productId]);

  const fetchProductAndBidData = async () => {
    try {
      console.log('Fetching data for product:', productId);
      const [productResponse, highestBidResponse, bidsResponse] = await Promise.all([
        getProductById(productId),
        getHighestBid(productId),
        getBidsForProduct(productId),
      ]);
      
      console.log('Product Response:', productResponse);
      console.log('Highest Bid Response:', highestBidResponse);
      console.log('Bids Response:', bidsResponse);

      if (productResponse.data) {
        setProduct(productResponse.data);
      }
      if (highestBidResponse.data) {
        setHighestBid(highestBidResponse.data.bidAmount || 0);
      }
      if (bidsResponse.data) {
        setBids(bidsResponse.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch product and bid data: ' + (error.response?.data || error.message));
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= highestBid) {
      setError('Bid amount must be higher than the current highest bid');
      return;
    }

    try {
      const email = localStorage.getItem('email');
      if (!email) {
        navigate('/');
        return;
      }

      console.log('Placing bid:', {
        productId: parseInt(productId),
        buyerEmail: email,
        bidAmount: amount
      });

      const response = await placeBid({
        productId: parseInt(productId),
        buyerEmail: email,
        bidAmount: amount
      });

      console.log('Bid response:', response);

      if (response.data && response.data.includes('200::')) {
        setSuccess('Bid placed successfully!');
        setBidAmount('');
        fetchProductAndBidData();
      } else {
        setError(response.data || 'Failed to place bid');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      setError(error.response?.data || 'Failed to place bid');
    }
  };

  if (!product) {
    return (
      <>
        <Navbar />
        <Container>
          <Typography>Loading product details...</Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardMedia
                component="img"
                height="400"
                image={product.imageUrl || 'https://via.placeholder.com/400'}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body1" paragraph>
                  {product.description}
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  Current Highest Bid: ${highestBid.toFixed(2)}
                </Typography>

                <form onSubmit={handleBidSubmit}>
                  <TextField
                    fullWidth
                    label="Your Bid Amount"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    sx={{ mb: 2 }}
                    inputProps={{ step: "0.01", min: (highestBid || 0) + 0.01 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Place Bid
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Bids
                </Typography>
                <List>
                  {bids.map((bid, index) => (
                    <div key={bid.id}>
                      <ListItem>
                        <ListItemText
                          primary={`$${bid.bidAmount.toFixed(2)}`}
                          secondary={`${bid.buyerEmail} - ${new Date(bid.bidTime).toLocaleString()}`}
                        />
                      </ListItem>
                      {index < bids.length - 1 && <Divider />}
                    </div>
                  ))}
                  {bids.length === 0 && (
                    <ListItem>
                      <ListItemText primary="No bids yet" />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Bidding; 