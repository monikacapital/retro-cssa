import React, { useState, useEffect } from "react";
import { getAccountMappings, addAccountMapping, getTeamUsers, getYouTrackTasks } from "../api";

const AccountMatcher = ({ users }) => {
  const [mappings, setMappings] = useState([]);
  const [youtrackUsers, setYoutrackUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mappingsData, ytTasks] = await Promise.all([
        getAccountMappings(),
        getYouTrackTasks()
      ]);
      
      setMappings(mappingsData);
      
      // Symulacja użytkowników YouTrack (w prawdziwej wersji pobierz z API)
      const mockYtUsers = [
        { login: "jan@firma.pl", fullName: "Jan Kowalski", email: "jan@firma.pl" },
        { login: "anna@firma.pl", fullName: "Anna Nowak", email: "anna@firma.pl" },
        { login: "pm@firma.pl", fullName: "Piotr Manager", email: "pm@firma.pl" }
      ];
      setYoutrackUsers(mockYtUsers);
      
      // Generuj sugestie mapowań
      generateSuggestions(users, mockYtUsers, mappingsData);
      
    } catch (error) {
      console.error("Błąd ładowania danych:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSuggestions = (teamsUsers, ytUsers, existingMappings) => {
    const suggestions = [];
    const mappedTeamsIds = existingMappings.map(m => m.teamsId);
    
    teamsUsers.forEach(teamsUser => {
      if (!mappedTeamsIds.includes(teamsUser.id)) {
        // Znajdź potencjalne dopasowania
        const matches = ytUsers.filter(ytUser => {
          // Identyczny email
          if (teamsUser.email === ytUser.email) return true;
          
          // Podobne nazwy
          const teamsName = teamsUser.name.toLowerCase();
          const ytName = ytUser.fullName.toLowerCase();
          return teamsName.includes(ytName) || ytName.includes(teamsName);
        });
        
        if (matches.length > 0) {
          suggestions.push({
            teamsUser,
            youtrackMatches: matches,
            confidence: matches[0].email === teamsUser.email ? 'high' : 'medium'
          });
        }
      }
    });
    
    setSuggestions(suggestions);
  };

  const handleAddMapping = async (teamsId, youtrackId) => {
    try {
      await addAccountMapping(teamsId, youtrackId);
      loadData(); // Przeładuj dane
    } catch (error) {
      alert("Błąd dodawania mapowania: " + error.message);
    }
  };

  const handleAutoMatch = () => {
    suggestions.forEach(suggestion => {
      if (suggestion.confidence === 'high' && suggestion.youtrackMatches.length > 0) {
        handleAddMapping(suggestion.teamsUser.id, suggestion.youtrackMatches[0].login);
      }
    });
  };

  if (loading) {
    return (
      <div className="modern-card">
        <h2>🔗 Matchowanie kont Teams ↔ YouTrack</h2>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div className="loading"></div>
          <p>Ładowanie danych...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: "var(--primary-blue)", marginBottom: "32px" }}>
        🔗 Matchowanie kont Teams ↔ YouTrack
      </h2>

      {/* Status Overview */}
      <div className="modern-card">
        <h3>📊 Status mapowań</h3>
        <div className="statistics-grid">
          <div className="stat-item">
            <div className="stat-value">{mappings.length}</div>
            <div className="stat-label">Zmapowane konta</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{users.length - mappings.length}</div>
            <div className="stat-label">Niezmapowane</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{suggestions.length}</div>
            <div className="stat-label">Sugestie</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">
              {suggestions.filter(s => s.confidence === 'high').length}
            </div>
            <div className="stat-label">Wysokie dopasowania</div>
          </div>
        </div>
        
        {suggestions.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            <button className="btn btn-success" onClick={handleAutoMatch}>
              ⚡ Auto-mapuj wysokie dopasowania
            </button>
          </div>
        )}
      </div>

      {/* Current Mappings */}
      <div className="modern-card">
        <h3>✅ Aktywne mapowania</h3>
        {mappings.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>Brak zmapowanych kont.</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {mappings.map((mapping, index) => (
              <div key={index} className="mapping-item" style={{
                display: "flex",
                alignItems: "center",
                padding: "16px",
                background: "var(--background-tertiary)",
                borderRadius: "12px",
                border: "2px solid var(--success-green)"
              }}>
                <div style={{ flex: 1 }}>
                  <strong>{mapping.teamsEmail}</strong> (Teams)
                </div>
                <div style={{ margin: "0 16px", fontSize: "1.5em" }}>↔</div>
                <div style={{ flex: 1 }}>
                  <strong>{mapping.youtrackId}</strong> (YouTrack)
                </div>
                <button 
                  className="btn btn-danger"
                  style={{ marginLeft: "16px" }}
                  onClick={() => {
                    if (confirm("Usunąć mapowanie?")) {
                      // TODO: implementuj usuwanie
                    }
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="modern-card">
          <h3>💡 Sugestie mapowań</h3>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-item" style={{
              padding: "20px",
              margin: "16px 0",
              background: "var(--background-secondary)",
              borderRadius: "12px",
              border: `2px solid ${suggestion.confidence === 'high' ? 'var(--success-green)' : 'var(--warning-orange)'}`
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                <span style={{
                  background: suggestion.confidence === 'high' ? 'var(--success-green)' : 'var(--warning-orange)',
                  color: 'white',
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "0.85em",
                  fontWeight: "600"
                }}>
                  {suggestion.confidence === 'high' ? '🎯 WYSOKIE' : '🔍 ŚREDNIE'}
                </span>
              </div>
              
              <div style={{ marginBottom: "16px" }}>
                <strong>Teams:</strong> {suggestion.teamsUser.name} ({suggestion.teamsUser.email})
              </div>
              
              <div style={{ marginBottom: "16px" }}>
                <strong>Potencjalne dopasowania YouTrack:</strong>
                {suggestion.youtrackMatches.map((match, idx) => (
                  <div key={idx} style={{
                    margin: "8px 0",
                    padding: "12px",
                    background: "var(--background-tertiary)",
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span>{match.fullName} ({match.login})</span>
                    <button
                      className="btn btn-success"
                      onClick={() => handleAddMapping(suggestion.teamsUser.id, match.login)}
                    >
                      ✅ Mapuj
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Mapping */}
      <div className="modern-card">
        <h3>🔧 Ręczne mapowanie</h3>
        <ManualMappingForm 
          teamsUsers={users.filter(u => !mappings.some(m => m.teamsId === u.id))}
          youtrackUsers={youtrackUsers}
          onAddMapping={handleAddMapping}
        />
      </div>
    </div>
  );
};

// Komponent do ręcznego mapowania
const ManualMappingForm = ({ teamsUsers, youtrackUsers, onAddMapping }) => {
  const [selectedTeams, setSelectedTeams] = useState("");
  const [selectedYouTrack, setSelectedYouTrack] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTeams && selectedYouTrack) {
      onAddMapping(selectedTeams, selectedYouTrack);
      setSelectedTeams("");
      setSelectedYouTrack("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Użytkownik Teams:
          </label>
          <select
            value={selectedTeams}
            onChange={(e) => setSelectedTeams(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "2px solid #E5E7EB"
            }}
          >
            <option value="">-- Wybierz --</option>
            {teamsUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Użytkownik YouTrack:
          </label>
          <select
            value={selectedYouTrack}
            onChange={(e) => setSelectedYouTrack(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "2px solid #E5E7EB"
            }}
          >
            <option value="">-- Wybierz --</option>
            {youtrackUsers.map(user => (
              <option key={user.login} value={user.login}>
                {user.fullName} ({user.login})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <button
        type="submit"
        className="btn btn-success"
        disabled={!selectedTeams || !selectedYouTrack}
      >
        ➕ Dodaj mapowanie
      </button>
    </form>
  );
};

export default AccountMatcher;
