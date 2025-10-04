// Tipos principales para el sistema académico

export interface Campus {
  id: number;
  nombre: string;
  direccion: string;
}

export interface Edificio {
  id: number;
  nombre: string;
  tipo: string;
  campus_id: number; // FK → Campus.id
}

export interface Sala {
  id: number;
  codigo: string;
  capacidad: number;
  tipo: string;
  esta_disponible: boolean;
  edificio_id: number; // FK → Edificio.id
  equipamiento: string;
}


// Tipos básicos
export interface Profesor {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  especialidad: string[];
  disponibilidad: {
    dias: string[];
    horasInicio: string;
    horasFin: string;
  };
  experiencia: number; // años
  estado: 'activo' | 'inactivo';
  fechaContratacion: string;
}


export interface HorarioSala {
  id: string;
  salaId: string;
  asignaturaId: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  profesorId: string;
}

// Nuevo tipo para horarios manuales
export interface HorarioManual {
  id: string;
  salaId: string;
  titulo: string;
  descripcion?: string;
  dia: string;
  horaInicio: string;
  horaFin: string;
  profesorId?: string;
  asignaturaId?: string;
  color?: string;
  estado: 'activo' | 'cancelado' | 'reprogramado';
  fechaCreacion: string;
  creadoPor: string;
  recurrente: boolean;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface Asignatura {
  id: string;
  codigo: string; // ej: MAT1105-07
  nombre: string;
  creditos: number;
  semestre: number;
  carrera: string;
  profesorId?: string;
  salaId?: string;
  horarios: {
    dia: string;
    horaInicio: string;
    horaFin: string;
  }[];
  prerrequisitos: string[]; // códigos de asignaturas
  cupos: number;
  inscritos: number;
  estado: 'planificada' | 'programada' | 'en_curso' | 'finalizada';
  descripcion: string;
}

export interface RestriccionAcademica {
  id: string;
  tipo: 'prerrequisito' | 'sala_prohibida' | 'horario_conflicto' | 'capacidad' | 'profesor_especialidad' | 'secuencia_temporal';
  descripcion: string;
  activa: boolean;
  prioridad: 'alta' | 'media' | 'baja';
  parametros: {
    asignaturaOrigen?: string;
    asignaturaDestino?: string;
    salaProhibida?: string;
    profesorRequerido?: string;
    especialidadRequerida?: string;
    diaRestriccion?: string;
    horaInicioRestriccion?: string;
    horaFinRestriccion?: string;
    [key: string]: any;
  };
  mensaje: string;
  fechaCreacion: string;
  creadoPor: string;
}

// Tipos heredados del sistema anterior (adaptados)
export interface Estudiante {
  id?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  edad: number;
  carrera: string;
  semestre: number;
  asignaturasAprobadas: string[];
  asignaturasInscritas: string[];
}

export interface Curso {
  id: string;
  nombre: string;
  descripcion: string;
  instructor: string;
  duracion: string;
  precio: number;
  nivel: 'Principiante' | 'Intermedio' | 'Avanzado';
  cuposTotal: number;
  cuposDisponibles: number;
  fechaInicio: string;
  fechaFinInscripcion: string;
  categoria: string;
  imagen: string;
  restricciones: Restricciones;
}

export interface Restricciones {
  edadMinima?: number;
  edadMaxima?: number;
  prerrequisitos?: string[];
  nivelMinimo?: 'Principiante' | 'Intermedio' | 'Avanzado';
  experienciaMinima?: string;
  documentosRequeridos?: string[];
}

export interface Inscripcion {
  cursoId: string;
  estudiante: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    edad: number;
    cursosCompletados: string[];
    nivel: 'Principiante' | 'Intermedio' | 'Avanzado';
  };
  fecha: string;
}

export interface ValidacionResult {
  esValida: boolean;
  errores: string[];
  advertencias: string[];
}

// Tipos para conflictos y validaciones
export interface ConflictoHorario {
  id: string;
  tipo: 'profesor_multiple' | 'sala_multiple' | 'estudiante_multiple';
  descripcion: string;
  asignaturas: string[];
  gravedad: 'critico' | 'advertencia' | 'informativo';
  sugerencias: string[];
}

export interface ValidacionAsignatura {
  asignaturaId: string;
  esValida: boolean;
  errores: string[];
  advertencias: string[];
  conflictos: ConflictoHorario[];
}
