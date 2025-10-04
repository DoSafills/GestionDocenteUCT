// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { setAccessToken, clearAccessToken } from "../auth/tokenStore";
import { ENDPOINTS } from "../endpoints";
import type { AuthContextType, LoginRequest, LoginResponse, RefreshResponse } from "../pages/LoginPage/types";

const THIRTY_MIN_MS = 30 * 60 * 1000;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const refreshIntervalRef = useRef<number | null>(null);

  const loginApi = async (payload: LoginRequest): Promise<LoginResponse> => {
    const res = await fetch(ENDPOINTS.AUTH_LOGIN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || res.statusText || "Login failed");
    return data;
  };

  const refreshApi = async (refresh_token: string): Promise<RefreshResponse> => {
    const res = await fetch(ENDPOINTS.AUTH_REFRESH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || res.statusText || "Refresh failed");
    return data;
  };

  const clearRefreshInterval = () => {
    if (refreshIntervalRef.current !== null) {
      window.clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };

  const scheduleRefresh = () => {
    clearRefreshInterval();
    refreshIntervalRef.current = window.setInterval(async () => {
      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) return logout();
      try {
        const { access_token } = await refreshApi(refresh_token);
        setAccessToken(access_token);
        setIsAuthenticated(true);
      } catch {
        logout();
      }
    }, THIRTY_MIN_MS);
  };

  const login = async (email: string, password: string) => {
    const { access_token, refresh_token } = await loginApi({ email, contrasena: password });
    localStorage.setItem("refresh_token", refresh_token);
    setAccessToken(access_token);
    setIsAuthenticated(true);
    scheduleRefresh();
  };

  const logout = () => {
    clearRefreshInterval();
    clearAccessToken();
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
  };

  // --- Autologin al montar ---
  useEffect(() => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) return;

    (async () => {
      try {
        const { access_token } = await refreshApi(refresh_token);
        setAccessToken(access_token);
        setIsAuthenticated(true);
        scheduleRefresh();
      } catch {
        logout();
      }
    })();

    return clearRefreshInterval;
  }, []);

  // --- Refresh al volver de background ---
  useEffect(() => {
    const onVisible = async () => {
      if (document.visibilityState !== "visible") return;
      const refresh_token = localStorage.getItem("refresh_token");
      if (!refresh_token) return;
      try {
        const { access_token } = await refreshApi(refresh_token);
        setAccessToken(access_token);
        setIsAuthenticated(true);
      } catch {
        logout();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
