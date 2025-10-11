// ./components/configuraciondialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import type { RestriccionAcademica } from "../../../types";

interface ConfirmacionDialogProps {
  dialogConfirmacionAbierto: boolean;
  setDialogConfirmacionAbierto: (open: boolean) => void;
  accionAConfirmar: "crear" | "editar" | "eliminar" | null;
  restriccionObjetivo: RestriccionAcademica | null;
  ejecutarAccion: () => void;
  setAccionAConfirmar: (accion: "crear" | "editar" | "eliminar" | null) => void;
  setRestriccionObjetivo: (r: RestriccionAcademica | null) => void;
}

export function ConfirmacionDialog({
  dialogConfirmacionAbierto,
  setDialogConfirmacionAbierto,
  accionAConfirmar,
  restriccionObjetivo,
  ejecutarAccion,
  setAccionAConfirmar,
  setRestriccionObjetivo,
}: ConfirmacionDialogProps) {
  if (!accionAConfirmar) return null;

  const mensaje = (() => {
    switch (accionAConfirmar) {
      case "crear":
        return "¿Deseas crear esta restricción?";
      case "editar":
        return "¿Deseas guardar los cambios en esta restricción?";
      case "eliminar":
        return `¿Deseas eliminar la restricción "${restriccionObjetivo?.descripcion}"?`;
      default:
        return "";
    }
  })();

  const cerrarDialog = () => {
    setDialogConfirmacionAbierto(false);
    setAccionAConfirmar(null);
    setRestriccionObjetivo(null);
  };

  const confirmar = () => {
    ejecutarAccion();
    cerrarDialog();
  };

  return (
    <Dialog open={dialogConfirmacionAbierto} onOpenChange={setDialogConfirmacionAbierto}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirmación</DialogTitle>
        </DialogHeader>
        <p className="my-4">{mensaje}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={cerrarDialog}>
            Cancelar
          </Button>
          <Button onClick={confirmar}>
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
