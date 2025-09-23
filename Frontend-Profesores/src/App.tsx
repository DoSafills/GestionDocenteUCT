import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout";
import SalasEdificios from "./pages/salas_edif";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Redirección automática de / hacia /salas */}
          <Route path="/" element={<Navigate to="/salas" replace />} />

          {/* Ruta principal */}
          <Route path="/salas" element={<SalasEdificios />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
