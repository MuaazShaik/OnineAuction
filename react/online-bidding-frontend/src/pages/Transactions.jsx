import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import AdminNavbar from '../components/AdminNavbar';
import { getAllTransactions } from '../api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getAllTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions');
    } finally {
      setLoading(false);
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
          All Transactions
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <List>
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <Box key={transaction.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            Transaction ID: {transaction.id}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography component="span" variant="body2" color="text.primary">
                              Buyer: {transaction.buyerEmail}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="text.primary">
                              Product ID: {transaction.productId}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2" color="text.primary">
                              Amount: ${transaction.amount.toFixed(2)}
                            </Typography>
                            <br />
                            {new Date(transaction.transactionTime).toLocaleString()}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </Box>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No transactions found" />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default Transactions; 