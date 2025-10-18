export type TipoRestriccion =
  | "prerrequisito"
  | "sala_prohibida"
  | "horario_conflicto"
  | "capacidad"
  | "profesor_especialidad"
  | "secuencia_temporal";

export interface ParametrosRestriccion {
  docente_rut?: string;
  operador?: string;
  valor?: string;
  comentario?: string;
  asignaturaOrigen?: string;
  asignaturaDestino?: string;
  salaProhibida?: string;
  especialidadRequerida?: string;
  diaRestriccion?: string;
  horaInicioRestriccion?: string;
  horaFinRestriccion?: string;
  fechaCreacion?: string; // o Date si lo manejas como fecha
  creadoPor?: string;
}

export interface RestriccionAcademica {
  id?: string;
  tipo: TipoRestriccion;
  descripcion: string;
  mensaje: string;
  prioridad: "alta" | "media" | "baja";
  activa: boolean;
  parametros: ParametrosRestriccion;
}
