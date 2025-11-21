const API_BASE_URL = 'http://localhost:5000/api';

// Fonction générique pour les requêtes avec credentials
async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important pour envoyer les cookies
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `API Error: ${response.statusText}`);
  }

  return response.json();
}

// API Auth
export const authAPI = {
  register: (data) =>
    fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) =>
    fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => fetchAPI('/auth/logout', { method: 'POST' }),
  getCurrentUser: () => fetchAPI('/auth/me'),
  refreshToken: () => fetchAPI('/auth/refresh', { method: 'POST' }),
};

// API Tasks
export const taskAPI = {
  getAll: (projectId) => fetchAPI(`/tasks/project/${projectId}`),
  getById: (id) => fetchAPI(`/tasks/${id}`),
  create: (data) =>
    fetchAPI('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    fetchAPI(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/tasks/${id}`, { method: 'DELETE' }),
};

// API Projects
export const projectAPI = {
  getAll: () => fetchAPI('/projects'),
  getById: (id) => fetchAPI(`/projects/${id}`),
  create: (data) =>
    fetchAPI('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    fetchAPI(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/projects/${id}`, { method: 'DELETE' }),
  getTasks: (id) => fetchAPI(`/projects/${id}/tasks`),
};

// API Enterprises
export const enterpriseAPI = {
  getAll: () => fetchAPI('/enterprises'),
  getById: (id) => fetchAPI(`/enterprises/${id}`),
  create: (data) =>
    fetchAPI('/enterprises', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) =>
    fetchAPI(`/enterprises/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => fetchAPI(`/enterprises/${id}`, { method: 'DELETE' }),
  getProjects: (id) => fetchAPI(`/enterprises/${id}/projects`),
  getUsers: (id) => fetchAPI(`/enterprises/${id}/users`),
};

