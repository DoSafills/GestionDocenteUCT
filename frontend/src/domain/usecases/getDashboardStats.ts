import { profesoresRepository } from "../../infrastructure/repositories/profesoresRepository";
import { salasRepository } from "../../infrastructure/repositories/salasRepository";
import { asignaturasRepository } from "../../infrastructure/repositories/asignaturasRepository";
import { restriccionesRepository } from "../../infrastructure/repositories/restriccionesRepository";

import type { Asignatura } from "../../types";

export async function getDashboardStats() {
  const [
    profesores,
    activos,
    edificios,
    salasDisponibles,
    asignaturas,
    programadas,
    restriccionesActivas,
    ultimasRestricciones,
  ] = await Promise.all([
    profesoresRepository.getAll(),
    profesoresRepository.getActiveCount(),
    salasRepository.getEdificios(),
    salasRepository.getDisponiblesCount(),
    asignaturasRepository.getAll(),
    asignaturasRepository.getProgramadasCount(),
    restriccionesRepository.getActivasCount(),
    restriccionesRepository.getUltimas(6),
  ]);

  // Asignaturas por carrera
  const asignaturasPorCarrera = (asignaturas as Asignatura[]).reduce(
    (acc: Record<string, number>, a) => {
      acc[a.carrera] = (acc[a.carrera] || 0) + 1;
      return acc;
    },
    {}
  );

  // Utilización de salas por edificio
  const utilizacionSalas = edificios.map((ed: any) => {
    const salasConAsignatura = ed.salas.filter((s: any) =>
      asignaturas.some((a: any) => a.salaId === s.id)
    ).length;
    const porcentajeUso = ed.salas.length
      ? (salasConAsignatura / ed.salas.length) * 100
      : 0;
    return {
      edificio: ed.nombre,
      codigo: ed.codigo,
      totalSalas: ed.salas.length,
      salasEnUso: salasConAsignatura,
      porcentajeUso,
    };
  });

  return {
    profesoresCount: profesores.length,
    profesoresActivosCount: activos,
    totalSalas: edificios.reduce((acc: number, e: any) => acc + e.salas.length, 0),
    salasDisponiblesCount: salasDisponibles,
    totalAsignaturas: asignaturas.length,
    asignaturasProgramadasCount: programadas,
    restriccionesActivasCount: restriccionesActivas,
    asignaturasPorCarrera,
    utilizacionSalas,
    ultimasRestricciones,
  };
}
