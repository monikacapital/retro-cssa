const express = require("express");
const router = express.Router();

// Mock bazy danych zadań
let stories = [];

// GET /api/planning/:sessionId/stories - pobierz listę zadań
router.get('/:sessionId/stories', (req, res) => {
  res.json(stories);
});

// POST /api/planning/:sessionId/story - dodaj nowe zadanie
router.post('/:sessionId/story', (req, res) => {
  const { title, description, assignee } = req.body;
  if (!title) return res.status(400).json({ error: "Brak tytułu zadania" });

  const newStory = {
    id: Date.now(),
    title,
    description: description || "",
    assignee: assignee || null,
    estimations: {},
    votesRevealed: false,
    finalEstimation: null,
    created: new Date().toLocaleDateString('pl-PL')
  };

  stories.push(newStory);
  res.json(newStory);
});

// POST /api/planning/:sessionId/story/:storyId/estimate - dodaj estymację do zadania
router.post('/:sessionId/story/:storyId/estimate', (req, res) => {
  const { storyId } = req.params;
  const { user, value } = req.body;

  const story = stories.find(s => s.id == storyId);
  if (!story) return res.status(404).json({ error: "Zadanie nie znalezione" });

  story.estimations[user] = value;
  res.json({ ok: true });
});

// POST /api/planning/:sessionId/story/:storyId/reveal - ujawnij głosy
router.post('/:sessionId/story/:storyId/reveal', (req, res) => {
  const { storyId } = req.params;
  const story = stories.find(s => s.id == storyId);
  if (!story) return res.status(404).json({ error: "Zadanie nie znalezione" });

  story.votesRevealed = true;
  res.json({ ok: true });
});

// POST /api/planning/:sessionId/story/:storyId/finalize - zatwierdź estymację
router.post('/:sessionId/story/:storyId/finalize', (req, res) => {
  const { storyId } = req.params;
  const story = stories.find(s => s.id == storyId);
  if (!story) return res.status(404).json({ error: "Zadanie nie znalezione" });

  const numericVotes = Object.values(story.estimations).filter(v => typeof v === 'number');
  if (numericVotes.length === 0) return res.status(400).json({ error: "Brak estymacji liczbowych" });

  const sorted = [...numericVotes].sort((a, b) => a - b);
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  story.finalEstimation = median;
  res.json({ ok: true, finalEstimation: median });
});

// POST /api/planning/:sessionId/story/:storyId/assign - przypisz osobę do zadania
router.post('/:sessionId/story/:storyId/assign', (req, res) => {
  const { storyId } = req.params;
  const { assignee } = req.body;

  const story = stories.find(s => s.id == storyId);
  if (!story) return res.status(404).json({ error: "Zadanie nie znalezione" });

  story.assignee = assignee;
  res.json({ ok: true, story });
});

module.exports = router;
