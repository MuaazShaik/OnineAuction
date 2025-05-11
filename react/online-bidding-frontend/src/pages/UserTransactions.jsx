import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Alert,
} from '@mui/material';
import UserNavbar from '../components/UserNavbar';
import { getTransactionsByUser } from '../api';

const UserTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const email = localStorage.getItem('email');

  useEffect(() => {
    fetchUserTransactions();
    // eslint-disable-next-line
  }, [email]);

  const fetchUserTransactions = async () => {
    try {
      const response = await getTransactionsByUser(email);
      setTransactions(response.data);
    } catch (error) {
      setError('Failed to fetch your transactions');
    }
  };

  return (
    <>
      <UserNavbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Transactions
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={3}>
          {transactions.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" textAlign="center">
                You have no transactions yet.
              </Typography>
            </Grid>
          )}
          {transactions.map((txn) => (
            <Grid item xs={12} sm={6} md={4} key={txn.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Transaction ID: {txn.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Buyer: {txn.buyerEmail}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Product ID: {txn.productId}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    Amount: ${txn.amount.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(txn.transactionDate).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default UserTransactions; 