import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { FormularioRestriccion } from "./formulariorestricciones";
import type { Formulario } from "./formulariorestricciones";

interface FormularioRestriccionDialogProps {
  abierto: boolean;
  setAbierto: (open: boolean) => void;
  formulario: Formulario;
  setFormulario: React.Dispatch<React.SetStateAction<Formulario>>;
  handleSubmit: () => void;
  editando: boolean;
}

export function FormularioRestriccionDialog({
  abierto,
  setAbierto,
  formulario,
  setFormulario,
  handleSubmit,
  editando,
}: FormularioRestriccionDialogProps) {
  const cerrarDialog = () => setAbierto(false);

  const onSubmit = () => {
    handleSubmit();
    cerrarDialog();
  };

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogContent className="sm:max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>
            {editando ? "Editar Restricción" : "Crear Nueva Restricción"}
          </DialogTitle>
        </DialogHeader>

        <FormularioRestriccion
          formulario={formulario}
          setFormulario={setFormulario}
          handleSubmit={onSubmit}
          modalCerrar={cerrarDialog}
          editando={editando}
        />
      </DialogContent>
    </Dialog>
  );
}
