import React, { useState, useEffect } from "react";
import RetroBoard from "./components/RetroBoard";
import PlanningPoker from "./components/PlanningPoker";
import UserList from "./components/UserList";
import RoleBasedView from "./components/RoleBasedView";
import AccountMatcher from "./components/AccountMatcher";
import { getCurrentUser, getTeamUsers, fetchRetroBoard, addRetroNote, voteRetroNote } from "./api";

// Szablony retrospektyw
const templates = {
  "start-stop-continue": {
    name: "Start/Stop/Continue",
    columns: [
      { id: "start", title: "🚀 START - Co zacząć robić?", color: "start" },
      { id: "stop", title: "🛑 STOP - Co przestać robić?", color: "stop" },
      { id: "continue", title: "✅ CONTINUE - Co robić dalej?", color: "continue" }
    ]
  },
  "4ls": {
    name: "4Ls",
    columns: [
      { id: "liked", title: "👍 LIKED - Co się podobało?", color: "liked" },
      { id: "learned", title: "🎓 LEARNED - Czego się nauczyliśmy?", color: "learned" },
      { id: "lacked", title: "❌ LACKED - Czego brakowało?", color: "lacked" },
      { id: "longed", title: "💭 LONGED - Za czym tęsknimy?", color: "longed" }
    ]
  }
};

function App() {
  // Stan główny aplikacji
  const [activeTab, setActiveTab] = useState("setup");
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(templates["start-stop-continue"]);
  const [sessionId, setSessionId] = useState("demo-session");
  
  // Stan retro
  const [retroData, setRetroData] = useState({
    start: [], stop: [], continue: [],
    liked: [], learned: [], lacked: [], longed: []
  });
  
  // Stan planning poker
  const [stories, setStories] = useState([]);
  const [actionItems, setActionItems] = useState([]);

  // Inicjalizacja aplikacji
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Pobierz aktualnego użytkownika
      const user = await getCurrentUser();
      setCurrentUser(user);
      
      // Pobierz użytkowników zespołu
      const teamUsers = await getTeamUsers();
      setUsers(teamUsers);
      
      // Pobierz dane retro
      const retro = await fetchRetroBoard(sessionId);
      setRetroData(retro);
      
    } catch (error) {
      console.error("Błąd inicjalizacji:", error);
      // W przypadku błędu autoryzacji - ustaw użytkownika demo
      setCurrentUser({ id: "demo", name: "Demo User", role: "pm" });
    }
  };

  // === RETRO FUNCTIONS ===
  const handleAddNote = async (category) => {
    const text = prompt(`Wpisz pomysł dla kategorii ${category.toUpperCase()}:`);
    if (text && text.trim()) {
      try {
        const note = await addRetroNote(sessionId, category, text.trim());
        setRetroData(prev => ({
          ...prev,
          [category]: [...(prev[category] || []), note]
        }));
      } catch (error) {
        console.error("Błąd dodawania notatki:", error);
        // Fallback - dodaj lokalnie
        const note = {
          id: Date.now(),
          text: text.trim(),
          votes: 0,
          category,
          author: currentUser?.name || "Anonimowy",
          timestamp: new Date().toLocaleString("pl-PL")
        };
        setRetroData(prev => ({
          ...prev,
          [category]: [...(prev[category] || []), note]
        }));
      }
    }
  };

  const handleVote = async (noteId, category) => {
    try {
      await voteRetroNote(sessionId, noteId);
      setRetroData(prev => ({
        ...prev,
        [category]: prev[category].map(note =>
          note.id === noteId ? { ...note, votes: note.votes + 1 } : note
        )
      }));
    } catch (error) {
      console.error("Błąd głosowania:", error);
    }
  };

  const handleDelete = (noteId, category) => {
    setRetroData(prev => ({
      ...prev,
      [category]: prev[category].filter(note => note.id !== noteId)
    }));
  };

  // === PLANNING POKER FUNCTIONS ===
  const handleAddStory = (title, description, assignee = null) => {
    const newStory = {
      id: Date.now(),
      title,
      description,
      assignee,
      estimations: {},
      votesRevealed: false,
      finalEstimation: null,
      created: new Date().toLocaleDateString("pl-PL")
    };
    setStories(prev => [...prev, newStory]);
  };

  const handleEstimate = (storyId, user, value) => {
    setStories(prev =>
      prev.map(story =>
        story.id === storyId
          ? { ...story, estimations: { ...story.estimations, [user]: value } }
          : story
      )
    );
  };

  const handleReveal = (storyId) => {
    setStories(prev =>
      prev.map(story =>
        story.id === storyId ? { ...story, votesRevealed: true } : story
      )
    );
  };

  const handleFinalize = (storyId) => {
    setStories(prev =>
      prev.map(story => {
        if (story.id === storyId) {
          const numericVotes = Object.values(story.estimations || {}).filter(v => typeof v === "number");
          if (numericVotes.length) {
            const sorted = [...numericVotes].sort((a, b) => a - b);
            const median = sorted.length % 2 === 0
              ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
              : sorted[Math.floor(sorted.length / 2)];
            return { ...story, finalEstimation: median, votesRevealed: true };
          }
        }
        return story;
      })
    );
  };

  const handleAssignStory = (storyId, assignee) => {
    setStories(prev =>
      prev.map(story =>
        story.id === storyId ? { ...story, assignee } : story
      )
    );
  };

  // === UI FUNCTIONS ===
  const handleTabClick = (tab) => setActiveTab(tab);

  const handleTemplateSelect = (templateKey) => {
    setSelectedTemplate(templates[templateKey]);
  };

  if (!currentUser) {
    return (
      <div className="container">
        <div className="header">
          <h1>🔄 RETRO_CSSA</h1>
          <p>Ładowanie aplikacji...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="header">
        <h1>🔄 RETRO_CSSA</h1>
        <p>Kompleksowa platforma retrospektyw i planowania zespołowego</p>
        <small>Zalogowany jako: {currentUser.name} ({currentUser.role})</small>
      </div>

      {/* Navigation */}
      <nav className="nav-tabs">
        <button className={`tab${activeTab === "setup" ? " active" : ""}`} onClick={() => handleTabClick("setup")}>
          ⚙️ Konfiguracja
        </button>
        <button className={`tab${activeTab === "planning" ? " active" : ""}`} onClick={() => handleTabClick("planning")}>
          📋 Planning Poker
        </button>
        <button className={`tab${activeTab === "checkin" ? " active" : ""}`} onClick={() => handleTabClick("checkin")}>
          👋 Check-in
        </button>
        <button className={`tab${activeTab === "retro" ? " active" : ""}`} onClick={() => handleTabClick("retro")}>
          🎯 Retrospektywa
        </button>
        <button className={`tab${activeTab === "accounts" ? " active" : ""}`} onClick={() => handleTabClick("accounts")}>
          🔗 Konta
        </button>
        <button className={`tab${activeTab === "summary" ? " active" : ""}`} onClick={() => handleTabClick("summary")}>
          📊 Raport
        </button>
      </nav>

      {/* Tab Content */}
      <div className={`tab-content${activeTab === "setup" ? " active" : ""}`}>
        <h2>🚀 Konfiguracja sesji retrospektywy</h2>
        <div className="setup-grid">
          <div className="modern-card">
            <h3>📋 Wybierz szablon retrospektywy</h3>
            {Object.keys(templates).map(key => (
              <div
                key={key}
                className={`template-option${selectedTemplate.name === templates[key].name ? " selected" : ""}`}
                onClick={() => handleTemplateSelect(key)}
              >
                <h4>{templates[key].name}</h4>
                <p>{templates[key].columns.map(col => col.title.split(' - ')[0]).join(" / ")}</p>
              </div>
            ))}
          </div>
          <UserList users={users} />
        </div>
      </div>

      <div className={`tab-content${activeTab === "planning" ? " active" : ""}`}>
        <RoleBasedView
          role={currentUser.role}
          pmView={
            <PlanningPoker
              stories={stories}
              currentUser={currentUser}
              users={users}
              role="pm"
              onAddStory={handleAddStory}
              onEstimate={handleEstimate}
              onReveal={handleReveal}
              onFinalize={handleFinalize}
              onAssign={handleAssignStory}
            />
          }
        >
          <PlanningPoker
            stories={stories}
            currentUser={currentUser}
            users={users}
            role={currentUser.role}
            onEstimate={handleEstimate}
          />
        </RoleBasedView>
      </div>

      <div className={`tab-content${activeTab === "checkin" ? " active" : ""}`}>
        <div className="modern-card">
          <h2>👋 Check-in zespołu</h2>
          <p>Wersja demonstracyjna check-in.</p>
        </div>
      </div>

      <div className={`tab-content${activeTab === "retro" ? " active" : ""}`}>
        <RetroBoard
          template={selectedTemplate}
          retroData={retroData}
          onAddNote={handleAddNote}
          onVote={handleVote}
          onDelete={handleDelete}
        />
      </div>

      <div className={`tab-content${activeTab === "accounts" ? " active" : ""}`}>
        <AccountMatcher users={users} />
      </div>

      <div className={`tab-content${activeTab === "summary" ? " active" : ""}`}>
        <div className="modern-card">
          <h2>📊 Raport i podsumowanie</h2>
          <p>Podsumowanie retro, action items, health check, eksport do Teams/YouTrack.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
