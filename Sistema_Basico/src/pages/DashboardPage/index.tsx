import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import { 
  Users, 
  Building, 
  BookOpen, 
  Settings,
  TrendingUp,
  MapPin
} from "lucide-react";
import { profesoresMock, edificiosMock, asignaturasMock, restriccionesMock } from "../../data/mock-data";

export function DashboardPage() {
  // Estadísticas generales
  const totalProfesores = profesoresMock.length;
  const profesoresActivos = profesoresMock.filter(p => p.estado === "activo").length;
  const totalSalas = edificiosMock.reduce((acc, edificio) => acc + edificio.salas.length, 0);
  const salasDisponibles = edificiosMock.reduce(
    (acc, edificio) => acc + edificio.salas.filter(s => s.disponible).length,
    0
  );
  const totalAsignaturas = asignaturasMock.length;
  const asignaturasProgramadas = asignaturasMock.filter(a => a.estado === "programada").length;
  const restriccionesActivas = restriccionesMock.filter(r => r.activa).length;

  // Estadísticas por carrera
  const asignaturasPorCarrera = asignaturasMock.reduce((acc, asig) => {
    acc[asig.carrera] = (acc[asig.carrera] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Utilización de salas por edificio
  const utilizacionSalas = edificiosMock.map(edificio => {
    const salasConAsignatura = edificio.salas.filter(sala =>
      asignaturasMock.some(asig => asig.salaId === sala.id)
    ).length;
    const porcentajeUso =
      edificio.salas.length > 0
        ? (salasConAsignatura / edificio.salas.length) * 100
        : 0;

    return {
      edificio: edificio.nombre,
      codigo: edificio.codigo,
      totalSalas: edificio.salas.length,
      salasEnUso: salasConAsignatura,
      porcentajeUso,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl">Dashboard</h2>
        <p className="text-muted-foreground">
          Resumen general del sistema
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Profesores */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Profesores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profesoresActivos}/{totalProfesores}
            </div>
            <p className="text-xs text-muted-foreground">
              Activos de {totalProfesores} totales
            </p>
            <Progress
              value={(profesoresActivos / totalProfesores) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        {/* Salas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Salas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {salasDisponibles}/{totalSalas}
            </div>
            <p className="text-xs text-muted-foreground">
              Disponibles de {totalSalas} totales
            </p>
            <Progress
              value={(salasDisponibles / totalSalas) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        {/* Asignaturas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Asignaturas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {asignaturasProgramadas}/{totalAsignaturas}
            </div>
            <p className="text-xs text-muted-foreground">
              Programadas de {totalAsignaturas} totales
            </p>
            <Progress
              value={(asignaturasProgramadas / totalAsignaturas) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>

        {/* Restricciones */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Restricciones</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{restriccionesActivas}</div>
            <p className="text-xs text-muted-foreground">
              Restricciones activas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fila principal — amplia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asignaturas por Carrera */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Asignaturas por Carrera
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(asignaturasPorCarrera).map(([carrera, cantidad]) => (
                <div key={carrera} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{carrera}</span>
                    <span className="text-sm text-muted-foreground">
                      {cantidad} asignaturas
                    </span>
                  </div>
                  <Progress
                    value={(cantidad / totalAsignaturas) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Últimas Restricciones Agregadas — ahora más amplia */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Últimas Restricciones Agregadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {restriccionesMock
                .slice()
                .sort(
                  (a, b) =>
                    new Date(b.fechaCreacion).getTime() -
                    new Date(a.fechaCreacion).getTime()
                )
                .map((r) => (
                  <div
                    key={r.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="mt-0.5">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          r.prioridad === "alta"
                            ? "bg-red-500"
                            : r.prioridad === "media"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                        }`}
                      ></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{r.tipo}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.descripcion}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-xs capitalize"
                    >
                      {r.prioridad}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segunda fila */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilización de edificios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Utilización de Edificios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {utilizacionSalas.map((edificio) => (
                <div key={edificio.codigo} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{edificio.edificio}</span>
                      <Badge variant="outline" className="text-xs">{edificio.codigo}</Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {edificio.salasEnUso}/{edificio.totalSalas} salas
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={edificio.porcentajeUso} className="flex-1 h-2" />
                    <span className="text-xs text-muted-foreground w-12">
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
