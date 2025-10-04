import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import type { Docente } from "../types";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  aEliminar: Docente | null;
  onCancelar: () => void;
  onConfirmar: () => void;
};

export default function DialogoConfirmEliminar({ open, setOpen, aEliminar, onCancelar, onConfirmar }: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle>Eliminar docente</DialogTitle>
          <DialogDescription>
            {aEliminar ? (
              <>¿Seguro que deseas eliminar a <span className="font-medium">{aEliminar.nombre}</span>? Esta acción no se puede deshacer.</>
            ) : (
              "¿Seguro que deseas eliminar este docente? Esta acción no se puede deshacer."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancelar}>Cancelar</Button>
          <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={onConfirmar}>
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
