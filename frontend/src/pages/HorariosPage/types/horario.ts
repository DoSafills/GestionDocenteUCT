export interface HorarioCompleto {
  clase: any;
  seccion: any;
  bloque: any;
  sala: any;
  docente: any;
  asignatura: any;
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
    id?: number;
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
  edificioId?: string;
  campusId?: string;
  bloqueId?: string;
  dia?: number;
  estado?: string;
  busqueda?: string;
}

export interface EstadisticasHorarios {
  totalClases: number;
  clasesPorEstado: Record<string, number>;
  clasesPorDia: Record<string, number>;
}