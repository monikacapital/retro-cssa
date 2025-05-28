// backend/config.js

require('dotenv').config();

const config = {
  // Microsoft Teams / Azure AD
  MS_CLIENT_ID: process.env.MS_CLIENT_ID,
  MS_CLIENT_SECRET: process.env.MS_CLIENT_SECRET,
  MS_TENANT_ID: process.env.MS_TENANT_ID,
  MS_REDIRECT_URI: process.env.MS_REDIRECT_URI || 'http://localhost:4000/api/auth/microsoft/callback',
  MS_TEAM_ID: process.env.MS_TEAM_ID,
  MS_SCOPES: [
    'User.Read.All',
    'Presence.Read.All',
    'ChannelMessage.Send',
    'Tasks.ReadWrite'
  ],

  // YouTrack
  YOUTRACK_API_URL: process.env.YOUTRACK_API_URL,
  YOUTRACK_TOKEN: process.env.YOUTRACK_TOKEN,
  YOUTRACK_PROJECT_ID: process.env.YOUTRACK_PROJECT_ID || 'CS',

  // Database (dla przyszłego użycia)
  DATABASE_URL: process.env.DATABASE_URL,
  
  // Sesje/JWT
  SESSION_SECRET: process.env.SESSION_SECRET || "retrocssa_secret_2025",
  JWT_SECRET: process.env.JWT_SECRET || "retrocssa_jwt_secret_2025",
  
  // URLs
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  API_BASE_URL: process.env.API_BASE_URL || "http://localhost:4000/api",
  
  // Opcje aplikacji
  ENABLE_AUTO_SYNC: process.env.ENABLE_AUTO_SYNC === 'true',
  DEFAULT_ESTIMATION_CARDS: ['0.5', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', '∞', '☕'],
  
  // Timeouts i limity
  API_TIMEOUT: parseInt(process.env.API_TIMEOUT) || 30000,
  MAX_RETRO_NOTES: parseInt(process.env.MAX_RETRO_NOTES) || 100,
  MAX_STORIES_PER_SESSION: parseInt(process.env.MAX_STORIES_PER_SESSION) || 50
};

// Walidacja konfiguracji
function validateConfig() {
  const required = ['MS_CLIENT_ID', 'MS_CLIENT_SECRET', 'YOUTRACK_API_URL'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    console.warn(`⚠️  Brakuje konfiguracji: ${missing.join(', ')}`);
    console.warn('Niektóre funkcje mogą nie działać poprawnie.');
  }
}

validateConfig();

module.exports = config;
