const express = require("express");
const router = express.Router();

// Mock retro board
let retroNotes = {
  start: [],
  stop: [],
  continue: [],
  liked: [],
  learned: [],
  lacked: [],
  longed: []
};

// GET /api/retro/:sessionId
router.get("/:sessionId", (req, res) => {
  res.json(retroNotes);
});

// POST /api/retro/:sessionId/note
router.post("/:sessionId/note", (req, res) => {
  const { category, text } = req.body;
  if (!category || !text) return res.status(400).json({ error: "Brak danych" });
  
  const note = {
    id: Date.now(),
    text,
    votes: 0,
    category,
    author: req.session.user ? req.session.user.name : "Anonimowy",
    timestamp: new Date().toLocaleString("pl-PL")
  };
  
  retroNotes[category] = [...(retroNotes[category] || []), note];
  res.json(note);
});

// POST /api/retro/:sessionId/note/:noteId/vote
router.post("/:sessionId/note/:noteId/vote", (req, res) => {
  const { noteId } = req.params;
  let voted = false;
  
  for (const category in retroNotes) {
    retroNotes[category] = retroNotes[category].map(note => {
      if (note.id == noteId) {
        voted = true;
        return { ...note, votes: note.votes + 1 };
      }
      return note;
    });
  }
  
  if (voted) res.json({ ok: true });
  else res.status(404).json({ error: "Notatka nie znaleziona" });
});

// Action Items
let actionItems = [];

// GET /api/retro/:sessionId/actions
router.get("/:sessionId/actions", (req, res) => {
  res.json(actionItems);
});

// POST /api/retro/:sessionId/actions
router.post("/:sessionId/actions", (req, res) => {
  const { action, owner, deadline } = req.body;
  if (!action) return res.status(400).json({ error: "Brak treści akcji" });
  
  const item = {
    id: Date.now(),
    action,
    owner: owner || "Nieprzypisane",
    deadline: deadline || "Brak terminu",
    status: "TODO",
    created: new Date().toLocaleDateString("pl-PL")
  };
  
  actionItems.push(item);
  
  // Sync do Teams TODO (symulacja)
  if (owner && owner !== "Nieprzypisane") {
    console.log(`Sync do Teams TODO: ${action} -> ${owner}`);
  }
  
  res.json(item);
});

// DELETE /api/retro/:sessionId/actions/:id
router.delete("/:sessionId/actions/:id", (req, res) => {
  const { id } = req.params;
  actionItems = actionItems.filter(item => item.id != id);
  res.json({ ok: true });
});

module.exports = router;
