import { useEffect, useState } from 'react';
import { Button } from "../../components/ui/button";
import { List, Download, Shield, User } from "lucide-react";
import { useHorarios } from '@/hooks/useHorarios';
import { usePermisosHorarios } from '@/hooks/usePermisosHorarios';
import { ListaHorarios } from './components/ListaHorarios';
import { FiltrosHorarios } from './components/FiltrosHorarios';
import type { FiltrosHorario } from './types/horario';
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";

import { edificiosMock } from "../../data/edificios";
import { salasMock } from "../../data/salas";
import { docentesMock } from "../../data/docentes";

export function HorariosPage() {
  const { horarios, cargando, error, filtrarHorarios, obtenerHorarioPorClase } = useHorarios();
  const { permisos, usuario, rol, cargando: cargandoPermisos } = usePermisosHorarios();

  const [filtros, setFiltros] = useState<FiltrosHorario>({});
  
  // Verificar si está en modo mock
  // const isMockMode = import.meta.env.VITE_AUTH_MOCK === 'true';

  // Enriquecer salas con edificio (para filtros)
  const edificioById = new Map(edificiosMock.map(e => [e.id, e]));
  const todasLasSalas = salasMock.map(s => {
    const edif = edificioById.get(s.edificio_id);
    const edificioNombre = edif?.nombre ?? "";
    const numero = (String(s.codigo).split(/[_-]/).pop() || String(s.codigo)).toString();
    return {
      ...s,
      numero,
      edificio: { codigo: edificioNombre, nombre: edificioNombre },
    };
  });

  // Cargar horarios según el rol del usuario
  useEffect(() => {
    if (cargandoPermisos) return;
    
    // Limpiar filtros al cambiar de usuario
    setFiltros({});
    
    // Si no hay usuario, cargar todos los horarios por defecto (solo en caso sin auth)
    if (!usuario) {
      filtrarHorarios({});
      return;
    }
    
    // Si es docente, cargar solo sus horarios
    if (rol === "DOCENTE") {
      console.log("[HorariosPage] Cargando horarios del docente:", usuario.id);
      filtrarHorarios({ docenteRut: String(usuario.id) });
    } else if (rol === "ESTUDIANTE") {
      // Si es estudiante, cargar solo sus horarios inscritos
      // TODO: Implementar filtro por inscripciones del estudiante
      filtrarHorarios({});
    } else if (permisos.puedeVerTodos) {
      // Administrador puede ver todos
      console.log("[HorariosPage] Cargando todos los horarios (admin)");
      filtrarHorarios({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rol, usuario?.id, cargandoPermisos]);

  // Log de horarios cargados
  useEffect(() => {
    if (horarios.length === 0) {
      return;
    }
    const detalles = horarios.map((h) => ({
      clase_id: h.clase_id,
      asignatura: h.titulo?.split(" - ")[0] ?? h.seccion?.codigo ?? "N/D",
      seccion: h.seccion?.codigo,
      docente: `${h.docente?.nombre} (${h.docente?.rut})`,
      dia: h.horario?.dia,
      hora: `${h.horario?.hora_inicio}-${h.horario?.hora_fin}`,
      sala: `${h.sala?.codigo} (${h.sala?.numero})`,
      estado: h.estado,
    }));
    console.log("Horarios cargados:", detalles.length);
  }, [horarios]);

  const handleVerDetalle = async (claseId: string) => {
    const detalle = await obtenerHorarioPorClase(claseId);
    if (detalle) console.log('Detalle del horario:', detalle);
  };

  const handleFiltroChange = (nuevosFiltros: Partial<FiltrosHorario>) => {
    let filtrosActualizados = { ...filtros, ...nuevosFiltros };
    
    // Si es docente, forzar filtro por su ID
    if (rol === "DOCENTE" && usuario) {
      filtrosActualizados = { ...filtrosActualizados, docenteRut: String(usuario.id) };
    }
    
    setFiltros(filtrosActualizados);
    filtrarHorarios(filtrosActualizados as FiltrosHorario);
  };

  const handleExportar = () => {
    // TODO: Implementar exportación a PDF/Excel
  };

  const getRolBadgeColor = (rol: string | null) => {
    switch (rol) {
      case "ADMINISTRADOR":
        return "bg-red-100 text-red-800 border-red-200";
      case "DOCENTE":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ESTUDIANTE":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Solo mostrar loading mientras se cargan permisos, no requerir autenticación en modo demo
  if (cargandoPermisos) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-blue-500 text-4xl mb-4">⏳</div>
          <p className="text-muted-foreground">Cargando permisos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 font-semibold text-lg mb-2">Error al cargar horarios</p>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => filtrarHorarios(filtros)} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold">Gestión de Horarios</h2>
            {usuario && rol && (
              <Badge variant="outline" className={getRolBadgeColor(rol)}>
                <Shield className="w-3 h-3 mr-1" />
                {rol.charAt(0) + rol.slice(1).toLowerCase()}
              </Badge>
            )}
            {usuario && (
              <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200">
                <User className="w-3 h-3 mr-1" />
                {usuario.nombre}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {rol === "ADMINISTRADOR" && "Vista completa de todos los horarios académicos"}
            {rol === "DOCENTE" && `Horarios de ${usuario?.nombre}`}
            {rol === "ESTUDIANTE" && "Tus horarios de clases inscritas"}
            {!rol && "Consulta los horarios académicos del sistema"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="default">
            <List className="w-4 h-4 mr-2" /> Lista
          </Button>
          {permisos.puedeExportar && (
            <Button variant="outline" onClick={handleExportar}>
              <Download className="w-4 h-4 mr-2" /> Exportar
            </Button>
          )}
        </div>
      </div>

      {/* Alerta informativa según el rol */}
      {rol === "DOCENTE" && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            📚 Visualizando únicamente tus horarios asignados. No puedes ver horarios de otros docentes.
          </AlertDescription>
        </Alert>
      )}

      {rol === "ESTUDIANTE" && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            🎓 Visualizando los horarios de tus secciones inscritas.
          </AlertDescription>
        </Alert>
      )}

      {rol === "ADMINISTRADOR" && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            🛡️ Acceso administrativo: Puedes ver y gestionar todos los horarios del sistema.
          </AlertDescription>
        </Alert>
      )}

      {/* Filtros - condicionalmente según permisos */}
      {(permisos.puedeFiltrarPorDocente || rol === null) && (
        <FiltrosHorarios
          filtros={filtros}
          onFiltroChange={handleFiltroChange}
          salas={todasLasSalas}
          profesores={docentesMock}
        />
      )}

      {/* Lista de horarios */}
      <ListaHorarios
        horarios={horarios}
        onVerDetalle={handleVerDetalle}
        cargando={cargando || cargandoPermisos}
      />
    </div>
  );
}