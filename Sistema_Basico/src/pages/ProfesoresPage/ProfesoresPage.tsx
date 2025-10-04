import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { User } from "lucide-react";
import { toast } from "sonner";

import { profesoresMock, restriccionesMock } from "./data/mock-profesores";
import type { DiaSemana, RestriccionHorarioGuardar } from "../../types";
import type { Docente } from "./types";

import AccionesHeader from "./components/AccionesHeader";
import FiltrosListado from "./components/FiltrosListado";
import DialogoDocente from "./components/DialogoDocente";
import TarjetaDocente from "./components/TarjetaDocente";
import DialogoConfirmEliminar from "./components/DialogoConfirmEliminar";

const DIA_LABEL: Record<DiaSemana, string> = {
  LUNES: "Lunes", MARTES: "Martes", MIERCOLES: "Miércoles", JUEVES: "Jueves", VIERNES: "Viernes", SABADO: "Sábado",
};
const ORD_DIAS: DiaSemana[] = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];
const diaToNum: Record<DiaSemana, number> = { LUNES: 1, MARTES: 2, MIERCOLES: 3, JUEVES: 4, VIERNES: 5, SABADO: 6 };
const numToDia: Record<number, DiaSemana> = { 1: "LUNES", 2: "MARTES", 3: "MIERCOLES", 4: "JUEVES", 5: "VIERNES", 6: "SABADO" };
const normalizarTexto = (s: string) => (s || "").toLowerCase().normalize("NFKD").replace(/\p{Diacritic}/gu, "");
const nowBase = () => Math.floor(Math.random() * 1e9);
const hhmmToMin = (hhmm: string) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };

function useDocentesListado() {
  const [items, setItems] = useState<Docente[]>([]);
  const listar = async () => setItems(profesoresMock as unknown as Docente[]);
  return { items, setItems, listar };
}

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => { const t = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(t); }, [value, delay]);
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
  const [form, setForm] = useState<Omit<Docente, "id">>({ nombre: "", email: "", password_hash: "", esta_activo: true, especialidad: "" });
  const [semana, setSemana] = useState<SemanaDisponibilidad>(defaultSemana());
  const limpiar = () => { setEditando(null); setForm({ nombre: "", email: "", password_hash: "", esta_activo: true, especialidad: "" }); setSemana(defaultSemana()); };
  return { open, setOpen, editando, setEditando, form, setForm, semana, setSemana, limpiar };
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
    setForm({ nombre: d.nombre, email: d.email, password_hash: d.password_hash, esta_activo: d.esta_activo, especialidad: d.especialidad });
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

  const eliminarDocente = (d: Docente) => { setAEliminar(d); setConfirmOpen(true); };
  const confirmarEliminar = () => {
    if (!aEliminar) return;
    setItems((prev) => prev.filter((x) => x.id !== aEliminar.id));
    setRestriccionesLocal((prev) => { const cp = { ...prev }; delete cp[aEliminar.id]; return cp; });
    toast.success("Docente eliminado");
    setConfirmOpen(false);
    setAEliminar(null);
  };

  const toggleDia = (dia: DiaSemana, enabled: boolean) => setSemana((prev) => ({ ...prev, [dia]: { ...prev[dia], enabled } }));
  const toggleEditing = (dia: DiaSemana, editing: boolean) => setSemana((prev) => ({ ...prev, [dia]: { ...prev[dia], editing } }));
  const addSlot = (dia: DiaSemana) => setSemana((prev) => { const list = prev[dia].slots.slice(); list.push({ id: nowBase(), desde: "08:00", hasta: "12:00" }); return { ...prev, [dia]: { ...prev[dia], slots: list } }; });
  const removeSlot = (dia: DiaSemana, id: number) => setSemana((prev) => { const list = prev[dia].slots.filter((s) => s.id !== id); return { ...prev, [dia]: { ...prev[dia], slots: list } }; });
  const changeSlot = (dia: DiaSemana, id: number, campo: "desde" | "hasta", valor: string) => setSemana((prev) => { const list = prev[dia].slots.map((s) => (s.id === id ? { ...s, [campo]: valor } : s)); return { ...prev, [dia]: { ...prev[dia], slots: list } }; });

  return (
    <div className="space-y-6 text-foreground">
      <AccionesHeader onRecargar={listar} onNuevo={abrirCrear} />

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
            const filas = restriccionesATabla(obtenerRestriccionesDocente(d.id));
            return (
              <TarjetaDocente
                key={d.id}
                docente={d}
                rows={filas}
                onEditar={abrirEditar}
                onEliminar={eliminarDocente}
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

      <DialogoConfirmEliminar
        open={confirmOpen}
        setOpen={setConfirmOpen}
        aEliminar={aEliminar}
        onCancelar={() => { setConfirmOpen(false); setAEliminar(null); }}
        onConfirmar={confirmarEliminar}
      />
    </div>
  );
}
