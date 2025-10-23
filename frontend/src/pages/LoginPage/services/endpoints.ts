const API_BASE_URL = import.meta.env.VITE_API_URL || '';
export const ENDPOINTS = {
    AUTH_LOGIN: `${API_BASE_URL}/api/auth/login-json`,
    AUTH_REFRESH: `${API_BASE_URL}/api/auth/refresh`,
};
