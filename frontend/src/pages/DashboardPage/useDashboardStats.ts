// src/pages/DashboardPage/useDashboardStats.ts
import { useEffect, useState } from "react";

// Usamos data/* para evitar errores de resolución de módulos en Vercel
import { docentesMock } from "../../data/docentes";
import { salasMock } from "../../data/salas";

// Estos sí existen en tu repo
import { asignaturaService } from "../../infraestructure/services/AsignaturaService";
import { db as restriccionesDB } from "../../data/restricciones";

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

  // vistas nuevas
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
        // 📌 Datos base 100% locales (sin repos)
        const docentes      = docentesMock ?? [];
        const salas         = salasMock ?? [];

        // 📌 Servicios existentes (con fallback si no tienen getAll)
        const [asignaturas, restricciones] = await Promise.all([
          safeGetAll<any>("AsignaturaService", asignaturaService),
          safeGetAll<any>("RestriccionesDB", restriccionesDB),
        ]);

        // Totales / derivados
        const docentesTotal    = docentes.length;
        const docentesActivos  = docentes.filter((d: any) => (d.activo ?? d.esta_activo) === true).length;

        const salasTotal       = salas.length;
        const salasDisponibles = salas.filter((s: any) => (s.disponible ?? s.esta_disponible) === true).length;

        // Conteo de edificios por ID desde salas (edificio_id | edificioId)
        const counts = new Map<string | number, number>();
        for (const s of salas) {
          const id = (s as any).edificio_id ?? (s as any).edificioId ?? null;
          if (id == null) continue;
          counts.set(id, (counts.get(id) ?? 0) + 1);
        }
        const edificiosConSalas: EdificioConSalas[] = Array.from(counts.entries())
          .map(([id, totalSalas]) => ({ id, totalSalas }))
          .sort((a, b) => b.totalSalas - a.totalSalas);

        const edificiosTotal = edificiosConSalas.length;
        const asignaturasTotal = asignaturas.length;
        const restriccionesActivas = restricciones.filter((r: any) => !!r.activa).length;

        // Últimas restricciones agregadas (max 5)
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
            fecha:
              r.fechaCreacion && !Number.isNaN(Date.parse(r.fechaCreacion))
                ? new Date(r.fechaCreacion).toISOString().slice(0, 10)
                : "—",
            descripcion: r.descripcion,
          }));

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
