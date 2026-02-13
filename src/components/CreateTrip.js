import React, { useState } from 'react';

function CreateTrip({ onTripCreated }) {
  const [tripName, setTripName] = useState('');
  const [organizerName, setOrganizerName] = useState('');
  const [geographicScope, setGeographicScope] = useState('Anywhere');
  const [duration, setDuration] = useState(7);
  const [tripType, setTripType] = useState('friends_adventure');
  const [familyAge, setFamilyAge] = useState('kids'); // for family trips
  const [corporateType, setCorporateType] = useState('teambuilding'); // for corporate

  const geographicOptions = [
    'Anywhere', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tripData = {
      trip_name: tripName,
      organizer_name: organizerName,
      geographic_scope: geographicScope,
      duration_days: duration,
      trip_type: tripType
    };

    try {
      const response = await fetch('https://triptips-backend.onrender.com/api/trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create trip');
      }

      const data = await response.json();
      onTripCreated(data.trip_id, tripName, organizerName);
    } catch (error) {
      console.error('Error creating trip:', error);
      alert(`Failed to create trip: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Create a New Trip</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Create a trip and share the link with your group. Everyone will submit their preferences, 
        and we'll find the perfect destination for you!
      </p>

      <form onSubmit={handleSubmit}>
        {/* Trip Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Trip Name *
          </label>
          <input
            type="text"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            placeholder="e.g., Summer Europe Adventure"
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '8px'
            }}
          />
        </div>

        {/* Organizer Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Your Name *
          </label>
          <input
            type="text"
            value={organizerName}
            onChange={(e) => setOrganizerName(e.target.value)}
            placeholder="Your name"
            required
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '8px'
            }}
          />
        </div>

        {/* Geographic Scope */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Where do you want to go? *
          </label>
          <select
            value={geographicScope}
            onChange={(e) => setGeographicScope(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '12px', 
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              backgroundColor: 'white'
            }}
          >
            {geographicOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
            You can narrow down the search to a specific continent or search anywhere
          </p>
        </div>

        {/* Duration */}      
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Duration (days) *</label>
          <input type="number" min="1" max="30" value={duration} 
            onChange={(e) => setDuration(parseInt(e.target.value))}
            style={{ width: '100%', padding: '12px', fontSize: '16px', border: '2px solid #ddd', borderRadius: '8px' }} />
        </div>

        {/* Trip Type */}         
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Trip Type *
          </label>
          <select value={tripType} onChange={(e) => setTripType(e.target.value)} 
            style={{ width: '100%', padding: '12px', fontSize: '16px', border: '2px solid #ddd', borderRadius: '8px' }}>
            <option value="couple_romantic">Couple - Romantic</option>
            <option value="couple_adventure">Couple - Adventure</option>
            <option value="friends_party">Friends - Party</option>
            <option value="friends_adventure">Friends - Adventure</option>
            <option value="family">Family</option>
            <option value="corporate">Corporate</option>
            <option value="solo_backpacker">Solo - Backpacker</option>
            <option value="solo_luxury">Solo - Luxury</option>
          </select>
          
          {tripType === 'family' && (
            <select value={familyAge} onChange={(e) => setFamilyAge(e.target.value)}
              style={{ width: '100%', padding: '12px', fontSize: '16px', marginTop: '10px' }}>
              <option value="young_kids">Young Kids (0-5)</option>
              <option value="kids">Kids (6-12)</option>
              <option value="teens">Teens (13-17)</option>
            </select>
          )}
          
          {tripType === 'corporate' && (
            <select value={corporateType} onChange={(e) => setCorporateType(e.target.value)}
              style={{ width: '100%', padding: '12px', fontSize: '16px', marginTop: '10px' }}>
              <option value="formal">Formal Meeting</option>
              <option value="teambuilding">Team Building</option>
            </select>
          )}
        </div>
              
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '15px',
            fontSize: '18px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'background 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#45a049'}
          onMouseLeave={(e) => e.target.style.background = '#4CAF50'}
        >
          Create Trip & Get Share Link
        </button>
      </form>

      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        background: '#f0f8ff', 
        borderRadius: '8px',
        border: '1px solid #2196F3'
      }}>
        <h3 style={{ marginTop: 0 }}>📝 Next Steps:</h3>
        <ol style={{ marginBottom: 0, paddingLeft: '20px' }}>
          <li>Create your trip</li>
          <li>Share the link with your group</li>
          <li>Everyone submits their preferences</li>
          <li>Click "Calculate Matches" to find your perfect destination!</li>
        </ol>
      </div>
    </div>
  );
}

export default CreateTrip;
