import { useState } from "react";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { ProfesoresPage } from "./components/profesores/ProfesoresPage";
import { SalasPage } from "./components/salas/SalasPage";
import { AsignaturasPage } from "./components/asignaturas/AsignaturasPage";
import { HorariosPage } from "./components/horarios/HorariosPage";
import { RestriccionesPage } from "./pages/RestriccionesPage/RestriccionesPage original";
import { CursosPage } from "./components/cursos/CursosPage";

export default function App() {
  const [paginaActual, setPaginaActual] = useState("dashboard");

  const renderPagina = () => {
    switch (paginaActual) {
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
        return <DashboardPage />;
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