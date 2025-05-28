const express = require("express");
const router = express.Router();

// Mock users
const users = [
  { id: "1", name: "Jan Kowalski", email: "jan@firma.pl", role: "developer" },
  { id: "2", name: "Anna Nowak", email: "anna@firma.pl", role: "tester" },
  { id: "3", name: "Piotr PM", email: "pm@firma.pl", role: "pm" }
];

// GET /api/auth/me
router.get("/me", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// GET /api/auth/microsoft
router.get("/microsoft", (req, res) => {
  req.session.user = users[2]; // PM dla demo
  res.redirect("http://localhost:3000");
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

module.exports = router;
