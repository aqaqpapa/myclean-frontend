import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const dummyBookings = [
  { id: 1, service: 'Home Cleaning', date: '2025-06-05', status: 'Confirmed', price: '$100', address: '123 Main St', provider: 'Cleaner Joe' },
  { id: 2, service: 'Office Cleaning', date: '2025-06-10', status: 'Pending', price: '$200', address: '456 Office Rd', provider: 'Cleaner Ann' },
];

function CustomerBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const booking = dummyBookings.find(b => b.id === Number(id));

  if (!booking) return <div>Booking not found</div>;

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>Back</button>
      <h2>Booking Details</h2>
      <p><strong>Service:</strong> {booking.service}</p>
      <p><strong>Date:</strong> {booking.date}</p>
      <p><strong>Status:</strong> {booking.status}</p>
      <p><strong>Price:</strong> {booking.price}</p>
      <p><strong>Address:</strong> {booking.address}</p>
      <p><strong>Service Provider:</strong> {booking.provider}</p>
    </div>
  );
}

export default CustomerBookingDetail;
