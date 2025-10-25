export type TipoRestriccion =
  | "sala_prohibida"
  | "horario_conflicto"
  | "capacidad"
  | "profesor_especialidad";

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
  capacidadMaxima?: number;
  fechaCreacion?: string; // o Date si lo manejas como fecha
  creadoPor?: string;
}

export interface RestriccionAcademica {
  id?: number;
  tipo: TipoRestriccion;
  descripcion: string;
  mensaje: string;
  prioridad: "alta" | "media" | "baja";
  activa: boolean;
  parametros: ParametrosRestriccion;
}
