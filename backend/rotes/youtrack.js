const express = require("express");
const router = express.Router();

// Mock zadania YouTrack
const mockTasks = [
  {
    id: "CS-1001",
    title: "Implementacja autoryzacji OAuth 2.0",
    description: "Dodanie obsługi logowania przez Microsoft Azure AD",
    estimation: null,
    assignee: null
  },
  {
    id: "CS-1002", 
    title: "Optymalizacja bazy danych raportów",
    description: "Przyspieszenie generowania raportów finansowych",
    estimation: 5,
    assignee: "jan@firma.pl"
  }
];

// GET /api/youtrack/tasks
router.get("/tasks", (req, res) => {
  res.json(mockTasks);
});

// GET /api/youtrack/task/:taskId - pobierz szczegóły zadania
router.get("/task/:taskId", (req, res) => {
  const { taskId } = req.params;
  const task = mockTasks.find(t => t.id === taskId);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: "Zadanie nie znalezione" });
  }
});

// POST /api/youtrack/assign - przypisz osobę do zadania
router.post("/assign", (req, res) => {
  const { taskId, assignee } = req.body;
  const taskIndex = mockTasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    mockTasks[taskIndex].assignee = assignee;
    res.json({ ok: true, task: mockTasks[taskIndex] });
  } else {
    res.status(404).json({ error: "Zadanie nie znalezione" });
  }
});

// POST /api/youtrack/export
router.post("/export", (req, res) => {
  const { stories } = req.body;
  res.json({
    ok: true,
    info: "Wyeksportowano do YouTrack (symulacja)",
    exportedStories: stories
  });
});

module.exports = router;
