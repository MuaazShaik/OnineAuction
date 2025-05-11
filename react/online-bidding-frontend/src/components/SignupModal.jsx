import { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Alert, Link } from '@mui/material';
import { signup } from '../api';
import '../CSS/modal.css';

const SignupModal = ({ open, onClose, onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await signup({
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;
      if (data.startsWith('200::')) {
        onSignupSuccess();
        onClose();
      } else {
        setError(data.split('::')[1] || 'Signup failed');
      }
    } catch (error) {
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <Modal open={open} onClose={onClose} className="modal">
      <Box className="modal-content">
        <Typography variant="h5" component="h2" className="modal-title">
          Sign Up
        </Typography>

        {error && (
          <Alert severity="error" className="error-message">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <TextField
            fullWidth
            label="Full Name"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            required
            margin="normal"
          />

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

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
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
            Sign Up
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link href="#" onClick={() => { onClose(); setTimeout(() => { document.querySelector('.login-btn')?.click(); }, 200); }}>
            Already have an account? Login
          </Link>
        </Box>
      </Box>
    </Modal>
  );
};

export default SignupModal; 