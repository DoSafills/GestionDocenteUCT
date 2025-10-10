import { useCallback, useEffect, useRef, useState } from "react";
import type { AuthState, LoginCredentials } from "../types/auth";
import { loginRepo, refreshRepo, logoutRepo, getAccessTokenRepo } from "../repository/authRepository";

export function useAuth() {
  const [state, setState] = useState<AuthState>(() => {
    const { token, accessExpAt } = getAccessTokenRepo();
    if (token) return { status: "authenticated", tokens: { access: token, refresh: "", expiresIn: 0, accessExpAt } };
    return { status: "anonymous" };
  });

  const refreshTimer = useRef<number | null>(null);

  const scheduleRefresh = useCallback((accessExpAt?: number) => {
    if (refreshTimer.current) {
      window.clearTimeout(refreshTimer.current);
      refreshTimer.current = null;
    }
    if (!accessExpAt) return;
    const ms = Math.max(accessExpAt - Date.now(), 5000);
    refreshTimer.current = window.setTimeout(async () => {
      const res = await refreshRepo();
      if (!res.ok) {
        setState({ status: "error", message: res.error.message });
        logoutRepo();
        setState({ status: "anonymous" });
        return;
      }
      setState({ status: "authenticated", tokens: res.value });
      scheduleRefresh(res.value.accessExpAt);
    }, ms) as unknown as number;
  }, []);

  const login = useCallback(async (creds: LoginCredentials) => {
    setState({ status: "authenticating" });
    const res = await loginRepo(creds);
    if (!res.ok) {
      setState({ status: "error", message: res.error.message });
      return false;
    }
    setState({ status: "authenticated", tokens: res.value });
    scheduleRefresh(res.value.accessExpAt);
    return true;
  }, [scheduleRefresh]);

  const refreshNow = useCallback(async () => {
    const res = await refreshRepo();
    if (!res.ok) {
      setState({ status: "error", message: res.error.message });
      logoutRepo();
      setState({ status: "anonymous" });
      return false;
    }
    setState({ status: "authenticated", tokens: res.value });
    scheduleRefresh(res.value.accessExpAt);
    return true;
  }, [scheduleRefresh]);

  const logout = useCallback(() => {
    logoutRepo();
    setState({ status: "anonymous" });
    if (refreshTimer.current) {
      window.clearTimeout(refreshTimer.current);
      refreshTimer.current = null;
    }
  }, []);

  // refresh al volver de background si queda <60s
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") {
        const auth = state.status === "authenticated" ? state.tokens : null;
        if (auth?.accessExpAt && auth.accessExpAt - Date.now() < 60_000) {
          refreshNow();
        }
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [state, refreshNow]);

  // sincronizar entre pestañas por localStorage del refresh
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "auth.refresh.token") {
        if (e.newValue === null) logout();
        else if (state.status !== "authenticated") refreshNow();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [logout, refreshNow, state.status]);

  useEffect(() => {
    if (state.status === "authenticated") scheduleRefresh(state.tokens.accessExpAt);
  }, [state, scheduleRefresh]);

  return {
    state,
    isAuthenticated: state.status === "authenticated",
    isLoading: state.status === "authenticating",
    error: state.status === "error" ? state.message : null,
    login,
    logout,
    refreshNow,
    accessToken: state.status === "authenticated" ? state.tokens.access : null,
  };
}
