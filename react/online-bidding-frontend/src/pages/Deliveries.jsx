import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AdminNavbar from '../components/AdminNavbar';
import { getAllDeliveries, updateDeliveryStatus } from '../api';

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await getAllDeliveries();
      setDeliveries(response.data);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setError('Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (deliveryId, newStatus) => {
    try {
      await updateDeliveryStatus(deliveryId, newStatus);
      setSuccess('Delivery status updated successfully!');
      fetchDeliveries(); // Refresh the list
    } catch (error) {
      console.error('Error updating delivery status:', error);
      setError('Failed to update delivery status');
    }
  };

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
          Deliveries
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

        <Grid container spacing={3}>
          {deliveries.length > 0 ? (
            deliveries.map((delivery) => (
              <Grid item xs={12} sm={6} md={4} key={delivery.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Delivery #{delivery.id}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Order ID: {delivery.orderId}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Address: {delivery.deliveryAddress}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={delivery.deliveryStatus}
                          label="Status"
                          onChange={(e) => handleStatusChange(delivery.id, e.target.value)}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Processing">Processing</MenuItem>
                          <MenuItem value="Shipped">Shipped</MenuItem>
                          <MenuItem value="Delivered">Delivered</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="h6" textAlign="center">
                No deliveries found
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default Deliveries; 