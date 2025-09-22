import { useState } from "react";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { ProfesoresPage } from "./components/profesores/ProfesoresPage";
import { SalasPage } from "./components/salas/SalasPage";
import { AsignaturasPage } from "./components/asignaturas/AsignaturasPage";
import { HorariosPage } from "./components/horarios/HorariosPage";
import { RestriccionesPage } from "./components/restricciones/RestriccionesPage";
import { CursosPage } from "./components/cursos/CursosPage";
import { Login } from "./components/Login/Login";
import { Registro } from "./components/Registro/Registro"; 

export default function App() {
  const [paginaActual, setPaginaActual] = useState("login");

  const renderPagina = () => {
    switch (paginaActual) {
      case "login":
        return (
          <Login
            onLoginSuccess={() => setPaginaActual("dashboard")}
            onShowRegistro={() => setPaginaActual("registro")} 
          />
        );
      case "registro":
        return (
          <Registro
            onShowLogin={() => setPaginaActual("login")} 
          />
        );
      case "dashboard":
        return <DashboardPage />;
      case "profesores":
        return <ProfesoresPage />;
      case "salas":
        return <SalasPage />;
      case "asignaturas":
        return <AsignaturasPage />;
      case "horarios":
        return <HorariosPage />;
      case "restricciones":
        return <RestriccionesPage />;
      case "cursos":
        return <CursosPage />;
      default:
        return <Login
          onLoginSuccess={() => setPaginaActual("dashboard")}
          onShowRegistro={() => setPaginaActual("registro")}
        />;
    }
  };

  return (
    <Layout
      currentPage={paginaActual}
      onPageChange={setPaginaActual}
    >
      {renderPagina()}
    </Layout>
  );
}
