// Tipos específicos para el componente de horarios
import type { HorarioManual, Profesor, Asignatura, Sala } from "../../types";

// Estados de filtros
export interface FiltrosHorarios {
  busqueda: string;
  filtroSala: string;
  filtroEstado: string;
  filtroProfesor?: string;
  filtroAsignatura?: string;
  filtroFecha?: string;
}


// Estado del modal de confirmación
export interface EstadoConfirmacion {
  abierto: boolean;
  horarioId?: string;
  titulo?: string;
  tipo?: "eliminar" | "cancelar" | "reprogramar";
  accion?: () => void;
}

// Props para el componente de horario individual
export interface HorarioCardProps {
  horario: HorarioManual;
  onEditar: (horario: HorarioManual) => void;
  onEliminar: (horario: HorarioManual) => void;
  onCambiarEstado: (horarioId: string, nuevoEstado: HorarioManual["estado"]) => void;
  profesores: Profesor[];
  asignaturas: Asignatura[];
  salas: (Sala & { edificio: any })[];
}

// Opciones para los selectores
export interface OpcionSelect {
  value: string;
  label: string;
}

// Configuración de colores para los horarios
export interface ConfiguracionColor {
  value: string;
  label: string;
  clase: string;
}

// Estado de vista del calendario
export interface VistaCalendario {
  tipo: "semanal" | "mensual" | "diaria";
  fechaActual: Date;
  horariosVisibles: HorarioManual[];
}

// Configuración de días de la semana
export interface ConfiguracionDia {
  id: string;
  nombre: string;
  nombreCorto: string;
  numero: number;
}

// Configuración de horas
export interface ConfiguracionHora {
  valor: string;
  etiqueta: string;
}

// Props para el componente de vista calendario
export interface VistaCalendarioProps {
  horarios: HorarioManual[];
  onEditarHorario: (horario: HorarioManual) => void;
  onEliminarHorario: (horario: HorarioManual) => void;
  profesores: Profesor[];
  asignaturas: Asignatura[];
  salas: (Sala & { edificio: any })[];
}

// Props para el componente de vista lista
export interface VistaListaProps {
  horarios: HorarioManual[];
  onEditarHorario: (horario: HorarioManual) => void;
  onEliminarHorario: (horario: HorarioManual) => void;
  onCambiarEstado: (horarioId: string, nuevoEstado: HorarioManual["estado"]) => void;
  profesores: Profesor[];
  asignaturas: Asignatura[];
  salas: (Sala & { edificio: any })[];
}

// Validación de conflictos de horarios
export interface ConflictoHorario {
  existe: boolean;
  horarioConflictivo?: HorarioManual;
  mensaje?: string;
}

// Estado principal del componente HorariosPage
export interface EstadoHorarios {
  horarios: HorarioManual[];
  filtros: FiltrosHorarios;
  vistaCalendario: boolean;
  modalAbierto: boolean;
  editandoHorario: HorarioManual | null;
  confirmacion: EstadoConfirmacion;
  cargando: boolean;
  error?: string;
}

// Acciones disponibles para los horarios
export type AccionHorario = 
  | "ver_detalles";

// Configuración de acciones con sus propiedades
export interface ConfiguracionAccion {
  id: AccionHorario;
  etiqueta: string;
  icono: string;
  color: string;
  confirmacion?: boolean;
  visible: (horario: HorarioManual) => boolean;
}

export const FILTROS_INICIALES: FiltrosHorarios = {
  busqueda: "",
  filtroSala: "todos",
  filtroEstado: "todos",
};

export const CONFIRMACION_INICIAL: EstadoConfirmacion = {
  abierto: false,
};

// Constantes para días de la semana
export const DIAS_SEMANA: ConfiguracionDia[] = [
  { id: "lunes", nombre: "Lunes", nombreCorto: "Lun", numero: 1 },
  { id: "martes", nombre: "Martes", nombreCorto: "Mar", numero: 2 },
  { id: "miércoles", nombre: "Miércoles", nombreCorto: "Mié", numero: 3 },
  { id: "jueves", nombre: "Jueves", nombreCorto: "Jue", numero: 4 },
  { id: "viernes", nombre: "Viernes", nombreCorto: "Vie", numero: 5 },
  { id: "sábado", nombre: "Sábado", nombreCorto: "Sáb", numero: 6 },
];

// Constantes para colores de horarios
export const COLORES_HORARIO: ConfiguracionColor[] = [
  { value: "#3B82F6", label: "Azul", clase: "bg-blue-500" },
  { value: "#10B981", label: "Verde", clase: "bg-green-500" },
  { value: "#F59E0B", label: "Amarillo", clase: "bg-yellow-500" },
  { value: "#EF4444", label: "Rojo", clase: "bg-red-500" },
  { value: "#8B5CF6", label: "Púrpura", clase: "bg-purple-500" },
  { value: "#06B6D4", label: "Cyan", clase: "bg-cyan-500" },
  { value: "#84CC16", label: "Lima", clase: "bg-lime-500" },
  { value: "#F97316", label: "Naranja", clase: "bg-orange-500" },
];

// Constantes para horas del día
export const HORAS_DIA: ConfiguracionHora[] = Array.from({ length: 24 }, (_, i) => {
  const hora = i.toString().padStart(2, '0');
  return {
    valor: `${hora}:00`,
    etiqueta: `${hora}:00`,
  };
});

// Función helper para generar horas con intervalos de 30 minutos
export const generarHorasConIntervalos = (): ConfiguracionHora[] => {
  const horas: ConfiguracionHora[] = [];
  for (let i = 7; i <= 22; i++) {
    for (let j = 0; j < 60; j += 30) {
      const hora = i.toString().padStart(2, '0');
      const minuto = j.toString().padStart(2, '0');
      const valor = `${hora}:${minuto}`;
      horas.push({
        valor,
        etiqueta: valor,
      });
    }
  }
  return horas;
};
