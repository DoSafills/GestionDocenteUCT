import React, { useMemo, useReducer, useState } from "react";
import "./ProfesoresPage.css";
import {
  User,
  Mail,
  Phone,
  Hourglass,
  Search as SearchIcon,
  Edit3,
  Trash2,
  X,
} from "lucide-react";

type Estado = "activo" | "inactivo";

type Profesor = {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  estado: Estado;
  aniosExperiencia: number;
  especialidades: string[];
  disponibilidad: {
    dias: string;
    horario: string;
  };
};

type Accion =
  | { type: "crear"; payload: Profesor }
  | { type: "actualizar"; payload: Profesor }
  | { type: "eliminar"; payload: string };

function profesoresReducer(state: Profesor[], action: Accion): Profesor[] {
  switch (action.type) {
    case "crear":
      return [...state, action.payload].sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );
    case "actualizar":
      return state
        .map((p) => (p.id === action.payload.id ? action.payload : p))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
    case "eliminar":
      return state.filter((p) => p.id !== action.payload);
    default:
      return state;
  }
}

const seed: Profesor[] = [
  {
    id: crypto.randomUUID(),
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@universidad.edu",
    telefono: "+56912345678",
    estado: "activo",
    aniosExperiencia: 15,
    especialidades: ["Matemáticas", "Estadística", "Álgebra Lineal"],
    disponibilidad: {
      dias: "Lunes, Martes, Miércoles, Jueves",
      horario: "08:00 - 18:00",
    },
  },
  {
    id: crypto.randomUUID(),
    nombre: "María González",
    email: "maria.gonzalez@universidad.edu",
    telefono: "+56923456789",
    estado: "activo",
    aniosExperiencia: 8,
    especialidades: ["Programación", "Algoritmos", "Estructura de Datos"],
    disponibilidad: {
      dias: "Lunes, Miércoles, Viernes",
      horario: "09:00 - 17:00",
    },
  },
  {
    id: crypto.randomUUID(),
    nombre: "Ana López",
    email: "ana.lopez@universidad.edu",
    telefono: "+56934567890",
    estado: "inactivo",
    aniosExperiencia: 12,
    especialidades: ["Física", "Mecánica", "Termodinámica"],
    disponibilidad: {
      dias: "Martes, Jueves, Viernes",
      horario: "08:30 - 16:30",
    },
  },
];

export default function ProfesoresPage() {
  const [profesores, dispatch] = useReducer(profesoresReducer, seed);
  const [q, setQ] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<"todos" | Estado>("todos");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<Profesor | null>(null);

  const visibles = useMemo(() => {
    const text = q.trim().toLowerCase();
    return profesores.filter((p) => {
      const coincideEstado =
        filtroEstado === "todos" ? true : p.estado === filtroEstado;
      const coincideTexto =
        text.length === 0
          ? true
          : [
              p.nombre,
              p.email,
              p.telefono,
              ...p.especialidades,
              p.disponibilidad.dias,
            ]
              .join(" ")
              .toLowerCase()
              .includes(text);
      return coincideEstado && coincideTexto;
    });
  }, [profesores, q, filtroEstado]);

  function abrirCrear() {
    setEditando(null);
    setModalAbierto(true);
  }
  function abrirEditar(p: Profesor) {
    setEditando(p);
    setModalAbierto(true);
  }
  function eliminar(id: string) {
    if (confirm("¿Eliminar profesor?")) dispatch({ type: "eliminar", payload: id });
  }

  return (
    <main className="page">
      <div className="page__header">
        <div>
          <h1>Gestión de Profesores</h1>
          <p className="muted">
            Administra la información y disponibilidad del personal docente
          </p>
        </div>
        <button className="btn btn--primary" onClick={abrirCrear}>
          ＋ Agregar Profesor
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
            placeholder="Buscar por nombre, email o especialidad…"
          />
        </div>

        <div className="select">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as any)}
            aria-label="Filtrar por estado"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>
      </div>

      {/* GRID DE TARJETAS */}
      <section className="grid">
        {visibles.map((p) => (
          <article key={p.id} className="card">
            <header className="card__header">
              <div className="avatar" aria-hidden>
                <User size={20} />
              </div>
              <div className="card__title">
                <div className="name">{p.nombre}</div>
                <span className={`pill ${p.estado === "activo" ? "ok" : "off"}`}>
                  {p.estado}
                </span>
              </div>
              <div className="card__actions">
                <button className="iconbtn" title="Editar" onClick={() => abrirEditar(p)}>
                  <Edit3 size={16} />
                </button>
                <button className="iconbtn danger" title="Eliminar" onClick={() => eliminar(p.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </header>

            <dl className="info">
              <dt>Email</dt>
              <dd>
                <Mail size={14} />
                <a href={`mailto:${p.email}`}>{p.email}</a>
              </dd>

              <dt>Teléfono</dt>
              <dd>
                <Phone size={14} />
                <a href={`tel:${p.telefono}`}>{p.telefono}</a>
              </dd>

              <dt>Experiencia</dt>
              <dd>
                <Hourglass size={14} /> {p.aniosExperiencia} años de experiencia
              </dd>
            </dl>

            <section className="section">
              <h4>Especialidades</h4>
              <div className="chips">
                {p.especialidades.map((e) => (
                  <span key={e} className="chip">
                    {e}
                  </span>
                ))}
              </div>
            </section>

            <section className="section">
              <h4>Disponibilidad</h4>
              <p className="muted">Días: {p.disponibilidad.dias}</p>
              <p className="muted">Horario: {p.disponibilidad.horario}</p>
            </section>
          </article>
        ))}

        {visibles.length === 0 && (
          <div className="empty">No se encontraron profesores con los filtros actuales.</div>
        )}
      </section>

      {modalAbierto && (
        <Modal onClose={() => setModalAbierto(false)}>
          <FormularioProfesor
            initial={editando}
            onSubmit={(prof) => {
              if (editando) dispatch({ type: "actualizar", payload: prof });
              else dispatch({ type: "crear", payload: prof });
              setModalAbierto(false);
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
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <strong>Profesor</strong>
          <button className="iconbtn" onClick={onClose} aria-label="Cerrar">
            <X size={16} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}

/* ===== Formulario ===== */
function FormularioProfesor({
  initial,
  onSubmit,
}: {
  initial: Profesor | null;
  onSubmit: (p: Profesor) => void;
}) {
  const [form, setForm] = useState<Profesor>(
    initial ?? {
      id: crypto.randomUUID(),
      nombre: "",
      email: "",
      telefono: "",
      estado: "activo",
      aniosExperiencia: 0,
      especialidades: [],
      disponibilidad: { dias: "", horario: "" },
    }
  );

  function upd<K extends keyof Profesor>(k: K, v: Profesor[K]) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) return alert("El nombre es obligatorio");
    if (!/\S+@\S+\.\S+/.test(form.email)) return alert("Email inválido");
    onSubmit({
      ...form,
      especialidades: form.especialidades.map((s) => s.trim()).filter(Boolean),
    });
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Nombre
        <input
          value={form.nombre}
          onChange={(e) => upd("nombre", e.target.value)}
          required
        />
      </label>

      <label>
        Email
        <input
          value={form.email}
          onChange={(e) => upd("email", e.target.value)}
          type="email"
          required
        />
      </label>

      <label>
        Teléfono
        <input
          value={form.telefono}
          onChange={(e) => upd("telefono", e.target.value)}
          placeholder="+56..."
        />
      </label>

      <div className="row">
        <label className="w50">
          Estado
          <select
            value={form.estado}
            onChange={(e) => upd("estado", e.target.value as Estado)}
          >
            <option value="activo">activo</option>
            <option value="inactivo">inactivo</option>
          </select>
        </label>

        <label className="w50">
          Años de experiencia
          <input
            value={form.aniosExperiencia}
            onChange={(e) =>
              upd("aniosExperiencia", Number(e.target.value || 0))
            }
            type="number"
            min={0}
          />
        </label>
      </div>

      <label>
        Especialidades (separadas por coma)
        <input
          value={form.especialidades.join(", ")}
          onChange={(e) =>
            upd(
              "especialidades",
              e.target.value.split(",").map((s) => s.trim())
            )
          }
          placeholder="Programación, Algoritmos…"
        />
      </label>

      <label>
        Días disponibles
        <input
          value={form.disponibilidad.dias}
          onChange={(e) =>
            setForm((s) => ({
              ...s,
              disponibilidad: { ...s.disponibilidad, dias: e.target.value },
            }))
          }
          placeholder="Lunes, Miércoles, Viernes"
        />
      </label>

      <label>
        Horario
        <input
          value={form.disponibilidad.horario}
          onChange={(e) =>
            setForm((s) => ({
              ...s,
              disponibilidad: { ...s.disponibilidad, horario: e.target.value },
            }))
          }
          placeholder="09:00 - 17:00"
        />
      </label>

      <div className="form__actions">
        <button type="submit" className="btn btn--primary">
          {initial ? "Guardar cambios" : "Crear profesor"}
        </button>
      </div>
    </form>
  );
}
