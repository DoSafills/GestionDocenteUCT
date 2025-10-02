import { getAccessToken, setAccessToken, clearAccessToken } from "../auth/tokenStore";

const isDev = import.meta.env.DEV;
const BASE_URL = isDev ? "/api" : "https://sgh.inf.uct.cl/api";

interface ApiOptions extends RequestInit {
  json?: unknown;        
  __retry401?: boolean;  
}

export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;

  
  const headers = normalizeHeaders(options.headers);

  // Adjunta Authorization si hay access token en memoria
  const access = getAccessToken();
  if (access) headers["Authorization"] = `Bearer ${access}`;

  
  if (options.json !== undefined) headers["Content-Type"] = "application/json";

  const init: RequestInit = {
    ...options,
    headers,
    body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
  };

  const res = await fetch(url, init);

  
  if (res.status === 401 && !options.__retry401) {
    const refreshed = await trySilentRefresh();
    if (refreshed) {
      return apiFetch<T>(path, { ...options, __retry401: true });
    }
  }

  const raw = await res.text();
  const data = safeParseJson(raw);

  if (!res.ok) {
    const err: any = new Error(data?.message || res.statusText || "HTTP error");
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data as T;
}


async function trySilentRefresh(): Promise<boolean> {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) return false;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });
    if (!res.ok) return false;

    const data = await res.json();
    const newAccess = data?.access_token as string | undefined;
    if (!newAccess) return false;

    setAccessToken(newAccess); 
    return true;
  } catch {
    return false;
  }
}


function normalizeHeaders(init?: HeadersInit): Record<string, string> {
  const out: Record<string, string> = {};
  if (!init) return out;
  const h = new Headers(init);
  h.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}


function safeParseJson(text: string) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}


export function clearAllTokensOnClient() {
  clearAccessToken();
  localStorage.removeItem("refresh_token");
}
