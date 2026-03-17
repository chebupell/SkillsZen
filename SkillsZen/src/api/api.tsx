import { auth } from "../services/login";

const API_URL = '';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = await auth.currentUser?.getIdToken();
  const url = `${API_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json();
}
