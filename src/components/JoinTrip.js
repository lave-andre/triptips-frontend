import React, { useState } from 'react';

function JoinTrip({ onJoin, onBack }) {
  const [tripId, setTripId] = useState('');
  const [tripInfo, setTripInfo] = useState(null);
  const [error, setError] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    
    // Verify trip exists
    fetch(`https://triptips-backend.onrender.com/api/trip/${tripId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setTripInfo(data.trip);
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
      
      {tripInfo ? (
        <div className="info-box">
          <h3>✈️ {tripInfo.trip_name || 'Trip Details'}</h3>
          <p><strong>Organized by:</strong> {tripInfo.organizer_name}</p>
          <p><strong>Type:</strong> {tripInfo.trip_type}</p>
          <p><strong>Duration:</strong> {tripInfo.duration_days} days</p>
          <p><strong>Participants so far:</strong> {tripInfo.participant_count}</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default JoinTrip;
