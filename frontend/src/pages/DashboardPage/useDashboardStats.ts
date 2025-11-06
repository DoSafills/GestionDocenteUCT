// src/pages/DashboardPage/useDashboardStats.ts
import { useEffect, useState } from "react";
import dashService, { type DashboardStats } from "../../infraestructure/services/dashboard.service";

type State =
  | { loading: true; error: null; stats: null }
  | { loading: false; error: string | null; stats: DashboardStats | null };

export default function useDashboardStats() {
  const [state, setState] = useState<State>({ loading: true, error: null, stats: null });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // 1) Intenta API real
        let payload: any = null;
        try {
          const res = await fetch("/api/dashboard", { method: "GET" });
          if (res.ok) {
            const data = await res.json();
            payload = {
              docentes: data?.docentes ?? [],
              salas: data?.salas ?? [],
              edificios: data?.edificios ?? [],
              asignaturas: data?.asignaturas ?? [],
              restricciones: data?.restricciones ?? [],
            };
          }
        } catch {
          /* sigue a mocks */
        }

        // 2) Fallback local: imports dinámicos (si falta un mock, cae a [])
        let docentes: any[] = [];
        let salas: any[] = [];
        let edificios: any[] = [];
        let asignaturas: any[] = [];
        let restricciones: any[] = [];

        if (!payload) {
          try { const m = await import("../../data/salas"); salas = (m as any).salasMock ?? (m as any).default ?? []; } catch {}
          try { const m = await import("../../data/edificios"); edificios = (m as any).edificiosMock ?? (m as any).default ?? []; } catch {}
          try { const m = await import("../../data/docentes"); docentes = (m as any).docentesMock ?? (m as any).default ?? []; } catch {}
          try { const m = await import("../../data/asignaturas"); asignaturas = (m as any).asignaturasMock ?? (m as any).default ?? []; } catch {}
          try {
            const m = await import("../../data/restricciones");
            const db = (m as any).db ?? (m as any).default?.db;
            if (db?.getAll) restricciones = await db.getAll();
            else restricciones = (m as any).restriccionesMock ?? (m as any).default ?? [];
          } catch {}

          payload = { docentes, salas, edificios, asignaturas, restricciones };
        }

        const stats = dashService.computeDashboardStats(payload);
        if (mounted) setState({ loading: false, error: null, stats });
      } catch (e: any) {
        if (mounted) setState({
          loading: false,
          error: e?.message ?? "Error al cargar estadísticas",
          stats: null,
        });
      }
    })();

    return () => { mounted = false; };
  }, []);

  return state;
}
