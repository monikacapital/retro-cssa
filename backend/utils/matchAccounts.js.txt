// backend/utils/matchAccounts.js

/**
 * Funkcje pomocnicze do matchowania kont Teams <-> YouTrack
 */

// Mock baza mapowań (w produkcji: baza danych)
let accountMappings = new Map();

/**
 * Znajdź mapowanie YouTrack dla użytkownika Teams
 */
function getYouTrackAccount(teamsEmail) {
  for (let [key, mapping] of accountMappings) {
    if (mapping.teamsEmail === teamsEmail) {
      return mapping.youtrackLogin;
    }
  }
  return null;
}

/**
 * Znajdź mapowanie Teams dla użytkownika YouTrack
 */
function getTeamsAccount(youtrackLogin) {
  for (let [key, mapping] of accountMappings) {
    if (mapping.youtrackLogin === youtrackLogin) {
      return mapping.teamsEmail;
    }
  }
  return null;
}

/**
 * Dodaj mapowanie kont
 */
function addMapping(teamsEmail, youtrackLogin) {
  const mappingId = `${teamsEmail}-${youtrackLogin}`;
  accountMappings.set(mappingId, {
    teamsEmail,
    youtrackLogin,
    created: new Date(),
    verified: false
  });
  return mappingId;
}

/**
 * Usuń mapowanie
 */
function removeMapping(teamsEmail) {
  for (let [key, mapping] of accountMappings) {
    if (mapping.teamsEmail === teamsEmail) {
      accountMappings.delete(key);
      return true;
    }
  }
  return false;
}

/**
 * Pobierz wszystkie mapowania
 */
function getAllMappings() {
  return Array.from(accountMappings.values());
}

/**
 * Automatyczne matchowanie na podstawie emaila (jeśli identyczne)
 */
function autoMatchByEmail(teamsUsers, youtrackUsers) {
  const autoMatched = [];
  
  teamsUsers.forEach(teamsUser => {
    const matchingYouTrack = youtrackUsers.find(
      ytUser => ytUser.email === teamsUser.email
    );
    
    if (matchingYouTrack) {
      addMapping(teamsUser.email, matchingYouTrack.login);
      autoMatched.push({
        teamsEmail: teamsUser.email,
        youtrackLogin: matchingYouTrack.login,
        matchType: 'auto'
      });
    }
  });
  
  return autoMatched;
}

/**
 * Zaproponuj możliwe mapowania na podstawie podobieństwa nazw
 */
function suggestMappings(teamsUsers, youtrackUsers) {
  const suggestions = [];
  
  teamsUsers.forEach(teamsUser => {
    const nameParts = teamsUser.displayName.toLowerCase().split(' ');
    
    youtrackUsers.forEach(ytUser => {
      const ytNameParts = ytUser.fullName.toLowerCase().split(' ');
      
      // Sprawdź podobieństwo imion i nazwisk
      const nameMatch = nameParts.some(part => 
        ytNameParts.some(ytPart => 
          ytPart.includes(part) || part.includes(ytPart)
        )
      );
      
      if (nameMatch) {
        suggestions.push({
          teamsUser: teamsUser,
          youtrackUser: ytUser,
          confidence: calculateConfidence(teamsUser, ytUser)
        });
      }
    });
  });
  
  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Oblicz pewność mapowania (0-1)
 */
function calculateConfidence(teamsUser, youtrackUser) {
  let confidence = 0;
  
  // Identyczny email = 100%
  if (teamsUser.email === youtrackUser.email) {
    return 1.0;
  }
  
  // Podobne nazwy
  const teamsName = teamsUser.displayName.toLowerCase();
  const ytName = youtrackUser.fullName.toLowerCase();
  
  if (teamsName === ytName) confidence += 0.8;
  else if (teamsName.includes(ytName) || ytName.includes(teamsName)) confidence += 0.6;
  
  // Podobne części emaila
  const teamsEmailLocal = teamsUser.email.split('@')[0];
  const ytEmailLocal = youtrackUser.email?.split('@')[0] || '';
  
  if (teamsEmailLocal === ytEmailLocal) confidence += 0.3;
  
  return Math.min(confidence, 1.0);
}

module.exports = {
  getYouTrackAccount,
  getTeamsAccount,
  addMapping,
  removeMapping,
  getAllMappings,
  autoMatchByEmail,
  suggestMappings,
  calculateConfidence
};
