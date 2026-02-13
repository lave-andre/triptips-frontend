import React, { useState } from 'react';

function JoinTrip({ tripId, tripData, onPreferencesSubmitted }) {
  const [userName, setUserName] = useState('');
  const [environment, setEnvironment] = useState([]);
  const [style, setStyle] = useState([]);
  const [activities, setActivities] = useState([]);
  const [budgetRange, setBudgetRange] = useState([50, 200]);

  // NEW: 20 environment types (same as CreateTrip)
  const environmentOptions = [
    'beach', 'mountains', 'urban', 'countryside', 'nature',
    'desert', 'tropical', 'islands', 'lakes', 'forests',
    'cliffs', 'coastal', 'gardens', 'valleys', 'waterfalls',
    'glaciers', 'fjords', 'historic-cities', 'modern-cities', 'small-towns'
  ];

  const styleOptions = [
    'romantic', 'adventure', 'party', 'cultural', 'nature',
    'luxury', 'budget-friendly', 'relaxing', 'active'
  ];

  // NEW: Categorized activities (60+ total, same as CreateTrip)
  const activityCategories = {
    '🌊 Water': ['swimming', 'surfing', 'diving', 'snorkeling', 'sailing', 'kayaking', 'paddle-boarding', 'jet-skiing', 'rafting', 'fishing', 'whale-watching', 'boat-tours'],
    '🎨 Cultural': ['museums', 'art-galleries', 'architecture', 'historical-sites', 'temples', 'churches', 'castles', 'palaces', 'cooking-classes', 'wine-tasting', 'tea-ceremonies', 'local-markets', 'festivals'],
    '🏔️ Adventure': ['hiking', 'rock-climbing', 'zip-lining', 'bungee-jumping', 'skydiving', 'paragliding', 'canyoning', 'caving', 'mountain-biking', 'horseback-riding', 'safari', 'wildlife-watching', 'volcano-trekking', 'glacier-hiking', 'desert-tours'],
    '❄️ Winter': ['skiing', 'snowboarding', 'ice-skating', 'sledding', 'snow-shoeing', 'husky-sledding'],
    '🧘 Wellness': ['spa', 'yoga', 'meditation', 'hot-springs', 'massage', 'wellness-retreats'],
    '🍽️ Food & Drink': ['fine-dining', 'street-food', 'food-tours', 'wine-tasting', 'brewery-tours', 'cooking-classes'],
    '🎉 Nightlife': ['nightclubs', 'bars', 'live-music', 'theater', 'concerts', 'casinos', 'rooftop-bars'],
    '🚶 Leisure': ['shopping', 'photography', 'cycling', 'walking-tours', 'golf', 'beach-clubs', 'parks', 'botanical-gardens', 'bird-watching', 'stargazing']
  };

  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const preferences = {
      name: userName,
      environment,
      style,
      activities,
      budget_range: budgetRange
    };

    try {
      const response = await fetch(`https://triptips-backend.onrender.com/api/trip/${tripId}/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) throw new Error('Failed to submit preferences');

      onPreferencesSubmitted(userName);
    } catch (error) {
      console.error('Error submitting preferences:', error);
      alert('Failed to submit preferences. Please try again.');
    }
  };

  const toggleSelection = (array, setArray, value) => {
    if (array.includes(value)) {
      setArray(array.filter(item => item !== value));
    } else {
      setArray([...array, value]);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ 
        background: '#f0f8ff', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '2px solid #2196F3'
      }}>
        <h2 style={{ margin: '0 0 10px 0' }}>Trip: {tripData?.trip_name || 'Loading...'}</h2>
        <p style={{ margin: '5px 0' }}>
          <strong>Organized by:</strong> {tripData?.organizer_name || 'Loading...'}
        </p>
        <p style={{ margin: '5px 0' }}>
          <strong>Destination:</strong> {tripData?.geographic_scope || 'Anywhere'}
        </p>
      </div>

      <h1>Submit Your Preferences</h1>
      <form onSubmit={handleSubmit}>
        {/* User Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Your Name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your name"
            required
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
        </div>

        {/* Environment */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Environment (select all that interest you)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {environmentOptions.map(env => (
              <button
                key={env}
                type="button"
                onClick={() => toggleSelection(environment, setEnvironment, env)}
                style={{
                  padding: '8px 16px',
                  border: '2px solid #ccc',
                  borderRadius: '20px',
                  background: environment.includes(env) ? '#4CAF50' : 'white',
                  color: environment.includes(env) ? 'white' : 'black',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {env}
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Travel Style
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {styleOptions.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSelection(style, setStyle, s)}
                style={{
                  padding: '8px 16px',
                  border: '2px solid #ccc',
                  borderRadius: '20px',
                  background: style.includes(s) ? '#2196F3' : 'white',
                  color: style.includes(s) ? 'white' : 'black',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Activities - Categorized */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Activities (select what you enjoy)
          </label>
          {Object.entries(activityCategories).map(([category, categoryActivities]) => (
            <div key={category} style={{ marginBottom: '15px', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  padding: '5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{category}</span>
                <span>{expandedCategories[category] ? '▼' : '▶'}</span>
              </button>
              {expandedCategories[category] && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                  {categoryActivities.map(activity => (
                    <button
                      key={activity}
                      type="button"
                      onClick={() => toggleSelection(activities, setActivities, activity)}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '15px',
                        background: activities.includes(activity) ? '#FF9800' : 'white',
                        color: activities.includes(activity) ? 'white' : 'black',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      {activity}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Budget Range */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Daily Budget Range: ${budgetRange[0]} - ${budgetRange[1]}
          </label>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '14px' }}>Min: ${budgetRange[0]}</label>
              <input
                type="range"
                min="15"
                max="500"
                step="5"
                value={budgetRange[0]}
                onChange={(e) => setBudgetRange([parseInt(e.target.value), budgetRange[1]])}
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '14px' }}>Max: ${budgetRange[1]}</label>
              <input
                type="range"
                min="15"
                max="500"
                step="5"
                value={budgetRange[1]}
                onChange={(e) => setBudgetRange([budgetRange[0], parseInt(e.target.value)])}
                style={{ width: '100%' }}
              />
            </div>
          </div>
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
            fontWeight: 'bold'
          }}
        >
          Submit Preferences
        </button>
      </form>
    </div>
  );
}

export default JoinTrip;
