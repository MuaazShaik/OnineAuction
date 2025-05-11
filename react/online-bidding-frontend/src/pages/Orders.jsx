import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Alert,
  Box,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import AdminNavbar from '../components/AdminNavbar';
import { getAllOrders, getOrdersByUser } from '../api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async (email) => {
    try {
      setLoading(true);
      const response = await getOrdersByUser(email);
      setUserOrders(response.data);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      setError('Failed to fetch user orders');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUserEmailSubmit = (e) => {
    e.preventDefault();
    if (userEmail.trim()) {
      fetchUserOrders(userEmail);
    }
  };

  const renderOrderCard = (order) => (
    <Grid item xs={12} sm={6} md={4} key={order.id}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order #{order.id}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Buyer: {order.buyerEmail}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Product ID: {order.productId}
          </Typography>
          <Typography variant="h6" color="primary">
            Amount: ${order.amount.toFixed(2)}
          </Typography>
          <Typography color="textSecondary">
            Date: {new Date(order.orderDate).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Orders
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

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All Orders" />
            <Tab label="User Orders" />
          </Tabs>
        </Box>

        {tabValue === 0 ? (
          <Grid container spacing={3}>
            {orders.length > 0 ? (
              orders.map(renderOrderCard)
            ) : (
              <Grid item xs={12}>
                <Typography variant="h6" textAlign="center">
                  No orders found
                </Typography>
              </Grid>
            )}
          </Grid>
        ) : (
          <>
            <form onSubmit={handleUserEmailSubmit} style={{ marginBottom: '2rem' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="User Email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      height: '100%',
                      padding: '8px 16px',
                      backgroundColor: '#1976d2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Search Orders
                  </button>
                </Grid>
              </Grid>
            </form>

            <Grid container spacing={3}>
              {userOrders.length > 0 ? (
                userOrders.map(renderOrderCard)
              ) : (
                <Grid item xs={12}>
                  <Typography variant="h6" textAlign="center">
                    No orders found for this user
                  </Typography>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Container>
    </>
  );
};

export default Orders; 