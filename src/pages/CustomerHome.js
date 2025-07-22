import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Typography, Button, Stack, Box } from '@mui/material';

function CustomerHome() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.pendingNotification) {
      alert('Your booking has been accepted!');
      // 这里可以调用接口告诉后端用户已看过提醒，或本地清除 pendingNotification
      // 如果想清除pendingNotification，可以调用一个context里的方法更新user状态
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url('/images/customer_home_bg.jpg')`,
        backgroundSize: '50%',
        backgroundPosition: 'center 70%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Header />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 5,
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            bgcolor: 'rgba(230, 240, 250, 0.9)',
            p: 5,
            borderRadius: 4,
            boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              color: '#2f5d62',
              fontWeight: '700',
              mb: 3,
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            Welcome, {user?.username || 'Customer'}
          </Typography>

          <Typography
            align="center"
            sx={{
              mb: 6,
              color: '#4a6e6e',
              fontSize: '1.1rem',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            This is your dashboard
          </Typography>

          <Stack spacing={4}>
            <Button
              variant="contained"
              onClick={() => navigate('/customer-order')}
              sx={{
                background: 'linear-gradient(45deg, #a7d7a7, #6fb36f)',
                py: 1.8,
                fontSize: '1.2rem',
                width: '100%',
                fontWeight: '600',
                boxShadow: '0 6px 20px rgba(111,179,111,0.6)',
                borderRadius: '24px',
                color: '#1f3a1f',
                '&:hover': {
                  background: 'linear-gradient(45deg, #83c383, #4c8b4c)',
                },
              }}
            >
              Make a New Order
            </Button>

            <Button
              variant="contained"
              onClick={() => navigate('/customer-bookings')}
              sx={{
                background: 'linear-gradient(45deg, #a7d7a7, #6fb36f)',
                py: 1.8,
                fontSize: '1.2rem',
                width: '100%',
                fontWeight: '600',
                boxShadow: '0 6px 20px rgba(111,179,111,0.6)',
                borderRadius: '24px',
                color: '#1f3a1f',
                '&:hover': {
                  background: 'linear-gradient(45deg, #83c383, #4c8b4c)',
                },
              }}
            >
              View My Bookings
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate('/edit-profile')}
              sx={{
                color: '#2f5d62',
                borderColor: '#2f5d62',
                py: 1.8,
                fontSize: '1.2rem',
                width: '100%',
                borderRadius: '24px',
                fontWeight: '600',
                '&:hover': {
                  borderColor: '#1f3a3a',
                  backgroundColor: 'rgba(47,93,98,0.1)',
                },
              }}
            >
              Edit Address
            </Button>

            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                mt: 5,
                bgcolor: '#d9534f',
                '&:hover': { bgcolor: '#b33934' },
                color: '#fff',
                py: 1.8,
                fontSize: '1.2rem',
                width: '100%',
                borderRadius: '24px',
                fontWeight: '600',
              }}
            >
              Logout
            </Button>
          </Stack>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}

export default CustomerHome;
