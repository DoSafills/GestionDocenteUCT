const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const ENDPOINTS = {
    AUTH_LOGIN: `${API_BASE_URL}/api/auth/login-json`,
    AUTH_REGISTER: `${API_BASE_URL}/api/auth/register`,
    AUTH_REFRESH: `${API_BASE_URL}/api/auth/refresh`,
    ASIGNATURAS: `${API_BASE_URL}/api/asignaturas`,
    SECCIONES: `${API_BASE_URL}/api/secciones`,
    RESTRICCIONES: `${API_BASE_URL}/api/restricciones`,
};
