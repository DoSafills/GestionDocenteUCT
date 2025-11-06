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

// -------------------- components/ModalSala.tsx --------------------
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { EdificioDTO } from "@/domain/edificios/types";
import type { FormularioSala, SalaTipo } from "../hooks/useEdificios";

interface ModalSalaProps {
  abierto: boolean;
  onCambiarEstado: (abierto: boolean) => void;
  formulario: FormularioSala;
  onCambiarFormulario: (formulario: FormularioSala) => void;
  edificios: EdificioDTO[];
  edificioSeleccionado: number | "";
  onCambiarEdificio: (id: number) => void;
  esEdicion: boolean;
  onSubmit: () => void;
}

export const ModalSala = ({
  abierto,
  onCambiarEstado,
  formulario,
  onCambiarFormulario,
  edificios,
  edificioSeleccionado,
  onCambiarEdificio,
  esEdicion,
  onSubmit,
}: ModalSalaProps) => {
  return (
    <Dialog open={abierto} onOpenChange={onCambiarEstado}>
      <DialogContent className="!bg-white !text-black">
        <DialogHeader>
          <DialogTitle>
            {esEdicion ? "Editar Sala" : "Agregar Nueva Sala"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edificio">Edificio *</Label>
            <Select
              value={edificioSeleccionado !== "" ? String(edificioSeleccionado) : ""}
              onValueChange={(value) => onCambiarEdificio(Number(value))}
              disabled={esEdicion}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un edificio" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900">
                {edificios.map(edificio => (
                  <SelectItem key={edificio.id} value={String(edificio.id)}>
                    {edificio.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código de Sala *</Label>
              <Input
                id="codigo"
                value={formulario.codigo}
                onChange={(e) => onCambiarFormulario({ ...formulario, codigo: e.target.value })}
                placeholder="CS-101"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacidad">Capacidad *</Label>
              <Input
                id="capacidad"
                type="number"
                value={formulario.capacidad}
                onChange={(e) => onCambiarFormulario({ ...formulario, capacidad: e.target.value })}
                placeholder="40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Sala</Label>
            <Select
              value={formulario.tipo}
              onValueChange={(value: SalaTipo) => onCambiarFormulario({ ...formulario, tipo: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-900">
                <SelectItem value="aula">Aula</SelectItem>
                <SelectItem value="laboratorio">Laboratorio</SelectItem>
                <SelectItem value="auditorio">Auditorio</SelectItem>
                <SelectItem value="taller">Taller</SelectItem>
                <SelectItem value="sala_conferencias">Sala de Conferencias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="equipamiento">Equipamiento (separado por comas)</Label>
            <Textarea
              id="equipamiento"
              value={formulario.equipamiento}
              onChange={(e) => onCambiarFormulario({ ...formulario, equipamiento: e.target.value })}
              placeholder="Proyector, Pizarra, Sistema de audio"
              rows={2}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="disponible"
              checked={formulario.disponible}
              onChange={(e) => onCambiarFormulario({ ...formulario, disponible: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="disponible">Disponible para uso</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onCambiarEstado(false)}>
              Cancelar
            </Button>
            <Button onClick={onSubmit}>
              {esEdicion ? "Actualizar" : "Agregar"} Sala
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
