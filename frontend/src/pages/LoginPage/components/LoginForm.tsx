import React, { useMemo, useState } from "react";
import { useAuthContext } from "../hooks/AuthProvider";

export default function LoginForm() {
  const { login, isLoading, error } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await login({ email, password });
  }

  const mockEnabled = useMemo(
    () => import.meta.env.VITE_AUTH_MOCK === "true",
    []
  );

  return (
    <div className="min-h-[70vh] w-full grid place-items-center px-4 py-10 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md">
        
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur shadow-xl dark:bg-slate-900/70 dark:border-slate-800">
          <div className="p-6 sm:p-8">
            
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 shadow ring-1 ring-slate-700/30 overflow-hidden">
                <img
                  src="/favicon.png"
                  alt="Logo UCT"
                  className="h-full w-full object-contain"
                  decoding="async"
                />
              </div>

              <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Iniciar sesión
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Accede con tus credenciales institucionales
              </p>
            </div>

            
            {mockEnabled && (
              <div className="mb-4 rounded-lg border border-yellow-300/60 bg-yellow-50 text-yellow-900 text-sm px-3 py-2 text-center font-medium dark:bg-yellow-100/10 dark:text-yellow-200 dark:border-yellow-500/40">
                <span className="mr-1">⚙️</span> MODO MOCK ACTIVADO
              </div>
            )}

            {/* Error */}
            {error && (
              <div
                role="alert"
                aria-live="polite"
                className="mb-4 flex items-start gap-2 rounded-lg border border-red-300/70 bg-red-50 px-3 py-2 text-red-800 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800/50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="mt-0.5 h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.29 3.86a2.25 2.25 0 013.42 0l7.26 8.45c.94 1.1.14 2.79-1.42 2.79H4.45c-1.56 0-2.36-1.69-1.42-2.79l7.26-8.45zM12 9a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0112 9zm0 7a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm">{error}</p>
              </div>
            )}

            
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Correo
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="tucorreo@ejemplo.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 pr-11 text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-2.5 my-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    aria-label={
                      showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    title={
                      showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M3.21 3.21a.75.75 0 011.06 0l16.52 16.52a.75.75 0 11-1.06 1.06l-2.53-2.53a10.7 10.7 0 01-5.2 1.38C6.55 19.64 2.4 16.07 1 12c.61-1.73 1.84-3.39 3.43-4.79L3.21 4.27a.75.75 0 010-1.06zM12 7.36a4.64 4.64 0 014.64 4.64c0 .64-.13 1.24-.37 1.78l-1.72-1.72a2.93 2.93 0 00-2.47-2.47L12 7.36z" />
                        <path d="M8.73 10.09l-1.6-1.6A10.73 10.73 0 0112 4.36c5.45 0 9.6 3.57 11 7.64-.37 1.06-.95 2.1-1.69 3.04l-3.18-3.18A4.64 4.64 0 008.73 10.1z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M12 4.36c5.45 0 9.6 3.57 11 7.64-1.4 4.07-5.55 7.64-11 7.64S2.4 16.07 1 12C2.4 7.93 6.55 4.36 12 4.36zm0 2.5C7.92 6.86 4.53 9.46 3.24 12 4.53 14.54 7.92 17.14 12 17.14S19.47 14.54 20.76 12C19.47 9.46 16.08 6.86 12 6.86zm0 1.64a3.5 3.5 0 110 7 3.5 3.5 0 010-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>



              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[.99] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                {isLoading && (
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeOpacity=".25"
                      strokeWidth="4"
                    />
                    <path
                      d="M22 12a10 10 0 00-10-10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                  </svg>
                )}
                <span>{isLoading ? "Ingresando..." : "Ingresar"}</span>
              </button>
            </form>
          </div>
        </div>

        
        
      </div>
    </div>
  );
}
