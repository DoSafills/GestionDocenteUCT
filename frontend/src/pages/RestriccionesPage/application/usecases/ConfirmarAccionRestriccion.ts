import type { RestriccionAcademica } from "@domain/entities/restriccionespage/RestriccionAcademica";

export type AccionRestriccion = "crear" | "editar" | "eliminar" | null;

export interface ConfirmarAccionParams {
  accion: AccionRestriccion;
  restriccion: RestriccionAcademica | null;
  ejecutar: () => void;
  limpiarEstados: () => void;
}

/**
 * Estado del cuadro de confirmación
 */
export interface ConfirmacionState {
  accion: AccionRestriccion;
  restriccionObjetivo: RestriccionAcademica | null;
  abierto: boolean;
}

/**
 * Genera un nuevo estado de confirmación (para abrir el diálogo)
 */
export function abrirConfirmacion(
  accion: AccionRestriccion,
  restriccion?: RestriccionAcademica
): ConfirmacionState {
  return {
    accion,
    restriccionObjetivo: restriccion || null,
    abierto: true,
  };
}

/**
 * Muestra un mensaje de confirmación y ejecuta la acción si el usuario acepta.
 */
export function confirmarAccionRestriccion({
  accion,
  restriccion,
  ejecutar,
  limpiarEstados,
}: ConfirmarAccionParams) {
  if (!accion) return;

  // Generar mensaje según la acción
  const mensaje = (() => {
    switch (accion) {
      case "crear":
        return "¿Deseas crear esta restricción?";
      case "editar":
        return "¿Deseas guardar los cambios en esta restricción?";
      case "eliminar":
        return `¿Deseas eliminar la restricción "${restriccion?.descripcion ?? "seleccionada"}"?`;
      default:
        return "";
    }
  })();

  // Mostrar confirmación al usuario
  const confirmado = window.confirm(mensaje);

  if (confirmado) {
    ejecutar();
  }

  limpiarEstados();
}
