// src/types/auth.ts
export interface LoginRequest {
  email: string;
  contrasena: string;
}

export interface LoginResponse {
  access_token: string;   // ≈ 30 min
  refresh_token: string;  // ≈ 7 días
}

export interface RefreshResponse {
  access_token: string;
}
