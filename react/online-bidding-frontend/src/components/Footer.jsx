import React from 'react';
import { Box, Typography, Container, Link, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  return (
    <Box sx={{
      background: '#e0e0e0',
      borderTop: '1px solid #e0e0e0',
      py: 4,
      mt: 8
    }}>
      <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: { xs: 2, md: 0 } }}>
          © {new Date().getFullYear()} Online Bidding Platform. All rights reserved.
        </Typography>
        <Box>
          <IconButton component={Link} href="https://github.com/" target="_blank" rel="noopener" color="inherit">
            <GitHubIcon />
          </IconButton>
          <IconButton component={Link} href="https://linkedin.com/" target="_blank" rel="noopener" color="inherit">
            <LinkedInIcon />
          </IconButton>
          <IconButton component={Link} href="mailto:support@onlinebidding.com" color="inherit">
            <EmailIcon />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 