// Tipos principales para el sistema académico


export interface Docente {
    id: number; // PK
    nombre: string;
    email: string;
    password_hash: string;
    esta_activo: boolean;
    especialidad: string;
}

export interface Clase {
    id: number; // PK
    seccion_id: number;
    docente_id: number; // FK
    sala_id: number; // FK
    bloque_id: number; // FK
    estado: string;
}

export interface Bloque {
  id: number;              // PK
  dia_semana: number;      // 1 = Lunes, ..., 7 = Domingo
  hora_inicio: string;     // formato "HH:MM:SS"
  hora_fin: string;        // formato "HH:MM:SS"
}

export interface Seccion {
  id: number;              // PK
  codigo: string;
  anio: number;
  semestre: number;
  asignatura_id: number;   // FK -> Asignatura.id
  cupos: number;
}

export interface Sala {
  id: number;              // PK
  codigo: string;
  capacidad: number;
  tipo: string;            // ejemplo: "Laboratorio", "Aula", etc.
  esta_disponible: boolean;
  edificio_id: number;     // FK -> Edificio.id
  equipamiento: string;    // lista o descripción de equipos
}

export interface Asignatura {
  id: number;
  codigo: string; // ej: MAT1105-07
  nombre: string;
  creditos: number;
  semestre: number;
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

export interface Edificio {
  id: string;
  nombre: string;
  codigo: string;
  direccion: string;
  salas: Sala[];
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
