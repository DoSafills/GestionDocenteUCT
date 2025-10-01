// Tipos principales para el sistema académico

// Tipos básicos
export interface Profesor {
  id: string;
  docente_rut: string; // ej: 12345678-9
  nombre: string;
  apellido?: string;
  email: string;
  telefono?: string;
  pass_hash: string;
  max_horas_docencia: number;
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

// Alias para compatibilidad
export interface Docente extends Profesor {}

// Tipos basados en el diagrama de base de datos
export interface Campus {
  id: string;
  codigo: string;
  nombre: string;
}

export interface Edificio {
  id: string;
  nombre: string;
  codigo: string;
  direccion: string;
  campus_codigo: string;
  salas: Sala[];
}

export interface Seccion {
  id: string;
  seccion_id: string;
  numero: string;
  codigo: string;
  ano: number;
  semestre: number;
  asignatura_codigo: string;
  cupos: number;
}

export interface Bloque {
  id: string;
  bloque_id: string;
  dia_semana: number; // 1-7 (Lunes=1, Domingo=7)
  hora_inicio: string;
  hora_fin: string;
}

export interface Clase {
  id: string;
  clase_id: string;
  seccion_id: string;
  docente_rut: string;
  sala_codigo: string;
  bloque_id: string;
  estado: 'Programado' | 'Activo' | 'ETC';
}

export interface Sala {
  id: string;
  codigo: string; // ej: CS01_125
  numero: string;
  edificioId: string;
  edificio_codigo: string;
  capacidad: number;
  tipo: 'TALLER' | 'LAB' | 'ATC';
  piso: number;
  estado: 'DISPONIBLE' | 'NO_DISPONIBLE';
  equipamiento: string[];
  disponible: boolean;
  horarios: HorarioSala[];
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