import type{ TipoRestriccion } from "@domain/entities/restriccionespage/RestriccionAcademica";

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
      tipo: "prerrequisito",
      descripcion: "",
      mensaje: "",
      prioridad: "media",
      activa: true,
      parametros: {},
    };
  }

  static actualizarCampo(formulario: Formulario, campo: keyof Formulario, valor: any): Formulario {
    return { ...formulario, [campo]: valor };
  }

  static actualizarParametro(
    formulario: Formulario,
    parametro: keyof ParametrosRestriccion,
    valor: any
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
      case "prerrequisito":
      case "secuencia_temporal":
        if (!formulario.parametros.asignaturaOrigen) errores.push("Asignatura origen requerida");
        if (!formulario.parametros.asignaturaDestino) errores.push("Asignatura destino requerida");
        break;
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
        if (!formulario.parametros.horaInicioRestriccion) errores.push("Hora inicio requerida");
        if (!formulario.parametros.horaFinRestriccion) errores.push("Hora fin requerida");
        break;
    }

    return errores;
  }
}
