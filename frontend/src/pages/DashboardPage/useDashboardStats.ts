import { useEffect, useState } from "react";
import { getDocentesRepo } from "@/infraestructure/repositories/docente";
import { EdificioMockRepository } from "@/infraestructure/repositories/edificio/EdificioMockRepository";
import { SalaMockRepository } from "@/infraestructure/repositories/sala/SalaMockRepository";
import { asignaturaService } from "@/infraestructure/services/AsignaturaService";
import { db as restriccionesDB } from "@/data/restricciones";

export type DashboardStats = {
  docentesActivos: number;
  edificiosTotal: number;
  salasDisponibles: number;
  asignaturasTotal: number;
  restriccionesActivas: number;
};

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const docentesRepo = getDocentesRepo();
        const edificioRepo = new EdificioMockRepository();
        const salaRepo = new SalaMockRepository();

        const [docentes, asignaturas, salas, edificios, restricciones] = await Promise.all([
          docentesRepo.getAll(),
          asignaturaService.getAll(),
          salaRepo.getAll(),
          edificioRepo.getAll(),      // simple y robusto
          restriccionesDB.getAll()
        ]);

        const docentesActivos = docentes.filter((d: any) => d.activo).length;
        const asignaturasTotal = asignaturas.length;
        const salasDisponibles = salas.filter((s: any) => s.disponible).length;
        const edificiosTotal = edificios.length;
        const restriccionesActivas = restricciones.filter((r: any) => r.activa).length;

        if (mounted) setStats({ docentesActivos, edificiosTotal, salasDisponibles, asignaturasTotal, restriccionesActivas });
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Error al cargar estadísticas");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  return { stats, loading, error };
}
