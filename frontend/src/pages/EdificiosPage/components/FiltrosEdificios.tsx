import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import type { EdificioDTO } from "@/domain/edificios/types";

interface FiltrosEdificiosProps {
  busqueda: string;
  onCambioBusqueda: (valor: string) => void;
  edificioSeleccionado: string;
  onCambioEdificio: (valor: string) => void;
  filtroTipo: string;
  onCambioTipo: (valor: string) => void;
  edificios: EdificioDTO[];
}

export const FiltrosEdificios = ({
  busqueda,
  onCambioBusqueda,
  edificioSeleccionado,
  onCambioEdificio,
  filtroTipo,
  onCambioTipo,
  edificios,
}: FiltrosEdificiosProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por sala, edificio, campus o código..."
              value={busqueda}
              onChange={(e) => onCambioBusqueda(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={edificioSeleccionado} onValueChange={onCambioEdificio}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por edificio" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-900">
              <SelectItem value="todos">Todos los edificios</SelectItem>
              {edificios.map(edificio => (
                <SelectItem key={edificio.id} value={String(edificio.id)}>
                  {edificio.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filtroTipo} onValueChange={onCambioTipo}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por tipo de sala" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-900">
              <SelectItem value="todos">Todos los tipos</SelectItem>
              <SelectItem value="aula">Aula</SelectItem>
              <SelectItem value="laboratorio">Laboratorio</SelectItem>
              <SelectItem value="auditorio">Auditorio</SelectItem>
              <SelectItem value="taller">Taller</SelectItem>
              <SelectItem value="sala_conferencias">Sala de Conferencias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
