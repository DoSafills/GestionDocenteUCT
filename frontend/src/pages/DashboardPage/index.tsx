// src/pages/DashboardPage/index.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Building, BookOpen, Settings } from 'lucide-react';
import { useDashboardStats } from './useDashboardStats';

export default function DashboardPage() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return <div className="p-6">Cargando dashboard…</div>;
  }
  if (error || !stats) {
    return <div className="p-6 text-red-600">Error: {error ?? 'No hay datos'}</div>;
  }

  const ultimas = stats.ultimasRestricciones ?? [];
  const edificios = stats.edificiosConSalas ?? [];

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Docentes activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.docentesActivos}</div>
            <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Edificios</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.edificiosTotal}</div>
            <p className="text-xs text-muted-foreground">Total en todos los campus</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salas disponibles</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.salasDisponibles}</div>
            <Progress
              value={Math.round(
                (stats.salasDisponibles / Math.max(1, stats.salasTotal)) * 100
              )}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground">
              Disponibles de {stats.salasTotal} salas totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Asignaturas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.asignaturasTotal}</div>
            <p className="text-xs text-muted-foreground">Cargadas en mock/service</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Últimas restricciones agregadas */}
        <Card>
          <CardHeader>
            <CardTitle>Últimas restricciones agregadas</CardTitle>
          </CardHeader>
          <CardContent>
            {ultimas.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin registros recientes.</p>
            ) : (
              <ul className="space-y-2">
                {ultimas.map((r) => (
                  <li key={r.id} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{r.tipo ?? 'General'}</p>
                      {r.descripcion && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {r.descripcion}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {r.fecha ?? '—'}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Edificios con sus cantidades de salas */}
        <Card>
          <CardHeader>
            <CardTitle>Edificios y cantidad de salas</CardTitle>
          </CardHeader>
          <CardContent>
            {edificios.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay salas registradas.</p>
            ) : (
              <div className="space-y-2">
                {edificios.slice(0, 8).map((e) => (
                  <div key={String(e.id)} className="flex items-center justify-between text-sm">
                    <div className="truncate">
                      <span className="font-medium">
                        {e.nombre ?? e.codigo ?? `Edificio ${e.id}`}
                      </span>
                    </div>
                    <span className="text-muted-foreground">{e.totalSalas} salas</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
