import React, { useState } from "react";
import TaskDetails from "./TaskDetails";
import AssignmentModal from "./AssignmentModal";

const POKER_CARDS = [0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100, "?", "∞", "☕"];

const PlanningPoker = ({
  stories,
  currentUser,
  users,
  role,
  onAddStory,
  onEstimate,
  onReveal,
  onFinalize,
  onAssign
}) => {
  const [selectedStoryId, setSelectedStoryId] = useState(null);
  const [userVote, setUserVote] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [youtrackTaskId, setYoutrackTaskId] = useState("");

  const selectedStory = stories.find((s) => s.id === selectedStoryId);
  const isPM = role === "pm";

  // Statystyki głosów
  const votes = selectedStory ? Object.values(selectedStory.estimations || {}) : [];
  const numericVotes = votes.filter((v) => typeof v === "number");
  const min = numericVotes.length ? Math.min(...numericVotes) : "-";
  const max = numericVotes.length ? Math.max(...numericVotes) : "-";
  const avg = numericVotes.length ? (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(1) : "-";
  const sorted = [...numericVotes].sort((a, b) => a - b);
  const median = numericVotes.length
    ? sorted.length % 2 === 0
      ? ((sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2).toFixed(1)
      : sorted[Math.floor(sorted.length / 2)]
    : "-";

  const handleVote = (card) => {
    setUserVote(card);
    if (selectedStory && onEstimate) {
      onEstimate(selectedStory.id, currentUser.name, card);
    }
  };

  const handleAddStoryClick = () => {
    const title = prompt("Tytuł zadania:");
    const description = prompt("Opis zadania:");
    if (title && onAddStory) {
      onAddStory(title, description);
    }
  };

  const handleSelectStory = (story) => {
    setSelectedStoryId(story.id);
    setUserVote(story.estimations?.[currentUser.name] || null);
  };

  const handleYouTrackSearch = () => {
    if (youtrackTaskId.trim()) {
      setShowTaskDetails(true);
    }
  };

  return (
    <div>
      <h2>📋 Planning Poker</h2>

      {/* YouTrack Integration */}
      <div className="modern-card youtrack-integration">
        <h3>🔗 Integracja z YouTrack</h3>
        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "16px" }}>
          <input
            type="text"
            placeholder="Wpisz numer zadania (np. CS-1234)"
            value={youtrackTaskId}
            onChange={(e) => setYoutrackTaskId(e.target.value)}
            style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "2px solid #E5E7EB" }}
          />
          <button className="btn" onClick={handleYouTrackSearch}>
            🔍 Pokaż zadanie
          </button>
        </div>
      </div>

      {/* Task Details from YouTrack */}
      {showTaskDetails && (
        <TaskDetails
          taskId={youtrackTaskId}
          onClose={() => setShowTaskDetails(false)}
          onAddToPlanning={(task) => {
            if (onAddStory) {
              onAddStory(task.title, task.description);
            }
            setShowTaskDetails(false);
          }}
        />
      )}

      {/* Add Story (PM only) */}
      {isPM && onAddStory && (
        <div style={{ marginBottom: 24 }}>
          <button className="btn btn-success" onClick={handleAddStoryClick}>
            + Dodaj zadanie do szacowania
          </button>
        </div>
      )}

      {/* Stories List */}
      <div className="modern-card">
        <h4>📝 Zadania do estymacji:</h4>
        {stories.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>Brak zadań. Dodaj pierwsze zadanie.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {stories.map((story) => (
              <li
                key={story.id}
                className={`story-item ${selectedStoryId === story.id ? "selected" : ""}`}
                onClick={() => handleSelectStory(story)}
              >
                <div className="story-title">
                  {story.finalEstimation ? "✅" : "⏳"} {story.title}
                  {story.assignee && (
                    <span style={{ color: "var(--accent-blue)", marginLeft: "8px" }}>
                      👤 {story.assignee}
                    </span>
                  )}
                </div>
                <div className="story-description">{story.description || "Brak opisu"}</div>
                <div className="story-meta">
                  <span>ID: {story.id}</span>
                  <span>
                    {story.finalEstimation
                      ? `Estymacja: ${story.finalEstimation} SP`
                      : "Nie oszacowane"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Estimation Section */}
      {selectedStory && (
        <div className="modern-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3>{selectedStory.title}</h3>
            {isPM && onAssign && (
              <button
                className="btn btn-secondary"
                onClick={() => setShowAssignmentModal(true)}
              >
                👤 Przypisz osobę
              </button>
            )}
          </div>
          
          <p>{selectedStory.description}</p>
          
          {selectedStory.assignee && (
            <p style={{ marginTop: "8px" }}>
              <strong>Przypisane do:</strong> {selectedStory.assignee}
            </p>
          )}

          <div>
            <strong>Twoja estymacja:</strong>{" "}
            {userVote !== null ? (
              <span style={{ color: "var(--success-green)" }}>{userVote}</span>
            ) : (
              <span style={{ color: "#FF9500" }}>brak</span>
            )}
          </div>

          {/* Poker Cards */}
          <div className="poker-cards" style={{ margin: "24px 0" }}>
            {POKER_CARDS.map((card) => (
              <div
                key={card}
                className={`poker-card${userVote === card ? " selected" : ""}${
                  typeof card !== "number" ? " special" : ""
                }`}
                onClick={() => handleVote(card)}
              >
                {card}
              </div>
            ))}
          </div>

          {/* Results (visible to PM or when revealed) */}
          {(isPM || selectedStory.votesRevealed) && (
            <div className="reveal-section show">
              <h4>📊 Wyniki głosowania:</h4>
              <div className="votes-display">
                {Object.entries(selectedStory.estimations || {}).map(([user, vote]) => (
                  <span className="vote-chip" key={user}>
                    <strong>{user}:</strong> {vote}
                  </span>
                ))}
              </div>
              <div className="statistics-grid">
                <div className="stat-item">
                  <div className="stat-value">{min}</div>
                  <div className="stat-label">Min</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{max}</div>
                  <div className="stat-label">Max</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{avg}</div>
                  <div className="stat-label">Średnia</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{median}</div>
                  <div className="stat-label">Mediana</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{numericVotes.length}</div>
                  <div className="stat-label">Głosy</div>
                </div>
              </div>
            </div>
          )}

          {/* PM Controls */}
          {isPM && (
            <div style={{ marginTop: 24 }}>
              {onReveal && (
                <button
                  className="btn btn-warning"
                  onClick={() => onReveal(selectedStory.id)}
                >
                  👁️ Ujawnij głosy
                </button>
              )}
              {onFinalize && (
                <button
                  className="btn btn-success"
                  onClick={() => onFinalize(selectedStory.id)}
                >
                  ✅ Zaakceptuj estymację
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <AssignmentModal
          users={users}
          onAssign={(assignee) => {
            if (onAssign && selectedStory) {
              onAssign(selectedStory.id, assignee);
            }
            setShowAssignmentModal(false);
          }}
          onClose={() => setShowAssignmentModal(false)}
        />
      )}
    </div>
  );
};

export default PlanningPoker;
