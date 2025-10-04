import { useState } from "react";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { ProfesoresPage } from "./components/profesores/ProfesoresPage";
import { EdificiosPage } from "./pages/EdificiosPage/index";
import { AsignaturasPage } from "./components/asignaturas/AsignaturasPage";
import { HorariosPage } from "./components/horarios/HorariosPage";
import { RestriccionesPage } from "./components/restricciones/RestriccionesPage";
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
        return <EdificiosPage/>;
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
