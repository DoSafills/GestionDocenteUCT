// src/types/auth.ts
import type { Estudiante, Docente, Admin } from "../../types";

export interface LoginFormProps {
  onSuccess?: () => void;
}

export interface LoginRequest {
  email: string;
  contrasena: string;
}

export interface LoginResponse {
  access_token: string;   // ≈ 30 min
  refresh_token: string;  // ≈ 7 días
  token_type: "bearer";
  expires_in: number;      // en segundos
  user: Estudiante | Docente | Admin;
}

export interface RefreshResponse {
  access_token: string;
}

export type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};
