import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ProviderOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectReasonMap, setRejectReasonMap] = useState({});
  const [rejectingOrderId, setRejectingOrderId] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch('https://myclean-backend.onrender.com/api/bookings')
      .then(res => res.json())
      .then(data => {
        const myOrders = data.filter(order => order.providerId === user.id);
        setOrders(myOrders);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to load orders.');
      })
      .finally(() => setLoading(false));
  }, [user]);

  const updateStatus = async (orderId, newStatus, rejectReason = '') => {
    const body = { status: newStatus };
    if (rejectReason) body.rejectReason = rejectReason;

    const res = await fetch(`https://myclean-backend.onrender.com/api/bookings/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setOrders(prev =>
        prev.map(o =>
          o.id === orderId ? { ...o, status: newStatus, rejectReason: rejectReason || o.rejectReason } : o
        )
      );
      alert(`Order marked as "${newStatus}"`);
      setRejectingOrderId(null);
      setRejectReasonMap(prev => ({ ...prev, [orderId]: '' }));
    } else {
      alert('Failed to update order status.');
    }
  };

  if (!user) return <p style={styles.loadingText}>Loading user info...</p>;
  if (loading) return <p style={styles.loadingText}>Loading orders...</p>;

  const pendingOrders = orders.filter(o => o.status === 'paid');
  const ongoingOrders = orders.filter(o => o.status === 'accepted');
  const finishedOrders = orders.filter(o => o.status === 'completed' || o.status === 'rejected');

  return (
    <div style={styles.pageWrapper}>
      <Header />
      <div style={styles.pageContainer}>
        <h2 style={styles.pageTitle}>Order Management</h2>

        <div style={styles.sectionsContainer}>
          {/* Pending Orders */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Pending Orders ({pendingOrders.length})</h3>
            {pendingOrders.length === 0 ? (
              <p style={styles.noOrdersText}>No pending orders</p>
            ) : (
              pendingOrders.map(order => (
                <div key={order.id} style={styles.card}>
                  <p><b>Customer ID:</b> {order.customerId}</p>
                  <p><b>Date:</b> {order.date}</p>
                  <p><b>Time:</b> {order.startTime} - {order.endTime}</p>
                  <p><b>Notes:</b> {order.notes || 'None'}</p>
                  <p><b>Status:</b> <span style={styles.statusPending}>Pending Acceptance</span></p>

                  <div style={styles.buttonGroup}>
                    <button
                      onClick={() => updateStatus(order.id, 'accepted')}
                      style={{ ...styles.button, ...styles.acceptButton }}
                    >
                      Accept
                    </button>

                    {rejectingOrderId === order.id ? (
                      <>
                        <input
                          type="text"
                          placeholder="Enter rejection reason"
                          value={rejectReasonMap[order.id] || ''}
                          onChange={e => setRejectReasonMap(prev => ({ ...prev, [order.id]: e.target.value }))}
                          style={styles.input}
                        />
                        <button
                          onClick={() => {
                            const reason = rejectReasonMap[order.id];
                            if (!reason || reason.trim() === '') {
                              alert('Please enter a rejection reason');
                              return;
                            }
                            updateStatus(order.id, 'rejected', reason);
                          }}
                          style={{ ...styles.button, ...styles.rejectButton }}
                        >
                          Confirm Reject
                        </button>
                        <button
                          onClick={() => setRejectingOrderId(null)}
                          style={{ ...styles.button, ...styles.cancelButton }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setRejectingOrderId(order.id)}
                        style={{ ...styles.button, ...styles.rejectButton }}
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Ongoing Orders */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Ongoing Orders ({ongoingOrders.length})</h3>
            {ongoingOrders.length === 0 ? (
              <p style={styles.noOrdersText}>No ongoing orders</p>
            ) : (
              ongoingOrders.map(order => (
                <div key={order.id} style={styles.card}>
                  <p><b>Customer ID:</b> {order.customerId}</p>
                  <p><b>Date:</b> {order.date}</p>
                  <p><b>Time:</b> {order.startTime} - {order.endTime}</p>
                  <p><b>Notes:</b> {order.notes || 'None'}</p>
                  <p><b>Status:</b> <span style={styles.statusOngoing}>Ongoing</span></p>
                  <button
                    onClick={() => updateStatus(order.id, 'completed')}
                    style={{ ...styles.button, ...styles.completeButton }}
                  >
                    Mark Completed
                  </button>
                </div>
              ))
            )}
          </section>

          {/* Finished Orders */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Finished Orders ({finishedOrders.length})</h3>
            {finishedOrders.length === 0 ? (
              <p style={styles.noOrdersText}>No finished orders</p>
            ) : (
              finishedOrders.map(order => (
                <div key={order.id} style={styles.card}>
                  <p><b>Customer ID:</b> {order.customerId}</p>
                  <p><b>Date:</b> {order.date}</p>
                  <p><b>Time:</b> {order.startTime} - {order.endTime}</p>
                  <p><b>Notes:</b> {order.notes || 'None'}</p>
                  <p>
                    <b>Status:</b>{' '}
                    <span
                      style={
                        order.status === 'completed' ? styles.statusCompleted : styles.statusRejected
                      }
                    >
                      {order.status === 'completed' ? 'Completed' : 'Rejected'}
                    </span>
                  </p>
                  {order.status === 'rejected' && order.rejectReason && (
                    <p style={styles.rejectReasonText}><b>Rejection Reason:</b> {order.rejectReason}</p>
                  )}
                </div>
              ))
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

const styles = {
  pageWrapper: {
    backgroundImage: 'url("/images/bookingbg.jpg")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  
  pageContainer: {
    maxWidth: '1100px',
    margin: '40px auto',
    padding: '0 24px 40px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#2c3e50',
    flexGrow: 1,
  },
  pageTitle: {
    fontSize: '30px',
    fontWeight: '700',
    marginBottom: '32px',
    borderBottom: '3px solid #d0e8ff',
    paddingBottom: '12px',
    color: '#3498db',
  },
  sectionsContainer: {
    display: 'flex',
    gap: '24px',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  section: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.05)',
    padding: '24px',
    maxHeight: '75vh',
    overflowY: 'auto',
    minWidth: '300px',
  },
  sectionTitle: {
    fontSize: '22px',
    marginBottom: '20px',
    color: '#2c3e50',
    borderBottom: '2px solid #e0f0ff',
    paddingBottom: '8px',
    fontWeight: '600',
  },
  noOrdersText: {
    color: '#95a5a6',
    fontStyle: 'italic',
    fontSize: '15px',
  },
  card: {
    background: 'linear-gradient(to right, #f0f9ff, #f6fffa)',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    border: '1px solid #d5eaf7',
  },
  buttonGroup: {
    marginTop: '16px',
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  button: {
    cursor: 'pointer',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '15px',
    transition: 'all 0.2s ease-in-out',
    flexShrink: 0,
    padding: '10px 20px',
    color: '#fff',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  },
  acceptButton: {
    backgroundColor: '#2ecc71',
  },
  rejectButton: {
    backgroundColor: '#e74c3c',
  },
  cancelButton: {
    backgroundColor: '#7f8c8d',
  },
  completeButton: {
    backgroundColor: '#3498db',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ccddee',
    fontSize: '15px',
    outlineColor: '#3498db',
    backgroundColor: '#ffffff',
  },
  statusPending: {
    color: '#f39c12',
    fontWeight: '600',
  },
  statusOngoing: {
    color: '#3498db',
    fontWeight: '600',
  },
  statusCompleted: {
    color: '#2ecc71',
    fontWeight: '600',
  },
  statusRejected: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  rejectReasonText: {
    color: '#e74c3c',
    marginTop: '8px',
    fontStyle: 'italic',
    fontSize: '14px',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#95a5a6',
    marginTop: '100px',
  },
};

export default ProviderOrdersPage;
