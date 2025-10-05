import { useEffect, useState } from 'react';
import { Button } from "../../components/ui/button";
import { Grid3x3, List, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { useHorarios } from './hooks';
import { ListaHorarios } from './components/ListaHorarios';
import { CalendarioHorarios } from './components/CalendarioHorarios';
import { FiltrosHorarios } from './components/FiltrosHorarios';
import { edificiosMock, profesoresMock, asignaturasMock } from "../../data/mock-data";
import type { FiltrosHorario } from './types/horario';
import { toast } from "sonner";

export function HorariosPage() {
  const {
    horarios,
    cargando,
    error,
    filtrarHorarios,
    obtenerHorarioPorClase,
    obtenerEstadisticas
  } = useHorarios();


  const [filtros, setFiltros] = useState<FiltrosHorario>({});
  const [vistaCalendario, setVistaCalendario] = useState(false);
  const [tipoVista, setTipoVista] = useState<'semanal' | 'mensual'>('semanal');
  const [estadisticas, setEstadisticas] = useState<any>(null);

  // Obtener salas del edificio CJP07
  const todasLasSalas = edificiosMock
    .filter((edificio: any) => edificio.codigo === 'CJP07')
    .flatMap((edificio: any) => 
      edificio.salas.map((sala: any) => ({ ...sala, edificio }))
    );

  useEffect(() => {
    filtrarHorarios({});
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    const stats = await obtenerEstadisticas();
    setEstadisticas(stats);
  };

  const handleVerDetalle = async (claseId: string) => {
    const detalle = await obtenerHorarioPorClase(claseId);
    if (detalle) {
      console.log('Detalle del horario:', detalle);
    }
  };

  const handleFiltroChange = (nuevosFiltros: Partial<FiltrosHorario>) => {
    const filtrosActualizados = { ...filtros, ...nuevosFiltros };
    setFiltros(filtrosActualizados);
    filtrarHorarios(filtrosActualizados);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 font-semibold text-lg mb-2">Error al cargar horarios</p>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button 
            onClick={() => filtrarHorarios(filtros)}
            variant="outline"
          >
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
          <p className="text-muted-foreground">
            Consulta los horarios académicos del sistema
          </p>
        </div>
        
        <div className="flex gap-2">
          
          <Button
            variant={!vistaCalendario ? 'default' : 'outline'}
            onClick={() => setVistaCalendario(false)}
          >
            <List className="w-4 h-4 mr-2" />
            Lista
          </Button>
          <Button
            variant={vistaCalendario ? 'default' : 'outline'}
            onClick={() => setVistaCalendario(true)}
          >
            <Grid3x3 className="w-4 h-4 mr-2" />
            Calendario
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <FiltrosHorarios
        filtros={filtros}
        onFiltroChange={handleFiltroChange}
        salas={todasLasSalas}
        profesores={profesoresMock}
        asignaturas={asignaturasMock}
      />

      {/* Contenido principal */}
      {vistaCalendario ? (
        <CalendarioHorarios
          horarios={horarios}
          onVerDetalle={handleVerDetalle}
          vista={tipoVista}
          onCambiarVista={setTipoVista}
        />
      ) : (
        <ListaHorarios
          horarios={horarios}
          onVerDetalle={handleVerDetalle}
          cargando={cargando}
        />
      )}

    </div>
  );
}
