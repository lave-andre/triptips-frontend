import React, { useState } from 'react';

function JoinTrip({ onJoin, onBack }) {
  const [tripId, setTripId] = useState('');
  const [error, setError] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    
    // Verify trip exists
    fetch(`http://192.168.1.3:5001/api/trip/${tripId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          onJoin(tripId);
        } else {
          setError('Trip not found. Check the ID and try again.');
        }
      })
      .catch(err => {
        setError('Error connecting to server');
      });
  };

  return (
    <div className="join-trip-view">
      <button className="btn btn-text" onClick={onBack}>← Back</button>
      
      <h2>Join a Trip</h2>
      <p className="help-text">Enter the trip ID shared by your organizer</p>

      <form onSubmit={handleJoin} className="join-trip-form">
        <div className="form-group">
          <label>Trip ID</label>
          <input 
            type="text"
            className="input input-large"
            placeholder="e.g., abc123xy"
            value={tripId}
            onChange={(e) => {
              setTripId(e.target.value);
              setError('');
            }}
            required
          />
          {error && <p className="error-text">{error}</p>}
        </div>

        <button type="submit" className="btn btn-primary btn-large">
          Join Trip →
        </button>
      </form>
    </div>
  );
}

export default JoinTrip;
