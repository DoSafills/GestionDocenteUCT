// frontend/src/pages/ProfesoresPage/components/AccionesHeader.tsx
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { RefreshCw, Plus } from "lucide-react";
import { authService } from "@/application/services/AuthService";

type Props = {
  onRecargar: () => void;
  onNuevo: () => void;
  canCreate?: boolean; // opcional, si el padre prefiere decidir
};

export default function AccionesHeader({ onRecargar, onNuevo, canCreate: canCreateProp }: Props) {
  const [canCreate, setCanCreate] = useState<boolean>(!!canCreateProp);

  useEffect(() => {
    if (typeof canCreateProp === "boolean") {
      setCanCreate(canCreateProp);
      return;
    }

    setCanCreate(authService.canCreateProfesores());

    if (!authService.getUsuarioActual()) {
      void authService.cargarUsuarioDesdeApi().then(() => {
        setCanCreate(authService.canCreateProfesores());
      });
    }

    const unsub = authService.onChange(() => {
      setCanCreate(authService.canCreateProfesores());
    });
    return unsub;
  }, [canCreateProp]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-2xl font-bold tracking-tight">Docentes</h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onRecargar} className="gap-2" aria-label="Recargar lista de docentes">
          <RefreshCw className="h-4 w-4" /> Recargar
        </Button>

        {canCreate ? (
          <Button className="gap-2" onClick={onNuevo} aria-label="Crear nuevo docente">
            <Plus className="h-4 w-4" /> Nuevo docente
          </Button>
        ) : null}
      </div>
    </div>
  );
}
