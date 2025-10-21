import type { LoginResponseDto, RefreshResponseDto } from "../types/auth";
import { ok, err } from "../types/result";
import { AuthError } from "../types/auth";

const LATENCY = 400;                     
let CURRENT_ACCESS = "access_mock_1";
let CURRENT_REFRESH = "refresh_mock_1";

export async function apiLogin(params: { email: string; password: string }) {
  await new Promise(r => setTimeout(r, LATENCY));
  if (!params.email.includes("@uct")) return err(new AuthError("Correo inválido", "BAD_REQUEST"));
  if (params.password === "fail")   return err(new AuthError("Credenciales inválidas", "UNAUTHORIZED"));

  // expires_in cortito para probar el auto-refresh
  const data: LoginResponseDto = {
    access_token: CURRENT_ACCESS,
    refresh_token: CURRENT_REFRESH,
    token_type: "bearer",
    expires_in: 12, // segundos
    user: {} as any,
  };
  return ok(data);
}

export async function apiRefresh(_: { refresh_token: string }) {
  await new Promise(r => setTimeout(r, LATENCY));
  // simula rotación de token
  CURRENT_ACCESS = "access_mock_" + Math.floor(Math.random() * 10000);
  const data: RefreshResponseDto = { access_token: CURRENT_ACCESS };
  return ok(data);
}
