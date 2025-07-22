// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleDashboardClick = () => {
    if (!user) {
      alert('Uh-oh! You’re not logged in yet~ To use this function, please log in first, okay? (｡>﹏<｡)');
      return; // 阻止跳转
    }

    if (user.role === 'Customer') {
      navigate('/customer-home');
    } else if (user.role === 'Provider') {
      navigate('/provider-home');
    } else {
      navigate('/');
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#2f5d62' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        <Typography
          variant="h1"
          sx={{
            fontWeight: '900',
            letterSpacing: '0.15em',
            borderBottom: '4px solid #a7d7a7',
            pb: 1,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
            cursor: 'pointer',
          }}
          onClick={handleHomeClick}
        >
          MyClean
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            sx={{
              color: '#fff',
              borderColor: '#a7d7a7',
              fontWeight: '700',
              borderRadius: '28px',
              px: 4,
              py: 1.5,
              fontSize: '1.2rem',
              letterSpacing: '0.05em',
              '&:hover': {
                backgroundColor: 'rgba(167, 215, 167, 0.3)',
                borderColor: '#83c383',
              },
            }}
            onClick={handleHomeClick}
          >
            Home
          </Button>

          <Button
            variant="outlined"
            sx={{
              color: '#fff',
              borderColor: '#a7d7a7',
              fontWeight: '700',
              borderRadius: '28px',
              px: 4,
              py: 1.5,
              fontSize: '1.2rem',
              letterSpacing: '0.05em',
              '&:hover': {
                backgroundColor: 'rgba(167, 215, 167, 0.3)',
                borderColor: '#83c383',
              },
            }}
            onClick={handleDashboardClick}
          >
            Dashboard
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
