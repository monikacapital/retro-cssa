const express = require("express");
const router = express.Router();

// Mock users z Teams
const users = [
  { id: "1", name: "Jan Kowalski", role: "developer", presence: "online" },
  { id: "2", name: "Anna Nowak", role: "tester", presence: "away" },
  { id: "3", name: "Piotr PM", role: "pm", presence: "online" }
];

// GET /api/teams/users
router.get("/users", (req, res) => {
  res.json(users);
});

// POST /api/teams/message
router.post("/message", (req, res) => {
  const { channelId, message } = req.body;
  res.json({
    ok: true,
    info: `Wiadomość wysłana do kanału ${channelId} (symulacja)`,
    messagePreview: message
  });
});

// POST /api/teams/todo - dodaj zadanie do Teams TODO
router.post("/todo", (req, res) => {
  const { userId, task, description } = req.body;
  res.json({
    ok: true,
    info: `Zadanie dodane do TODO użytkownika ${userId} (symulacja)`,
    task: { id: Date.now(), task, description, status: "notStarted" }
  });
});

module.exports = router;
