// src/components/Login/Loginpage.tsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      
      await login(email, password);
      
      
    } catch (error: any) {
      // apiFetch lanza Error con { status, data }
      const msg =
        error?.data?.message ||
        error?.message ||
        "No se pudo iniciar sesión";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
        className="w-full border rounded px-3 py-2"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
        className="w-full border rounded px-3 py-2"
      />
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <button
        type="submit"
        disabled={loading || !email || !password}
        className="w-full border rounded px-3 py-2"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
