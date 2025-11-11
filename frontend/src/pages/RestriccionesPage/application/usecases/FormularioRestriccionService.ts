import type { TipoRestriccion } from "@domain/entities/restriccionespage/RestriccionAcademica";

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
  fechaCreacion?: string; // agregado mínimo
  creadoPor?: string;     // agregado mínimo
  capacidadMaxima?: number;
}

export interface Formulario {
  tipo: TipoRestriccion;
  descripcion: string;
  mensaje: string;
  prioridad: "alta" | "media" | "baja";
  activa: boolean;
  parametros: ParametrosRestriccion;
}

export class FormularioRestriccionService {
  static inicializar(): Formulario {
    return {
      tipo: "sala_prohibida",
      descripcion: "",
      mensaje: "",
      prioridad: "media",
      activa: true,
      parametros: {},
    };
  }

  static actualizarCampo<K extends keyof Formulario>(
    formulario: Formulario,
    campo: K,
    valor: Formulario[K]
  ): Formulario {
    return { ...formulario, [campo]: valor };
  }

  static actualizarParametro<K extends keyof ParametrosRestriccion>(
    formulario: Formulario,
    parametro: K,
    valor: ParametrosRestriccion[K]
  ): Formulario {
    return {
      ...formulario,
      parametros: { ...formulario.parametros, [parametro]: valor },
    };
  }

  static validar(formulario: Formulario): string[] {
    const errores: string[] = [];

    if (!formulario.descripcion.trim()) errores.push("La descripción es obligatoria");
    if (!formulario.mensaje.trim()) errores.push("El mensaje es obligatorio");

    switch (formulario.tipo) {
      case "sala_prohibida":
        if (!formulario.parametros.asignaturaOrigen) errores.push("Asignatura requerida");
        if (!formulario.parametros.salaProhibida) errores.push("Tipo de sala requerido");
        break;

      case "profesor_especialidad":
        if (!formulario.parametros.asignaturaOrigen) errores.push("Asignatura requerida");
        if (!formulario.parametros.especialidadRequerida) errores.push("Especialidad requerida");
        break;

      case "horario_conflicto":
        if (!formulario.parametros.diaRestriccion) errores.push("Día requerido");

        const horaInicio = formulario.parametros.horaInicioRestriccion;
        const horaFin = formulario.parametros.horaFinRestriccion;
        const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (!horaInicio) errores.push("Hora inicio requerida");
        else if (!horaRegex.test(horaInicio)) errores.push("Hora inicio inválida");

        if (!horaFin) errores.push("Hora fin requerida");
        else if (!horaRegex.test(horaFin)) errores.push("Hora fin inválida");
        break;

      case "capacidad":
        const capacidad = formulario.parametros.capacidadMaxima;
        if (capacidad === undefined || capacidad <= 0 || isNaN(capacidad)) {
          errores.push("Capacidad máxima debe ser un número mayor a 0");
        }
        break;
    }

    return errores;
  }
}
