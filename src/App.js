import React, { useState, useEffect } from 'react';
import CreateTrip from './components/CreateTrip';
import JoinTrip from './components/JoinTrip';
import Results from './components/Results';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home'); // home, create, join, preferences, results
  const [tripId, setTripId] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [userName, setUserName] = useState(null);

	// Auto-join trip from URL
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/join\/([a-z0-9]+)/i);
    if (match) {
      const id = match[1];
      setTripId(id);
      setCurrentView('preferences');
    }
  }, []);

  const handleTripCreated = (id) => {
    setTripId(id);
    setCurrentView('share');
  };

  const handleJoinTrip = (id) => {
    setTripId(id);
    setCurrentView('preferences');
  };

  const handlePreferencesSubmitted = () => {
    setCurrentView('waiting');
  };

  const handleViewResults = (data) => {
    setTripData(data);
    setCurrentView('results');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🌍 TripTips</h1>
        <p className="tagline">Find the perfect destination for your group</p>
      </header>

      <main className="app-main">
	{currentView === 'loading' && (
          <div className="waiting-view">
            <h2>Loading trip details...</h2>
            <p>Please wait</p>
          </div>
        )}
        {currentView === 'home' && (
          <div className="home-view">
            <div className="hero-section">
              <h2>Planning a trip with friends?</h2>
              <p>Different preferences? No problem! Our algorithm finds destinations that make everyone happy.</p>
            </div>

            <div className="action-buttons">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => setCurrentView('create')}
              >
                🎯 Organize a Trip
              </button>
              
              <button 
                className="btn btn-secondary btn-large"
                onClick={() => setCurrentView('join')}
              >
                👥 Join a Trip
              </button>
            </div>

            <div className="how-it-works">
              <h3>How it works</h3>
              <div className="steps">
                <div className="step">
                  <span className="step-number">1</span>
                  <h4>Create Trip</h4>
                  <p>Set up your trip and invite friends</p>
                </div>
                <div className="step">
                  <span className="step-number">2</span>
                  <h4>Share Preferences</h4>
                  <p>Everyone fills out a quick 2-minute form</p>
                </div>
                <div className="step">
                  <span className="step-number">3</span>
                  <h4>Get Recommendations</h4>
                  <p>Our algorithm suggests the best destinations</p>
                </div>
                <div className="step">
                  <span className="step-number">4</span>
                  <h4>Vote & Book</h4>
                  <p>Pick your favorite and start planning!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'create' && (
          <CreateTrip 
            onTripCreated={handleTripCreated}
            onBack={() => setCurrentView('home')}
          />
        )}

        {currentView === 'share' && (
          <div className="share-view">
            <div className="success-message">
              <h2>✅ Trip Created!</h2>
              <p>Your trip ID: <strong>{tripId}</strong></p>
            </div>

            <div className="share-link-box">
              <h3>Share this link with your group:</h3>
              <div className="link-display">
                <input 
                  type="text" 
                  value={`${window.location.origin}/join/${tripId}`}
                  readOnly
                />
                <button 
                  className="btn btn-small"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/join/${tripId}`);
                    alert('Link copied!');
                  }}
                >
                  📋 Copy
                </button>
              </div>
            </div>

            <div className="next-steps">
              <p>Each person should click the link and fill out their preferences.</p>
              <p>Once everyone has submitted, come back to see the results!</p>
              
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setCurrentView('preferences');
                }}
              >
                Fill Out My Preferences
              </button>

              <button 
                className="btn btn-secondary"
                onClick={() => setCurrentView('home')}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {currentView === 'join' && (
          <JoinTrip 
            onJoin={handleJoinTrip}
            onBack={() => setCurrentView('home')}
          />
        )}

	{currentView === 'preferences' && (
	  <>
	    {tripData && (
	      <div className="info-box" style={{margin: '2rem auto', maxWidth: '600px'}}>
	        <h3>✈️ You're joining: {tripData.organizer_name}'s Trip</h3>
	        <p><strong>Type:</strong> {tripData.trip_type}</p>
	        <p><strong>Duration:</strong> {tripData.duration_days} days</p>
	        <p><strong>Participants:</strong> {tripData.participant_count}</p>
	      </div>
	    )}
	    <PreferencesForm 
	      tripId={tripId}
	      onSubmitted={handlePreferencesSubmitted}
	      onBack={() => setCurrentView('home')}
	      setUserName={setUserName}
	    />
	  </>
	)}

        {currentView === 'waiting' && (
          <div className="waiting-view">
            <h2>✅ Preferences Submitted!</h2>
            <p>Thanks, {userName}! Your preferences have been saved.</p>
            
            <div className="info-box">
              <p>Once everyone in your group has submitted their preferences, the organizer can calculate the results.</p>
            </div>

            <button 
              className="btn btn-primary"
              onClick={() => {
                // Fetch trip and check if ready to calculate
                fetch(`https://triptips-backend.onrender.com/api/trip/${tripId}`)
                  .then(r => r.json())
                  .then(data => {
                    if (data.success) {
                      const trip = data.trip;
                      if (trip.participants && trip.participants.length >= 2) {
				          setCurrentView('ready_calculate');
				        } else {
				          const count = trip.participants ? trip.participants.length : 0;
				          alert('Need at least 2 participants. Currently: ' + count);
				        }
				      }
				    })
				    .catch(err => alert('Error: ' + err));
				}}
            >
              Check if Ready to Calculate
            </button>

            <button 
              className="btn btn-secondary"
              onClick={() => setCurrentView('home')}
            >
              Done
            </button>
          </div>
        )}

        {currentView === 'ready_calculate' && (
          <div className="calculate-view">
            <h2>🎉 Everyone's In!</h2>
            <p>All preferences collected. Ready to see the results?</p>
            
            <button 
              className="btn btn-primary btn-large"
              onClick={() => {
                // Call calculate API
                fetch(`https://triptips-backend.onrender.com/api/trip/${tripId}/calculate`, {
                  method: 'POST'
                })
                  .then(r => r.json())
                  .then(data => {
                    if (data.success) {
                      handleViewResults(data.results);
                    } else {
                      alert('Error: ' + data.error);
                    }
                  })
                  .catch(err => alert('Error calculating: ' + err));
              }}
            >
              🚀 Calculate Matches
            </button>
          </div>
        )}

        {currentView === 'results' && (
          <Results 
            tripId={tripId}
            results={tripData}
            onBack={() => setCurrentView('home')}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Made with ❤️ for group travel planning</p>
      </footer>
    </div>
  );
}

// Preferences Form Component (inline for MVP)
function PreferencesForm({ tripId, onSubmitted, onBack, setUserName }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    geographic_preference: '',
    environment: [],
    style: [],
    activities: [],
    budget_range: [50, 150],
    climate: ''
  });

  const handleSubmit = () => {
    // Submit to API
    fetch(`https://triptips-backend.onrender.com/api/trip/${tripId}/preferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setUserName(formData.name);
          onSubmitted();
        } else {
          alert('Error: ' + data.error);
        }
      })
      .catch(err => alert('Error: ' + err));
  };

  const toggleArrayItem = (field, item) => {
    const current = formData[field];
    if (current.includes(item)) {
      setFormData({ ...formData, [field]: current.filter(i => i !== item) });
    } else {
      setFormData({ ...formData, [field]: [...current, item] });
    }
  };

  return (
    <div className="preferences-form">
      <div className="form-header">
        <h2>Share Your Preferences</h2>
        <p>Step {step} of 6</p>
      </div>

      <div className="form-content">
        {step === 1 && (
          <div className="form-step">
            <h3>What's your name?</h3>
            <input 
              type="text"
              className="input-large"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h3>Where would you like to go?</h3>
            <p className="help-text">Pick your preferred continent/region</p>
            <div className="options-grid">
              {['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Oceania', 'Anywhere'].map(geo => (
                <button
                  key={geo}
                  className={`option-btn ${formData.geographic_preference === geo ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, geographic_preference: geo })}
                >
                  {geo}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h3>What environments appeal to you?</h3>
            <p className="help-text">Pick your top 2-3</p>
            <div className="options-grid">
              {['beach', 'mountains', 'urban', 'countryside', 'nature', 'desert', 'tropical'].map(env => (
                <button
                  key={env}
                  className={`option-btn ${formData.environment.includes(env) ? 'selected' : ''}`}
                  onClick={() => toggleArrayItem('environment', env)}
                  disabled={formData.environment.length >= 3 && !formData.environment.includes(env)}
                >
                  {env}
                </button>
              ))}
            </div>
            <p className="selection-count">{formData.environment.length} / 3 selected</p>
          </div>
        )}

        {step === 4 && (
          <div className="form-step">
            <h3>What's your trip style?</h3>
            <p className="help-text">Pick your top 2</p>
            <div className="options-grid">
              {['relaxing', 'adventure', 'cultural', 'party', 'culinary', 'wellness', 'luxury', 'budget-friendly'].map(style => (
                <button
                  key={style}
                  className={`option-btn ${formData.style.includes(style) ? 'selected' : ''}`}
                  onClick={() => toggleArrayItem('style', style)}
                  disabled={formData.style.length >= 2 && !formData.style.includes(style)}
                >
                  {style}
                </button>
              ))}
            </div>
            <p className="selection-count">{formData.style.length} / 2 selected</p>
          </div>
        )}

        {step === 5 && (
          <div className="form-step">
            <h3>What activities excite you?</h3>
            <p className="help-text">Pick your top 3-5</p>
            <div className="options-grid">
              {['swimming', 'hiking', 'museums', 'nightlife', 'surfing', 'skiing', 'wine_tasting', 'shopping', 'diving', 'cycling', 'photography', 'wildlife', 'restaurants'].map(activity => (
                <button
                  key={activity}
                  className={`option-btn ${formData.activities.includes(activity) ? 'selected' : ''}`}
                  onClick={() => toggleArrayItem('activities', activity)}
                  disabled={formData.activities.length >= 5 && !formData.activities.includes(activity)}
                >
                  {activity.replace('_', ' ')}
                </button>
              ))}
            </div>
            <p className="selection-count">{formData.activities.length} / 5 selected</p>
          </div>
        )}

        {step === 6 && (
          <div className="form-step">
            <h3>What's your budget?</h3>
            <p className="help-text">Daily budget per person (excluding flights)</p>
            <div className="budget-options">
              <button
                className={`option-btn ${formData.budget_range[1] === 50 ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, budget_range: [20, 50] })}
              >
                💵 Budget<br/>&lt;$50/day
              </button>
              <button
                className={`option-btn ${formData.budget_range[1] === 150 ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, budget_range: [50, 150] })}
              >
                💵💵 Moderate<br/>$50-150/day
              </button>
              <button
                className={`option-btn ${formData.budget_range[1] === 300 ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, budget_range: [150, 300] })}
              >
                💵💵💵 Comfortable<br/>$150-300/day
              </button>
              <button
                className={`option-btn ${formData.budget_range[1] === 500 ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, budget_range: [300, 500] })}
              >
                💵💵💵💵 Luxury<br/>$300+/day
              </button>
            </div>

            <h3 style={{marginTop: '2rem'}}>Climate preference?</h3>
            <div className="options-grid">
              {['warm', 'mild', 'cool', 'flexible'].map(climate => (
                <button
                  key={climate}
                  className={`option-btn ${formData.climate === climate ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, climate })}
                >
                  {climate}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="form-navigation">
        {step > 1 && (
          <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
            ← Back
          </button>
        )}
        
        {step < 6 && (
          <button 
            className="btn btn-primary" 
            onClick={() => setStep(step + 1)}
            disabled={
              (step === 1 && !formData.name) ||
              (step === 2 && !formData.geographic_preference) ||
              (step === 3 && formData.environment.length === 0) ||
              (step === 4 && formData.style.length === 0) ||
              (step === 5 && formData.activities.length === 0)
            }
          >
            Next →
          </button>
        )}

        {step === 6 && (
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={!formData.climate}
          >
            ✅ Submit
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
