// backend/middleware/auth.js

/**
 * Middleware: sprawdza czy użytkownik jest zalogowany.
 */
function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ error: "Brak autoryzacji" });
}

/**
 * Middleware: sprawdza czy użytkownik ma wymaganą rolę.
 * @param {string|string[]} roles - dozwolone role (np. "pm" lub ["pm", "admin"])
 */
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      return res.status(401).json({ error: "Brak autoryzacji" });
    }
    const userRole = req.session.user.role;
    if (Array.isArray(roles) ? roles.includes(userRole) : userRole === roles) {
      return next();
    }
    return res.status(403).json({ error: "Brak uprawnień" });
  };
}

/**
 * Middleware: sprawdza czy użytkownik może zarządzać planningiem (PM)
 */
function requirePlanningManager(req, res, next) {
  return requireRole('pm')(req, res, next);
}

module.exports = {
  ensureAuthenticated,
  requireRole,
  requirePlanningManager
};
