import React from "react";

const UserList = ({ users = [], showMappingStatus = false }) => {
  // Mapowanie roli na czytelny opis i kolor
  const roleLabel = {
    developer: "Developer",
    tester: "Tester", 
    pm: "Project Manager",
    guest: "Gość"
  };
  
  const roleColor = {
    developer: "#4A90BE",
    tester: "#AF52DE", 
    pm: "#34C759",
    guest: "#FF9500"
  };

  // Mapowanie obecności na emoji/status
  const presenceIcon = {
    online: "🟢",
    offline: "⚪",
    away: "🟡", 
    busy: "🔴"
  };

  const presenceLabel = {
    online: "Online",
    offline: "Offline",
    away: "Nieobecny",
    busy: "Zajęty"
  };

  return (
    <div className="modern-card" style={{ marginBottom: 32 }}>
      <h3 style={{ color: "var(--primary-blue)", marginBottom: 24 }}>
        👥 Uczestnicy zespołu ({users.length})
      </h3>
      
      {users.length === 0 ? (
        <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "20px" }}>
          Brak użytkowników w zespole. Sprawdź połączenie z Teams.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((user) => (
            <li
              key={user.id}
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 16,
                padding: "12px 16px",
                borderBottom: "1px solid #F2F4F7",
                borderRadius: "8px",
                background: user.presence === "online" ? "rgba(52, 199, 89, 0.05)" : "var(--background-secondary)"
              }}
            >
              {/* Presence Icon */}
              <span 
                style={{ fontSize: "1.5em", marginRight: 12 }}
                title={presenceLabel[user.presence] || "Nieznany"}
              >
                {presenceIcon[user.presence] || "⚪"}
              </span>
              
              {/* User Info */}
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: 600, 
                  marginBottom: 4,
                  color: "var(--text-primary)"
                }}>
                  {user.name}
                </div>
                
                {user.email && (
                  <div style={{ 
                    fontSize: "0.9em", 
                    color: "var(--text-secondary)",
                    marginBottom: 4
                  }}>
                    📧 {user.email}
                  </div>
                )}
                
                {showMappingStatus && (
                  <div style={{ 
                    fontSize: "0.85em", 
                    color: user.mappedToYouTrack ? "var(--success-green)" : "var(--warning-orange)" 
                  }}>
                    {user.mappedToYouTrack ? "✅ Zmapowane do YouTrack" : "⚠️ Brak mapowania YouTrack"}
                  </div>
                )}
              </div>
              
              {/* Role Badge */}
              <span
                style={{
                  background: roleColor[user.role] || "#E5E7EB",
                  color: "#fff",
                  fontWeight: 500,
                  borderRadius: 16,
                  padding: "4px 12px",
                  fontSize: "0.85em",
                  marginLeft: 12
                }}
              >
                {roleLabel[user.role] || user.role}
              </span>
              
              {/* Presence Label */}
              <span style={{
                fontSize: "0.8em",
                color: "var(--text-tertiary)",
                marginLeft: 8,
                minWidth: "60px",
                textAlign: "right"
              }}>
                {presenceLabel[user.presence] || "Nieznany"}
              </span>
            </li>
          ))}
        </ul>
      )}
      
      {/* Summary Statistics */}
      {users.length > 0 && (
        <div style={{ 
          marginTop: 20, 
          padding: "16px", 
          background: "var(--background-tertiary)", 
          borderRadius: "8px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "12px",
          fontSize: "0.9em"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: "600", color: "var(--success-green)" }}>
              {users.filter(u => u.presence === "online").length}
            </div>
            <div style={{ color: "var(--text-secondary)" }}>Online</div>
          </div>
          
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: "600", color: "var(--primary-blue)" }}>
              {users.filter(u => u.role === "developer").length}
            </div>
            <div style={{ color: "var(--text-secondary)" }}>Devs</div>
          </div>
          
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: "600", color: "var(--purple-accent)" }}>
              {users.filter(u => u.role === "tester").length}
            </div>
            <div style={{ color: "var(--text-secondary)" }}>Testers</div>
          </div>
          
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: "600", color: "var(--success-green)" }}>
              {users.filter(u => u.role === "pm").length}
            </div>
            <div style={{ color: "var(--text-secondary)" }}>PMs</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
