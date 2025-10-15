import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import type { RestriccionAcademica } from "../../Domain/entities/restriccionespage/RestriccionAcademica";
import { confirmarAccionRestriccion, type AccionRestriccion } from "../../application/usecases/ConfirmarAccionRestriccion";

interface ConfirmacionDialogProps {
  dialogConfirmacionAbierto: boolean;
  setDialogConfirmacionAbierto: (open: boolean) => void;
  accionAConfirmar: AccionRestriccion | null;
  restriccionObjetivo: RestriccionAcademica | null;
  ejecutarAccion: () => void;
  setAccionAConfirmar: (accion: AccionRestriccion | null) => void;
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

  // Si no hay acción a confirmar, no mostrar el diálogo
  if (!accionAConfirmar) return null;

  const limpiarEstados = () => {
    setDialogConfirmacionAbierto(false);
    setAccionAConfirmar(null);
    setRestriccionObjetivo(null);
  };

  const resultado = confirmarAccionRestriccion({
    accion: accionAConfirmar,
    restriccion: restriccionObjetivo,
    ejecutar: ejecutarAccion,
    limpiarEstados,
  });

  // Si por algún motivo no hay resultado, cerrar el diálogo
  if (!resultado) return null;

  const { mensaje, confirmar } = resultado;

  return (
    <Dialog open={dialogConfirmacionAbierto} onOpenChange={setDialogConfirmacionAbierto}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirmación</DialogTitle>
        </DialogHeader>
        <p className="my-4">{mensaje}</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={limpiarEstados}>
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
