import { useEffect, useState } from 'react';
import { Button } from "../../components/ui/button";
import { List } from "lucide-react";
import { useHorarios } from './hooks';
import { ListaHorarios } from './components/ListaHorarios';
import { FiltrosHorarios } from './components/FiltrosHorarios';
import type { FiltrosHorario } from './types/horario';

import { asignaturasMock } from "../../data/asignaturas";
import { edificiosMock } from "../../data/edificios";
import { salasMock } from "../../data/salas";
import { docentesMock } from "../../data/docentes";

export function HorariosPage() {
  const { horarios, cargando, error, filtrarHorarios, obtenerHorarioPorClase } = useHorarios();

  const [filtros, setFiltros] = useState<FiltrosHorario>({});

  // Enriquecer salas con edificio (para filtros)
  const edificioById = new Map(edificiosMock.map(e => [e.id, e]));
  const todasLasSalas = salasMock.map(s => {
    const edif = edificioById.get(s.edificio_id);
    const edificioNombre = (edif?.nombre ?? "").trim();
    const edificioCodigo = (edificioNombre.split(" ")[0] || "").trim();
    const numero = (String(s.codigo).split(/[_-]/).pop() || String(s.codigo)).toString();
    return {
      ...s,
      numero,
      edificio: { codigo: edificioCodigo, nombre: edificioNombre },
    };
  });

  // Cargar TODOS los horarios al iniciar
  useEffect(() => {
    console.log("[HorariosPage] montado: cargo todos los horarios");
    filtrarHorarios({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Log amigable
  useEffect(() => {
    if (horarios.length === 0) {
      console.log("No se encontraron horarios con los filtros actuales.");
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
    console.log("Horarios cargados (detalle):", detalles);
  }, [horarios]);

  const handleVerDetalle = async (claseId: string) => {
    const detalle = await obtenerHorarioPorClase(claseId);
    if (detalle) console.log('Detalle del horario:', detalle);
  };

  const handleFiltroChange = (nuevosFiltros: Partial<FiltrosHorario>) => {
    const filtrosActualizados = { ...filtros, ...nuevosFiltros };
    setFiltros(filtrosActualizados);
    filtrarHorarios(filtrosActualizados as FiltrosHorario);
  };

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
          <h2 className="text-3xl font-bold">Gestión de Horarios</h2>
          <p className="text-muted-foreground">Consulta los horarios académicos del sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="default">
            <List className="w-4 h-4 mr-2" /> Lista
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <FiltrosHorarios
        filtros={filtros}
        onFiltroChange={handleFiltroChange}
        salas={todasLasSalas}
        profesores={docentesMock}
        asignaturas={asignaturasMock}
      />

      {/* Solo lista */}
      <ListaHorarios
        horarios={horarios}
        onVerDetalle={handleVerDetalle}
        cargando={cargando}
      />
    </div>
  );
}
