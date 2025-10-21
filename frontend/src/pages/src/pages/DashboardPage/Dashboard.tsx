import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  Users,
  Building,
  BookOpen,
  Settings,
  TrendingUp,
  MapPin,
} from "lucide-react";

import { getDashboardStats } from "../../domain/usecases/getDashboardStats";

export function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getDashboardStats();
      setStats(data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Cargando información del sistema...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold">Dashboard</h2>
        <p className="text-muted-foreground">
          Resumen general del sistema
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Profesores */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profesores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.profesoresActivosCount}/{stats.profesoresCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Activos de {stats.profesoresCount} totales
            </p>
            <Progress
              value={(stats.profesoresActivosCount / stats.profesoresCount) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        {/* Salas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Salas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.salasDisponiblesCount}/{stats.totalSalas}
            </div>
            <p className="text-xs text-muted-foreground">
              Disponibles de {stats.totalSalas} totales
            </p>
            <Progress
              value={(stats.salasDisponiblesCount / stats.totalSalas) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        {/* Asignaturas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Asignaturas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.asignaturasProgramadasCount}/{stats.totalAsignaturas}
            </div>
            <p className="text-xs text-muted-foreground">
              Programadas de {stats.totalAsignaturas} totales
            </p>
            <Progress
              value={(stats.asignaturasProgramadasCount / stats.totalAsignaturas) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        {/* Restricciones */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Restricciones</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.restriccionesActivasCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Restricciones activas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fila principal: Asignaturas por carrera + Restricciones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asignaturas por carrera */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Asignaturas por Carrera
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.asignaturasPorCarrera).map(
                ([carrera, cantidad]: [string, number]) => (
                  <div key={carrera} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{carrera}</span>
                      <span className="text-sm text-muted-foreground">
                        {cantidad} asignaturas
                      </span>
                    </div>
                    <Progress
                      value={(cantidad / stats.totalAsignaturas) * 100}
                      className="h-2"
                    />
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Últimas Restricciones Agregadas */}
        <Card className="lg:col-span-1 lg:row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Últimas Restricciones Agregadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {stats.ultimasRestricciones.map((r: any) => (
                <div
                  key={r.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted transition"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1 ${
                      r.prioridad === "alta"
                        ? "bg-red-500"
                        : r.prioridad === "media"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{r.tipo}</p>
                    <p className="text-xs text-muted-foreground">{r.descripcion}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segunda fila: Utilización de edificios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Utilización de Edificios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.utilizacionSalas.map((edificio: any) => (
                <div key={edificio.codigo} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{edificio.edificio}</span>
                      <Badge variant="outline" className="text-xs">
                        {edificio.codigo}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {edificio.salasEnUso}/{edificio.totalSalas} salas
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={edificio.porcentajeUso} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {Math.round(edificio.porcentajeUso)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


