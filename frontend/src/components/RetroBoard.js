import React from "react";

const RetroBoard = ({
  template,
  retroData,
  onAddNote,
  onVote,
  onDelete
}) => {
  if (!template) return <div>Wybierz szablon retrospektywy.</div>;

  return (
    <div>
      <div className="ai-panel">
        <h3>🤖 Capital Service AI Assistant</h3>
        <p>Inteligentny asystent pomoże automatycznie grupować podobne tematy i generować insights</p>
        <button className="btn" onClick={() => alert("AI grupowanie (demo)")}>
          🔗 Grupuj podobne tematy
        </button>
        <button className="btn" onClick={() => alert("AI insights (demo)")}>
          💡 Generuj insights
        </button>
        <button className="btn" onClick={() => alert("AI akcje (demo)")}>
          ⚡ Sugeruj akcje
        </button>
      </div>

      <div className={`retro-board board-${template.name.replace(/\s/g, "-").toLowerCase()}`}>
        {template.columns.map((column) => (
          <div className="column" key={column.id}>
            <h3 className={column.color}>{column.title}</h3>
            <div
              className="add-note"
              onClick={() => onAddNote(column.id)}
              role="button"
              tabIndex={0}
            >
              + Dodaj nowy pomysł
            </div>
            <div id={`${column.id}-notes`}>
              {(retroData[column.id] || [])
                .sort((a, b) => b.votes - a.votes)
                .map((note) => (
                  <div className="note" key={note.id}>
                    <button
                      className="delete-btn"
                      onClick={() => onDelete(note.id, column.id)}
                      title="Usuń notatkę"
                    >
                      ×
                    </button>
                    <div className="note-text">{note.text}</div>
                    <div className="note-meta">
                      <div className="vote-section">
                        <span>👍 {note.votes} głosów</span>
                        <button
                          className="vote-btn"
                          onClick={() => onVote(note.id, column.id)}
                        >
                          Głosuj
                        </button>
                      </div>
                      <small>
                        {note.author || "Anonimowy"} • {note.timestamp}
                      </small>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RetroBoard;
