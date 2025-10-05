import type { Seccion, Bloque, Clase, Sala, Docente, Asignatura } from "../../../types";

export interface HorarioCompleto {
  clase: Clase;
  seccion: Seccion;
  bloque: Bloque;
  sala: Sala;
  docente: Docente;
  asignatura: Asignatura;
}

export interface HorarioDetalle {
  id: string;
  clase_id: string;
  titulo: string;
  seccion: {
    numero: string;
    codigo: string;
    asignatura_codigo: string;
  };
  horario: {
    dia: string;
    hora_inicio: string;
    hora_fin: string;
  };
  sala: {
    codigo: string;
    numero: string;
    edificio: string;
    capacidad: number;
  };
  docente: {
    rut: string;
    nombre: string;
    email: string;
  };
  estado: string;
}

export interface FiltrosHorario {
  seccionId?: string;
  docenteRut?: string;
  salaId?: string;
  bloqueId?: string;
  dia?: number;
  estado?: string;
}

export interface EstadisticasHorarios {
  totalClases: number;
  clasesPorEstado: Record<string, number>;
  clasesPorDia: Record<string, number>;
}