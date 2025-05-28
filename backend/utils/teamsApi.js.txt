// backend/utils/teamsApi.js

const axios = require("axios");

/**
 * Pobierz listę użytkowników zespołu Teams
 */
async function getTeamMembers(accessToken, teamId) {
  const url = `https://graph.microsoft.com/v1.0/teams/${teamId}/members`;
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data.value.map(u => ({
    id: u.id,
    displayName: u.displayName,
    email: u.email || u.userPrincipalName,
    role: u.roles && u.roles.length > 0 ? u.roles[0] : "member"
  }));
}

/**
 * Pobierz obecność użytkownika
 */
async function getUserPresence(accessToken, userId) {
  const url = `https://graph.microsoft.com/v1.0/users/${userId}/presence`;
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data.availability;
}

/**
 * Wyślij wiadomość do kanału Teams
 */
async function sendMessageToChannel(accessToken, teamId, channelId, message) {
  const url = `https://graph.microsoft.com/v1.0/teams/${teamId}/channels/${channelId}/messages`;
  const body = {
    body: { contentType: "html", content: message }
  };
  const res = await axios.post(url, body, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
}

/**
 * Dodaj zadanie do Teams TODO użytkownika
 */
async function addTodoTask(accessToken, userId, title, description) {
  const url = `https://graph.microsoft.com/v1.0/users/${userId}/todo/lists/tasks/tasks`;
  const body = {
    title,
    body: { content: description, contentType: "text" },
    importance: "normal"
  };
  const res = await axios.post(url, body, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data;
}

/**
 * Pobierz listy TODO użytkownika
 */
async function getTodoLists(accessToken, userId) {
  const url = `https://graph.microsoft.com/v1.0/users/${userId}/todo/lists`;
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return res.data.value;
}

module.exports = {
  getTeamMembers,
  getUserPresence,
  sendMessageToChannel,
  addTodoTask,
  getTodoLists
};
