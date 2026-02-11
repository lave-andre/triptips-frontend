import React, { useState } from 'react';

function CreateTrip({ onTripCreated, onBack }) {
  const [formData, setFormData] = useState({
    trip_name: '',
    organizer_name: '',
    trip_type: '',
    duration_days: 7
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch('https://triptips-backend.onrender.com/api/trip/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          onTripCreated(data.trip_id);
        } else {
          alert('Error creating trip');
        }
      })
      .catch(err => alert('Error: ' + err));
  };

  return (
    <div className="create-trip-view">
      <button className="btn btn-text" onClick={onBack}>← Back</button>
      
      <h2>Create a New Trip</h2>
      <p className="help-text">Set up your trip and we'll help you find the perfect destination</p>

      < onSubmit={handleSubmit} className="create-trip-form">
        <div className="form-group">
          <label>Trip Name</label>
          <input 
            type="text"
            className="input"
            placeholder="e.g., Summer Europe Trip 2026"
            value={formData.trip_name}
            onChange={(e) => setFormData({ ...formData, trip_name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Your Name (Organizer)</label>
          <input 
            type="text"
            className="input"
            placeholder="Enter your name"
            value={formData.organizer_name}
            onChange={(e) => setFormData({ ...formData, organizer_name: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Trip Type</label>
          <select 
            className="input"
            value={formData.trip_type}
            onChange={(e) => setFormData({ ...formData, trip_type: e.target.value })}
            required
          >
            <option value="">Select trip type</option>
            <option value="friends_vacation">Friends Vacation</option>
            <option value="couple_trip">Couple's Trip</option>
            <option value="family_with_kids">Family with Kids</option>
            <option value="family_without_kids">Family without Kids</option>
            <option value="corporate">Corporate / Team Building</option>
          </select>
        </div>

        <div className="form-group">
          <label>Trip Duration</label>
          <div className="duration-options">
            {[3, 5, 7, 10, 14].map(days => (
              <button
                key={days}
                type="button"
                className={`option-btn ${formData.duration_days === days ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, duration_days: days })}
              >
                {days} days
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-large">
          Create Trip →
        </button>
      </form>
    </div>
  );
}

export default CreateTrip;
