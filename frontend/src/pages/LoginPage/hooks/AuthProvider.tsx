import React, { createContext, useContext } from "react";
import { useAuth } from "./useAuth";

type AuthCtx = ReturnType<typeof useAuth>;

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = useAuth(); // una sola instancia del hook para toda la app
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuthContext debe usarse dentro de <AuthProvider>");
  return ctx;
}
