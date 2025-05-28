// src/utils/matchAccounts.js

/**
 * Funkcje pomocnicze do matchowania kont Teams <-> YouTrack (frontend)
 */

/**
 * Oblicz pewność mapowania (0-1) na podstawie podobieństwa danych
 */
export function calculateMatchConfidence(teamsUser, youtrackUser) {
  let confidence = 0;

  // Identyczny email = najwyższa pewność
  if (teamsUser.email === youtrackUser.email) {
    return 1.0;
  }

  // Podobne nazwy (imię i nazwisko)
  const teamsName = teamsUser.name?.toLowerCase() || '';
  const ytName = youtrackUser.fullName?.toLowerCase() || '';
  
  if (teamsName === ytName) {
    confidence += 0.8;
  } else if (teamsName.includes(ytName) || ytName.includes(teamsName)) {
    confidence += 0.6;
  } else {
    // Sprawdź podobieństwo części nazw (imię, nazwisko)
    const teamsNameParts = teamsName.split(' ');
    const ytNameParts = ytName.split(' ');
    
    const nameMatches = teamsNameParts.filter(part =>
      ytNameParts.some(ytPart => 
        ytPart.includes(part) || part.includes(ytPart)
      )
    ).length;
    
    if (nameMatches > 0) {
      confidence += (nameMatches / Math.max(teamsNameParts.length, ytNameParts.length)) * 0.5;
    }
  }

  // Podobne części emaila (część przed @)
  const teamsEmailLocal = teamsUser.email?.split('@')[0] || '';
  const ytEmailLocal = youtrackUser.email?.split('@')[0] || '';
  
  if (teamsEmailLocal && ytEmailLocal && teamsEmailLocal === ytEmailLocal) {
    confidence += 0.3;
  }

  return Math.min(confidence, 1.0);
}

/**
 * Zaproponuj możliwe mapowania na podstawie podobieństwa
 */
export function suggestMappings(teamsUsers, youtrackUsers, existingMappings = []) {
  const suggestions = [];
  const mappedTeamsIds = existingMappings.map(m => m.teamsId);
  const mappedYtIds = existingMappings.map(m => m.youtrackId);

  teamsUsers.forEach(teamsUser => {
    // Pomiń już zmapowanych użytkowników
    if (mappedTeamsIds.includes(teamsUser.id)) return;

    const matches = youtrackUsers
      .filter(ytUser => !mappedYtIds.includes(ytUser.login))
      .map(ytUser => ({
        youtrackUser: ytUser,
        confidence: calculateMatchConfidence(teamsUser, ytUser)
      }))
      .filter(match => match.confidence > 0.3) // Tylko obiecujące dopasowania
      .sort((a, b) => b.confidence - a.confidence);

    if (matches.length > 0) {
      suggestions.push({
        teamsUser,
        matches,
        bestMatch: matches[0],
        confidenceLevel: getConfidenceLevel(matches[0].confidence)
      });
    }
  });

  return suggestions.sort((a, b) => b.bestMatch.confidence - a.bestMatch.confidence);
}

/**
 * Określ poziom pewności mapowania
 */
export function getConfidenceLevel(confidence) {
  if (confidence >= 0.9) return 'very-high';
  if (confidence >= 0.7) return 'high';
  if (confidence >= 0.5) return 'medium';
  if (confidence >= 0.3) return 'low';
  return 'very-low';
}

/**
 * Automatyczne mapowanie dla wysokich dopasowań
 */
export function getAutoMappingCandidates(suggestions, minConfidence = 0.8) {
  return suggestions.filter(suggestion => 
    suggestion.bestMatch.confidence >= minConfidence
  );
}

/**
 * Formatuj wynik mapowania dla wyświetlenia
 */
export function formatMappingDisplay(teamsUser, youtrackUser, confidence) {
  const confidenceLevel = getConfidenceLevel(confidence);
  const confidenceEmoji = {
    'very-high': '🎯',
    'high': '✅',
    'medium': '🔍',
    'low': '⚠️',
    'very-low': '❌'
  };

  return {
    display: `${teamsUser.name} ↔ ${youtrackUser.fullName}`,
    confidence: Math.round(confidence * 100),
    confidenceLevel,
    emoji: confidenceEmoji[confidenceLevel],
    details: {
      teams: {
        name: teamsUser.name,
        email: teamsUser.email,
        role: teamsUser.role
      },
      youtrack: {
        name: youtrackUser.fullName,
        login: youtrackUser.login,
        email: youtrackUser.email
      }
    }
  };
}

/**
 * Waliduj mapowanie przed zapisaniem
 */
export function validateMapping(teamsUser, youtrackUser) {
  const errors = [];

  if (!teamsUser || !teamsUser.id) {
    errors.push("Brak danych użytkownika Teams");
  }

  if (!youtrackUser || !youtrackUser.login) {
    errors.push("Brak danych użytkownika YouTrack");
  }

  // Sprawdź czy to nie jest duplikat
  if (teamsUser.email === youtrackUser.email && teamsUser.email) {
    // To jest OK - identyczne emaile
  } else {
    const confidence = calculateMatchConfidence(teamsUser, youtrackUser);
    if (confidence < 0.1) {
      errors.push("Bardzo niskie podobieństwo - sprawdź poprawność mapowania");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Eksportuj mapowania do formatu CSV
 */
export function exportMappingsToCSV(mappings) {
  const csvHeaders = ['Teams Email', 'Teams Name', 'YouTrack Login', 'YouTrack Name', 'Confidence'];
  const csvRows = mappings.map(mapping => [
    mapping.teamsEmail,
    mapping.teamsName || '',
    mapping.youtrackLogin,
    mapping.youtrackName || '',
    mapping.confidence || ''
  ]);

  const csvContent = [
    csvHeaders.join(','),
    ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Pobierz statystyki mapowań
 */
export function getMappingStatistics(teamsUsers, youtrackUsers, mappings) {
  const mapped = mappings.length;
  const unmappedTeams = teamsUsers.length - mapped;
  const unmappedYouTrack = youtrackUsers.length - mapped;
  const mappingRate = teamsUsers.length > 0 ? (mapped / teamsUsers.length) * 100 : 0;

  return {
    total: {
      teams: teamsUsers.length,
      youtrack: youtrackUsers.length,
      mappings: mapped
    },
    unmapped: {
      teams: unmappedTeams,
      youtrack: unmappedYouTrack
    },
    mappingRate: Math.round(mappingRate),
    status: mappingRate >= 90 ? 'excellent' : 
            mappingRate >= 70 ? 'good' : 
            mappingRate >= 50 ? 'fair' : 'poor'
  };
}
