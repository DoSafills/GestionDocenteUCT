import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "../../../components/ui/dialog";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Switch } from "../../../components/ui/switch";
import { CalendarDays, Mail, Pencil, PlusCircle, Trash2 } from "lucide-react";
import SelectorHora from "../components/SelectorHora";
import type { DiaSemana } from "../../../types";
import type { Docente } from "../types";

type Slot = { id: number; desde: string; hasta: string };
type DiaConfig = { enabled: boolean; slots: Slot[]; editing: boolean };
type SemanaDisponibilidad = Record<DiaSemana, DiaConfig>;

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  editando: Docente | null;
  form: Omit<Docente, "id">;
  setForm: (f: Omit<Docente, "id">) => void;
  semana: SemanaDisponibilidad;
  DIA_LABEL: Record<DiaSemana, string>;
  ORD_DIAS: DiaSemana[];
  toggleDia: (d: DiaSemana, en: boolean) => void;
  toggleEditing: (d: DiaSemana, ed: boolean) => void;
  addSlot: (d: DiaSemana) => void;
  removeSlot: (d: DiaSemana, id: number) => void;
  changeSlot: (d: DiaSemana, id: number, campo: "desde" | "hasta", valor: string) => void;
  onGuardar: () => void;
  onCancelar: () => void;
};

export default function DialogoDocente({
  open, setOpen, editando, form, setForm, semana,
  DIA_LABEL, ORD_DIAS,
  toggleDia, toggleEditing, addSlot, removeSlot, changeSlot,
  onGuardar, onCancelar,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[860px] max-h-[80vh] overflow-y-auto bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle>{editando ? "Editar docente" : "Nuevo docente"}</DialogTitle>
          <DialogDescription>
            Completa los datos del docente y configura su disponibilidad semanal.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label>Nombre</Label>
            <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          </div>

          <div className="space-y-2">
            <Label>Correo</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                value={(form.email || "").trim()}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select
              value={String(form.esta_activo)}
              onValueChange={(v: any) => setForm({ ...form, esta_activo: v === "true" })}
            >
              <SelectTrigger className="rounded-xl bg-white text-gray-900 dark:bg-white dark:text-gray-900">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900 shadow-md rounded-md">
                <SelectItem value="true">Activo</SelectItem>
                <SelectItem value="false">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Especialidad</Label>
            <Input value={form.especialidad} onChange={(e) => setForm({ ...form, especialidad: e.target.value })} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Password / Hash</Label>
            <Input
              type="password"
              value={form.password_hash}
              onChange={(e) => setForm({ ...form, password_hash: e.target.value })}
            />
          </div>

          {/* Editor semanal */}
          <div className="md:col-span-2 border rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <p className="font-medium">Disponibilidad semanal</p>
            </div>

            <div className="space-y-4">
              {ORD_DIAS.map((dia) => {
                const cfg = semana[dia];
                return (
                  <div key={dia} className="flex items-center gap-3 rounded-lg border p-3 bg-card/50">
                    <div className="w-36 shrink-0 flex items-center gap-2">
                      <Switch checked={cfg.enabled} onCheckedChange={(v) => toggleDia(dia, v)} />
                      <span className="font-medium">{DIA_LABEL[dia]}</span>
                    </div>

                    <div className="flex-1">
                      {cfg.enabled ? (
                        cfg.slots.length ? (
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            {cfg.slots.map((s) => (
                              <span key={s.id} className="inline-flex items-center rounded-md border px-2 py-1">
                                {s.desde} – {s.hasta}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Sin franjas</span>
                        )
                      ) : (
                        <span className="text-sm text-muted-foreground">Ocupado todo el día</span>
                      )}

                      {cfg.editing && (
                        <div className="mt-3 overflow-visible rounded-lg border">
                          <table className="w-full text-sm table-fixed">
                            <colgroup>
                              <col className="w-35" /> {/* Desde */}
                              <col className="w-35" /> {/* Hasta */}
                              <col className="w-24" /> {/* Acciones */}
                            </colgroup>
                            <thead className="bg-muted/50">
                              <tr className="text-left">
                                <th className="py-2 px-3">Desde</th>
                                <th className="py-2 px-3">Hasta</th>
                                <th className="py-2 px-3 text-center">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cfg.slots.map((s) => (
                                <tr key={s.id} className="border-t">
                                  <td className="py-2 px-3">
                                    <SelectorHora valor={s.desde} onChange={(v) => changeSlot(dia, s.id, "desde", v)} />
                                  </td>
                                  <td className="py-2 px-3">
                                    <SelectorHora valor={s.hasta} onChange={(v) => changeSlot(dia, s.id, "hasta", v)} />
                                  </td>
                                  <td className="py-2 px-3 text-center">
                                    <Button size="sm" variant="ghost" className="p-2" onClick={() => removeSlot(dia, s.id)} title="Eliminar">
                                      <Trash2 className="w-5 h-5 text-red-600" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="border-t">
                              <tr>
                                <td></td>
                                <td></td>
                                <td className="p-2 text-center">
                                  <Button size="sm" onClick={() => addSlot(dia)} className="gap-1 bg-blue-600 hover:bg-blue-700 text-white" title="Agregar franja">
                                    <PlusCircle className="w-4 h-4 text-white" /> 
                                    Franja
                                  </Button>
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0">
                      <Button size="sm" variant="outline" className="gap-1" onClick={() => toggleEditing(dia, !cfg.editing)} disabled={!cfg.enabled} title="Editar">
                        <Pencil className="w-4 h-4" /> {cfg.editing ? "Cerrar" : "Editar"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onCancelar}>Cancelar</Button>
          <Button onClick={onGuardar}>{editando ? "Guardar cambios" : "Crear"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
