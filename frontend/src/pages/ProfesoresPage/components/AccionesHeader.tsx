import { Button } from "../../../components/ui/button";
import { RefreshCw, Plus } from "lucide-react";

type Props = {
  onRecargar: () => void;
  onNuevo: () => void;
};

export default function AccionesHeader({ onRecargar, onNuevo }: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-2xl font-bold tracking-tight">Docentes</h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onRecargar} className="gap-2" aria-label="Recargar lista de docentes">
          <RefreshCw className="h-4 w-4" /> Recargar
        </Button>
        <Button className="gap-2" onClick={onNuevo} aria-label="Crear nuevo docente">
          <Plus className="h-4 w-4" /> Nuevo docente
        </Button>
      </div>
    </div>
  );
}
