const express = require('express');
const router = express.Router();

// Mock mapowanie kont Teams <-> YouTrack
let accountMappings = [
  { teamsId: '1', teamsEmail: 'jan@firma.pl', youtrackId: 'jan@firma.pl' },
  { teamsId: '2', teamsEmail: 'anna@firma.pl', youtrackId: 'anna@firma.pl' },
  { teamsId: '3', teamsEmail: 'pm@firma.pl', youtrackId: 'pm@firma.pl' }
];

// GET /api/accounts/mappings - pobierz mapowanie
router.get('/mappings', (req, res) => {
  res.json(accountMappings);
});

// POST /api/accounts/mappings - dodaj lub zaktualizuj mapowanie
router.post('/mappings', (req, res) => {
  const { teamsId, youtrackId } = req.body;
  if (!teamsId || !youtrackId) {
    return res.status(400).json({ error: 'Brak danych' });
  }

  const index = accountMappings.findIndex(m => m.teamsId === teamsId);
  if (index !== -1) {
    accountMappings[index].youtrackId = youtrackId;
  } else {
    accountMappings.push({ teamsId, youtrackId });
  }

  res.json({ ok: true, mappings: accountMappings });
});

// DELETE /api/accounts/mappings/:teamsId - usuń mapowanie
router.delete('/mappings/:teamsId', (req, res) => {
  const { teamsId } = req.params;
  accountMappings = accountMappings.filter(m => m.teamsId !== teamsId);
  res.json({ ok: true });
});

// GET /api/accounts/match/:email - znajdź mapowanie po emailu
router.get('/match/:email', (req, res) => {
  const { email } = req.params;
  const mapping = accountMappings.find(m => m.teamsEmail === email || m.youtrackId === email);
  if (mapping) {
    res.json(mapping);
  } else {
    res.status(404).json({ error: 'Brak mapowania dla tego emaila' });
  }
});

module.exports = router;
