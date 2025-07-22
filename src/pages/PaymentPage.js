import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import wechatQR from './wechatpay.jpg';

function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentCode, setShowPaymentCode] = useState(false);

  useEffect(() => {
    fetch(`https://myclean-backend.onrender.com/api/bookings/${orderId}`)
      .then(res => res.json())
      .then(data => setOrder(data))
      .catch(err => {
        console.error('Failed to load order:', err);
        alert('Failed to load order info.');
        navigate('/');
      });
  }, [orderId, navigate]);

  const handlePayment = async () => {
    if (!order) return;
    setLoading(true);
    try {
      const res = await fetch(`https://myclean-backend.onrender.com/api/bookings/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' }),
      });
      if (res.ok) {
        alert('Payment successful! Your provider has been notified.');
        navigate('/customer-home');
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Network error during payment.');
    } finally {
      setLoading(false);
    }
  };

  if (!order) return <div style={styles.loading}>Loading order info...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Payment for Order #{order.id}</h2>
      <div style={styles.info}>
        <p><strong>Provider:</strong> {order.providerId}</p>
        <p><strong>Date:</strong> {order.date}</p>
        <p><strong>Duration:</strong> {order.duration} hour(s)</p>
        <p><strong>Price:</strong> ${order.price}</p>
      </div>

      <div style={styles.buttonGroup}>
        <button
          onClick={() => setShowPaymentCode(true)}
          disabled={loading}
          style={{ ...styles.button, background: '#5ab1cb' }}
        >
          Show Payment Code
        </button>

        <button
          onClick={handlePayment}
          disabled={loading}
          style={{ ...styles.button, background: '#4e9a51' }}
        >
          {loading ? 'Confirming...' : 'I have paid'}
        </button>
      </div>

      {showPaymentCode && (
        <div style={styles.qrContainer}>
          <h4 style={styles.qrTitle}>Scan this code to pay:</h4>
          <img
            src={wechatQR}
            alt="Payment QR Code"
            style={styles.qrImage}
          />
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: '60px auto',
    padding: 30,
    background: 'linear-gradient(to bottom, #e6f2ec, #fafafa)',
    borderRadius: 16,
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.05)',
    fontFamily: "'Segoe UI', sans-serif",
    color: '#2c3e50',
  },
  loading: {
    fontFamily: "'Segoe UI', sans-serif",
    fontSize: '18px',
    textAlign: 'center',
    paddingTop: '100px'
  },
  title: {
    fontSize: '26px',
    marginBottom: '20px',
    color: '#2e7d58',
    textAlign: 'center'
  },
  info: {
    marginBottom: '30px',
    fontSize: '16px',
    lineHeight: '1.6',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  button: {
    padding: '10px 20px',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: '16px',
    cursor: 'pointer',
    minWidth: '150px',
    transition: 'background 0.3s ease',
  },
  qrContainer: {
    marginTop: 30,
    textAlign: 'center'
  },
  qrTitle: {
    marginBottom: 10,
    color: '#333'
  },
  qrImage: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  }
};

export default PaymentPage;
