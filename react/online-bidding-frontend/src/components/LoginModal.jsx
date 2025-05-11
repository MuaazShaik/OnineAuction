import { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { signin } from '../api';
import { useNavigate } from 'react-router-dom';
import '../CSS/modal.css';

const LoginModal = ({ open, onClose, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await signin(formData);
      const data = response.data;

      if (data.startsWith('200::')) {
        const token = data.split('::')[1];
        localStorage.setItem('token', token);
        localStorage.setItem('email', formData.email);
        localStorage.setItem('isAdmin', formData.email === 'admin@gmail.com');
        onClose();
        if (formData.email === 'admin@gmail.com') {
          navigate('/admin-dashboard');
        } else {
          navigate('/user-dashboard');
        }
        if (onLoginSuccess) onLoginSuccess();
      } else {
        setError('Invalid credentials');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="modal">
      <Box className="modal-content">
        <Typography variant="h5" component="h2" className="modal-title">
          Login
        </Typography>

        {error && (
          <Alert severity="error" className="error-message">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="submit-button"
          >
            Login
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link href="#" onClick={() => { onClose(); setTimeout(() => { document.querySelector('.signup-btn')?.click(); }, 200); }}>
            Don't have an account? Sign Up
          </Link>
        </Box>
      </Box>
    </Modal>
  );
};

export default LoginModal; 