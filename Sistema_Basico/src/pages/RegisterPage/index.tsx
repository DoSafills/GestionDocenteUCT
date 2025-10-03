import React, { useState } from "react";

type RegistroProps = {
  onShowLogin: () => void; 
};

export const Registro: React.FC<RegistroProps> = ({ onShowLogin }) => {
  const [rut, setRut] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [maxHoras, setMaxHoras] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost/gestionuctscript/registro.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rut,
          nombre,
          email,
          password,
          max_horas: maxHoras || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        
        onShowLogin();
      } else {
        setError(data.message || "Error al registrar docente.");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-primary mb-6">
          Registro de Docente
        </h1>

        {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="RUT"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="number"
            placeholder="Horas máximas (opcional)"
            value={maxHoras}
            onChange={(e) => setMaxHoras(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onShowLogin}
            className="text-sm text-primary hover:underline"
          >
            Volver al login
          </button>
        </div>
      </div>
    </div>
  );
};
