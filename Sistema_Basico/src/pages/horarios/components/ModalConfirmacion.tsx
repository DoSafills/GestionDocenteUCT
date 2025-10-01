import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Trash2, XCircle, Calendar } from "lucide-react";
import type { ModalConfirmacionProps } from "./type";

export function ModalConfirmacion({
  abierto,
  onConfirmar,
  onCancelar,
  titulo = "Confirmar acción",
  mensaje = "¿Estás seguro de que deseas realizar esta acción?",
  tipo = "eliminar"
}: ModalConfirmacionProps) {
  
  const configuracion = {
    eliminar: {
      icono: Trash2,
      color: "text-red-600",
      bgColor: "bg-red-100",
      buttonVariant: "destructive" as const,
      confirmText: "Eliminar",
      titulo: "Eliminar Horario"
    },
    cancelar: {
      icono: XCircle,
      color: "text-yellow-600", 
      bgColor: "bg-yellow-100",
      buttonVariant: "default" as const,
      confirmText: "Cancelar",
      titulo: "Cancelar Horario"
    },
    reprogramar: {
      icono: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100", 
      buttonVariant: "default" as const,
      confirmText: "Reprogramar",
      titulo: "Reprogramar Horario"
    }
  };

  const config = configuracion[tipo];
  const IconoComponente = config.icono;

  const handleConfirmar = () => {
    onConfirmar();
  };

  return (
    <Dialog open={abierto} onOpenChange={onCancelar}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-10 h-10 ${config.bgColor} rounded-full`}>
              <IconoComponente className={`w-5 h-5 ${config.color}`} />
            </div>
            <div className="flex-1">
              <DialogTitle>{titulo || config.titulo}</DialogTitle>
            </div>
          </div>
        </DialogHeader>
        <DialogDescription className="text-sm text-gray-600 mt-2">
          {mensaje}
        </DialogDescription>
        <DialogFooter className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onCancelar}
          >
            Cancelar
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirmar}
            className={tipo === "cancelar" ? "bg-yellow-600 hover:bg-yellow-700 text-white" : ""}
          >
            {config.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}