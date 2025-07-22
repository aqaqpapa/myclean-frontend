import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Customer',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (data.success) {
      alert('Registration successful!');
      navigate('/');
    } else {
      alert('Registration failed: ' + data.message);
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: 'calc(100vh - 128px)', // 减去Header和Footer高度，保证页面满屏
          backgroundImage: `url('/images/register-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <Container
          maxWidth="xs"
          sx={{
            p: 4,
            bgcolor: 'rgba(255, 248, 240, 0.85)', // 半透明背景提高可读性
            borderRadius: 3,
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: '700', color: '#d35400', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
          >
            Register
          </Typography>

          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={formData.role}
                label="Role"
                onChange={handleChange}
              >
                <MenuItem value="Customer">Customer</MenuItem>
                <MenuItem value="Provider">Cleaning Service Provider</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #ff9a76, #ff6126)',
                fontWeight: '600',
                fontSize: '1.1rem',
                borderRadius: '24px',
                boxShadow: '0 6px 20px rgba(255,97,38,0.6)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ff7b4a, #ff3700)',
                },
              }}
            >
              Register
            </Button>

            <Button
              fullWidth
              onClick={() => navigate('/')}
              sx={{
                mt: 2,
                py: 1.5,
                backgroundColor: '#999',
                color: '#fff',
                borderRadius: '24px',
                '&:hover': { backgroundColor: '#777' },
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default Register;
