import React, { useState, useEffect } from 'react';

function Results({ tripId, results, tripData, onBack }) {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [cities, setCities] = useState(null);
  const [votes, setVotes] = useState({});
  const [participantCount, setParticipantCount] = useState(0);

  const handleVote = (regionId) => {
    // In a real app, would get user name from session
    const userName = prompt("Enter your name to vote:");
    if (!userName) return;

    // Fetch current participant count
      useEffect(() => {
        fetch(`https://triptips-backend.onrender.com/api/trip/${tripId}`)
          .then(r => r.json())
          .then(data => {
            if (data.success && data.trip.participants) {
              setParticipantCount(data.trip.participants.length);
            }
          })
          .catch(err => console.error('Error fetching participant count:', err));
      }, [tripId]);

    fetch(`https://triptips-backend.onrender.com/api/trip/${tripId}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_name: userName,
        region_id: regionId
      })
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setVotes(data.vote_counts);
          alert('Vote recorded!');
        }
      });
  };

  const handleSelectRegion = (region) => {
    setSelectedRegion(region);
    
    // Fetch cities for this region
    fetch(`https://triptips-backend.onrender.com/api/trip/${tripId}/cities`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ region_id: region.region_id })
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setCities(data.cities);
        }
      })
      .catch(err => {
        alert('No detailed city data available for this region yet');
        setCities([]);
      });
  };

  if (cities && selectedRegion) {
    return (
      <div className="cities-view">
        <button className="btn btn-text" onClick={() => { setCities(null); setSelectedRegion(null); }}>
          ← Back to Regions
        </button>

        <h2>📍 Best Cities in {selectedRegion.region_name}</h2>
        <p className="help-text">Here are the top cities that match your group's preferences</p>

        {cities.length === 0 ? (
          <div className="info-box">
            <p>Detailed city data for this region is coming soon! For now, research cities in {selectedRegion.region_name} and plan your itinerary.</p>
          </div>
        ) : (
          <div className="cities-list">
            {cities.map((city, idx) => (
              <div key={idx} className="city-card">
                <div className="city-header">
                  <div>
                    <h3>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '📍'} {city.city_name}</h3>
                    <p className="match-badge">{city.match_percentage}% match</p>
                  </div>
                  <p className="budget">💰 ${city.budget_range[0]}-${city.budget_range[1]}/day</p>
                </div>

                {city.best_for && (
                  <p className="best-for">🎯 {city.best_for}</p>
                )}

                {city.pros && city.pros.length > 0 && (
                  <div className="pros-section">
                    <strong>Highlights:</strong>
                    <ul>
                      {city.pros.map((pro, i) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="user-fit">
                  <strong>Who it's best for:</strong>
                  {city.user_breakdown.map((user, i) => (
                    <div key={i} className="user-match">
                      <span className={`sentiment sentiment-${user.sentiment.toLowerCase().replace(' ', '-')}`}>
                        {user.sentiment}:
                      </span>
                      <span>{user.name} ({user.match_percentage.toFixed(0)}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="results-view">
      <button className="btn btn-text" onClick={onBack}>← Back to Home</button>

      <h2>🎯 Your Top Destination Matches{tripData?.trip_name ? ` for "${tripData.trip_name}"` : ''}!</h2>

      <div className="info-box" style={{marginBottom: '1rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <strong>👥 {participantCount} participant{participantCount !== 1 ? 's' : ''} submitted preferences</strong>
            <p style={{margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#666'}}>
              More people joined? Recalculate to include their preferences.
            </p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => {
              fetch(`https://triptips-backend.onrender.com/api/trip/${tripId}/calculate`, {
                method: 'POST'
              })
                .then(r => r.json())
                .then(data => {
                  if (data.success) {
                    // Reload the page to show new results
                    window.location.reload();
                  } else {
                    alert('Error recalculating: ' + data.error);
                  }
                })
                .catch(err => alert('Error: ' + err));
            }}
          >
            🔄 Recalculate
          </button>
        </div>
      </div>

      {results.geographic_analysis && results.geographic_analysis.is_split && (
        <div className="info-box warning">
          <strong>⚠️ Your group has diverse geographic preferences!</strong>
          <p>We've searched worldwide to find the best compromises.</p>
          <div className="geo-prefs">
            {Object.entries(results.geographic_analysis.preferences).map(([geo, count]) => (
              <span key={geo} className="geo-tag">{geo}: {count} vote{count > 1 ? 's' : ''}</span>
            ))}
          </div>
        </div>
      )}

      <p className="help-text">Based on everyone's preferences, here are your best options:</p>

      <div className="results-list">
        {results.regions.map((region, idx) => (
          <div key={idx} className="result-card">
            <div className="result-header">
              <div>
                <h3>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`} {region.region_name}</h3>
                <p className="country">{region.country}</p>
              </div>
              <div className="match-percentage">
                <div className="percentage-circle">
                  {region.match_percentage.toFixed(0)}%
                </div>
                <span>match</span>
              </div>
            </div>

            <div className="result-details">
              <p className="budget">💰 Budget: ${region.budget_range[0]}-${region.budget_range[1]}/day</p>
              
              <div className="tags">
                {region.environment.slice(0, 3).map((env, i) => (
                  <span key={i} className="tag tag-environment">{env}</span>
                ))}
                {region.style.slice(0, 3).map((style, i) => (
                  <span key={i} className="tag tag-style">{style}</span>
                ))}
              </div>

              {region.pros && region.pros.length > 0 && (
                <div className="pros-cons">
                  <div className="pros">
                    <strong>✅ Pros:</strong>
                    <ul>
                      {region.pros.map((pro, i) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {region.cons && region.cons.length > 0 && (
                <div className="pros-cons">
                  <div className="cons">
                    <strong>⚠️ Considerations:</strong>
                    <ul>
                      {region.cons.map((con, i) => (
                        <li key={i}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="user-breakdown">
                <strong>👥 Group Fit:</strong>
                {region.user_breakdown.map((user, i) => (
                  <div key={i} className="user-match-detail">
                    <div className="user-match-header">
                      <span className={`sentiment sentiment-${user.sentiment.toLowerCase().replace(' ', '-')}`}>
                        {user.sentiment}:
                      </span>
                      <span className="user-name">{user.name}</span>
                      <span className="user-percentage">({user.match_percentage.toFixed(0)}%)</span>
                    </div>
                    {user.match_reasons && user.match_reasons.length > 0 && (
                      <div className="match-reasons">
                        ↳ {user.match_reasons.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="result-actions">
              <button 
                className="btn btn-primary"
                onClick={() => handleSelectRegion(region)}
              >
                🏙️ See Cities in This Region
              </button>
              
              <button 
                className="btn btn-secondary"
                onClick={() => handleVote(region.region_id)}
              >
                🗳️ Vote for This
                {votes[region.region_id] && ` (${votes[region.region_id]} votes)`}
              </button>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(votes).length > 0 && (
        <div className="voting-summary">
          <h3>🗳️ Voting Results</h3>
          {Object.entries(votes)
            .sort((a, b) => b[1] - a[1])
            .map(([regionId, count]) => {
              const region = results.regions.find(r => r.region_id === regionId);
              return region ? (
                <div key={regionId} className="vote-result">
                  <strong>{region.region_name}</strong>: {count} vote{count > 1 ? 's' : ''}
                </div>
              ) : null;
            })}
        </div>
      )}
    </div>
  );
}

export default Results;
