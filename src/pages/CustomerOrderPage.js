import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_BASE = 'https://myclean-backend.onrender.com';  // 线上后端地址

function CustomerOrderPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [providerRatings, setProviderRatings] = useState({});
  const [providerComments, setProviderComments] = useState({});
  const [filter, setFilter] = useState({ sortBy: 'rating' });
  const [searchServiceType, setSearchServiceType] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showCommentsFor, setShowCommentsFor] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    date: '',
    startTime: '',
    endTime: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  // 新增状态：是否显示确认订单弹窗
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const getServiceTypesDisplay = (data) => {
    if (!data) return 'No service types';
    if (Array.isArray(data)) {
      return data.join(', ');
    }
    if (typeof data === 'string') {
      try {
        const arr = JSON.parse(data);
        if (Array.isArray(arr)) {
          return arr.join(', ');
        }
      } catch {
        return data.split(',').map(s => s.trim()).join(', ');
      }
    }
    return 'No service types';
  };

  useEffect(() => {
    fetch(`${API_BASE}/api/users`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(u => u.role === 'Provider' && u.available);
        setProviders(filtered);
      })
      .catch(err => console.error('Failed to load providers:', err));

    fetch(`${API_BASE}/api/bookings`)
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error('Failed to load bookings:', err));
  }, []);

  useEffect(() => {
    const ratings = {};
    const comments = {};

    providers.forEach(provider => {
      const relevant = bookings.filter(b => b.providerId === provider.id && b.rating != null);
      if (relevant.length > 0) {
        const avgRating = (
          relevant.reduce((acc, cur) => acc + (cur.rating || 0), 0) / relevant.length
        ).toFixed(1);
        ratings[provider.id] = avgRating;
        comments[provider.id] = relevant.filter(b => b.comment && b.comment.trim() !== '');
      } else {
        ratings[provider.id] = null;
        comments[provider.id] = [];
      }
    });

    setProviderRatings(ratings);
    setProviderComments(comments);
  }, [bookings, providers]);

  const filteredProviders = providers.filter(p => {
    if (!searchServiceType.trim()) return true;

    let types = [];
    if (Array.isArray(p.serviceTypes)) {
      types = p.serviceTypes;
    } else if (typeof p.serviceTypes === 'string') {
      try {
        const parsed = JSON.parse(p.serviceTypes);
        if (Array.isArray(parsed)) types = parsed;
        else types = p.serviceTypes.split(',').map(s => s.trim());
      } catch {
        types = p.serviceTypes.split(',').map(s => s.trim());
      }
    }
    return types.some(t => t.toLowerCase().includes(searchServiceType.trim().toLowerCase()));
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    if (filter.sortBy === 'rating') {
      return (providerRatings[b.id] || 0) - (providerRatings[a.id] || 0);
    } else if (filter.sortBy === 'hourlyRate') {
      return (a.hourlyRate || 0) - (b.hourlyRate || 0);
    }
    return 0;
  });

  const handleOrderChange = e => {
    const { name, value } = e.target;
    setOrderDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateTime = (start, end) => {
    if (!start || !end) return false;
    return start < end;
  };

  const handleConfirmBooking = () => {
    if (!user) return alert('Please login first.');
    if (!orderDetails.date) return alert('Please select a date.');
    if (!validateTime(orderDetails.startTime, orderDetails.endTime)) {
      return alert('Please select a valid time range where start time is before end time.');
    }
    if (!selectedProvider) return alert('Please select a provider.');

    if (!user.location || user.location.trim() === '') {
      alert('Your address is empty. Please complete your profile address first.');
      navigate('/edit-profile');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleSubmitOrder = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    const [startHour, startMin] = orderDetails.startTime.split(':').map(Number);
    const [endHour, endMin] = orderDetails.endTime.split(':').map(Number);
    let duration = endHour + endMin / 60 - (startHour + startMin / 60);
    if (duration <= 0) duration = 1;

    const newOrder = {
      customerId: user.id,
      providerId: selectedProvider.id,
      date: orderDetails.date,
      startTime: orderDetails.startTime,
      endTime: orderDetails.endTime,
      duration,
      notes: orderDetails.notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
      price: selectedProvider.hourlyRate * duration,
    };

    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (res.ok) {
        const savedOrder = await res.json();
        alert('Order placed successfully! Redirecting to payment...');
        setSelectedProvider(null);
        setOrderDetails({ date: '', startTime: '', endTime: '', notes: '' });
        navigate(`/payment/${savedOrder.id}`);
      } else {
        alert('Failed to place the order. Please try again.');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      alert('Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div style={pageStyle}>
        <h2 style={titleStyle}>Browse Cleaning Service Providers</h2>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 'bold', fontSize: 16, marginRight: 8 }}>
            Search by service type:
          </label>
          <input
            type="text"
            placeholder="e.g. laundry, window"
            value={searchServiceType}
            onChange={e => setSearchServiceType(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 'bold', fontSize: 16, marginRight: 8 }}>Sort by:</label>
          <select
            value={filter.sortBy}
            onChange={e => setFilter({ sortBy: e.target.value })}
            style={selectStyle}
          >
            <option value="rating">Highest Rating</option>
            <option value="hourlyRate">Lowest Hourly Rate</option>
          </select>
        </div>

        <div style={providerListStyle}>
          {sortedProviders.length === 0 ? (
            <p>No providers match your search.</p>
          ) : (
            sortedProviders.map(p => (
              <div key={p.id} style={providerCardStyle}>
                <h3 style={providerNameStyle}>{p.username}</h3>
                <p><b>Description:</b> {p.description || 'No description'}</p>
                <p><b>Location:</b> {p.location || 'No location'}</p>
                <p><b>Service types:</b> {getServiceTypesDisplay(p.serviceTypes)}</p>
                <p><b>Hourly rate:</b> ${p.hourlyRate}/hr</p>
                <p>
                  <b>Rating:</b>{' '}
                  {providerRatings[p.id] ? providerRatings[p.id] + ' ★' : 'No ratings yet'}
                </p>
                <button
                  onClick={() => setShowCommentsFor(p.id)}
                  style={buttonSecondaryStyle}
                >
                  View Comments
                </button>
                <button
                  onClick={() => setSelectedProvider(p)}
                  style={buttonPrimaryStyle}
                >
                  Book Now
                </button>
              </div>
            ))
          )}
        </div>

        {showCommentsFor && (
          <div onClick={() => setShowCommentsFor(null)} style={modalBackdropStyle}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
              <h3>Comments for {providers.find(u => u.id === showCommentsFor)?.username}</h3>
              {providerComments[showCommentsFor]?.length > 0 ? (
                providerComments[showCommentsFor].map((c, idx) => (
                  <div key={idx} style={commentCardStyle}>
                    <p><b>Rating:</b> {c.rating} ★</p>
                    {c.comment && <p><i>{c.comment}</i></p>}
                    <p><small>{c.date}</small></p>
                  </div>
                ))
              ) : (
                <p><i>No comments available.</i></p>
              )}
              <button
                onClick={() => setShowCommentsFor(null)}
                style={buttonPrimaryStyle}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {selectedProvider && (
          <div style={modalBackdropStyle} onClick={() => setSelectedProvider(null)}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
              <h3>Book {selectedProvider.username}</h3>
              <label style={labelStyle}>Booking Date</label>
              <input
                type="date"
                name="date"
                value={orderDetails.date}
                onChange={handleOrderChange}
                style={inputStyle}
              />

              <label style={labelStyle}>Start Time</label>
              <select
                name="startTime"
                value={orderDetails.startTime}
                onChange={handleOrderChange}
                style={inputStyle}
              >
                <option value="">-- Select Start Time --</option>
                {Array.from({ length: 14 }, (_, i) => {
                  const hour = 9 + i;
                  return (
                    <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                      {hour}:00
                    </option>
                  );
                })}
              </select>

              <label style={labelStyle}>End Time</label>
              <select
                name="endTime"
                value={orderDetails.endTime}
                onChange={handleOrderChange}
                style={inputStyle}
              >
                <option value="">-- Select End Time --</option>
                {Array.from({ length: 14 }, (_, i) => {
                  const hour = 10 + i;
                  return (
                    <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                      {hour}:00
                    </option>
                  );
                })}
              </select>

              <label style={labelStyle}>Additional Notes</label>
              <textarea
                name="notes"
                value={orderDetails.notes}
                onChange={handleOrderChange}
                style={textareaStyle}
              />

              <button
                disabled={loading}
                onClick={handleConfirmBooking}
                style={buttonPrimaryStyle}
              >
                {loading ? 'Placing Order...' : 'Confirm Booking'}
              </button>

              <button
                onClick={() => setSelectedProvider(null)}
                style={{ ...buttonSecondaryStyle, marginTop: 10 }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {showConfirmModal && (
          <div style={modalBackdropStyle} onClick={() => setShowConfirmModal(false)}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
              <h3>Please Confirm Your Order</h3>
              <p><b>Customer:</b> {user.username}</p>
              <p><b>Address:</b> {user.location}</p>
              <p><b>Provider:</b> {selectedProvider.username}</p>
              <p><b>Date:</b> {orderDetails.date}</p>
              <p><b>Time:</b> {orderDetails.startTime} - {orderDetails.endTime}</p>
              <p><b>Notes:</b> {orderDetails.notes || '(none)'}</p>
              <p><b>Estimated Price:</b> ${(selectedProvider.hourlyRate * (
                (() => {
                  const [sh, sm] = orderDetails.startTime.split(':').map(Number);
                  const [eh, em] = orderDetails.endTime.split(':').map(Number);
                  let dur = eh + em / 60 - (sh + sm / 60);
                  if (dur <= 0) dur = 1;
                  return dur;
                })()
              )).toFixed(2)}</p>

              <button
                onClick={handleSubmitOrder}
                style={buttonPrimaryStyle}
              >
                Confirm and Pay
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{ ...buttonSecondaryStyle, marginTop: 10 }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </>
  );
}

const pageStyle = {
  backgroundColor: '#f5f9f8',
  minHeight: '100vh',
  padding: 24,
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  color: '#333',
};

const titleStyle = {
  fontSize: 28,
  fontWeight: '700',
  color: '#2a7d8c',
  marginBottom: 20,
  textAlign: 'center',
  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
};

const providerListStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: 20,
};

const providerCardStyle = {
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 20,
  boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  border: '1px solid #cce0d9',
  transition: 'transform 0.2s, box-shadow 0.2s',
};

const providerNameStyle = {
  fontSize: 22,
  fontWeight: '600',
  marginBottom: 10,
  color: '#2a7d8c',
};

const buttonPrimaryStyle = {
  padding: '12px 24px',
  fontSize: 16,
  fontWeight: '600',
  backgroundColor: '#4fb3a2',
  color: 'white',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  marginTop: 14,
  transition: 'background-color 0.3s',
};

const buttonSecondaryStyle = {
  padding: '10px 20px',
  fontSize: 15,
  backgroundColor: '#e0f0f5',
  color: '#2a7d8c',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  marginTop: 10,
  transition: 'background-color 0.3s',
};

const selectStyle = {
  padding: '10px 14px',
  fontSize: 16,
  borderRadius: 6,
  border: '1px solid #cce0d9',
  minWidth: 160,
};

const inputStyle = {
  padding: '10px 14px',
  fontSize: 16,
  borderRadius: 6,
  border: '1px solid #cce0d9',
  marginBottom: 16,
  width: 300,
  boxSizing: 'border-box',
};

const textareaStyle = {
  ...inputStyle,
  height: 80,
  resize: 'vertical',
};

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.35)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: 'white',
  borderRadius: 10,
  padding: 32,
  maxWidth: 520,
  width: '90%',
  maxHeight: '80vh',
  overflowY: 'auto',
  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
  border: '1px solid #cce0d9',
};

const labelStyle = {
  display: 'block',
  marginBottom: 8,
  fontSize: 15,
  fontWeight: '500',
  color: '#2a7d8c',
};

const commentCardStyle = {
  border: '1px solid #cce0d9',
  padding: 8,
  marginBottom: 8,
  borderRadius: 6,
  backgroundColor: '#f5f9f8',
};

export default CustomerOrderPage;
