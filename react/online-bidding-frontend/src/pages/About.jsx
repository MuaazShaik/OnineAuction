import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import Navbar from '../components/Navbar';

const About = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h3" gutterBottom color="primary">
            About Us
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Welcome to <b>Online Bidding</b>! We are dedicated to providing a secure, transparent, and user-friendly platform for online auctions and bidding. Our mission is to connect buyers and sellers in a seamless digital marketplace, making it easy to discover, bid on, and win unique products.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <b>Why choose us?</b> We offer real-time bidding, a secure wallet system, and a wide selection of products across various categories. Our team is committed to ensuring a safe and enjoyable experience for all users.
          </Typography>
          <Typography variant="body1">
            Thank you for choosing Online Bidding. If you have any questions or feedback, feel free to contact us. Happy bidding!
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default About; 