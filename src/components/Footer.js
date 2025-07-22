// src/components/Footer.js
import React from 'react';
import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 4,
        textAlign: 'center',
        bgcolor: '#2f5d62',
        color: '#a7d7a7',
        fontSize: '0.9rem',
      }}
    >
      <Typography>
        &copy; {new Date().getFullYear()} MyClean. All rights reserved.
      </Typography>
      <Typography sx={{ mt: 1 }}>
        Contact us: <Link href="mailto:support@myclean.com" color="inherit">support@myclean.com</Link>
      </Typography>
    </Box>
  );
}
