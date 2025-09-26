import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { ProfesoresPage } from "./components/profesores/ProfesoresPage";
import { SalasPage } from "./components/salas/SalasPage";
import { AsignaturasPage } from "./components/asignaturas/AsignaturasPage";
import { HorariosPage } from "./components/horarios/HorariosPage";
import { RestriccionesPage } from "./components/restricciones/RestriccionesPage";
import { CursosPage } from "./components/cursos/CursosPage";

export default function App() {
  const [paginaActual, setPaginaActual] = useState("dashboard");

  // Forzar modo oscuro al cargar la aplicación
  useEffect(() => {
    // Agregar clase dark al documento
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    
    // También aplicar al body
    document.body.classList.add('dark');
    document.body.classList.remove('light');
    
    // Configurar color-scheme
    document.documentElement.style.colorScheme = 'dark';
  }, []);

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
    <div className="dark min-h-screen bg-background text-foreground">
      <Layout 
        currentPage={paginaActual} 
        onPageChange={setPaginaActual}
      >
        {renderPagina()}
      </Layout>
    </div>
  );
}