import React, { useState } from "react";

const AssignmentModal = ({ users, onAssign, onClose }) => {
  const [selectedUser, setSelectedUser] = useState("");

  const handleAssign = () => {
    if (selectedUser) {
      onAssign(selectedUser);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div className="modal-content modern-card" style={{
        maxWidth: "500px",
        width: "90%",
        maxHeight: "80vh",
        overflow: "auto"
      }}>
        <h3 style={{ color: "var(--primary-blue)", marginBottom: "24px" }}>
          👤 Przypisz zadanie do osoby
        </h3>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
            Wybierz osobę z zespołu:
          </label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "2px solid #E5E7EB",
              fontSize: "1em"
            }}
          >
            <option value="">-- Wybierz osobę --</option>
            {users.map((user) => (
              <option key={user.id} value={user.email || user.name}>
                {user.name} ({user.role}) {user.presence === "online" ? "🟢" : "⚪"}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Anuluj
          </button>
          <button
            className="btn btn-success"
            onClick={handleAssign}
            disabled={!selectedUser}
          >
            ✅ Przypisz
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;
