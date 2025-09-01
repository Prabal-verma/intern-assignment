const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

export function getToken() {
  return localStorage.getItem('token');
}

export function clearToken() {
  localStorage.removeItem('token');
}

// Notes API
export async function getNotes() {
  return apiRequest('/notes');
}

export async function getNoteById(id: string) {
  return apiRequest(`/notes/${id}`);
}

export async function createNote({ title, content }: { title: string; content: string }) {
  return apiRequest('/notes', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  });
}

export async function updateNote(id: string, { title, content }: { title: string; content: string }) {
  return apiRequest(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content }),
  });
}

export async function deleteNote(id: string) {
  return apiRequest(`/notes/${id}`, {
    method: 'DELETE',
  });
}
