import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

function CustomerEditProfile() {
  const { user, refreshUser } = useAuth();  // 新增 refreshUser
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.location) {
      setLocation(user.location);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) {
      alert("User ID not found.");
      return;
    }

    const updatedUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      password: '', // 空密码代表不修改密码，后端会处理
      location: location,
    };

    try {
      const res = await fetch(`http://localhost:3001/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (res.ok) {
        setStatus('success');
        await refreshUser();  // 关键：保存成功后刷新用户信息
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error("Save error:", err);
      setStatus('error');
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: 'calc(100vh - 128px)',
          backgroundImage: 'url(/images/profile-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 4,
          paddingBottom: 4,
        }}
      >
        <Container maxWidth="sm" sx={{
          bgcolor: 'rgba(255, 255, 255, 0.85)',
          borderRadius: 3,
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          padding: 4,
        }}>
          <Button
            onClick={() => navigate('/customer-home')}
            variant="outlined"
            sx={{
              mb: 3,
              color: '#2f5d62',
              borderColor: '#6fb36f',
              borderRadius: '20px',
              '&:hover': {
                borderColor: '#4c8b4c',
                backgroundColor: '#e6f0ea',
              },
            }}
          >
            ← Back to Home
          </Button>

          <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#2f5d62', fontWeight: 700 }}>
            Edit Address
          </Typography>

          <TextField
            label="Address"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            margin="normal"
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 3,
                bgcolor: '#e6f0fa',
                color: '#1f3a1f',
              },
              '& label': { color: '#4a6e6e', fontWeight: 600 },
              '& input': { fontWeight: 600 },
            }}
          />

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              mt: 3,
              bgcolor: '#6fb36f',
              color: '#1f3a1f',
              fontWeight: 700,
              borderRadius: '20px',
              padding: '10px 24px',
              '&:hover': {
                bgcolor: '#4c8b4c',
              },
            }}
            fullWidth
          >
            Save Address
          </Button>

          {status === 'success' && (
            <Typography sx={{ mt: 2, color: 'green' }}>Address updated successfully!</Typography>
          )}
          {status === 'error' && (
            <Typography sx={{ mt: 2, color: 'red' }}>Failed to update address. Try again.</Typography>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default CustomerEditProfile;
