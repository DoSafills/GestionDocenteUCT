// src/pages/LoginPage/components/LoginForm.tsx
import React, { useState } from "react";
import { useAuthContext } from "../hooks/AuthProvider";

export default function LoginForm() {
  // ✅ el hook va DENTRO del componente
  const { login, isLoading, error } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // (opcional) logs de depuración:
    // console.log("submit login", { email, passwordLength: password.length });
    await login({ email, password });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {import.meta.env.VITE_AUTH_MOCK === "true" && (
        <div className="mb-3 rounded bg-yellow-100 text-yellow-800 text-sm px-3 py-1 text-center font-medium">
          ⚙️ MODO MOCK ACTIVADO
        </div>
      )}

      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium">Correo</label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border px-3 py-2"
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded border px-3 py-2"
          required
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={isLoading || !email || !password}
        className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
      >
        {isLoading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
