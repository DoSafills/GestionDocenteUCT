import { Input } from "../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Search } from "lucide-react";

type Props = {
  busqueda: string;
  setBusqueda: (v: string) => void;
  filtroEstado: "todos" | "activo" | "inactivo";
  setFiltroEstado: (v: "todos" | "activo" | "inactivo") => void;
};

export default function FiltrosListado({ busqueda, setBusqueda, filtroEstado, setFiltroEstado }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, correo o especialidad"
          className="pl-9"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <div className="w-full sm:w-56">
        <Select value={filtroEstado} onValueChange={(v: any) => setFiltroEstado(v)}>
          <SelectTrigger className="bg-white text-gray-900 dark:bg-white dark:text-gray-900">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="bg-white text-gray-900 shadow-md rounded-md">
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="activo">Activos</SelectItem>
            <SelectItem value="inactivo">Inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
