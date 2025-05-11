import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  CircularProgress,
} from '@mui/material';
import UserNavbar from '../components/UserNavbar';
import { getBalance, addMoney, getUserTransactions } from '../api';
import RefreshIcon from '@mui/icons-material/Refresh';

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [recentTransaction, setRecentTransaction] = useState(null);
  const email = localStorage.getItem('email');

  useEffect(() => {
    if (email) {
      fetchWalletData();
      fetchRecentTransaction();
    }
  }, [email]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const balanceResponse = await getBalance(email);
      setBalance(balanceResponse.data);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setError('Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTransaction = async () => {
    try {
      const txRes = await getUserTransactions(email);
      if (txRes.data && txRes.data.length > 0) {
        // Sort by transactionTime descending if not already
        const sorted = [...txRes.data].sort((a, b) => new Date(b.transactionTime) - new Date(a.transactionTime));
        setRecentTransaction(sorted[0]);
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      await addMoney(email, parseFloat(amount));
      setSuccess('Money added successfully!');
      setAmount('');
      fetchWalletData();
    } catch (error) {
      console.error('Error adding money:', error);
      setError('Failed to add money');
    }
  };

  if (loading) {
    return (
      <>
        <UserNavbar />
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress />
        </Container>
      </>
    );
  }

  return (
    <>
      <UserNavbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Wallet
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          sx={{ mb: 2 }}
          onClick={() => {
            fetchWalletData();
            fetchRecentTransaction();
          }}
        >
          Refresh
        </Button>

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
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Current Balance
                </Typography>
                <Typography variant="h3" color="primary" gutterBottom>
                  ${balance.toFixed(2)}
                </Typography>
                <form onSubmit={handleAddMoney}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        fullWidth
                        label="Amount to Add"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        inputProps={{ step: "0.01", min: "0" }}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ height: '100%' }}
                      >
                        Add Money
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Recent Transaction
                </Typography>
                {recentTransaction ? (
                  <>
                    <Typography variant="body1">
                      Amount: <b>${recentTransaction.amount}</b>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {new Date(recentTransaction.transactionTime).toLocaleString()}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No recent transaction found.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Wallet; 