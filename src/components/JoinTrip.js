import React, { useState } from 'react';

function JoinTrip({ onJoin, onBack }) {
  const [tripId, setTripId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`https://triptips-backend.onrender.com/api/trip/${tripId}`);
      const data = await response.json();

      if (data.success) {
        onJoin(tripId);
      } else {
        setError('Trip not found. Please check the ID and try again.');
      }
    } catch (err) {
      setError('Error connecting to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <button 
        onClick={onBack}
        style={{ background: 'none', border: 'none', color: '#667eea', cursor: 'pointer', marginBottom: '20px' }}
      >
        ← Back
      </button>

      <h1>Join a Trip</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Enter the trip ID that was shared with you
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Trip ID
          </label>
          <input
            type="text"
            value={tripId}
            onChange={(e) => setTripId(e.target.value.trim())}
            placeholder="e.g., abc123de"
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '16px',
              border: error ? '2px solid #f44336' : '2px solid #ddd',
              borderRadius: '8px'
            }}
          />
          {error && <p style={{ color: '#f44336', fontSize: '14px', marginTop: '5px' }}>{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '18px',
            background: loading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Loading...' : 'Join Trip'}
        </button>
      </form>
    </div>
  );
}

export default JoinTrip;
  );
}

export default JoinTrip;
