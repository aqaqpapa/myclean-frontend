import React from 'react';
import { useNavigate } from 'react-router-dom';

function SetAvailability() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <h2>Set Pricing & Availability</h2>
      <p>Feature coming soon...</p>
      <button onClick={() => navigate(-1)}>← Back</button>
    </div>
  );
}

export default SetAvailability;
