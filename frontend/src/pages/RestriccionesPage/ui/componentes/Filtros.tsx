import { Input } from "../../../../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../components/ui/select";
import { Search, Filter } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/card";

interface FiltrosProps {
  busqueda: string;
  setBusqueda: (val: string) => void;
  filtroTipo: string;
  setFiltroTipo: (val: string) => void;
  filtroPrioridad: string;
  setFiltroPrioridad: (val: string) => void;
  filtroActiva: string;
  setFiltroActiva: (val: string) => void;
}

export function Filtros({
  busqueda,
  setBusqueda,
  filtroTipo,
  setFiltroTipo,
  filtroPrioridad,
  setFiltroPrioridad,
  filtroActiva,
  setFiltroActiva,
}: FiltrosProps) {
  const hayFiltrosActivos = busqueda || filtroTipo !== "todos" || filtroPrioridad !== "todos" || filtroActiva !== "todos";

  const limpiarFiltros = () => {
    setBusqueda("");
    setFiltroTipo("todos");
    setFiltroPrioridad("todos");
    setFiltroActiva("todos");
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header con título y botón de limpiar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Filtros</h3>
            </div>
            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Grid de filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar restricciones..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10 bg-white border-gray-300 focus:border-primary"
              />
            </div>

            {/* Tipo */}
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="bg-white border-gray-300">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
                <SelectItem value="todos">Todos los tipos</SelectItem>
                <SelectItem value="sala_prohibida">Sala Prohibida</SelectItem>
                <SelectItem value="horario_conflicto">Conflicto de Horario</SelectItem>
                <SelectItem value="profesor_especialidad">Especialidad de Profesor</SelectItem>
                <SelectItem value="capacidad">Capacidad</SelectItem>
              </SelectContent>
            </Select>

            {/* Prioridad */}
            <Select value={filtroPrioridad} onValueChange={setFiltroPrioridad}>
              <SelectTrigger className="bg-white border-gray-300">
                <SelectValue placeholder="Filtrar por prioridad" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
                <SelectItem value="todos">Todas las prioridades</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Media</SelectItem>
                <SelectItem value="baja">Baja</SelectItem>
              </SelectContent>
            </Select>

            {/* Estado */}
            <Select value={filtroActiva} onValueChange={setFiltroActiva}>
              <SelectTrigger className="bg-white border-gray-300">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="activa">Activas</SelectItem>
                <SelectItem value="inactiva">Inactivas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
