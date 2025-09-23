import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";

import ProfesoresPage from "./pages/ProfesoresPage/ProfesoresPage";
import SalasPage from "./pages/SalasPage/SalasPage";
const DashboardPage = () => <div className="page"><h1>Dashboard</h1></div>;
const AsignaturasPage = () => <div className="page"><h1>Asignaturas</h1></div>;
const HorariosPage = () => <div className="page"><h1>Horarios</h1></div>;
const RestriccionesPage = () => <div className="page"><h1>Restricciones</h1></div>;
const CursosExtensionPage = () => <div className="page"><h1>Cursos Extensión</h1></div>;
const NotFound = () => <div className="page"><h1>404</h1><p>Página no encontrada</p></div>;

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profesores" element={<ProfesoresPage />} />
        <Route path="/salas" element={<SalasPage />} />
        <Route path="/asignaturas" element={<AsignaturasPage />} />
        <Route path="/horarios" element={<HorariosPage />} />
        <Route path="/restricciones" element={<RestriccionesPage />} />
        <Route path="/cursos-extension" element={<CursosExtensionPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
