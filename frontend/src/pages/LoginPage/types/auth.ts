// Si necesitas el usuario en esta página, reusa tus tipos reales:
import type { Estudiante, Docente, Admin } from "../../../types"; // ajusta ruta si fuese necesario

// ====== DTOs de API (tal como responde/espera el backend) ======
export interface LoginRequestDto {
  email: string;
  contrasena: string;
}

export interface LoginResponseDto {
  access_token: string;   // ≈ 30 min
  refresh_token: string;  // ≈ 7 días
  token_type: "bearer";
  expires_in: number;     // en segundos
  user: Estudiante | Docente | Admin;
}

export interface RefreshResponseDto {
  access_token: string;
}

// ====== Tipos de dominio (lo que usa la UI/hook/repo) ======
export interface LoginCredentials {
  email: string;
  password: string; // usamos 'password' en UI y mapeamos a 'contrasena' en services
}

export interface Tokens {
  access: string;
  refresh: string;
  expiresIn: number;
  accessExpAt?: number; // epoch ms
}

export type AuthState =
  | { status: "anonymous" }
  | { status: "authenticating" }
  | { status: "authenticated"; tokens: Tokens }
  | { status: "error"; message: string };

export class AuthError extends Error {
  code: "BAD_REQUEST" | "UNAUTHORIZED" | "NETWORK" | "UNKNOWN";
  constructor(message: string, code: AuthError["code"] = "UNKNOWN") {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}
