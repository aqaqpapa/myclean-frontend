import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Container, Typography, Button, Stack, Paper, Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ProviderHome() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

  const [isAvailable, setIsAvailable] = useState(user?.providerInfo?.available ?? true);

  useEffect(() => {
    setIsAvailable(user?.providerInfo?.available ?? true);
  }, [user]);

  useEffect(() => {
    if (user?.pendingNotification) {
      alert('You have new bookings waiting for your confirmation!');
      // 同理，可以考虑调用接口告诉后端已查看，或前端更新pendingNotification状态
    }
  }, [user]);

  const toggleAvailability = async () => {
    if (!user?.id) {
      alert("User ID not found.");
      return;
    }

    const updatedUserPayload = {
      ...user,
      providerInfo: {
        ...user.providerInfo,
        available: !isAvailable,
      },
    };

    try {
      const res = await fetch(`https://myclean-backend.onrender.com/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUserPayload),
      });

      if (res.ok) {
        const updatedUserFromServer = await res.json();
        login(updatedUserFromServer);
      } else {
        alert("Failed to update availability.");
      }
    } catch (err) {
      console.error("Error updating availability:", err);
      alert("Network error.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/prohome-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 6,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={4}
            sx={{
              p: 5,
              borderRadius: 3,
              bgcolor: '#f4f9f9',
              boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" sx={{ color: '#2f5d62', fontWeight: 700, mb: 4 }}>
              Welcome, {user?.username || 'Cleaning Service Provider'}!
            </Typography>

            <Button
              variant="contained"
              onClick={toggleAvailability}
              sx={{
                bgcolor: isAvailable ? '#6fb36f' : '#888888',
                color: '#f0fff0',
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: '20px',
                py: 2,
                px: 5,
                mb: 5,
                '&:hover': {
                  bgcolor: isAvailable ? '#4c8b4c' : '#666666',
                },
              }}
            >
              {isAvailable ? '✅ Available for Work' : '❌ Currently Unavailable'}
            </Button>

            <Stack spacing={3}>
              <Button
                variant="outlined"
                onClick={() => navigate('/provider-bookings')}
                sx={{
                  borderColor: '#6fb36f',
                  color: '#2f5d62',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  borderRadius: '20px',
                  py: 1.8,
                  px: 5,
                  '&:hover': {
                    bgcolor: '#e6f0ea',
                    borderColor: '#4c8b4c',
                  },
                }}
              >
                Manage Booking Schedule
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate('/provider-income')}
                sx={{
                  borderColor: '#6fb36f',
                  color: '#2f5d62',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  borderRadius: '20px',
                  py: 1.8,
                  px: 5,
                  '&:hover': {
                    bgcolor: '#e6f0ea',
                    borderColor: '#4c8b4c',
                  },
                }}
              >
                View Income Statistics
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate('/provider-profile')}
                sx={{
                  borderColor: '#6fb36f',
                  color: '#2f5d62',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  borderRadius: '20px',
                  py: 1.8,
                  px: 5,
                  '&:hover': {
                    bgcolor: '#e6f0ea',
                    borderColor: '#4c8b4c',
                  },
                }}
              >
                Edit Profile
              </Button>

              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{
                  borderColor: '#d9534f',
                  color: '#d9534f',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  borderRadius: '20px',
                  py: 1.8,
                  px: 5,
                  '&:hover': {
                    bgcolor: '#f9d6d5',
                    borderColor: '#b52b27',
                  },
                }}
              >
                Logout
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </div>
  );
}

export default ProviderHome;
