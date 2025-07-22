import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

function ProviderIncomeStats() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState('today'); // 默认显示今日收入

  useEffect(() => {
    if (!user) return;

    fetch('https://myclean-backend.onrender.com/api/bookings')
      .then(res => res.json())
      .then(data => {
        const completedOrders = data.filter(order =>
          order.providerId === user.id && order.status === 'completed'
        );
        setOrders(completedOrders);
      });
  }, [user]);

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMonthAgoDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  };

  const calculateIncome = () => {
    const todayStr = getTodayDateString();
    const monthAgo = getMonthAgoDate();

    let filtered = orders;

    if (view === 'today') {
      filtered = orders.filter(order => order.date === todayStr);
    } else if (view === 'month') {
      filtered = orders.filter(order => new Date(order.date) >= monthAgo);
    }
    // total 不过滤，全部收入

    return filtered.reduce((sum, order) => sum + Number(order.price), 0);
  };

  const income = calculateIncome();

  const renderIncomeMessage = () => {
    if (view === 'today') {
      if (income === 0) {
        return (
          <p style={styles.incomeMessageZero}>
            No coins jingling today, but tomorrow’s a new day! 🌱
          </p>
        );
      } else if (income > 0 && income < 100) {
        return (
          <p style={styles.incomeMessageLow}>
            Not bad! Keep hustling to hit the big bucks! 💪💰
          </p>
        );
      } else if (income >= 100) {
        return (
          <p style={styles.incomeMessageHigh}>
            Ka-ching! You’re on fire today! 🔥🔥🔥
          </p>
        );
      }
    } else if (view === 'total') {
      if (income === 0) {
        return (
          <p style={styles.incomeMessageZero}>
            Your treasure chest is empty... for now! 🏴‍☠️
          </p>
        );
      } else if (income > 0 && income < 1000) {
        return (
          <p style={styles.incomeMessageLow}>
            Steady and strong — your total income is growing! 📈✨
          </p>
        );
      } else if (income >= 1000) {
        return (
          <p style={styles.incomeMessageHigh}>
            Wow! You’ve built quite a fortune! 🏦💎
          </p>
        );
      }
    } else if (view === 'month') {
      if (income === 0) {
        return (
          <p style={styles.incomeMessageZero}>
            This month’s a quiet one — better days ahead! 🌙
          </p>
        );
      } else if (income > 0 && income < 500) {
        return (
          <p style={styles.incomeMessageLow}>
            A decent month, keep those coins rolling in! 🪙🙂
          </p>
        );
      } else if (income >= 500) {
        return (
          <p style={styles.incomeMessageHigh}>
            Crushing it this month! Keep up the amazing work! 🚀🎉
          </p>
        );
      }
    }
    return null;
  };

  if (!user) return <p style={styles.loading}>Loading user...</p>;

  return (
    <div style={styles.pageWrapper}>
      <Header />
      <main style={styles.container}>
        <h2 style={styles.title}>My Income Statistics</h2>

        <div style={styles.buttonGroup}>
          <button
            style={{ ...styles.button, ...(view === 'today' ? styles.activeButton : {}) }}
            onClick={() => setView('today')}
          >
            Today's Income
          </button>
          <button
            style={{ ...styles.button, ...(view === 'total' ? styles.activeButton : {}) }}
            onClick={() => setView('total')}
          >
            Total Income
          </button>
          <button
            style={{ ...styles.button, ...(view === 'month' ? styles.activeButton : {}) }}
            onClick={() => setView('month')}
          >
            Last 30 Days
          </button>
        </div>

        <div style={styles.resultBox}>
          <h3 style={styles.resultText}>
            {view === 'total' && 'Total Income:'}
            {view === 'today' && "Today's Income:"}
            {view === 'month' && 'Income in Last 30 Days:'} {' '}
            ${income.toFixed(2)}
          </h3>
          {renderIncomeMessage()}
        </div>
      </main>
      <Footer />
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: "url('/images/incomebg.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: '#2c3e50',
  },
  container: {
    flex: '1 0 auto',
    maxWidth: '600px',
    margin: '60px auto 80px',
    padding: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '12px',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: '26px',
    marginBottom: '30px',
    color: '#3498db',
    textAlign: 'center',
    borderBottom: '2px solid #d6ecff',
    paddingBottom: '10px',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '1px solid #d0eaf7',
    backgroundColor: '#e6f4ff',
    color: '#2c3e50',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
  },
  activeButton: {
    backgroundColor: '#3498db',
    color: '#ffffff',
    border: '1px solid #3498db',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
  },
  resultBox: {
    backgroundColor: '#f9fcff',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    border: '1px solid #dceefc',
  },
  resultText: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '12px',
  },
  incomeMessageZero: {
    color: '#888',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '22px',
    marginTop: 0,
  },
  incomeMessageLow: {
    color: '#3498db',
    fontWeight: '600',
    fontSize: '22px',
    marginTop: 0,
  },
  incomeMessageHigh: {
    color: '#e67e22',
    fontWeight: '700',
    fontSize: '22px',
    marginTop: 0,
  },
  loading: {
    textAlign: 'center',
    marginTop: '100px',
    color: '#95a5a6',
    fontSize: '16px',
  },
};

export default ProviderIncomeStats;
