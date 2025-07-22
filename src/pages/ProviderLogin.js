import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ProviderLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch('https://myclean-backend.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernameOrEmail: email,
          password,
          role: 'Provider'
        }),
      });

      const data = await res.json();

      if (data.success) {
        login(data.user);
        navigate('/');
      } else {
        alert('Login failed: ' + data.message);
      }
    } catch (err) {
      alert('Network error. Please try again later.');
      console.error(err);
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/prologin-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 真正渲染 Header */}
      <Header />

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 6,
        }}
      >
        <Container
          maxWidth="xs"
          sx={{
            p: 4,
            bgcolor: '#fff8f0',
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
            Provider Login
          </Typography>

          <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
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
              Login
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 真正渲染 Footer */}
      <Footer />
    </div>
  );
}

export default ProviderLogin;
