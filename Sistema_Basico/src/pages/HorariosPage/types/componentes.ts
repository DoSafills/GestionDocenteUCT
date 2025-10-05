import type { HorarioDetalle, FiltrosHorario } from "./horario";
import type { FormularioHorario } from "../types";
import type { Profesor, Asignatura, Sala } from "../../../types";

// Props para tarjeta individual de horario
export interface HorarioCardProps {
  horario: HorarioDetalle;
  onVerDetalle: (claseId: string) => void;
  onEditar?: (horario: HorarioDetalle) => void;
}

// Props para el formulario de horarios
export interface FormularioHorarioProps {
  formulario: FormularioHorario;
  onFormularioChange: (campo: keyof FormularioHorario, valor: any) => void;
  onSubmit: () => void;
  onCancelar: () => void;
  profesores: Profesor[];
  asignaturas: Asignatura[];
  salas: (Sala & { edificio: any })[];
  errores?: Record<string, string>;
}

// Props para los filtros de horarios (actualizado para búsqueda simple)
export interface FiltrosHorariosProps {
  filtros: FiltrosHorario;
  onFiltroChange: (filtros: Partial<FiltrosHorario>) => void;
  salas: (Sala & { edificio: any })[];
  profesores: (Profesor & { 
    nombre: string; 
    apellido: string; 
    docente_rut: string; 
    estado: string 
  })[];
  asignaturas: Asignatura[];
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