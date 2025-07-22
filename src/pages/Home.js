import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stack,
  Grid,
} from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />

      {/* Hero 区域 */}
      <Box
        sx={{
          backgroundImage: `url('/images/hero_cleaning.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '75vh',
          color: '#fff',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Find Trusted Cleaning Help Anytime
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Book top-rated cleaners near you in seconds.
        </Typography>

        {/* 登录后显示跳转按钮 */}
        {user ? (
          <Button
            onClick={() =>
              user.role === 'Customer'
                ? navigate('/customer-home')
                : navigate('/provider-home')
            }
            variant="outlined"
            sx={{
              px: 4,
              py: 1.2,
              fontSize: '1rem',
              borderRadius: '20px',
              border: '2px solid #4caf50',
              color: '#4caf50',
              backgroundColor: '#ffffffdd',
              fontWeight: '600',
              maxWidth: '220px',
              width: '100%',
              transition: '0.3s',
              '&:hover': {
                backgroundColor: '#4caf50',
                color: '#fff',
              },
              mb: 3,
              mx: 'auto',
              display: 'block',
            }}
          >
            Go to Dashboard
          </Button>
        ) : (
          <Stack direction="row" spacing={4} justifyContent="center" mb={3}>
            <Button
              onClick={() => navigate('/login-customer')}
              variant="contained"
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                borderRadius: '28px',
                backgroundColor: '#a7d7a7',
                fontWeight: '600',
              }}
            >
              I am a Customer
            </Button>
            <Button
              onClick={() => navigate('/login-provider')}
              variant="contained"
              sx={{
                px: 6,
                py: 2,
                fontSize: '1.2rem',
                borderRadius: '28px',
                backgroundColor: '#8cc7e7',
                fontWeight: '600',
              }}
            >
              I am a Service Provider
            </Button>
          </Stack>
        )}

        {/* 注册按钮，只有未登录时显示 */}
        {!user && (
          <Button
            onClick={() => navigate('/register')}
            variant="outlined"
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              borderRadius: '28px',
              color: '#2f5d62',
              borderColor: '#2f5d62',
              fontWeight: '600',
              width: 'fit-content',
              margin: '0 auto',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                borderColor: '#557a95',
                color: '#557a95',
                boxShadow: '0 6px 20px rgba(85, 122, 149, 0.3)',
              },
            }}
          >
            Register
          </Button>
        )}
      </Box>

      {/* 服务介绍 */}
      <Box sx={{ bgcolor: '#f9f9f9', py: 8, px: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          What Services Can We Help With?
        </Typography>
        <Grid container spacing={4} justifyContent="center" mt={2}>
          {[
            { label: 'Home Cleaning', icon: '🧹' },
            { label: 'Move-in/Out Cleaning', icon: '🚚' },
            { label: 'Laundry Service', icon: '👕' },
            { label: 'Deep Sanitation', icon: '🦠' },
            { label: 'Carpet Cleaning', icon: '🧼' },
            { label: 'Window Cleaning', icon: '🪟' },
            { label: 'Garden Maintenance', icon: '🌳' },
            { label: 'Office Cleaning', icon: '🏢' },
          ].map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.label}>
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  border: '1px solid #ddd',
                  borderRadius: 3,
                  bgcolor: '#fff',
                  height: '100%',
                }}
              >
                <Typography variant="h2">{item.icon}</Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {item.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 如何使用平台 */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 3,
          gap: 5,
          bgcolor: '#fff',
        }}
      >
        <Box
          component="img"
          src="/images/how_it_works.jpg"
          alt="How it works"
          sx={{ maxWidth: '500px', borderRadius: 3 }}
        />
        <Box maxWidth="500px">
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            How MyClean Works
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ① Tell us what service you need.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ② Browse top-rated cleaning professionals.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ③ Book instantly and relax!
          </Typography>
        </Box>
      </Box>

      {/* 用户评价 */}
      <Box
        sx={{
          backgroundImage: `url('/images/testimonial_bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: 8,
          px: 3,
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
          What Our Users Say
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {[
            {
              name: 'Alice',
              feedback: '“MyClean matched me with a fantastic cleaner! Very professional.”',
            },
            {
              name: 'Jason',
              feedback: '“Booking a provider took less than 2 minutes. Amazing!”',
            },
            {
              name: 'Lily',
              feedback: '“This platform made my moving-out cleaning stress-free.”',
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Box
                sx={{
                  bgcolor: 'rgba(0,0,0,0.6)',
                  p: 3,
                  borderRadius: 2,
                  minHeight: '150px',
                }}
              >
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  {item.feedback}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
                  — {item.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Footer />
    </Box>
  );
}

export default Home;
