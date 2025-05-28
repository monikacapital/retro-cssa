// backend/utils/todoSync.js

const teamsApi = require('./teamsApi');
const matchAccounts = require('./matchAccounts');

/**
 * Synchronizuj action items z retro do Teams TODO lists
 */
async function syncActionItemsToTeams(actionItems, accessToken) {
  const results = [];
  
  for (const item of actionItems) {
    try {
      // Znajdź mapowanie konta
      const youtrackLogin = matchAccounts.getYouTrackAccount(item.owner);
      
      if (!youtrackLogin) {
        results.push({
          actionItem: item,
          status: 'error',
          message: `Brak mapowania dla ${item.owner}`
        });
        continue;
      }
      
      // Dodaj do Teams TODO
      const todoTask = await teamsApi.addTodoTask(
        accessToken,
        item.owner, // Teams user ID/email
        item.action,
        `Retro Action Item - Termin: ${item.deadline}\nSesja: ${item.sessionId || 'N/A'}`
      );
      
      results.push({
        actionItem: item,
        status: 'success',
        todoTask: todoTask
      });
      
    } catch (error) {
      results.push({
        actionItem: item,
        status: 'error',
        message: error.message
      });
    }
  }
  
  return results;
}

/**
 * Synchronizuj pojedynczy action item do Teams TODO
 */
async function syncSingleActionItem(actionItem, accessToken) {
  try {
    const todoTask = await teamsApi.addTodoTask(
      accessToken,
      actionItem.owner,
      actionItem.action,
      `Retro Action Item - Termin: ${actionItem.deadline}`
    );
    
    return {
      success: true,
      todoTask
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Synchronizuj zadania planning poker do Teams TODO
 */
async function syncPlanningTasksToTeams(stories, accessToken) {
  const results = [];
  
  const assignedStories = stories.filter(story => 
    story.assignee && story.finalEstimation
  );
  
  for (const story of assignedStories) {
    try {
      const todoTask = await teamsApi.addTodoTask(
        accessToken,
        story.assignee,
        story.title,
        `Planning Poker Task - Estymacja: ${story.finalEstimation} SP\n${story.description}`
      );
      
      results.push({
        story: story,
        status: 'success',
        todoTask: todoTask
      });
      
    } catch (error) {
      results.push({
        story: story,
        status: 'error',
        message: error.message
      });
    }
  }
  
  return results;
}

/**
 * Formatuj wiadomość retro do wysłania na Teams
 */
function formatRetroSummaryForTeams(retroData, actionItems, sessionInfo) {
  let message = `<h2>📋 Podsumowanie Retrospektywy</h2>`;
  message += `<p><strong>Zespół:</strong> ${sessionInfo.teamName}</p>`;
  message += `<p><strong>Sprint:</strong> ${sessionInfo.sprintName}</p>`;
  message += `<p><strong>Data:</strong> ${new Date().toLocaleDateString('pl-PL')}</p><br>`;
  
  // Dodaj kategorie retro
  for (const [category, notes] of Object.entries(retroData)) {
    if (notes.length > 0) {
      message += `<h3>${getCategoryTitle(category)}</h3><ul>`;
      notes.forEach(note => {
        message += `<li>${note.text} (👍 ${note.votes})</li>`;
      });
      message += `</ul><br>`;
    }
  }
  
  // Dodaj action items
  if (actionItems.length > 0) {
    message += `<h3>✅ Action Items</h3><ul>`;
    actionItems.forEach(item => {
      message += `<li>${item.action} - <strong>${item.owner}</strong> (${item.deadline})</li>`;
    });
    message += `</ul>`;
  }
  
  return message;
}

/**
 * Pobierz czytelny tytuł kategorii
 */
function getCategoryTitle(category) {
  const titles = {
    start: '🚀 START - Co zacząć robić',
    stop: '🛑 STOP - Co przestać robić',
    continue: '✅ CONTINUE - Co robić dalej',
    liked: '👍 LIKED - Co się podobało',
    learned: '🎓 LEARNED - Czego się nauczyliśmy',
    lacked: '❌ LACKED - Czego brakowało',
    longed: '💭 LONGED - Za czym tęsknimy'
  };
  return titles[category] || category;
}

module.exports = {
  syncActionItemsToTeams,
  syncSingleActionItem,
  syncPlanningTasksToTeams,
  formatRetroSummaryForTeams
};
