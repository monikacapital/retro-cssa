const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 4000;

// Importy tras
const authRoutes = require("./routes/auth");
const teamsRoutes = require("./routes/teams");
const youtrackRoutes = require("./routes/youtrack");
const retroRoutes = require("./routes/retro");
const planningRoutes = require("./routes/planning");
const accountsRoutes = require("./routes/accounts");

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || "retrocssa_secret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Trasy API
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/youtrack", youtrackRoutes);
app.use("/api/retro", retroRoutes);
app.use("/api/planning", planningRoutes);
app.use("/api/accounts", accountsRoutes);

// Start serwera
app.listen(PORT, () => {
  console.log(`RETRO_CSSA backend running on http://localhost:${PORT}`);
});
