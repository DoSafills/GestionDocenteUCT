import type { HorarioDetalle, FiltrosHorario } from "./horario";

// Props para tarjeta individual de horario
export interface HorarioCardProps {
  horario: HorarioDetalle;
  onVerDetalle: (claseId: string) => void;
  onEditar?: (horario: HorarioDetalle) => void;
}

// Props para los filtros de horarios (actualizado para búsqueda simple)
export interface FiltrosHorariosProps {
  filtros: FiltrosHorario;
  onFiltroChange: (filtros: Partial<FiltrosHorario>) => void;
  salas: any[];
  profesores: any[];
}

// Props para la lista de horarios
export interface ListaHorariosProps {
  horarios: HorarioDetalle[];
  onVerDetalle: (claseId: string) => void;
  onEditar?: (horario: HorarioDetalle) => void;
  cargando?: boolean;
}

// Props para el calendario de horarios
export interface CalendarioHorariosProps {
  horarios: HorarioDetalle[];
  onVerDetalle: (claseId: string) => void;
  onEditar?: (horario: HorarioDetalle) => void;
  vista: 'semanal' | 'mensual';
  onCambiarVista: (vista: 'semanal' | 'mensual') => void;
}

// Props para estadísticas de horarios
export interface EstadisticasHorariosProps {
  estadisticas: {
    totalClases: number;
    clasesPorEstado: Record<string, number>;
    clasesPorDia: Record<string, number>;
  } | null;
  cargando?: boolean;
}