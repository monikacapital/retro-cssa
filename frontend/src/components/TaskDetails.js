import React, { useState, useEffect } from "react";
import { getYouTrackTask } from "../api";

const TaskDetails = ({ taskId, onClose, onAddToPlanning }) => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const taskData = await getYouTrackTask(taskId);
        setTask(taskData);
        setError(null);
      } catch (err) {
        setError(err.message);
        setTask(null);
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  if (loading) {
    return (
      <div className="modern-card" style={{ position: "relative" }}>
        <button className="delete-btn" onClick={onClose}>×</button>
        <h3>🔍 Pobieranie zadania YouTrack...</h3>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div className="loading"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modern-card" style={{ position: "relative", borderLeft: "6px solid var(--error-red)" }}>
        <button className="delete-btn" onClick={onClose}>×</button>
        <h3>❌ Błąd pobierania zadania</h3>
        <p style={{ color: "var(--error-red)" }}>{error}</p>
        <p style={{ color: "var(--text-secondary)" }}>
          Sprawdź czy zadanie <strong>{taskId}</strong> istnieje w YouTrack.
        </p>
      </div>
    );
  }

  return (
    <div className="modern-card" style={{ position: "relative", borderLeft: "6px solid var(--success-green)" }}>
      <button className="delete-btn" onClick={onClose}>×</button>
      
      <h3 style={{ color: "var(--primary-blue)", marginBottom: "16px" }}>
        📋 {task.id || taskId}
      </h3>
      
      <div style={{ marginBottom: "16px" }}>
        <h4 style={{ color: "var(--text-primary)", marginBottom: "8px" }}>
          {task.title}
        </h4>
        <p style={{ color: "var(--text-secondary)", lineHeight: "1.5" }}>
          {task.description || "Brak szczegółowego opisu."}
        </p>
      </div>

      {task.assignee && (
        <div style={{ marginBottom: "16px" }}>
          <strong>Obecnie przypisane do:</strong> {task.assignee}
        </div>
      )}

      {task.estimation && (
        <div style={{ marginBottom: "16px" }}>
          <strong>Aktualna estymacja:</strong> {task.estimation} SP
        </div>
      )}

      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <button
          className="btn btn-success"
          onClick={() => onAddToPlanning(task)}
        >
          ➕ Dodaj do Planning Poker
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          Zamknij
        </button>
      </div>
    </div>
  );
};

export default TaskDetails;
