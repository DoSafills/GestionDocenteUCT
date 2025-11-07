import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CampusDTO } from "@/domain/campus/types";
import type { FormularioEdificio } from "../hooks/useEdificios";

interface ModalEdificioProps {
  abierto: boolean;
  onCambiarEstado: (abierto: boolean) => void;
  formulario: FormularioEdificio;
  onCambiarFormulario: (formulario: FormularioEdificio) => void;
  campus: CampusDTO[];
  esEdicion: boolean;
  onSubmit: () => void;
}

export const ModalEdificio = ({
  abierto,
  onCambiarEstado,
  formulario,
  onCambiarFormulario,
  campus,
  esEdicion,
  onSubmit,
}: ModalEdificioProps) => {
  return (
    <Dialog open={abierto} onOpenChange={onCambiarEstado}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span style={{
              color: '#000',
              fontWeight: 'bold',
              fontSize: '1.25rem',
              letterSpacing: '0.5px',
              WebkitTextStroke: '0.1px #000',
              textShadow: '0 0 1px #000',
              background: 'transparent',
              zIndex: 10
            }}>
              {esEdicion ? "Editar Edificio" : "Agregar Nuevo Edificio"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="nombre"
              style={{ color: '#000', fontWeight: 'bold', background: 'transparent', zIndex: 10 }}
            >
              Nombre del Edificio *
            </Label>
            <Input
              id="nombre"
              value={formulario.nombre}
              onChange={(e) => onCambiarFormulario({ ...formulario, nombre: e.target.value })}
              placeholder="Edificio Biblioteca"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pisos" style={{ color: '#000', fontWeight: 'bold', zIndex: 10 }}>
              Pisos (opcional)
            </Label>
            <Input
              id="pisos"
              type="number"
              value={formulario.pisos}
              onChange={(e) => onCambiarFormulario({ ...formulario, pisos: e.target.value })}
              placeholder="5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="campus_id" style={{ color: '#000', fontWeight: 'bold', zIndex: 10 }}>
              Campus *
            </Label>
            <Select
              value={formulario.campus_id ? String(formulario.campus_id) : ""}
              onValueChange={value => onCambiarFormulario({ ...formulario, campus_id: Number(value) })}
            >
              <SelectTrigger
                style={{ color: formulario.campus_id ? '#000' : undefined }}
                className="dark:text-white"
              >
                <SelectValue placeholder="Selecciona un campus" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900">
                {campus.map(c => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.nombre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              className="!bg-gray-200 !text-black !hover:bg-gray-300 dark:!bg-gray-700 dark:!text-white dark:!hover:bg-gray-600"
              onClick={() => onCambiarEstado(false)}
            >
              Cancelar
            </Button>
            <Button
              className="!bg-blue-500 !text-white !hover:bg-blue-600"
              onClick={onSubmit}
            >
              {esEdicion ? "Actualizar" : "Agregar"} Edificio
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
