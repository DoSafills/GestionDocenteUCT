import type { RestriccionAcademica } from "@domain/entities/restriccionespage/RestriccionAcademica";

export interface ResumenStats {
  label: string;
  count: number;
  color: string;
}

export function generarResumenRestricciones(restricciones: RestriccionAcademica[]): ResumenStats[] {
  return [
    { color: "green-500", count: restricciones.filter(r => r.activa).length, label: "Activas" },
    { color: "red-500", count: restricciones.filter(r => r.prioridad === "alta").length, label: "Alta Prioridad" },
    { color: "blue-500", count: restricciones.filter(r => r.tipo === "prerrequisito").length, label: "Prerrequisitos" },
    { color: "gray-500", count: restricciones.length, label: "Total" }
  ];
}
