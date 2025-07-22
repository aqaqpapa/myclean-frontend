import React from 'react';
import { useNavigate } from 'react-router-dom';

function ViewAppointments() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <h2>My Appointments</h2>
      <p>Feature coming soon...</p>
      <button onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
}

export default ViewAppointments;
