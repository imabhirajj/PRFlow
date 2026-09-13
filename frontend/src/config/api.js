// Centralized API configuration for PRFlow
export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
    GITHUB: `${API_BASE_URL}/api/auth/github`
  },
  PROGRESS: {
    BASE: `${API_BASE_URL}/api/progress`,
    BY_ID: (id) => `${API_BASE_URL}/api/progress/${id}`
  }
};
