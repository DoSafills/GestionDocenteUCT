// src/api/client.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://sgh.inf.uct.cl/api",
  timeout: 15000,
});

// Adjunta el access_token si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});
