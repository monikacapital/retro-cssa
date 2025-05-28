// backend/utils/youtrackApi.js

const axios = require("axios");

const YOUTRACK_API_URL = process.env.YOUTRACK_API_URL || "https://youtrack.example.com/api";
const YOUTRACK_TOKEN = process.env.YOUTRACK_TOKEN;

function getHeaders() {
  return {
    Authorization: `Bearer ${YOUTRACK_TOKEN}`,
    Accept: "application/json",
    "Content-Type": "application/json"
  };
}

/**
 * Pobierz szczegóły zadania po ID
 */
async function getIssueById(issueId) {
  const url = `${YOUTRACK_API_URL}/issues/${issueId}?fields=id,idReadable,summary,description,customFields(id,name,value(name)),project(id,name),assignee(login,fullName)`;
  const res = await axios.get(url, { headers: getHeaders() });
  return res.data;
}

/**
 * Pobierz listę zadań z projektu
 */
async function getIssues(projectId, query = "", limit = 50) {
  const url = `${YOUTRACK_API_URL}/issues?fields=id,idReadable,summary,description,customFields(id,name,value(name)),project(id,name),assignee(login,fullName)&query=project:${projectId}${query ? " " + query : ""}&$top=${limit}`;
  const res = await axios.get(url, { headers: getHeaders() });
  return res.data;
}

/**
 * Przypisz osobę do zadania
 */
async function assignUser(issueId, userLogin) {
  const url = `${YOUTRACK_API_URL}/issues/${issueId}/fields/assignee`;
  const body = { value: { login: userLogin } };
  const res = await axios.post(url, body, { headers: getHeaders() });
  return res.data;
}

/**
 * Zaktualizuj estymację zadania
 */
async function updateEstimation(issueId, estimationValue) {
  const url = `${YOUTRACK_API_URL}/issues/${issueId}/fields/Estimation`;
  const body = { value: estimationValue };
  const res = await axios.post(url, body, { headers: getHeaders() });
  return res.data;
}

/**
 * Utwórz nowe zadanie
 */
async function createIssue(projectId, summary, description, assignee = null) {
  const url = `${YOUTRACK_API_URL}/issues`;
  const body = {
    project: { id: projectId },
    summary,
    description,
    ...(assignee && { assignee: { login: assignee } })
  };
  const res = await axios.post(url, body, { headers: getHeaders() });
  return res.data;
}

module.exports = {
  getIssueById,
  getIssues,
  assignUser,
  updateEstimation,
  createIssue
};
