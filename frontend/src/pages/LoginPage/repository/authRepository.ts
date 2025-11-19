import { apiLogin, apiRefresh } from "../services/authApi";
import { tokenStorage } from "../services/tokenStorage";
import { AuthError } from "../types/auth";
import type { LoginCredentials, Tokens } from "../types/auth";
import { ok, err } from "../types/result";
import type { Result } from "../types/result";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCredentials(c: LoginCredentials): Result<LoginCredentials, AuthError> {
  if (!EMAIL_RE.test(c.email)) return err(new AuthError("Correo inválido", "BAD_REQUEST"));
  if (!c.password || c.password.length < 4) return err(new AuthError("Contraseña demasiado corta", "BAD_REQUEST"));
  return ok(c);
}

export async function loginRepo(creds: LoginCredentials): Promise<Result<Tokens, AuthError>> {
  const valid = validateCredentials(creds);
  if (!valid.ok) return valid;

  const res = await apiLogin(valid.value);
  if (!res.ok) return err(res.error);

  const expiresIn = res.value.expires_in ?? 1800;
  const accessExpAt = Date.now() + (expiresIn - 60) * 1000; // margen 60s

  tokenStorage.setAccess(res.value.access_token, accessExpAt);
  tokenStorage.setRefresh(res.value.refresh_token);

  // Guardar email para modo mock
  localStorage.setItem('mock_login_email', valid.value.email);

  return ok({
    access: res.value.access_token,
    refresh: res.value.refresh_token,
    expiresIn,
    accessExpAt,
  });
}

export async function refreshRepo(): Promise<Result<Tokens, AuthError>> {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) return err(new AuthError("No hay refresh token", "UNAUTHORIZED"));

  // retry simple (2 intentos)
  const attempt = async () => apiRefresh({ refresh_token: refresh });
  const first = await attempt();
  const final = first.ok ? first : await attempt();

  if (!final.ok) {
    tokenStorage.clearAccess();
    tokenStorage.clearRefresh();
    return err(final.error);
  }

  const expiresIn = final.value.access_token ? (30 * 60) : 1800; // si no te dan expires_in en refresh, asume 30m
  const accessExpAt = Date.now() + (expiresIn - 60) * 1000;

  tokenStorage.setAccess(final.value.access_token, accessExpAt);

  return ok({ access: final.value.access_token, refresh, expiresIn, accessExpAt });
}

export function logoutRepo(): void {
  tokenStorage.clearAccess();
  tokenStorage.clearRefresh();
  localStorage.removeItem('mock_login_email');
}

export function getAccessTokenRepo(): { token: string | null; accessExpAt?: number } {
  return tokenStorage.getAccess();
}
