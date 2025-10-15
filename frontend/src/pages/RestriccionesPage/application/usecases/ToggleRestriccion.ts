import type { RestriccionAcademica } from "../../Domain/entities/restriccionespage/RestriccionAcademica";

export function toggleActivarRestriccion(
  restricciones: RestriccionAcademica[],
  id: string
): RestriccionAcademica[] {
  return restricciones.map(r => r.id === id ? { ...r, activa: !r.activa } : r);
}
