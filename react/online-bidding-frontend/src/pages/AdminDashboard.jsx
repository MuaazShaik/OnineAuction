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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import AdminNavbar from '../components/AdminNavbar';
import {
  getDashboardSummary,
  getAllOrders,
  getAllProducts,
  getAllDeliveries,
} from '../api';

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [
        summaryResponse,
        ordersResponse,
        productsResponse,
        deliveriesResponse,
      ] = await Promise.all([
        getDashboardSummary(),
        getAllOrders(),
        getAllProducts(),
        getAllDeliveries(),
      ]);

      setSummary(summaryResponse.data);
      setRecentOrders(ordersResponse.data.slice(0, 5));
      setRecentProducts(productsResponse.data.slice(0, 5));
      setRecentDeliveries(deliveriesResponse.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to fetch admin data');
    }
  };

  const StatCard = ({ title, value }) => (
    <Card>
      <CardContent>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" color="primary">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <>
      <AdminNavbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {summary && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Total Users" value={summary.totalUsers} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Total Products" value={summary.totalProducts} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Total Bids" value={summary.totalBids} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Total Orders" value={summary.totalOrders} />
            </Grid>
          </Grid>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Orders
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>${order.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            {new Date(order.orderDate).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/orders')}
                  sx={{ mt: 2 }}
                >
                  View All Orders
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Products
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.id}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/products')}
                  sx={{ mt: 2 }}
                >
                  View All Products
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Deliveries
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Delivery ID</TableCell>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Address</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentDeliveries.map((delivery) => (
                        <TableRow key={delivery.id}>
                          <TableCell>{delivery.id}</TableCell>
                          <TableCell>{delivery.orderId}</TableCell>
                          <TableCell>{delivery.deliveryStatus}</TableCell>
                          <TableCell>{delivery.deliveryAddress}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default AdminDashboard; 