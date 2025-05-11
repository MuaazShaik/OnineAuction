import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { getFullname } from '../api';
import '../CSS/navbar.css';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

const Navbar = () => {
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      const email = localStorage.getItem('email');
      setIsAdmin(email === 'admin@gmail.com');
      getFullname(token)
        .then(response => {
          const data = response.data;
          if (data.startsWith('200::')) {
            setUserName(data.split('::')[1]);
          }
        })
        .catch(error => {
          console.error('Error fetching user name:', error);
          handleLogout();
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserName('');
    navigate('/');
  };

  const handleLoginSuccess = () => {
    window.location.reload();
  };

  const handleSignupSuccess = () => {
    setSignupModalOpen(false);
    setLoginModalOpen(true);
  };

  return (
    <AppBar position="static" className="navbar">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" className="logo">
          Online Bidding
        </Typography>
        
        <Box className="nav-links">
          <Button color="inherit" component={Link} to="/about">
            About Us
          </Button>
          {isLoggedIn ? (
            <Button color="inherit" onClick={handleLogout} className="logout-btn">
              Logout
            </Button>
          ) : (
            <>
              <Button color="inherit" onClick={() => setLoginModalOpen(true)} className="login-btn">
                Login
              </Button>
              <Button color="inherit" onClick={() => setSignupModalOpen(true)} className="signup-btn">
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>

      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <SignupModal
        open={signupModalOpen}
        onClose={() => setSignupModalOpen(false)}
        onSignupSuccess={handleSignupSuccess}
      />
    </AppBar>
  );
};

export default Navbar; 