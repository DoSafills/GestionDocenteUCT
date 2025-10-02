import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { loginApi, refreshApi } from "../api/auth";
import { setAccessToken } from "../auth/tokenStore";
import { clearAllTokensOnClient } from "../api/http";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};

const THIRTY_MIN_MS = 30 * 60 * 1000;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const refreshIntervalRef = useRef<number | null>(null);

  const clearRefreshInterval = () => {
    if (refreshIntervalRef.current !== null) {
      window.clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };

  const scheduleRefresh = () => {
    clearRefreshInterval();
    // Requisito: fetch a /auth/refresh cada 30 minutos
    refreshIntervalRef.current = window.setInterval(async () => {
      try {
        const refresh_token = localStorage.getItem("refresh_token");
        if (!refresh_token) return logout();
        const { access_token } = await refreshApi(refresh_token);
        setAccessToken(access_token); // ⬅️ SOLO memoria
        setIsAuthenticated(true);
      } catch {
        logout();
      }
    }, THIRTY_MIN_MS);
  };

  const login = async (email: string, password: string) => {
    const { access_token, refresh_token } = await loginApi({ email, contrasena: password });
    // Persistimos SOLO el refresh_token (7 días lo define el backend)
    localStorage.setItem("refresh_token", refresh_token);
    setAccessToken(access_token);     // access token NO se persiste
    setIsAuthenticated(true);
    scheduleRefresh();
  };

  const logout = () => {
    clearRefreshInterval();
    clearAllTokensOnClient(); // borra access (memoria) + refresh (localStorage)
    setIsAuthenticated(false);
  };

  // Autologin: si hay refresh_token al montar, refrescamos para obtener access en memoria
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

  // Extra: al volver del background, intenta refrescar por si expiró
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
