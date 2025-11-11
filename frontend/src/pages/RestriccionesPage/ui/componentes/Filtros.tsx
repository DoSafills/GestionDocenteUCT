import { Input } from "../../../../components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../../components/ui/select";
import { Search } from "lucide-react";

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar restricciones..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={filtroTipo} onValueChange={setFiltroTipo}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los tipos</SelectItem>
          <SelectItem value="prerrequisito">Prerrequisito</SelectItem>
          <SelectItem value="sala_prohibida">Sala Prohibida</SelectItem>
          <SelectItem value="horario_conflicto">Conflicto de Horario</SelectItem>
          <SelectItem value="profesor_especialidad">Especialidad de Profesor</SelectItem>
          <SelectItem value="secuencia_temporal">Secuencia Temporal</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filtroPrioridad} onValueChange={setFiltroPrioridad}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por prioridad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas las prioridades</SelectItem>
          <SelectItem value="alta">Alta</SelectItem>
          <SelectItem value="media">Media</SelectItem>
          <SelectItem value="baja">Baja</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filtroActiva} onValueChange={setFiltroActiva}>
        <SelectTrigger>
          <SelectValue placeholder="Filtrar por estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos los estados</SelectItem>
          <SelectItem value="activa">Activas</SelectItem>
          <SelectItem value="inactiva">Inactivas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
