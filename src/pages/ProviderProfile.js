import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PRESET_TYPES = [
  'Home Cleaning',
  'Move-in/Out Cleaning',
  'Laundry Service',
  'Deep Sanitation',
  'Carpet Cleaning',
  'Window Cleaning',
  'Garden Maintenance',
  'Office Cleaning',
];

function ProviderProfile() {
  const { user, refreshUser } = useAuth();
  const [providerInfo, setProviderInfo] = useState({
    serviceTypes: [],
    location: '',
    hourlyRate: '',
    description: '',
    available: true,
  });

  const navigate = useNavigate();

  const parseServiceTypes = (input) => {
    if (!input) return [];
    if (Array.isArray(input)) return input;

    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        if (input.startsWith('[') && input.endsWith(']')) {
          return input
            .slice(1, -1)
            .split(',')
            .map((s) => s.replace(/^['"]|['"]$/g, '').trim())
            .filter(Boolean);
        }
        return input.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }
    return [];
  };

  useEffect(() => {
    if (user?.providerInfo) {
      const parsed = parseServiceTypes(user.providerInfo.serviceTypes);
      setProviderInfo({
        ...user.providerInfo,
        serviceTypes: parsed,
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?.id) return alert('User ID not found.');

    const updatedUser = {
      ...user,
      providerInfo: {
        ...providerInfo,
        // 这里关键：转为字符串，方便后端存储
        serviceTypes: JSON.stringify(providerInfo.serviceTypes),
      },
    };

    try {
      const res = await fetch(`https://myclean-backend.onrender.com/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });

      if (res.ok) {
        const result = await res.json();
        if (result?.success) {
          await refreshUser();
          alert('Provider profile updated successfully!');
          navigate('/provider-home');
        } else {
          alert('Update succeeded but user data was not returned.');
        }
      } else {
        alert('Failed to update provider profile.');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Network error occurred.');
    }
  };

  const toggleServiceType = (type) => {
    setProviderInfo((prev) => {
      const hasType = prev.serviceTypes.includes(type);
      return {
        ...prev,
        serviceTypes: hasType
          ? prev.serviceTypes.filter((t) => t !== type)
          : [...prev.serviceTypes, type],
      };
    });
  };

  return (
    <>
      <Header />
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <button onClick={() => navigate('/provider-home')} style={styles.backButton}>
            ← Back to Home
          </button>

          <h2 style={styles.title}>Edit Provider Profile</h2>

          <label style={styles.label}>Service Types (comma-separated)</label>
          <input
            type="text"
            value={providerInfo.serviceTypes.join(', ')}
            onChange={(e) =>
              setProviderInfo((prev) => ({
                ...prev,
                serviceTypes: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
              }))
            }
            style={styles.input}
          />

          <div style={{ marginBottom: 16 }}>
            {PRESET_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => toggleServiceType(type)}
                style={{
                  ...styles.typeButton,
                  backgroundColor: providerInfo.serviceTypes.includes(type)
                    ? '#4fb3a2'
                    : '#e0f0f5',
                  color: providerInfo.serviceTypes.includes(type)
                    ? 'white'
                    : '#2a7d8c',
                }}
              >
                {type}
              </button>
            ))}
          </div>

          <label style={styles.label}>Location</label>
          <input
            type="text"
            value={providerInfo.location}
            onChange={(e) =>
              setProviderInfo((prev) => ({ ...prev, location: e.target.value }))
            }
            style={styles.input}
          />

          <label style={styles.label}>Hourly Rate</label>
          <input
            type="number"
            value={providerInfo.hourlyRate}
            onChange={(e) =>
              setProviderInfo((prev) => ({ ...prev, hourlyRate: e.target.value }))
            }
            style={styles.input}
          />

          <label style={styles.label}>Description</label>
          <textarea
            value={providerInfo.description}
            onChange={(e) =>
              setProviderInfo((prev) => ({ ...prev, description: e.target.value }))
            }
            rows="4"
            style={styles.textarea}
          />

          <button onClick={handleSave} style={styles.saveButton}>
            Save Profile
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

const styles = {
  pageContainer: {
    minHeight: 'calc(100vh - 120px)',
    backgroundImage: "url('/images/cleanbg.jpg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center calc(50% - 90px)',
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  container: {
    maxWidth: '600px',
    width: '100%',
    padding: '40px',
    backgroundColor: 'rgba(245, 249, 247, 0.9)',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Segoe UI', sans-serif",
    color: '#2c3e50',
  },
  backButton: {
    background: '#5ab1cb',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '8px',
    cursor: 'pointer',
    marginBottom: '25px',
    transition: 'background 0.3s ease',
  },
  title: {
    fontSize: '26px',
    marginBottom: '30px',
    textAlign: 'center',
    color: '#2e7d58',
  },
  label: {
    fontWeight: '600',
    marginTop: '10px',
    marginBottom: '6px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #cce3d8',
    marginBottom: '15px',
    fontSize: '16px',
    backgroundColor: '#f5f9f7',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #cce3d8',
    marginBottom: '20px',
    fontSize: '16px',
    backgroundColor: '#f5f9f7',
    resize: 'vertical',
  },
  saveButton: {
    marginTop: '10px',
    width: '100%',
    background: 'linear-gradient(to right, #4e9a51, #8bc28c)',
    color: '#fff',
    fontSize: '16px',
    padding: '12px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  typeButton: {
    margin: '4px 6px',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
};

export default ProviderProfile;
