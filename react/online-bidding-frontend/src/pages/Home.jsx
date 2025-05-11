import { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, CardMedia, Chip, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAllProducts } from '../api';
import '../CSS/home.css';
import SecurityIcon from '@mui/icons-material/Security';
import CategoryIcon from '@mui/icons-material/Category';
import PaymentIcon from '@mui/icons-material/Payment';
import Footer from '../components/Footer';

const API_BASE = 'http://localhost:8080';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <>
      <Navbar />
      
      <Container maxWidth="lg" className="home-container">
        <Box 
          className="hero-section"
          sx={{
            background: 'white',
            borderRadius: '20px',
            p: 8,
            mb: 8,
            color: '#1976d2',
            textAlign: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            className="hero-title"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              textShadow: '0 2px 8px rgba(33,150,243,0.08)'
            }}
          >
            Welcome to Online Bidding
          </Typography>
          
          <Typography 
            variant="h5" 
            className="hero-subtitle"
            sx={{
              opacity: 0.9,
              maxWidth: '800px',
              mx: 'auto',
              color: '#555'
            }}
          >
            Your trusted platform for online auctions and bidding
          </Typography>
        </Box>

        <Box className="features-section" sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            className="section-title"
            sx={{
              textAlign: 'center',
              mb: 4,
              fontWeight: 'bold',
              color: '#1976d2'
            }}
          >
            Why Choose Us?
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SecurityIcon sx={{ fontSize: 40, color: '#2196F3', mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Secure Bidding</Typography>
                </Box>
                <Typography>
                  Safe and secure bidding process with real-time updates and encrypted transactions
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CategoryIcon sx={{ fontSize: 40, color: '#2196F3', mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Wide Selection</Typography>
                </Box>
                <Typography>
                  Browse through a diverse range of products and categories with detailed descriptions
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PaymentIcon sx={{ fontSize: 40, color: '#2196F3', mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Easy Payments</Typography>
                </Box>
                <Typography>
                  Secure wallet system for hassle-free transactions and instant payment processing
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box className="products-section" sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            className="section-title"
            sx={{
              textAlign: 'center',
              mb: 4,
              fontWeight: 'bold',
              color: '#1976d2'
            }}
          >
            Featured Products
          </Typography>
          
          <Grid container spacing={4}>
            {products.slice(0, 6).map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="250"
                    image={product.photoUrl ? `${API_BASE}${product.photoUrl}` : 'https://via.placeholder.com/200'}
                    alt={product.name}
                    sx={{ 
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography 
                        gutterBottom 
                        variant="h6" 
                        component="div"
                        sx={{ 
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}
                      >
                        {product.name}
                      </Typography>
                      <Chip 
                        label={product.category} 
                        size="small" 
                        color="primary" 
                        sx={{ 
                          fontWeight: 'bold',
                          borderRadius: '12px'
                        }}
                      />
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 2,
                        fontSize: '0.95rem',
                        lineHeight: 1.5
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color="primary"
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '1.3rem'
                      }}
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Home; 