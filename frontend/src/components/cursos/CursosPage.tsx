import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Search, Filter, BookOpen, Users, Award } from "lucide-react";
import { toast } from "sonner";
import { CursoCard } from "../CursoCard";
import { FormularioInscripcion } from "../FormularioInscripcion";
import { cursosDisponibles, cursosCompletadosEjemplo } from "../../data/cursos";
import type { Curso, Inscripcion } from "../../types";
import { validarInscripcion } from "../../utils/validaciones";

export function CursosPage() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroNivel, setFiltroNivel] = useState<string>("");
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState<string>("");
  const [cursoSeleccionado, setCursoSeleccionado] = useState<Curso | null>(null);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);

  // Datos simulados del usuario
  const usuarioSimulado = {
    nombre: 'Usuario',
    apellido: 'Demo',
    email: 'usuario@demo.com',
    telefono: '+1234567890',
    edad: 25,
    cursosCompletados: cursosCompletadosEjemplo,
    nivel: 'Intermedio' as const
  };

  const cursosFiltrados = cursosDisponibles.filter(curso => {
    const coincideBusqueda = curso.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            curso.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
                            curso.instructor.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideNivel = !filtroNivel || filtroNivel === "todos" || curso.nivel === filtroNivel;
    
    const coincideDisponibilidad = !filtroDisponibilidad || filtroDisponibilidad === "todos" ||
      (filtroDisponibilidad === "disponible" && curso.cuposDisponibles > 0) ||
      (filtroDisponibilidad === "completo" && curso.cuposDisponibles === 0);

    return coincideBusqueda && coincideNivel && coincideDisponibilidad;
  });

  const evaluarCurso = (curso: Curso) => {
    const inscripcionSimulada: Inscripcion = {
      cursoId: curso.id,
      estudiante: usuarioSimulado,
      fecha: new Date().toISOString()
    };

    const validacion = validarInscripcion(curso, inscripcionSimulada);
    return {
      puedeInscribirse: validacion.esValida && curso.cuposDisponibles > 0,
      restriccionesCumplidas: validacion.errores.length === 0
    };
  };

  const handleInscribirse = (curso: Curso) => {
    setCursoSeleccionado(curso);
  };

  const handleInscripcion = (inscripcion: Inscripcion) => {
    setInscripciones(prev => [...prev, inscripcion]);
    toast.success("¡Inscripción realizada exitosamente!", {
      description: `Te has inscrito en ${cursoSeleccionado?.nombre}`
    });
  };

  const cursosDisponiblesCount = cursosDisponibles.filter(c => c.cuposDisponibles > 0).length;
  const cursosInscritosCount = inscripciones.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl">Cursos de Extensión</h2>
        <p className="text-muted-foreground">
          Descubre cursos diseñados para tu nivel y objetivos profesionales
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{cursosDisponibles.length}</p>
                <p className="text-sm text-muted-foreground">Cursos totales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{cursosDisponiblesCount}</p>
                <p className="text-sm text-muted-foreground">Con cupos disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{cursosInscritosCount}</p>
                <p className="text-sm text-muted-foreground">Tus inscripciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Perfil simulado del usuario */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Tu perfil académico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p><strong>Nivel actual:</strong> {usuarioSimulado.nivel}</p>
              <p><strong>Edad:</strong> {usuarioSimulado.edad} años</p>
            </div>
            <div className="md:col-span-2">
              <p className="mb-2"><strong>Cursos completados:</strong></p>
              <div className="flex flex-wrap gap-2">
                {usuarioSimulado.cursosCompletados.map((curso, index) => (
                  <Badge key={index} variant="secondary">{curso}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar cursos, instructores..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filtroNivel} onValueChange={setFiltroNivel}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por nivel" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900">
                <SelectItem value="todos">Todos los niveles</SelectItem>
                <SelectItem value="Principiante">Principiante</SelectItem>
                <SelectItem value="Intermedio">Intermedio</SelectItem>
                <SelectItem value="Avanzado">Avanzado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroDisponibilidad} onValueChange={setFiltroDisponibilidad}>
              <SelectTrigger>
                <SelectValue placeholder="Disponibilidad" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900">
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="disponible">Con cupos</SelectItem>
                <SelectItem value="completo">Completos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(busqueda || (filtroNivel && filtroNivel !== "todos") || (filtroDisponibilidad && filtroDisponibilidad !== "todos")) && (
            <div className="flex items-center gap-2 mt-4">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Mostrando {cursosFiltrados.length} de {cursosDisponibles.length} cursos
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setBusqueda("");
                  setFiltroNivel("todos");
                  setFiltroDisponibilidad("todos");
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de cursos */}
      {cursosFiltrados.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg mb-2">No se encontraron cursos</h3>
            <p className="text-muted-foreground">
              {busqueda || (filtroNivel && filtroNivel !== "todos") || (filtroDisponibilidad && filtroDisponibilidad !== "todos")
                ? "Intenta ajustar los filtros de búsqueda"
                : "No hay cursos disponibles en este momento"
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursosFiltrados.map((curso) => {
            const { puedeInscribirse, restriccionesCumplidas } = evaluarCurso(curso);
            
            return (
              <CursoCard
                key={curso.id}
                curso={curso}
                onInscribirse={handleInscribirse}
                puedeInscribirse={puedeInscribirse}
                restriccionesCumplidas={restriccionesCumplidas}
              />
            );
          })}
        </div>
      )}

      {/* Modal de inscripción */}
      <FormularioInscripcion
        curso={cursoSeleccionado}
        abierto={!!cursoSeleccionado}
        onCerrar={() => setCursoSeleccionado(null)}
        onInscripcion={handleInscripcion}
      />
    </div>
  );
}
