import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Button, Paper } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';

function CustomerBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [providers, setProviders] = useState({});
  const [ratingMap, setRatingMap] = useState({});

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const bookingsRes = await fetch('http://localhost:3001/api/bookings');
      const bookingsData = await bookingsRes.json();

      const myBookings = bookingsData
        .map(b => ({
          rating: null,
          ...b,
        }))
        .filter(b => b.customerId === user.id);

      setBookings(myBookings);

      const usersRes = await fetch('http://localhost:3001/api/users');
      const usersData = await usersRes.json();

      const providerNames = {};
      usersData.forEach(u => {
        providerNames[u.id] = u.name;
      });
      setProviders(providerNames);
    };

    fetchData();
  }, [user]);

  const updateRating = async (orderId, rating) => {
    if (!rating) {
      alert('Please select a rating before submitting.');
      return;
    }

    const res = await fetch(`http://localhost:3001/api/bookings/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating }),
    });

    if (res.ok) {
      setBookings(prev =>
        prev.map(b =>
          b.id === orderId
            ? {
                ...b,
                rating,
              }
            : b
        )
      );
      alert('Thank you for your rating!');
    } else {
      alert('Failed to submit rating.');
    }
  };

  const categorized = {
    pending: [],
    paid: [],
    ongoing: [],
    finished: [],
  };

  bookings.forEach(b => {
    if (b.status === 'pending') categorized.pending.push(b);
    else if (b.status === 'paid') categorized.paid.push(b);
    else if (b.status === 'accepted') categorized.ongoing.push(b);
    else if (b.status === 'completed' || b.status === 'rejected') categorized.finished.push(b);
  });

  const renderBooking = (b, showRating = false) => (
    <Paper
      key={b.id}
      elevation={3}
      sx={{
        p: 2,
        mb: 2,
        borderRadius: 3,
        bgcolor: '#f4f9f9',
        boxShadow: '0 8px 20px rgba(0,0,0,0.05)',
      }}
    >
      <Typography variant="subtitle1" fontWeight="600" mb={0.5}>
        Order ID: {b.id}
      </Typography>
      <Typography variant="body2" color="#2f5d62" mb={0.5}>
        Provider: {providers[b.providerId] || b.providerId}
      </Typography>
      <Typography variant="body2" color="#4a6e6e" mb={0.5}>
        Date: {b.date}
      </Typography>
      <Typography variant="body2" color="#4a6e6e" mb={0.5}>
        Time: {b.startTime} - {b.endTime}
      </Typography>
      <Typography variant="body2" color="#6a8f8f" mb={1}>
        Status: {b.status}
      </Typography>

      {b.status === 'pending' && (
        <Button
          component={Link}
          to={`/payment/${b.id}`}
          variant="contained"
          sx={{
            bgcolor: 'linear-gradient(45deg, #a7d7a7, #6fb36f)',
            '&:hover': { bgcolor: 'linear-gradient(45deg, #83c383, #4c8b4c)' },
            color: '#1f3a1f',
            fontWeight: 600,
            borderRadius: '20px',
          }}
        >
          Go to Payment
        </Button>
      )}

      {showRating && b.status === 'completed' && b.rating == null && (
        <Box mt={2}>
          <Typography
            component="label"
            htmlFor={`rating-select-${b.id}`}
            sx={{ mr: 1, color: '#2f5d62', fontWeight: 600 }}
          >
            Rate this service:
          </Typography>
          <select
            id={`rating-select-${b.id}`}
            value={ratingMap[b.id] || ''}
            onChange={e => setRatingMap(prev => ({ ...prev, [b.id]: parseInt(e.target.value) }))}
            style={{
              padding: '6px 8px',
              borderRadius: 6,
              borderColor: '#6fb36f',
              fontWeight: '600',
              color: '#1f3a1f',
              marginRight: 12,
              minWidth: 120,
            }}
          >
            <option value="">Select rating</option>
            {[1, 2, 3, 4, 5].map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <Button
            variant="contained"
            onClick={() => updateRating(b.id, ratingMap[b.id])}
            sx={{
              bgcolor: '#6fb36f',
              '&:hover': { bgcolor: '#4c8b4c' },
              color: '#1f3a1f',
              fontWeight: 600,
              borderRadius: '20px',
              padding: '6px 16px',
            }}
          >
            Submit
          </Button>
        </Box>
      )}

      {showRating && b.status === 'completed' && b.rating != null && (
        <Typography mt={1} fontWeight="600" color="#2f5d62">
          Your rating: {b.rating}
        </Typography>
      )}
    </Paper>
  );

  const sectionStyle = {
    bgcolor: '#e6f0fa',
    p: 3,
    borderRadius: 3,
    mb: 4,
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: 'calc(100vh - 128px)', // 留出 header/footer 高度
          backgroundImage: `url('/images/booking-background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          py: 8,
        }}
      >
        <Container maxWidth="md" sx={{ bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 4, p: 4, boxShadow: 3 }}>
          <Typography variant="h4" mb={4} align="center" sx={{ color: '#2f5d62', fontWeight: 700 }}>
            Your Bookings
          </Typography>

          <Box sx={sectionStyle}>
            <Typography variant="h6" sx={{ color: '#4a6e6e', mb: 2 }}>
              🕐 Pending (Unpaid)
            </Typography>
            {categorized.pending.length === 0 ? (
              <Typography color="#6a8f8f">No unpaid bookings.</Typography>
            ) : (
              categorized.pending.map(b => renderBooking(b))
            )}
          </Box>

          <Box sx={sectionStyle}>
            <Typography variant="h6" sx={{ color: '#4a6e6e', mb: 2 }}>
              📥 Awaiting Acceptance
            </Typography>
            {categorized.paid.length === 0 ? (
              <Typography color="#6a8f8f">No paid bookings waiting for acceptance.</Typography>
            ) : (
              categorized.paid.map(b => renderBooking(b))
            )}
          </Box>

          <Box sx={sectionStyle}>
            <Typography variant="h6" sx={{ color: '#4a6e6e', mb: 2 }}>
              🚧 Ongoing
            </Typography>
            {categorized.ongoing.length === 0 ? (
              <Typography color="#6a8f8f">No ongoing bookings.</Typography>
            ) : (
              categorized.ongoing.map(b => renderBooking(b))
            )}
          </Box>

          <Box sx={sectionStyle}>
            <Typography variant="h6" sx={{ color: '#4a6e6e', mb: 2 }}>
              ✅ Finished
            </Typography>
            {categorized.finished.length === 0 ? (
              <Typography color="#6a8f8f">No finished bookings.</Typography>
            ) : (
              categorized.finished.map(b => renderBooking(b, true))
            )}
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default CustomerBookings;
