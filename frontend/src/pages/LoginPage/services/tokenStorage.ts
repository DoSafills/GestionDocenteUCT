import { getAccessToken, setAccessToken, clearAccessToken } from "../../../auth/tokenStore";

let accessExpAtMem: number | undefined = undefined; // epoch ms
const REFRESH_KEY = "auth.refresh.token";

export const tokenStorage = {
  
  setAccess(token: string | null, accessExpAt?: number) {
    setAccessToken(token);
    accessExpAtMem = accessExpAt;
  },
  getAccess(): { token: string | null; accessExpAt?: number } {
    return { token: getAccessToken(), accessExpAt: accessExpAtMem };
  },
  clearAccess() {
    clearAccessToken();
    accessExpAtMem = undefined;
  },

  // REFRESH (persistencia en localStorage)
  setRefresh(token: string | null) {
    if (token) localStorage.setItem(REFRESH_KEY, token);
    else localStorage.removeItem(REFRESH_KEY);
  },
  getRefresh(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  },
  clearRefresh() {
    localStorage.removeItem(REFRESH_KEY);
  },
};
