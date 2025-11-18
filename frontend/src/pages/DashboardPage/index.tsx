// src/pages/DashboardPage/index.tsx
import TopStatsBar from "./components/TopStatsBar";
import OccupancySection from "./components/OccupancySection";
import RestrictionsSection from "./components/RestrictionsSection";
import useDashboardStats from "./useDashboardStats";

export default function DashboardPage() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) return <div className="p-6">Cargando dashboard…</div>;
  if (error)   return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!stats)  return <div className="p-6">Sin datos.</div>;

  const tieneEdificios = stats.ocupacionPorEdificio?.length > 0;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Resumen y ocupación por edificio</p>
      </div>

      {/* Barra superior con KPIs */}
      <TopStatsBar
        ocupacionPct={stats.ocupacionGlobalPct}
        totalOcupadas={stats.totalOcupadas}
        totalLibres={stats.totalLibres}
        edificiosTotal={stats.edificiosTotal}
        salasTotal={stats.salasTotal}
      />

      {/* Ocupación */}
      {tieneEdificios && (
        <OccupancySection
          totalPct={stats.ocupacionGlobalPct}
          data={stats.ocupacionPorEdificio}
        />
      )}

      {/* Restricciones */}
      <RestrictionsSection
        ultimasSemana={stats.ultimasRestriccionesSemana}
        topTipos={stats.restriccionesTopTipos}
      />
    </div>
  );
}
