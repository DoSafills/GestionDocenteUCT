import { useState, useEffect, useMemo } from "react";
import type { RestriccionAcademica } from "@domain/entities/restriccionespage/RestriccionAcademica";
import type { Formulario } from "../usecases/FormularioRestriccionService";
import { db } from "../../services/utils";

// 🔹 Validación de prioridad
const validarPrioridad = (p: string): "alta" | "media" | "baja" => {
  if (p === "alta" || p === "media" || p === "baja") return p;
  return "media";
};

// 🔹 Estado inicial del formulario
export const FORMULARIO_INICIAL: Formulario = {
  tipo: "prerrequisito",
  prioridad: "media",
  descripcion: "",
  mensaje: "",
  activa: true,
  parametros: {
    asignaturaOrigen: "",
    asignaturaDestino: "",
    salaProhibida: "",
    especialidadRequerida: "",
    diaRestriccion: "",
    horaInicioRestriccion: "",
    horaFinRestriccion: "",
  },
};

// 🔹 Hook combinado
export function useRestriccionesPage() {
  const [restricciones, setRestricciones] = useState<RestriccionAcademica[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>("todos");
  const [filtroActiva, setFiltroActiva] = useState<string>("todos");

  // Modal creación/edición
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(false);
  const [formulario, setFormulario] = useState<Formulario>(FORMULARIO_INICIAL);
  const [restriccionParaEditar, setRestriccionParaEditar] = useState<RestriccionAcademica | null>(null);

  // Modal confirmación eliminación
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [restriccionParaEliminar, setRestriccionParaEliminar] = useState<RestriccionAcademica | null>(null);

  // 🔹 Cargar restricciones al inicio
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await db.getAll();
        setRestricciones(data.map((r) => ({ ...r, prioridad: validarPrioridad(r.prioridad ?? "media") })));
      } catch (error) {
        console.error("Error cargando restricciones:", error);
      }
    };
    fetchData();
  }, []);

  // 🔹 Crear o editar
  const guardarRestriccion = async (
    formData: Formulario,
    editando: boolean,
    restriccionParaEditar: RestriccionAcademica | null
  ) => {
    const prioridadValidada = validarPrioridad(formData.prioridad);
    if (editando && restriccionParaEditar?.id) {
      await db.update(restriccionParaEditar.id, { ...formData, prioridad: prioridadValidada });
      setRestricciones((prev) =>
        prev.map((r) =>
          r.id === restriccionParaEditar.id ? { ...r, ...formData, prioridad: prioridadValidada } : r
        )
      );
    } else {
      const nuevaRestriccion: RestriccionAcademica = {
        id: crypto.randomUUID(),
        tipo: formData.tipo,
        prioridad: prioridadValidada,
        descripcion: formData.descripcion,
        mensaje: formData.mensaje,
        activa: formData.activa,
        parametros: formData.parametros,
      };
      const creada = await db.create(nuevaRestriccion);
      setRestricciones((prev) => [...prev, creada]);
    }
  };

  // 🔹 Activar/desactivar
  const toggleRestriccion = async (r: RestriccionAcademica) => {
    if (!r.id) return;
    const actualizado = await db.toggleEstado(r.id);
    if (!actualizado) return;
    setRestricciones((prev) => prev.map((item) => (item.id === r.id ? actualizado : item)));
  };

  // 🔹 Abrir modal creación/edición
  const abrirModalParaCrear = () => {
    setFormulario(FORMULARIO_INICIAL);
    setEditando(false);
    setRestriccionParaEditar(null);
    setModalAbierto(true);
  };
  const abrirModalParaEditar = (r: RestriccionAcademica) => {
    setFormulario({ ...r });
    setEditando(true);
    setRestriccionParaEditar(r);
    setModalAbierto(true);
  };

  // 🔹 Abrir/cancelar modal de eliminación
  const abrirConfirmacionEliminar = (r: RestriccionAcademica) => {
    setRestriccionParaEliminar(r);
    setModalEliminarAbierto(true);
  };
  const cancelarEliminar = () => {
    setRestriccionParaEliminar(null);
    setModalEliminarAbierto(false);
  };

  // 🔹 Confirmar eliminación
  const confirmarEliminar = async () => {
    if (!restriccionParaEliminar?.id) return;
    await db.delete(restriccionParaEliminar.id);
    setRestricciones((prev) => prev.filter((r) => r.id !== restriccionParaEliminar.id));
    cancelarEliminar();
  };

  // 🔹 Filtros
  const restriccionesFiltradas = useMemo(() => {
    return restricciones.filter((r) => {
      const matchBusqueda = r.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      const matchTipo = filtroTipo === "todos" || r.tipo === filtroTipo;
      const matchPrioridad = filtroPrioridad === "todos" || r.prioridad === filtroPrioridad;
      const matchActiva = filtroActiva === "todos" || (filtroActiva === "activa" ? r.activa : !r.activa);
      return matchBusqueda && matchTipo && matchPrioridad && matchActiva;
    });
  }, [restricciones, busqueda, filtroTipo, filtroPrioridad, filtroActiva]);

  return {
    restriccionesFiltradas,
    restricciones,
    setRestricciones,
    busqueda,
    setBusqueda,
    filtroTipo,
    setFiltroTipo,
    filtroPrioridad,
    setFiltroPrioridad,
    filtroActiva,
    setFiltroActiva,
    modalAbierto,
    setModalAbierto,
    editando,
    formulario,
    restriccionParaEditar,
    abrirModalParaCrear,
    abrirModalParaEditar,
    guardarRestriccion,
    toggleRestriccion,
    modalEliminarAbierto,
    restriccionParaEliminar,
    abrirConfirmacionEliminar,
    cancelarEliminar,
    confirmarEliminar,
  };
}
