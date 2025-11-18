// frontend/src/pages/ProfesoresPage/index.tsx
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { DiaSemana, RestriccionHorarioGuardar } from "@/types";
import { docenteService } from "@/application/services/DocenteService";
import type { DocenteConUsuario, DocenteCreateDTO } from "@/domain/docentes/types";
import { normalize } from "@/utils/string";

import AccionesHeader from "./components/AccionesHeader";
import FiltrosListado from "./components/FiltrosListado";
import DialogoDocente from "./components/DialogoDocente";
import TarjetaDocente from "./components/TarjetaDocente";

import { authService } from "@/application/services/AuthService";

const DIA_LABEL: Record<DiaSemana, string> = { LUNES: "Lunes", MARTES: "Martes", MIERCOLES: "Miércoles", JUEVES: "Jueves", VIERNES: "Viernes", SABADO: "Sábado" };
const ORD_DIAS: DiaSemana[] = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];
const diaToNum: Record<DiaSemana, number> = { LUNES: 1, MARTES: 2, MIERCOLES: 3, JUEVES: 4, VIERNES: 5, SABADO: 6 };
const numToDia: Record<number, DiaSemana> = { 1: "LUNES", 2: "MARTES", 3: "MIERCOLES", 4: "JUEVES", 5: "VIERNES", 6: "SABADO" };
const nowBase = () => Math.floor(Math.random() * 1e9);
const hhmmToMin = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return debounced;
}

/* ---------- utilidades de disponibilidad (copiar/adaptadas de tu versión) ---------- */

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

function validarSemana(semana: SemanaDisponibilidad): string | null {
  for (const d of ORD_DIAS) {
    const cfg = semana[d];
    if (!cfg?.enabled) continue;
    if (!cfg.slots.length) return `Agrega al menos una franja en ${DIA_LABEL[d]}`;
    for (const s of cfg.slots) {
      if (!/^\d{2}:\d{2}$/.test(s.desde) || !/^\d{2}:\d{2}$/.test(s.hasta)) return `Formato de hora inválido en ${DIA_LABEL[d]}`;
      if (s.desde >= s.hasta) return `En ${DIA_LABEL[d]} la hora de inicio debe ser menor que la de fin`;
    }
    const sorted = [...cfg.slots].sort((a, b) => hhmmToMin(a.desde) - hhmmToMin(b.desde));
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1]; const cur = sorted[i];
      if (hhmmToMin(cur.desde) < hhmmToMin(prev.hasta)) return `Franja solapada en ${DIA_LABEL[d]}: ${prev.desde}–${prev.hasta} con ${cur.desde}–${cur.hasta}`;
    }
  }
  return null;
}

function semanaATransfer(semana: SemanaDisponibilidad, docenteId: number): RestriccionHorarioGuardar[] {
  const out: RestriccionHorarioGuardar[] = [];
  for (const d of ORD_DIAS) {
    const cfg = semana[d]; if (!cfg?.enabled) continue;
    for (const s of cfg.slots) {
      out.push({ docente_id: docenteId, dia_semana: diaToNum[d], hora_inicio: s.desde, hora_fin: s.hasta, ...( { esta_activo: true, esta_disponible: true } as any ) } as unknown as RestriccionHorarioGuardar);
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
  return ORD_DIAS.filter((d) => grouped.has(d)).map((d) => ({ dia: DIA_LABEL[d], horario: (grouped.get(d) || []).join(", ") }));
}

function restriccionesASemana(restricciones: RestriccionHorarioGuardar[]): SemanaDisponibilidad {
  const base = defaultSemana();
  const byDia: Record<DiaSemana, { id: number; desde: string; hasta: string }[]> = { LUNES: [], MARTES: [], MIERCOLES: [], JUEVES: [], VIERNES: [], SABADO: [] };
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

/* -------------------- componente -------------------- */

type FormState = DocenteCreateDTO;

export function ProfesoresPage() {
  const [items, setItems] = useState<DocenteConUsuario[]>([]);
  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<DocenteConUsuario | null>(null);
  const [form, setForm] = useState<FormState>({ nombre: "", email: "", departamento: "", activo: true, contrasena: "" });
  const [semana, setSemana] = useState<SemanaDisponibilidad>(defaultSemana());

  const [restriccionesLocal, setRestriccionesLocal] = useState<Record<number, RestriccionHorarioGuardar[]>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [aEliminar, setAEliminar] = useState<DocenteConUsuario | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const debouncedSearch = useDebouncedValue(busqueda, 250);
  const [filtroEstado, setFiltroEstado] = useState<"todos" | "activo" | "inactivo">("todos");

  // permisos
  const [canCreate, setCanCreate] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);

  useEffect(() => {
    setCanCreate(authService.canCreateProfesores());
    setCanEdit(authService.canEditProfesores());
    setCanDelete(authService.canDeleteProfesores());

    if (!authService.getUsuarioActual()) {
      void authService.cargarUsuarioDesdeApi().then(() => {
        setCanCreate(authService.canCreateProfesores());
        setCanEdit(authService.canEditProfesores());
        setCanDelete(authService.canDeleteProfesores());
      });
    }

    const unsub = authService.onChange(() => {
      setCanCreate(authService.canCreateProfesores());
      setCanEdit(authService.canEditProfesores());
      setCanDelete(authService.canDeleteProfesores());
    });
    return unsub;
  }, []);

  const limpiar = () => {
    setEditando(null);
    setForm({ nombre: "", email: "", departamento: "", activo: true, contrasena: "" });
    setSemana(defaultSemana());
  };

  const listar = async () => {
    const entidades = debouncedSearch
      ? await docenteService.buscar(debouncedSearch)
      : await docenteService.obtenerTodas();
    setItems(entidades.map((e) => e.toDTO()));
  };

  useEffect(() => { listar(); }, [debouncedSearch]);

  const filtrados = useMemo(() => {
    const q = normalize(debouncedSearch);
    return items.filter((d) => {
      if (filtroEstado === "activo" && !d.activo) return false;
      if (filtroEstado === "inactivo" && d.activo) return false;
      if (!q) return true;
      return normalize(`${d.nombre} ${d.email} ${d.docente.departamento}`).includes(q);
    });
  }, [items, debouncedSearch, filtroEstado]);

  const abrirCrear = () => {
    if (!canCreate) {
      toast.error("No tienes permisos para crear docentes");
      return;
    }
    limpiar();
    setOpen(true);
  };

  const abrirEditar = (d: DocenteConUsuario) => {
    if (!canEdit) {
      toast.error("No tienes permisos para editar docentes");
      return;
    }
    limpiar();
    setEditando(d);
    setForm({ nombre: d.nombre, email: d.email, departamento: d.docente.departamento, activo: d.activo, contrasena: "" });
    const actuales = restriccionesLocal[d.id] || [];
    setSemana(restriccionesASemana(actuales));
    setOpen(true);
  };

  const guardar = async () => {
    if (!form.nombre.trim()) return toast.error("El nombre es obligatorio");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((form.email || "").trim())) return toast.error("Correo inválido");
    if (!editando && !(form.contrasena || "").trim()) return toast.error("La contraseña es obligatoria");
    const err = validarSemana(semana);
    if (err) return toast.error(err);

    try {
      if (editando) {
        const updated = await docenteService.actualizar(editando.id, {
          nombre: form.nombre,
          email: form.email,
          activo: form.activo,
          departamento: form.departamento,
        });
        const payload = semanaATransfer(semana, updated.id);
        setRestriccionesLocal((prev) => ({ ...prev, [updated.id]: payload }));
        toast.success("Docente actualizado");
      } else {
        if (!canCreate) {
          toast.error("No tienes permisos para crear docentes");
          return;
        }
        const created = await docenteService.crearNueva({
          nombre: form.nombre,
          email: form.email,
          departamento: form.departamento,
          activo: form.activo,
          contrasena: form.contrasena,
          rol: "docente",
        });
        const createdId = created.id;
        const restr = semanaATransfer(semana, createdId);
        setRestriccionesLocal((prev) => ({ ...prev, [createdId]: restr }));
        toast.success("Docente creado");
      }
      await listar();
      setOpen(false);
      limpiar();
    } catch (e: any) {
      toast.error(e.message || "Error al guardar");
    }
  };

  const eliminarDocente = (d: DocenteConUsuario) => {
    if (!canDelete) {
      toast.error("No tienes permisos para eliminar docentes");
      return;
    }
    setAEliminar(d);
    setConfirmOpen(true);
  };

  const confirmarEliminar = async () => {
    if (!aEliminar) return;
    try {
      await docenteService.eliminar(aEliminar.id);
      setRestriccionesLocal((prev) => { const cp = { ...prev }; delete cp[aEliminar.id]; return cp; });
      await listar();
      toast.success("Docente eliminado");
    } catch (e: any) {
      toast.error(e.message || "Error al eliminar");
    } finally {
      setConfirmOpen(false);
      setAEliminar(null);
    }
  };

  const toggleDia = (dia: DiaSemana, enabled: boolean) => setSemana((prev) => ({ ...prev, [dia]: { ...prev[dia], enabled } }));
  const toggleEditing = (dia: DiaSemana, editing: boolean) => setSemana((prev) => ({ ...prev, [dia]: { ...prev[dia], editing } }));
  const addSlot = (dia: DiaSemana) => setSemana((prev) => { const list = prev[dia].slots.slice(); list.push({ id: nowBase(), desde: "08:00", hasta: "12:00" }); return { ...prev, [dia]: { ...prev[dia], slots: list } }; });
  const removeSlot = (dia: DiaSemana, id: number) => setSemana((prev) => { const list = prev[dia].slots.filter((s) => s.id !== id); return { ...prev, [dia]: { ...prev[dia], slots: list } }; });
  const changeSlot = (dia: DiaSemana, id: number, campo: "desde" | "hasta", valor: string) => setSemana((prev) => { const list = prev[dia].slots.map((s) => (s.id === id ? { ...s, [campo]: valor } : s)); return { ...prev, [dia]: { ...prev[dia], slots: list } }; });

  return (
    <div className="space-y-6 text-foreground">
      <AccionesHeader onRecargar={listar} onNuevo={abrirCrear} canCreate={canCreate} />

      <DialogoDocente
        open={open}
        setOpen={setOpen}
        editando={editando}
        form={form}
        setForm={setForm}
        semana={semana}
        DIA_LABEL={DIA_LABEL}
        ORD_DIAS={ORD_DIAS}
        toggleDia={toggleDia}
        toggleEditing={toggleEditing}
        addSlot={addSlot}
        removeSlot={removeSlot}
        changeSlot={changeSlot}
        onGuardar={guardar}
        onCancelar={() => { setOpen(false); limpiar(); }}
      />

      <FiltrosListado
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        filtroEstado={filtroEstado}
        setFiltroEstado={setFiltroEstado}
      />

      {filtrados.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtrados.map((d) => {
            const filas = restriccionesATabla(restriccionesLocal[d.id] || []);
            return (
              <TarjetaDocente
                key={d.id}
                docente={d}
                rows={filas}
                onEditar={abrirEditar}
                onEliminar={eliminarDocente}
                canEdit={canEdit}
                canDelete={canDelete}
              />
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

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={confirmarEliminar}
        title="Eliminar docente"
        description={`¿Seguro que quieres eliminar a ${aEliminar?.nombre}?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
}
