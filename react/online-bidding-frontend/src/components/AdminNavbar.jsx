import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import GavelIcon from '@mui/icons-material/Gavel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LogoutIcon from '@mui/icons-material/Logout';
import '../CSS/navbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('isAdmin');
    navigate('/');
  };

  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/admin-dashboard" className="logo">
          Admin Panel
        </Typography>
        <Box className="nav-links">
          <Tooltip title="All Products">
            <IconButton color="inherit" component={Link} to="/products">
              <ListAltIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="All Categories">
            <IconButton color="inherit" component={Link} to="/admin/categories">
              <CategoryIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="All Orders">
            <IconButton color="inherit" component={Link} to="/orders">
              <ShoppingCartIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Transactions">
            <IconButton color="inherit" component={Link} to="/transactions">
              <ReceiptLongIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Bids">
            <IconButton color="inherit" component={Link} to="/admin/bids">
              <GavelIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Deliveries">
            <IconButton color="inherit" component={Link} to="/admin/deliveries">
              <LocalShippingIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar; 