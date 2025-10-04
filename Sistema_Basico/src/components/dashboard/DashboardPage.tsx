import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { 
  Users, 
  Building, 
  BookOpen, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  MapPin
} from "lucide-react";

export function DashboardPage() {
  // Estadísticas generales
  const totalProfesores = profesoresMock.length;
  const profesoresActivos = profesoresMock.filter(p => p.estado === 'activo').length;
  const totalSalas = edificiosMock.reduce((acc, edificio) => acc + edificio.salas.length, 0);
  const salasDisponibles = edificiosMock.reduce((acc, edificio) => 
    acc + edificio.salas.filter(s => s.disponible).length, 0);
  const totalAsignaturas = asignaturasMock.length;
  const asignaturasProgramadas = asignaturasMock.filter(a => a.estado === 'programada').length;
  const restriccionesActivas = restriccionesMock.filter(r => r.activa).length;

  // Estadísticas por carrera
  const asignaturasPorCarrera = asignaturasMock.reduce((acc, asig) => {
    acc[asig.carrera] = (acc[asig.carrera] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Conflictos potenciales
  const conflictosPotenciales = [
    {
      tipo: "Profesor Sobrecargado",
      descripcion: "Prof. Carlos Rodriguez tiene 3 asignaturas simultáneas",
      gravedad: "alta" as const
    },
    {
      tipo: "Sala Sin Asignar",
      descripcion: "MAT2205-01 no tiene sala asignada",
      gravedad: "media" as const
    },
    {
      tipo: "Restricción Violada",
      descripcion: "Posible conflicto de prerrequisitos detectado",
      gravedad: "baja" as const
    }
  ];

  // Próximas tareas
  const proximasTareas = [
    "Asignar sala a MAT2205-01",
    "Revisar disponibilidad de Prof. González",
    "Validar prerrequisitos para nuevo semestre",
    "Actualizar equipamiento de laboratorios"
  ];

  // Utilización de salas por edificio
  const utilizacionSalas = edificiosMock.map(edificio => {
    const salasConAsignatura = edificio.salas.filter(sala => 
      asignaturasMock.some(asig => asig.salaId === sala.id)
    ).length;
    const porcentajeUso = edificio.salas.length > 0 ? 
      (salasConAsignatura / edificio.salas.length) * 100 : 0;
    
    return {
      edificio: edificio.nombre,
      codigo: edificio.codigo,
      totalSalas: edificio.salas.length,
      salasEnUso: salasConAsignatura,
      porcentajeUso
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl">Dashboard</h2>
        <p className="text-muted-foreground">
          Resumen general del sistema académico
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Profesores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profesoresActivos}/{totalProfesores}</div>
            <p className="text-xs text-muted-foreground">
              Activos de {totalProfesores} totales
            </p>
            <Progress value={(profesoresActivos / totalProfesores) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Salas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salasDisponibles}/{totalSalas}</div>
            <p className="text-xs text-muted-foreground">
              Disponibles de {totalSalas} totales
            </p>
            <Progress value={(salasDisponibles / totalSalas) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Asignaturas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{asignaturasProgramadas}/{totalAsignaturas}</div>
            <p className="text-xs text-muted-foreground">
              Programadas de {totalAsignaturas} totales
            </p>
            <Progress value={(asignaturasProgramadas / totalAsignaturas) * 100} className="mt-2" />
          </CardContent>
        </Card>

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
            <div className="flex items-center space-x-1 mt-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">Sistema validado</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fila principal de contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribución por carrera */}
        <Card className="lg:col-span-2">
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
                    <span className="text-sm text-muted-foreground">{cantidad} asignaturas</span>
                  </div>
                  <Progress value={(cantidad / totalAsignaturas) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conflictos y alertas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conflictosPotenciales.map((conflicto, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                  <div className="mt-0.5">
                    {conflicto.gravedad === 'alta' && (
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    )}
                    {conflicto.gravedad === 'media' && (
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    )}
                    {conflicto.gravedad === 'baja' && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{conflicto.tipo}</p>
                    <p className="text-xs text-muted-foreground">{conflicto.descripcion}</p>
                  </div>
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

        {/* Próximas tareas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximas Tareas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proximasTareas.map((tarea, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">{tarea}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de estados */}
      <Card>
        <CardHeader>
          <CardTitle>Estado General del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Profesores</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Activos:</span>
                  <span>{profesoresActivos}</span>
                </div>
                <div className="flex justify-between">
                  <span>Con especialidad en Matemáticas:</span>
                  <span>{profesoresMock.filter(p => p.especialidad.includes('Matemáticas')).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Disponibles tiempo completo:</span>
                  <span>{profesoresMock.filter(p => p.disponibilidad.dias.length >= 5).length}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Infraestructura</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Edificios:</span>
                  <span>{edificiosMock.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Laboratorios:</span>
                  <span>{edificiosMock.reduce((acc, e) => acc + e.salas.filter(s => s.tipo === 'laboratorio').length, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Salas con proyector:</span>
                  <span>{edificiosMock.reduce((acc, e) => acc + e.salas.filter(s => s.equipamiento.includes('Proyector')).length, 0)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Académico</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Asignaturas de 1er semestre:</span>
                  <span>{asignaturasMock.filter(a => a.semestre === 1).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Con prerrequisitos:</span>
                  <span>{asignaturasMock.filter(a => a.prerrequisitos.length > 0).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estudiantes inscritos:</span>
                  <span>{asignaturasMock.reduce((acc, a) => acc + a.inscritos, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

