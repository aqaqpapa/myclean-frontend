import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Typography, TextField, Button, Box } from '@mui/material';

function CustomerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernameOrEmail: email,
          password,
          role: 'Customer'
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url('/images/customer_login_bg.jpg')`, // ✅ 背景图
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Header />

      {/* 主体内容区域 - 让登录框垂直居中 */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 5,
        }}
      >
        <Container
          maxWidth="xs"
          sx={{
            p: 4,
            bgcolor: 'rgba(230, 240, 250, 0.9)', // 半透明背景
            borderRadius: 3,
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: '700',
              color: '#2f5d62',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            Customer Login
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#7baacb',
                  },
                  '&:hover fieldset': {
                    borderColor: '#5394c3',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2f5d62',
                  },
                },
              }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#7baacb',
                  },
                  '&:hover fieldset': {
                    borderColor: '#5394c3',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#2f5d62',
                  },
                },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              sx={{
                mt: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #a7d7a7, #6fb36f)',
                fontWeight: '600',
                fontSize: '1.1rem',
                borderRadius: '24px',
                boxShadow: '0 6px 20px rgba(111,179,111,0.6)',
                color: '#1f3a1f',
                '&:hover': {
                  background: 'linear-gradient(45deg, #83c383, #4c8b4c)',
                },
              }}
            >
              Login
            </Button>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default CustomerLogin;
