import React, { useMemo, useReducer, useState } from "react";
import "../ProfesoresPage/ProfesoresPage.css";
import {
  Building,
  MapPin,
  Users,
  Calendar,
  Search as SearchIcon,
  Plus,
  Edit3,
  Trash2,
  X,
  Monitor,
} from "lucide-react";

type TipoSala = "aula" | "laboratorio" | "auditorio" | "sala_computacion";

type Horario = { dia: string; inicio: string; fin: string };
type Sala = {
  id: string;
  numero: string;
  capacidad: number;
  tipo: TipoSala;
  equipamiento: string[];
  disponible: boolean;
  horarios: Horario[];
};

type Edificio = {
  id: string;
  nombre: string;
  codigo: string;
  direccion?: string;
  salas: Sala[];
};

/* ===== Estado / Reducer ===== */
type Accion =
  | { type: "edificio:crear"; payload: Edificio }
  | { type: "edificio:actualizar"; payload: Edificio }
  | { type: "edificio:eliminar"; payload: string }
  | { type: "sala:crear"; payload: { edificioId: string; sala: Sala } }
  | {
      type: "sala:actualizar";
      payload: { edificioId: string; sala: Sala };
    }
  | { type: "sala:eliminar"; payload: { edificioId: string; salaId: string } };

function reducer(state: Edificio[], action: Accion): Edificio[] {
  switch (action.type) {
    case "edificio:crear":
      return [...state, action.payload].sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
    case "edificio:actualizar":
      return state
        .map((e) => (e.id === action.payload.id ? action.payload : e))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
    case "edificio:eliminar":
      return state.filter((e) => e.id !== action.payload);
    case "sala:crear":
      return state.map((e) =>
        e.id === action.payload.edificioId
          ? { ...e, salas: [...e.salas, action.payload.sala] }
          : e
      );
    case "sala:actualizar":
      return state.map((e) =>
        e.id === action.payload.edificioId
          ? {
              ...e,
              salas: e.salas.map((s) =>
                s.id === action.payload.sala.id ? action.payload.sala : s
              ),
            }
          : e
      );
    case "sala:eliminar":
      return state.map((e) =>
        e.id === action.payload.edificioId
          ? { ...e, salas: e.salas.filter((s) => s.id !== action.payload.salaId) }
          : e
      );
    default:
      return state;
  }
}

/* ===== Seed de ejemplo ===== */
const seed: Edificio[] = [
  {
    id: crypto.randomUUID(),
    nombre: "Edificio de Ciencias",
    codigo: "CS",
    direccion: "Av. Universidad 123",
    salas: [
      {
        id: crypto.randomUUID(),
        numero: "CS-101",
        capacidad: 40,
        tipo: "aula",
        equipamiento: ["Proyector", "Pizarra", "Sistema de audio"],
        disponible: true,
        horarios: [
          { dia: "Lunes", inicio: "08:30", fin: "10:00" },
          { dia: "Miércoles", inicio: "08:30", fin: "10:00" },
          { dia: "Viernes", inicio: "08:30", fin: "10:00" },
        ],
      },
      {
        id: crypto.randomUUID(),
        numero: "CS-102",
        capacidad: 30,
        tipo: "laboratorio",
        equipamiento: ["Computadores", "Proyector", "Pizarra digital"],
        disponible: true,
        horarios: [
          { dia: "Lunes", inicio: "14:00", fin: "15:30" },
          { dia: "Miércoles", inicio: "14:00", fin: "15:30" },
        ],
      },
      {
        id: crypto.randomUUID(),
        numero: "CS-201",
        capacidad: 60,
        tipo: "auditorio",
        equipamiento: ["Sistema de sonido", "Proyector HD", "Escenario"],
        disponible: true,
        horarios: [],
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    nombre: "Edificio de Ingeniería",
    codigo: "ING",
    direccion: "Av. Tecnología 456",
    salas: [
      {
        id: crypto.randomUUID(),
        numero: "ING-101",
        capacidad: 45,
        tipo: "aula",
        equipamiento: ["Proyector", "Pizarra", "Aire acondicionado"],
        disponible: true,
        horarios: [],
      },
      {
        id: crypto.randomUUID(),
        numero: "ING-LAB1",
        capacidad: 25,
        tipo: "sala_computacion",
        equipamiento: ["30 Computadores", "Proyector", "Software especializado"],
        disponible: true,
        horarios: [
          { dia: "Martes", inicio: "10:15", fin: "12:30" },
          { dia: "Jueves", inicio: "10:15", fin: "12:30" },
        ],
      },
    ],
  },
];

/* ===== Página ===== */
export default function SalasPage() {
  const [edificios, dispatch] = useReducer(reducer, seed);
  const [q, setQ] = useState("");
  const [filtroEdificio, setFiltroEdificio] = useState<string>("todos");
  const [filtroTipo, setFiltroTipo] = useState<"todos" | TipoSala>("todos");

  const [modalEdificio, setModalEdificio] = useState(false);
  const [editandoEdificio, setEditandoEdificio] = useState<Edificio | null>(
    null
  );

  const [modalSala, setModalSala] = useState(false);
  const [contextoSala, setContextoSala] = useState<{
    edificioId: string | null;
    sala: Sala | null;
  }>({ edificioId: null, sala: null });

  const visibles = useMemo(() => {
    const text = q.trim().toLowerCase();
    return edificios
      .map((e) => ({
        ...e,
        salas: e.salas.filter((s) => {
          const coincideTexto =
            text.length === 0
              ? true
              : [s.numero, e.nombre, e.codigo].join(" ").toLowerCase().includes(text);
          const coincideTipo = filtroTipo === "todos" ? true : s.tipo === filtroTipo;
          const coincideEdif =
            filtroEdificio === "todos" ? true : e.id === filtroEdificio;
          return coincideTexto && coincideTipo && coincideEdif;
        }),
      }))
      .filter((e) => e.salas.length > 0 || filtroEdificio === "todos");
  }, [edificios, q, filtroTipo, filtroEdificio]);

  function abrirCrearEdificio() {
    setEditandoEdificio(null);
    setModalEdificio(true);
  }
  function abrirEditarEdificio(e: Edificio) {
    setEditandoEdificio(e);
    setModalEdificio(true);
  }
  function eliminarEdificio(id: string) {
    if (confirm("¿Eliminar edificio y todas sus salas?"))
      dispatch({ type: "edificio:eliminar", payload: id });
  }

  function abrirCrearSala(edificioId: string) {
    setContextoSala({ edificioId, sala: null });
    setModalSala(true);
  }
  function abrirEditarSala(edificioId: string, sala: Sala) {
    setContextoSala({ edificioId, sala });
    setModalSala(true);
  }
  function eliminarSala(edificioId: string, salaId: string) {
    if (confirm("¿Eliminar sala?"))
      dispatch({ type: "sala:eliminar", payload: { edificioId, salaId } });
  }

  return (
    <main className="page">
      <div className="page__header">
        <div>
          <h1>Gestión de Salas y Edificios</h1>
          <p className="muted">
            Administra la infraestructura y asignación de espacios físicos
          </p>
        </div>
        <button className="btn btn--primary" onClick={ abrirCrearEdificio }>
          ＋ Agregar Edificio
        </button>
      </div>

      {/* Controles */}
      <div className="toolbar">
        <div className="search">
          <span className="search__icon" aria-hidden>
            <SearchIcon size={16} />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por sala, edificio o código…"
          />
        </div>

        <div className="select">
          <select
            value={filtroEdificio}
            onChange={(e) => setFiltroEdificio(e.target.value)}
            aria-label="Filtrar por edificio"
          >
            <option value="todos">Todos los edificios</option>
            {edificios.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre} ({e.codigo})
              </option>
            ))}
          </select>
        </div>

        <div className="select">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as any)}
            aria-label="Filtrar por tipo"
          >
            <option value="todos">Todos los tipos</option>
            <option value="aula">Aula</option>
            <option value="laboratorio">Laboratorio</option>
            <option value="auditorio">Auditorio</option>
            <option value="sala_computacion">Sala de Computación</option>
          </select>
        </div>
      </div>

      {/* Secciones por edificio */}
      {visibles.map((e) => (
        <section key={e.id} className="card" style={{ marginBottom: 16 }}>
          <header className="card__header" style={{ marginBottom: 12 }}>
            <div className="avatar" aria-hidden>
              <Building size={20} />
            </div>
            <div className="card__title">
              <div className="name" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {e.nombre}
                <span className="chip">{e.codigo}</span>
              </div>
              <div className="muted" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={14} /> {e.direccion || "Dirección no especificada"}
              </div>
            </div>
            <div className="card__actions">
              <button className="iconbtn" onClick={() => abrirCrearSala(e.id)}>
                <Plus size={16} /> 
              </button>
              <button className="iconbtn" onClick={() => abrirEditarEdificio(e)}>
                <Edit3 size={16} />
              </button>
              <button className="iconbtn danger" onClick={() => eliminarEdificio(e.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </header>

          <div className="grid">
            {e.salas.map((s) => (
              <article key={s.id} className="card">
                <header className="card__header" style={{ marginBottom: 8 }}>
                  <div className="avatar" aria-hidden>
                    <Users size={16} />
                  </div>
                  <div className="card__title">
                    <div className="name">{s.numero}</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span className="chip">{s.tipo}</span>
                      <span className={`pill ${s.disponible ? "ok" : "off"}`}>
                        {s.disponible ? "Disponible" : "No disponible"}
                      </span>
                    </div>
                  </div>
                  <div className="card__actions">
                    <button className="iconbtn" onClick={() => abrirEditarSala(e.id, s)}>
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="iconbtn danger"
                      onClick={() => eliminarSala(e.id, s.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </header>

                <dl className="info">
                  <dt>Capacidad</dt>
                  <dd>
                    <Users size={14} />
                    {s.capacidad} personas
                  </dd>

                  {s.equipamiento.length > 0 && (
                    <>
                      <dt>Equipamiento</dt>
                      <dd className="chips">
                        {s.equipamiento.map((eq) => (
                          <span key={eq} className="chip">
                            {eq}
                          </span>
                        ))}
                      </dd>
                    </>
                  )}
                </dl>

                {s.horarios.length > 0 && (
                  <section className="section">
                    <h4 style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Calendar size={14} /> Asignaturas programadas
                    </h4>
                    <div className="chips" style={{ flexDirection: "column", gap: 6 }}>
                      {s.horarios.map((h, i) => (
                        <div key={i} className="chip" style={{ display: "inline-flex", gap: 8 }}>
                          <strong>{h.dia}</strong> {h.inicio}-{h.fin}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </article>
            ))}

            {e.salas.length === 0 && (
              <div className="empty">
                <Monitor size={20} />
                <div>No hay salas en este edificio.</div>
                <div style={{ marginTop: 8 }}>
                  <button className="btn" onClick={() => abrirCrearSala(e.id)}>Agregar primera sala</button>
                </div>
              </div>
            )}
          </div>
        </section>
      ))}

      {visibles.length === 0 && (
        <div className="card empty">No se encontraron salas con los filtros actuales.</div>
      )}

      {/* Modales */}
      {modalEdificio && (
        <Modal onClose={() => setModalEdificio(false)} titulo="Edificio">
          <FormularioEdificio
            initial={editandoEdificio}
            onSubmit={(ed) => {
              if (editandoEdificio)
                dispatch({ type: "edificio:actualizar", payload: ed });
              else dispatch({ type: "edificio:crear", payload: ed });
              setModalEdificio(false);
            }}
          />
        </Modal>
      )}

      {modalSala && contextoSala.edificioId && (
        <Modal onClose={() => setModalSala(false)} titulo="Sala">
          <FormularioSala
            initial={contextoSala.sala}
            onSubmit={(s) => {
              const edificioId = contextoSala.edificioId!;
              if (contextoSala.sala)
                dispatch({ type: "sala:actualizar", payload: { edificioId, sala: s } });
              else dispatch({ type: "sala:crear", payload: { edificioId, sala: s } });
              setModalSala(false);
            }}
          />
        </Modal>
      )}
    </main>
  );
}

/* ===== Modal ===== */
function Modal({
  children,
  titulo,
  onClose,
}: {
  children: React.ReactNode;
  titulo: string;
  onClose: () => void;
}) {
  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <strong>{titulo}</strong>
          <button className="iconbtn" onClick={onClose} aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}

/* ===== Formularios ===== */
function FormularioEdificio({
  initial,
  onSubmit,
}: {
  initial: Edificio | null;
  onSubmit: (e: Edificio) => void;
}) {
  const [form, setForm] = useState<Edificio>(
    initial ?? {
      id: crypto.randomUUID(),
      nombre: "",
      codigo: "",
      direccion: "",
      salas: [],
    }
  );

  function upd<K extends keyof Edificio>(k: K, v: Edificio[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) return alert("El nombre es obligatorio");
    if (!form.codigo.trim()) return alert("El código es obligatorio");
    onSubmit(form);
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Nombre del edificio
        <input value={form.nombre} onChange={(e) => upd("nombre", e.target.value)} required />
      </label>
      <label>
        Código
        <input value={form.codigo} onChange={(e) => upd("codigo", e.target.value)} required />
      </label>
      <label>
        Dirección
        <input value={form.direccion ?? ""} onChange={(e) => upd("direccion", e.target.value)} />
      </label>
      <div className="form__actions">
        <button className="btn btn--primary" type="submit">
          {initial ? "Guardar cambios" : "Agregar edificio"}
        </button>
      </div>
    </form>
  );
}

function FormularioSala({
  initial,
  onSubmit,
}: {
  initial: Sala | null;
  onSubmit: (s: Sala) => void;
}) {
  const [form, setForm] = useState<Sala>(
    initial ?? {
      id: crypto.randomUUID(),
      numero: "",
      capacidad: 0,
      tipo: "aula",
      equipamiento: [],
      disponible: true,
      horarios: [],
    }
  );

  function upd<K extends keyof Sala>(k: K, v: Sala[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.numero.trim()) return alert("El número de sala es obligatorio");
    if (form.capacidad <= 0) return alert("La capacidad debe ser mayor a 0");
    onSubmit({
      ...form,
      equipamiento: form.equipamiento.map((x) => x.trim()).filter(Boolean),
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="row">
        <label className="w50">
          Número de sala
          <input
            value={form.numero}
            onChange={(e) => upd("numero", e.target.value)}
            placeholder="CS-101"
            required
          />
        </label>

        <label className="w50">
          Capacidad
          <input
            type="number"
            min={1}
            value={form.capacidad}
            onChange={(e) => upd("capacidad", Number(e.target.value || 0))}
            required
          />
        </label>
      </div>

      <div className="row">
        <label className="w50">
          Tipo
          <select
            value={form.tipo}
            onChange={(e) => upd("tipo", e.target.value as TipoSala)}
          >
            <option value="aula">Aula</option>
            <option value="laboratorio">Laboratorio</option>
            <option value="auditorio">Auditorio</option>
            <option value="sala_computacion">Sala de Computación</option>
          </select>
        </label>

        <label className="w50">
          Disponible
          <select
            value={form.disponible ? "si" : "no"}
            onChange={(e) => upd("disponible", e.target.value === "si")}
          >
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </label>
      </div>

      <label>
        Equipamiento (separar por coma)
        <input
          value={form.equipamiento.join(", ")}
          onChange={(e) =>
            upd(
              "equipamiento",
              e.target.value.split(",").map((s) => s.trim())
            )
          }
          placeholder="Proyector, Pizarra…"
        />
      </label>

      <div className="form__actions">
        <button className="btn btn--primary" type="submit">
          {initial ? "Guardar cambios" : "Agregar sala"}
        </button>
      </div>
    </form>
  );
}
