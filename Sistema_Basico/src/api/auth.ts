import { apiFetch } from "./http";

export interface LoginRequest {
  email: string;
  contrasena: string;
}
export interface LoginResponse {
  access_token: string;   // ~30 min (NO se persiste)
  refresh_token: string;  // ~7 días (SÍ se persiste)
}
export interface RefreshResponse {
  access_token: string;
}

export function loginApi(payload: LoginRequest) {
  return apiFetch<LoginResponse>("/auth/login-json", {
    method: "POST",
    json: payload,
  });
}

export function refreshApi(refresh_token: string) {
  return apiFetch<RefreshResponse>("/auth/refresh", {
    method: "POST",
    json: { refresh_token },
  });
}
