import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import type { RestriccionAcademica } from "../../../types";

interface ConfirmacionDialogProps {
  dialogConfirmacionAbierto: boolean;
  setDialogConfirmacionAbierto: (open: boolean) => void;
  accionAConfirmar: "crear" | "editar" | "eliminar" | null;
  restriccionObjetivo: RestriccionAcademica | null;
  setAccionAConfirmar: (accion: "crear" | "editar" | "eliminar" | null) => void;
  setRestriccionObjetivo: (r: RestriccionAcademica | null) => void;
  ejecutarAccion: () => void; // Prop agregada
}

export function ConfirmacionDialog({
  dialogConfirmacionAbierto,
  setDialogConfirmacionAbierto,
  accionAConfirmar,
  restriccionObjetivo,
  setAccionAConfirmar,
  setRestriccionObjetivo,
  ejecutarAccion, // Recibimos la función
}: ConfirmacionDialogProps) {

  const confirmarAccion = () => {
    ejecutarAccion(); // Ejecuta la acción real desde RestriccionesPage
    setDialogConfirmacionAbierto(false);
    setAccionAConfirmar(null);
    setRestriccionObjetivo(null);
  };

  const titulo =
    accionAConfirmar === "eliminar"
      ? "Confirmar eliminación"
      : accionAConfirmar === "editar"
      ? "Confirmar edición"
      : "Confirmar creación";

  const icono =
    accionAConfirmar === "eliminar"
      ? <XCircle className="w-5 h-5 text-red-500" />
      : <CheckCircle className="w-5 h-5 text-green-500" />;

  const descripcion =
    accionAConfirmar === "eliminar"
      ? `¿Estás seguro de eliminar la restricción "${restriccionObjetivo?.descripcion}"? Esta acción no se puede deshacer.`
      : accionAConfirmar === "editar"
      ? `¿Deseas guardar los cambios en la restricción "${restriccionObjetivo?.descripcion}"?`
      : `¿Deseas agregar la restricción "${restriccionObjetivo?.descripcion}"?`;

  const textoBoton =
    accionAConfirmar === "eliminar"
      ? "Eliminar"
      : accionAConfirmar === "editar"
      ? "Guardar"
      : "Crear";

  return (
    <Dialog open={dialogConfirmacionAbierto} onOpenChange={setDialogConfirmacionAbierto}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icono}
            {titulo}
          </DialogTitle>
        </DialogHeader>

        <Alert className="mt-4">
          <AlertDescription>{descripcion}</AlertDescription>
        </Alert>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setDialogConfirmacionAbierto(false)}
          >
            Cancelar
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={confirmarAccion}
          >
            {textoBoton}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
