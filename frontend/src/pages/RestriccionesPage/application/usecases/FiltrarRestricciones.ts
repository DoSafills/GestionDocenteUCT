import type { RestriccionAcademica } from "@domain/entities/restriccionespage/RestriccionAcademica";

export interface FiltroParams {
  busqueda: string;
  tipo: string;
  prioridad: string;
  activa: string;
}

export function filtrarRestricciones(
  restricciones: RestriccionAcademica[],
  filtros: FiltroParams
): RestriccionAcademica[] {
  return restricciones.filter(restriccion => {
    const coincideBusqueda =
      (restriccion.descripcion || "").toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      (restriccion.mensaje || "").toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      (restriccion.tipo || "").toLowerCase().includes(filtros.busqueda.toLowerCase());

    const coincideTipo = filtros.tipo === "todos" || restriccion.tipo === filtros.tipo;
    const coincidePrioridad = filtros.prioridad === "todos" || restriccion.prioridad === filtros.prioridad;
    const coincideActiva =
      filtros.activa === "todos" ||
      (filtros.activa === "activa" && restriccion.activa) ||
      (filtros.activa === "inactiva" && !restriccion.activa);

    return coincideBusqueda && coincideTipo && coincidePrioridad && coincideActiva;
  });
}
