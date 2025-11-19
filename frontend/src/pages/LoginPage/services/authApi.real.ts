import { ENDPOINTS } from "./endpoints";
import { ok, err } from "../types/result"; 
import type { Result } from "../types/result"; 
import { AuthError } from "../types/auth";
import type { LoginRequestDto, LoginResponseDto, RefreshResponseDto } from "../types/auth";


export async function apiLogin(params: {
  email: string;
  password: string;
}): Promise<Result<LoginResponseDto, AuthError>> {
  try {
    const body: LoginRequestDto = { email: params.email, contrasena: params.password };
    const res = await fetch(ENDPOINTS.AUTH_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data: LoginResponseDto = await res.json();
    if (!res.ok) {
      const code: AuthError["code"] =
        res.status === 400 ? "BAD_REQUEST" : res.status === 401 ? "UNAUTHORIZED" : "UNKNOWN";
      return err(new AuthError((data as any)?.message || res.statusText || "Login failed", code));
    }
    return ok(data);
  } catch {
    return err(new AuthError("Network error", "NETWORK"));
  }
}

export async function apiRefresh(params: {
  refresh_token: string;
}): Promise<Result<RefreshResponseDto, AuthError>> {
  try {
    const res = await fetch(ENDPOINTS.AUTH_REFRESH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const data: RefreshResponseDto = await res.json();
    if (!res.ok) {
      const code: AuthError["code"] =
        res.status === 400 ? "BAD_REQUEST" : res.status === 401 ? "UNAUTHORIZED" : "UNKNOWN";
      return err(new AuthError((data as any)?.message || res.statusText || "Refresh failed", code));
    }
    return ok(data);
  } catch {
    return err(new AuthError("Network error", "NETWORK"));
  }
}

export async function apiGetMe(): Promise<Result<any, AuthError>> {
  try {
    const res = await fetch(ENDPOINTS.AUTH_ME, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) {
      const code: AuthError["code"] =
        res.status === 400 ? "BAD_REQUEST" : res.status === 401 ? "UNAUTHORIZED" : "UNKNOWN";
      return err(new AuthError((data as any)?.message || res.statusText || "Get me failed", code));
    }
    return ok(data);
  } catch {
    return err(new AuthError("Network error", "NETWORK"));
  }
}