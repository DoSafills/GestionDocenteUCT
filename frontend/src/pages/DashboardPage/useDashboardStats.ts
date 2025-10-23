// src/pages/DashboardPage/useDashboardStats.ts
import { useEffect, useState } from "react";
import { DocenteMockRepository } from "@/infraestructure/repositories/docente/DocenteMockRepository";
import { SalaMockRepository } from "@/infraestructure/repositories/sala/SalaMockRepository";
import { EdificioMockRepository } from "@/infraestructure/repositories/edificio/EdificioMockRepository";
import { asignaturaService } from "@/infraestructure/services/AsignaturaService";
import { db as restriccionesDB } from "@/data/restricciones";

export type UltimaRestriccion = {
  id: string | number;
  tipo?: string;
  fecha: string;         // YYYY-MM-DD
  descripcion?: string;
};

export type EdificioConSalas = {
  id: string | number;
  nombre?: string;
  codigo?: string;
  totalSalas: number;
};

export type DashboardStats = {
  docentesActivos: number;
  docentesTotal: number;
  edificiosTotal: number;
  salasDisponibles: number;
  salasTotal: number;
  asignaturasTotal: number;
  restriccionesActivas: number;

  // NUEVO
  ultimasRestricciones: UltimaRestriccion[];
  edificiosConSalas: EdificioConSalas[];
};

// helper seguro: usa obj.getAll() si existe; si no, []
async function safeGetAll<T>(label: string, obj: any): Promise<T[]> {
  try {
    const fn = obj?.getAll;
    if (typeof fn === "function") return await fn.call(obj);
    console.warn(`[${label}] getAll() no existe, usando []`);
    return [];
  } catch (e) {
    console.warn(`[${label}] getAll() lanzó error, usando []`, e);
    return [];
  }
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const docentesRepo = new DocenteMockRepository();
        const salaRepo     = new SalaMockRepository();
        const edificioRepo = new EdificioMockRepository(); // puede no tener getAll → safeGetAll

        const [docentes, asignaturas, salas, restricciones, edificiosMeta] = await Promise.all([
          safeGetAll<any>("DocentesRepo", docentesRepo),
          safeGetAll<any>("AsignaturaService", asignaturaService),
          safeGetAll<any>("SalaRepo", salaRepo),
          safeGetAll<any>("RestriccionesDB", restriccionesDB),
          safeGetAll<any>("EdificioRepo", edificioRepo),
        ]);

        // Contadores base
        const docentesTotal      = docentes.length;
        const docentesActivos    = docentes.filter((d) => (d.activo ?? d.esta_activo) === true).length;

        const salasTotal         = salas.length;
        const salasDisponibles   = salas.filter((s) => (s.disponible ?? s.esta_disponible) === true).length;

        const asignaturasTotal   = asignaturas.length;
        const restriccionesActivas = restricciones.filter((r) => !!r.activa).length;

        // === ÚLTIMAS RESTRICCIONES ===
        const ultimasRestricciones: UltimaRestriccion[] = [...restricciones]
          .sort((a, b) => {
            const ta = Date.parse(a?.fechaCreacion ?? "");
            const tb = Date.parse(b?.fechaCreacion ?? "");
            return (Number.isNaN(tb) ? 0 : tb) - (Number.isNaN(ta) ? 0 : ta);
          })
          .slice(0, 5)
          .map((r) => ({
            id: r.id,
            tipo: r.tipo ?? "General",
            fecha: (r.fechaCreacion && !Number.isNaN(Date.parse(r.fechaCreacion)))
              ? new Date(r.fechaCreacion).toISOString().slice(0, 10)
              : "—",
            descripcion: r.descripcion,
          }));

        // === EDIFICIOS CON CANTIDAD DE SALAS ===
        // Conteo por ID desde las salas (edificio_id | edificioId)
        const counts = new Map<string | number, number>();
        for (const s of salas) {
          const id = (s as any).edificio_id ?? (s as any).edificioId ?? null;
          if (id == null) continue;
          counts.set(id, (counts.get(id) ?? 0) + 1);
        }

        // Intentamos enriquecer con nombre/código si existe meta
        const metaById = new Map<string | number, any>();
        for (const e of edificiosMeta) metaById.set(e.id, e);

        const edificiosConSalas: EdificioConSalas[] = Array.from(counts.entries())
          .map(([id, totalSalas]) => {
            const meta = metaById.get(id);
            return {
              id,
              nombre: meta?.nombre,
              codigo: meta?.codigo,
              totalSalas,
            };
          })
          .sort((a, b) => b.totalSalas - a.totalSalas);

        const edificiosTotal = edificiosConSalas.length;

        if (mounted) {
          setStats({
            docentesActivos,
            docentesTotal,
            edificiosTotal,
            salasDisponibles,
            salasTotal,
            asignaturasTotal,
            restriccionesActivas,
            ultimasRestricciones,
            edificiosConSalas,
          });
        }
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
