import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Alert, AlertDescription } from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import type { RestriccionAcademica } from "../../../types";

interface ConfirmacionDialogProps {
  dialogConfirmacionAbierto: boolean;
  setDialogConfirmacionAbierto: (open: boolean) => void;
  accionAConfirmar: "crear" | "eliminar" | null;
  restriccionObjetivo: RestriccionAcademica | null;
  setRestricciones: React.Dispatch<React.SetStateAction<RestriccionAcademica[]>>;
  setAccionAConfirmar: (accion: "crear" | "eliminar" | null) => void;
  setRestriccionObjetivo: (r: RestriccionAcademica | null) => void;
}

export function ConfirmacionDialog({
  dialogConfirmacionAbierto,
  setDialogConfirmacionAbierto,
  accionAConfirmar,
  restriccionObjetivo,
  setRestricciones,
  setAccionAConfirmar,
  setRestriccionObjetivo,
}: ConfirmacionDialogProps) {

  const confirmarAccion = () => {
    if (accionAConfirmar === "eliminar" && restriccionObjetivo) {
      setRestricciones(prev => prev.filter(r => r.id !== restriccionObjetivo.id));
    }
    if (accionAConfirmar === "crear" && restriccionObjetivo) {
      setRestricciones(prev => [...prev, restriccionObjetivo]);
    }
    setDialogConfirmacionAbierto(false);
    setAccionAConfirmar(null);
    setRestriccionObjetivo(null);
  };

  return (
    <Dialog open={dialogConfirmacionAbierto} onOpenChange={setDialogConfirmacionAbierto}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {accionAConfirmar === "eliminar"
              ? <XCircle className="w-5 h-5 text-red-500" />
              : <CheckCircle className="w-5 h-5 text-green-500" />}
            {accionAConfirmar === "eliminar" ? "Confirmar eliminación" : "Confirmar creación"}
          </DialogTitle>
        </DialogHeader>

        <Alert className="mt-4">
          <AlertDescription>
            {accionAConfirmar === "eliminar"
              ? `¿Estás seguro de eliminar la restricción "${restriccionObjetivo?.descripcion}"? Esta acción no se puede deshacer.`
              : `¿Deseas agregar la restricción "${restriccionObjetivo?.descripcion}"?`}
          </AlertDescription>
        </Alert>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDialogConfirmacionAbierto(false)}>Cancelar</Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={confirmarAccion}
          >
            {accionAConfirmar === "eliminar" ? "Eliminar" : "Crear"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
