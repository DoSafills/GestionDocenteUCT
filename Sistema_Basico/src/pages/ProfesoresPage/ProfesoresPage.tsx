import { useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import {
  Plus,
  Search,
  Mail,
  Edit,
  Trash2,
  User,
  RefreshCw,
  CalendarDays,
  Pencil,
  Tags,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";

import { profesoresMock, restriccionesMock } from "./data/mock-profesores";
import type { DiaSemana, RestriccionHorarioGuardar } from "../../types";
import type { Docente } from "./types";

import SelectorHora from "./components/SelectorHora";

const DIA_LABEL: Record<DiaSemana, string> = {
  LUNES: "Lunes",
  MARTES: "Martes",
  MIERCOLES: "Miércoles",
  JUEVES: "Jueves",
  VIERNES: "Viernes",
  SABADO: "Sábado",
};

const ORD_DIAS: DiaSemana[] = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];
const diaToNum: Record<DiaSemana, number> = { LUNES: 1, MARTES: 2, MIERCOLES: 3, JUEVES: 4, VIERNES: 5, SABADO: 6 };
const numToDia: Record<number, DiaSemana> = { 1: "LUNES", 2: "MARTES", 3: "MIERCOLES", 4: "JUEVES", 5: "VIERNES", 6: "SABADO" };
const normalizarTexto = (s: string) => (s || "").toLowerCase().normalize("NFKD").replace(/\p{Diacritic}/gu, "");
const nowBase = () => Math.floor(Math.random() * 1e9);
const hhmmToMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

function useDocentesListado() {
  const [items, setItems] = useState<Docente[]>([]);
  const listar = async () => setItems(profesoresMock as unknown as Docente[]);
  return { items, setItems, listar };
}

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

type Slot = { id: number; desde: string; hasta: string };
type DiaConfig = { enabled: boolean; slots: Slot[]; editing: boolean };
type SemanaDisponibilidad = Record<DiaSemana, DiaConfig>;

function defaultSemana(): SemanaDisponibilidad {
  const base = nowBase();
  return {
    LUNES: { enabled: true, slots: [{ id: base + 1, desde: "08:00", hasta: "18:00" }], editing: false },
    MARTES: { enabled: true, slots: [{ id: base + 2, desde: "08:00", hasta: "18:00" }], editing: false },
    MIERCOLES: { enabled: false, slots: [], editing: false },
    JUEVES: { enabled: true, slots: [{ id: base + 3, desde: "08:00", hasta: "18:00" }], editing: false },
    VIERNES: { enabled: true, slots: [{ id: base + 4, desde: "08:00", hasta: "12:30" }], editing: false },
    SABADO: { enabled: false, slots: [], editing: false },
  };
}

function useFormulario() {
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<Docente | null>(null);
  const [form, setForm] = useState<Omit<Docente, "id">>({
    nombre: "",
    email: "",
    password_hash: "",
    esta_activo: true,
    especialidad: "",
  });
  const [semana, setSemana] = useState<SemanaDisponibilidad>(defaultSemana());

  const limpiar = () => {
    setEditando(null);
    setForm({ nombre: "", email: "", password_hash: "", esta_activo: true, especialidad: "" });
    setSemana(defaultSemana());
  };

  return { open, setOpen, editando, setEditando, form, setForm, semana, setSemana, limpiar };
}

function validarSemana(semana: SemanaDisponibilidad): string | null {
  for (const d of ORD_DIAS) {
    const cfg = semana[d];
    if (!cfg?.enabled) continue;
    if (!cfg.slots.length) return `Agrega al menos una franja en ${DIA_LABEL[d]}`;

    for (const s of cfg.slots) {
      if (!/^\d{2}:\d{2}$/.test(s.desde) || !/^\d{2}:\d{2}$/.test(s.hasta)) {
        return `Formato de hora inválido en ${DIA_LABEL[d]}`;
      }
      if (s.desde >= s.hasta) {
        return `En ${DIA_LABEL[d]} la hora de inicio debe ser menor que la de fin`;
      }
    }
    const sorted = [...cfg.slots].sort((a, b) => hhmmToMin(a.desde) - hhmmToMin(b.desde));
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const cur = sorted[i];
      if (hhmmToMin(cur.desde) < hhmmToMin(prev.hasta)) {
        return `Franja solapada en ${DIA_LABEL[d]}: ${prev.desde}–${prev.hasta} con ${cur.desde}–${cur.hasta}`;
      }
    }
  }
  return null;
}

function semanaATransfer(semana: SemanaDisponibilidad, docenteId: number): RestriccionHorarioGuardar[] {
  const out: RestriccionHorarioGuardar[] = [];
  for (const d of ORD_DIAS) {
    const cfg = semana[d];
    if (!cfg?.enabled) continue;
    for (const s of cfg.slots) {
      out.push({
        docente_id: docenteId,
        dia_semana: diaToNum[d],
        hora_inicio: s.desde,
        hora_fin: s.hasta,
        ...( { esta_activo: true, esta_disponible: true } as any ),
      } as unknown as RestriccionHorarioGuardar);
    }
  }
  return out;
}

function restriccionesATabla(restricciones: RestriccionHorarioGuardar[]) {
  const grouped = new Map<DiaSemana, string[]>();
  for (const r of restricciones) {
    if ((r as any).esta_activo === false) continue;
    if ((r as any).esta_disponible === false) continue;

    const dia = typeof r.dia_semana === "number" ? numToDia[r.dia_semana] : (r.dia_semana as DiaSemana);
    if (!dia || !ORD_DIAS.includes(dia)) continue;
    if (!grouped.has(dia)) grouped.set(dia, []);
    grouped.get(dia)!.push(`${r.hora_inicio}–${r.hora_fin}`);
  }
  return ORD_DIAS
    .filter((d) => grouped.has(d))
    .map((d) => ({ dia: DIA_LABEL[d], horario: (grouped.get(d) || []).join(", ") }));
}

function restriccionesASemana(restricciones: RestriccionHorarioGuardar[]): SemanaDisponibilidad {
  const base = defaultSemana();
  const byDia: Record<DiaSemana, Slot[]> = { LUNES: [], MARTES: [], MIERCOLES: [], JUEVES: [], VIERNES: [], SABADO: [] };
  for (const r of restricciones) {
    if ((r as any).esta_activo === false) continue;
    if ((r as any).esta_disponible === false) continue;

    const dia = typeof r.dia_semana === "number" ? numToDia[r.dia_semana] : (r.dia_semana as DiaSemana);
    if (!dia || !ORD_DIAS.includes(dia)) continue;
    byDia[dia].push({ id: nowBase() + Math.floor(Math.random() * 1000), desde: r.hora_inicio, hasta: r.hora_fin });
  }
  for (const d of ORD_DIAS) {
    const slots = byDia[d];
    base[d] = { enabled: slots.length > 0, slots, editing: false };
  }
  return base;
}

export function ProfesoresPage() {
  const { items, setItems, listar } = useDocentesListado();
  const { open, setOpen, editando, setEditando, form, setForm, semana, setSemana, limpiar } = useFormulario();

  const [restriccionesLocal, setRestriccionesLocal] = useState<Record<number, RestriccionHorarioGuardar[]>>({});

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [aEliminar, setAEliminar] = useState<Docente | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const debouncedSearch = useDebouncedValue(busqueda, 250);
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "activo" | "inactivo">("todos");

  useEffect(() => { listar(); }, []);

  const filtrados = useMemo(() => {
    const q = normalizarTexto(debouncedSearch);
    return items.filter((d) => {
      if (filtroEstado === "activo" && !d.esta_activo) return false;
      if (filtroEstado === "inactivo" && d.esta_activo) return false;
      if (!q) return true;
      return normalizarTexto(`${d.nombre} ${d.email} ${d.especialidad}`).includes(q);
    });
  }, [items, debouncedSearch, filtroEstado]);

  const obtenerRestriccionesDocente = (docenteId: number): RestriccionHorarioGuardar[] => {
    if (restriccionesLocal[docenteId]?.length) return restriccionesLocal[docenteId];
    return restriccionesMock.filter((r) => r.docente_id === docenteId);
  };

  const abrirCrear = () => { limpiar(); setOpen(true); };
  const abrirEditar = (d: Docente) => {
    limpiar();
    setEditando(d);
    setForm({
      nombre: d.nombre,
      email: d.email,
      password_hash: d.password_hash,
      esta_activo: d.esta_activo,
      especialidad: d.especialidad,
    });
    const actuales = obtenerRestriccionesDocente(d.id);
    setSemana(restriccionesASemana(actuales));
    setOpen(true);
  };

  const guardar = () => {
    if (!form.nombre.trim()) return toast.error("El nombre es obligatorio");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((form.email || "").trim())) return toast.error("Correo inválido");
    const err = validarSemana(semana);
    if (err) return toast.error(err);

    let docenteId = editando?.id;
    if (editando) {
      setItems((prev) => prev.map((x) => (x.id === editando.id ? { ...x, ...form } : x)));
      docenteId = editando.id;
    } else {
      docenteId = (items.length ? Math.max(...items.map((i) => i.id)) : 0) + 1;
      setItems((prev) => [{ id: docenteId!, ...form }, ...prev]);
    }

    const payload = semanaATransfer(semana, docenteId!);
    setRestriccionesLocal((prev) => ({ ...prev, [docenteId!]: payload }));

    toast.success(editando ? "Docente actualizado" : "Docente creado");
    setOpen(false);
    limpiar();
  };

  const eliminarDocente = (d: Docente) => {
    setAEliminar(d);
    setConfirmOpen(true);
  };

  const confirmarEliminar = () => {
    if (!aEliminar) return;
    setItems((prev) => prev.filter((x) => x.id !== aEliminar.id));
    setRestriccionesLocal((prev) => {
      const cp = { ...prev };
      delete cp[aEliminar.id];
      return cp;
    });
    toast.success("Docente eliminado");
    setConfirmOpen(false);
    setAEliminar(null);
  };

  const toggleDia = (dia: DiaSemana, enabled: boolean) =>
    setSemana((prev) => ({ ...prev, [dia]: { ...prev[dia], enabled } }));
  const toggleEditing = (dia: DiaSemana, editing: boolean) =>
    setSemana((prev) => ({ ...prev, [dia]: { ...prev[dia], editing } }));
  const addSlot = (dia: DiaSemana) =>
    setSemana((prev) => {
      const list = prev[dia].slots.slice();
      list.push({ id: nowBase(), desde: "08:00", hasta: "12:00" });
      return { ...prev, [dia]: { ...prev[dia], slots: list } };
    });
  const removeSlot = (dia: DiaSemana, id: number) =>
    setSemana((prev) => {
      const list = prev[dia].slots.filter((s) => s.id !== id);
      return { ...prev, [dia]: { ...prev[dia], slots: list } };
    });
  const changeSlot = (dia: DiaSemana, id: number, campo: "desde" | "hasta", valor: string) =>
    setSemana((prev) => {
      const list = prev[dia].slots.map((s) => (s.id === id ? { ...s, [campo]: valor } : s));
      return { ...prev, [dia]: { ...prev[dia], slots: list } };
    });

  return (
    <div className="space-y-6 text-foreground">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Docentes</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={listar} className="gap-2" aria-label="Recargar lista de docentes">
            <RefreshCw className="h-4 w-4" /> Recargar
          </Button>

          {/* Dialog Añadir / Editar */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" onClick={abrirCrear} aria-label="Crear nuevo docente">
                <Plus className="h-4 w-4" /> Nuevo docente
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[860px] max-h-[80vh] overflow-y-auto bg-white text-gray-900">
              <DialogHeader>
                <DialogTitle>{editando ? "Editar docente" : "Nuevo docente"}</DialogTitle>
                <DialogDescription>
                  Completa los datos del docente y configura su disponibilidad semanal.
                </DialogDescription>
              </DialogHeader>

              {/* Form */}
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
                                  {/* columnas con ancho fijo */}
                                  <colgroup>
                                    <col className="w-35" />   {/* Desde */}
                                    <col className="w-35" />   {/* Hasta */}
                                    <col className="w-24" />   {/* Acciones */}
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
                                          <SelectorHora
                                            valor={s.desde}
                                            onChange={(v) => changeSlot(dia, s.id, "desde", v)}
                                          />
                                        </td>
                                        <td className="py-2 px-3">
                                          <SelectorHora
                                            valor={s.hasta}
                                            onChange={(v) => changeSlot(dia, s.id, "hasta", v)}
                                          />
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="p-2"
                                            onClick={() => removeSlot(dia, s.id)}
                                            title="Eliminar"
                                          >
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
                                        <Button
                                          size="sm"
                                          onClick={() => addSlot(dia)}
                                          className="gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                                          title="Agregar franja"
                                        >
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
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1"
                              onClick={() => toggleEditing(dia, !cfg.editing)}
                              disabled={!cfg.enabled}
                              title="Editar"
                            >
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
                <Button variant="outline" onClick={() => { setOpen(false); limpiar(); }}>Cancelar</Button>
                <Button onClick={guardar}>{editando ? "Guardar cambios" : "Crear"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, correo o especialidad"
            className="pl-9"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select value={filtroEstado} onValueChange={(v: any) => setFiltroEstado(v)}>
            <SelectTrigger className="bg-white text-gray-900 dark:bg-white dark:text-gray-900">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900 shadow-md rounded-md">
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="activo">Activos</SelectItem>
              <SelectItem value="inactivo">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Listado */}
      {/* (sin cambios) */}
      {filtrados.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtrados.map((d) => {
            const restricciones = obtenerRestriccionesDocente(d.id);
            const rows = restriccionesATabla(restricciones);
            const especialidades = (d.especialidad || "").split(",").map((s) => s.trim()).filter(Boolean);

            return (
              <Card key={d.id} className="rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>

                      {/* Nombre + estado debajo */}
                      <div>
                        <CardTitle className="text-lg">{d.nombre}</CardTitle>

                        {/* Estado debajo del nombre */}
                        <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-sm text-gray-700">
                          <span
                            className={`inline-block w-1.5 h-1.5 rounded-full ${
                              d.esta_activo ? "bg-emerald-500" : "bg-gray-400"
                            }`}
                          />
                          {d.esta_activo ? "activo" : "inactivo"}
                        </span>
                      </div>
                    </div>
                    {/* Botones de acción */}
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => abrirEditar(d)}
                        aria-label={`Editar docente ${d.nombre}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarDocente(d)}
                        aria-label={`Eliminar docente ${d.nombre}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5 text-sm">
                  {/* Correo */}
                  <div>
                    <div className="flex items-center gap-2 font-medium mb-1">
                      <Mail className="h-4 w-4" />
                      <span>Correo</span>
                    </div>
                    <p className="text-muted-foreground">{d.email}</p>
                  </div>

                  {/* Especialidades */}
                  <div>
                    <div className="flex items-center gap-2 font-medium mb-1">
                      <Tags className="h-4 w-4" />
                      <span>Especialidades</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {especialidades.length ? (
                        especialidades.map((e, i) => (
                          <Badge key={i} variant="outline" className="text-xs rounded-lg">
                            {e}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">Sin especialidades</span>
                      )}
                    </div>
                  </div>

                  {/* Disponibilidad (tabla lectura) */}
                  <div>
                    <div className="flex items-center gap-2 font-medium mb-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>Disponibilidad</span>
                    </div>
                    {rows.length ? (
                      <div className="overflow-visible rounded-lg border">
                        <table className="w-full text-xs">
                          <thead className="bg-muted/50">
                            <tr className="text-left">
                              <th className="py-1.5 px-2">Día</th>
                              <th className="py-1.5 px-2">Horario</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((r, i) => (
                              <tr key={i} className="border-t">
                                <td className="py-1.5 px-2">{r.dia}</td>
                                <td className="py-1.5 px-2">{r.horario}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Sin restricciones activas</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="text-center py-12">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg mb-2">No se encontraron docentes</h3>
            <p className="text-muted-foreground">
              {busqueda || filtroEstado !== "todos" ? "Ajusta los filtros de búsqueda" : "Comienza agregando tu primer docente"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dialog Confirmar Eliminación */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto bg-white text-gray-900">
          <DialogHeader>
            <DialogTitle>Eliminar docente</DialogTitle>
            <DialogDescription>
              {aEliminar ? (
                <>
                  ¿Seguro que deseas eliminar a{" "}
                  <span className="font-medium">{aEliminar.nombre}</span>? Esta acción no se puede deshacer.
                </>
              ) : (
                "¿Seguro que deseas eliminar este docente? Esta acción no se puede deshacer."
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => { setConfirmOpen(false); setAEliminar(null); }}
            >
              Cancelar
            </Button>
            <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmarEliminar}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
