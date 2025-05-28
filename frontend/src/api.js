// src/api.js

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000/api";

// === AUTH ===
export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/auth/me`, { credentials: "include" });
  if (!res.ok) throw new Error("Brak autoryzacji");
  return await res.json();
}

export async function loginWithMicrosoft() {
  window.location.href = `${API_BASE}/auth/microsoft`;
}

export async function logout() {
  await fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" });
  window.location.href = "/";
}

// === TEAMS ===
export async function getTeamUsers() {
  const res = await fetch(`${API_BASE}/teams/users`, { credentials: "include" });
  if (!res.ok) throw new Error("Błąd pobierania użytkowników Teams");
  return await res.json();
}

export async function sendMessageToTeams(channelId, message) {
  const res = await fetch(`${API_BASE}/teams/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ channelId, message })
  });
  if (!res.ok) throw new Error("Błąd wysyłania wiadomości do Teams");
  return await res.json();
}

export async function addTodoToTeams(userId, task, description) {
  const res = await fetch(`${API_BASE}/teams/todo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId, task, description })
  });
  if (!res.ok) throw new Error("Błąd dodawania zadania do Teams TODO");
  return await res.json();
}

// === YOUTRACK ===
export async function getYouTrackTasks() {
  const res = await fetch(`${API_BASE}/youtrack/tasks`, { credentials: "include" });
  if (!res.ok) throw new Error("Błąd pobierania zadań YouTrack");
  return await res.json();
}

export async function getYouTrackTask(taskId) {
  const res = await fetch(`${API_BASE}/youtrack/task/${taskId}`, { credentials: "include" });
  if (!res.ok) throw new Error("Błąd pobierania zadania YouTrack");
  return await res.json();
}

export async function assignYouTrackTask(taskId, assignee) {
  const res = await fetch(`${API_BASE}/youtrack/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ taskId, assignee })
  });
  if (!res.ok) throw new Error("Błąd przypisywania zadania");
  return await res.json();
}

// === RETRO ===
export async function fetchRetroBoard(sessionId) {
  const res = await fetch(`${API_BASE}/retro/${sessionId}`, { credentials: "include" });
  if (!res.ok) throw new Error("Błąd pobierania retro");
  return await res.json();
}

export async function addRetroNote(sessionId, category, text) {
  const res = await fetch(`${API_BASE}/retro/${sessionId}/note`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ category, text })
  });
  if (!res.ok) throw new Error("Błąd dodawania notatki");
  return await res.json();
}

export async function voteRetroNote(sessionId, noteId) {
  const res = await fetch(`${API_BASE}/retro/${sessionId}/note/${noteId}/vote`, {
    method: "POST",
    credentials: "include"
  });
  if (!res.ok) throw new Error("Błąd głosowania");
  return await res.json();
}

// === PLANNING ===
export async function getStories(sessionId) {
  const res = await fetch(`${API_BASE}/planning/${sessionId}/stories`, { credentials: "include" });
  if (!res.ok) throw new Error("Błąd pobierania zadań");
  return await res.json();
}

export async function addStory(sessionId, title, description, assignee) {
  const res = await fetch(`${API_BASE}/planning/${sessionId}/story`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ title, description, assignee })
  });
  if (!res.ok) throw new Error("Błąd dodawania zadania");
  return await res.json();
}

export async function estimateStory(sessionId, storyId, user, value) {
  const res = await fetch(`${API_BASE}/planning/${sessionId}/story/${storyId}/estimate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ user, value })
  });
  if (!res.ok) throw new Error("Błąd estymacji");
  return await res.json();
}

// === ACCOUNTS ===
export async function getAccountMappings() {
  const res = await fetch(`${API_BASE}/accounts/mappings`, { credentials: "include" });
  if (!res.ok) throw new Error("Błąd pobierania mapowań");
  return await res.json();
}

export async function addAccountMapping(teamsId, youtrackId) {
  const res = await fetch(`${API_BASE}/accounts/mappings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ teamsId, youtrackId })
  });
  if (!res.ok) throw new Error("Błąd dodawania mapowania");
  return await res.json();
}
