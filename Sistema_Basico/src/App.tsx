// src/App.tsx
import React, { useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { ProfesoresPage } from "./components/profesores/ProfesoresPage";
import { SalasPage } from "./components/salas/SalasPage";
import { AsignaturasPage } from "./components/asignaturas/AsignaturasPage";
import { HorariosPage } from "./components/horarios/HorariosPage";
import { RestriccionesPage } from "./components/restricciones/RestriccionesPage";
import { CursosPage } from "./components/cursos/CursosPage";
import LoginForm from "./components/Login/Loginpage"; // export default
import { AuthProvider, useAuth } from "./context/AuthContext";

// Define tu union para navegación
type Pagina =
  | "login"
  | "dashboard"
  | "profesores"
  | "salas"
  | "asignaturas"
  | "horarios"
  | "restricciones"
  | "cursos";

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

function MainApp() {
  const [paginaActual, setPaginaActual] = useState<Pagina>("login");
  const { isAuthenticated } = useAuth();

  // Redirige según autenticación
  useEffect(() => {
    if (!isAuthenticated) setPaginaActual("login");
    else if (paginaActual === "login") setPaginaActual("dashboard");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const renderPrivado = () => {
    switch (paginaActual) {
      case "dashboard": return <DashboardPage />;
      case "profesores": return <ProfesoresPage />;
      case "salas": return <SalasPage />;
      case "asignaturas": return <AsignaturasPage />;
      case "horarios": return <HorariosPage />;
      case "restricciones": return <RestriccionesPage />;
      case "cursos": return <CursosPage />;
      default: return <DashboardPage />;
    }
  };

  // Si NO hay sesión: solo Login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <LoginForm onSuccess={() => setPaginaActual("dashboard")} />
        </div>
      </div>
    );
  }

  // ✅ Opción 2: wrapper que castea a Pagina
  return (
    <Layout
      currentPage={paginaActual}                            // string compatible
      onPageChange={(p) => setPaginaActual(p as Pagina)}    // <— wrapper
    >
      {renderPrivado()}
    </Layout>
  );
}
