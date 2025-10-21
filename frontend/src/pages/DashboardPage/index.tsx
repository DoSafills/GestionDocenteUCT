
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Building, BookOpen, Settings, TrendingUp, MapPin } from 'lucide-react';
import { useDashboardStats } from './useDashboardStats';

export default function DashboardPage() {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return <div className="p-6">Cargando dashboard…</div>;
  }
  if (error || !stats) {
    return <div className="p-6 text-red-600">Error: {error ?? "No hay datos"}</div>;
  }

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
            <Progress value={Math.min(100, (stats.salasDisponibles / Math.max(1, stats.salasDisponibles)) * 100)} className="mt-2" />
            <p className="text-xs text-muted-foreground">Disponibilidad actual</p>
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
        <Card>
          <CardHeader>
            <CardTitle>Restricciones activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{stats.restriccionesActivas}</Badge>
              <span className="text-muted-foreground text-sm">Reglas vigentes</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendencias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Estructura modular conectada a repos/mock/services</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Edificios de todos los campus consolidados</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
